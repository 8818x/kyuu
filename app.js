const entries = window.DIARY_ENTRIES || [];
const dishNames = {
  All: "All",
  PadThaiHoiTod: "Pad Thai / Hoi Tod",
  Roti: "Roti",
  ALaCarte: "A la carte",
  KhaoKhaMu: "Khao Kha Mu",
  Noodles: "Noodles"
};

const TYPE_COLORS = ["#2f6f5e", "#2f5b8f", "#8a4f19", "#7a3f6e", "#3f6b2f", "#8f3b3b"];
function typeColor(type) {
  const known = { PadThaiHoiTod: 0, Roti: 1, ALaCarte: 2, KhaoKhaMu: 3, Noodles: 4};
  if (type in known) return TYPE_COLORS[known[type]];
  const types = recordTypes.filter((t) => t !== "All");
  return TYPE_COLORS[types.indexOf(type) % TYPE_COLORS.length];
}

function typesOf(entry) {
  if (Array.isArray(entry.type)) return entry.type;
  return entry.type ? [entry.type] : [];
}

const dishLabel = (type) => Array.isArray(type)
  ? type.map(dishLabel).join(" / ")
  : (dishNames[type] || type || "");

const recordTypes = [...new Set(entries.flatMap(typesOf))];
const filters = ["All", ...recordTypes.filter((t) => t !== "All")];
const LAST_KEY = "food-diary-last";

let activeFilter = filters[0];
let selectedPlateId = null;
let map = null;
let markers = new Map();
let selectedShopKey = null;
let sheetTrigger = null;
let popupTrigger = null;
let renderedPlateId = null;
let archiveReturn = null;

const $ = (id) => document.getElementById(id);
const tabsBox = $("tabs");
const filterBox = $("filters");
const diaryPanel = $("diary-panel");
const archivePanel = $("archive-panel");
const archiveGrid = $("archive-grid");
const archiveCount = $("archive-count");
const archiveBack = $("archive-back");
const mapPanel = $("map-panel");
const featuredBox = $("featured");
const shopItemsBox = $("shop-items");
const mapCount = $("map-count");
const statusEl = $("status");
const sheet = $("sheet");
const listToggle = $("list-toggle");
const ledgerList = document.querySelector(".ledger-list");

/* ---------- helpers ---------- */

function coordsFromLink(link) {
  if (!link) return null;
  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/
  ];
  for (const re of patterns) {
    const m = link.match(re);
    if (m) return [Number(m[1]), Number(m[2])];
  }
  return null;
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(y, m - 1, d));
}

function photosOf(entry) {
  return entry.display ? [entry.display] : [];
}

function displaySrc(entry) {
  return entry.display || "";
}

function thumbSrc(entry) {
  return entry.thumb || displaySrc(entry);
}

function noteText(entry) {
  const raw = entry && entry.note;
  return typeof raw === "string" ? raw.trim() : "";
}

function makeNote(entry, className = "inscription") {
  const text = noteText(entry);
  if (!text) return null;
  const p = document.createElement("p");
  p.className = className;
  p.textContent = text;
  return p;
}

function appendNote(parent, entry, className) {
  const note = makeNote(entry, className);
  if (note) parent.appendChild(note);
}

function entrySlug(entry, index) {
  const base = (entry.date || "") + "-" + (entry.shop || index + 1);
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "entry-" + (index + 1);
}

function entryId(entry, index) {
  if (entry.id != null && entry.id !== "") return String(entry.id);
  const slug = entrySlug(entry, index);
  const clash = entries.some((other, i) =>
    i !== index && (other.id == null || other.id === "") && entrySlug(other, i) === slug);
  if (!clash) return slug;
  const photo = (entry.display || entry.thumb || "photo-" + index)
    .replace(/^images\//, "").replace(/\.[a-z0-9]+$/i, "").toLowerCase();
  return slug + "-" + photo;
}

function pad(n) {
  return String(n).padStart(3, "0");
}

function plateNumber(entry) {
  const ranked = entries.slice().sort((a, b) =>
    (a.date || "").localeCompare(b.date || "") || entries.indexOf(a) - entries.indexOf(b));
  return pad(ranked.indexOf(entry) + 1);
}

function diaryList() {
  return visibleEntries().slice().sort((a, b) => {
    const byDate = (b.entry.date || "").localeCompare(a.entry.date || "");
    if (byDate) return byDate;
    return entries.indexOf(b.entry) - entries.indexOf(a.entry);
  });
}

function getLast() {
  try { return localStorage.getItem(LAST_KEY); } catch (e) { return null; }
}

function setLast(id) {
  try { localStorage.setItem(LAST_KEY, id); } catch (e) { /* storage unavailable */ }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isPhone() {
  return window.matchMedia("(max-width: 600px)").matches;
}

function announce(text) {
  statusEl.textContent = text;
}

function selectPlate(id, keepFocus = true) {
  if (id === selectedPlateId) return;
  const item = diaryList().find((x) => entryId(x.entry, x.index) === id);
  if (!item) return;
  selectedPlateId = id;
  setLast(id);
  renderDiary();
  announce("Plate " + plateNumber(item.entry) + ", " + (item.entry.shop || "untitled"));
}

function makeStamp(entry) {
  const wrap = document.createElement("span");
  wrap.className = "dish-stamps";
  typesOf(entry).forEach((type) => {
    const stamp = document.createElement("span");
    stamp.className = "dish-stamp";
    stamp.textContent = dishLabel(type);
    wrap.appendChild(stamp);
  });
  return wrap;
}

function makeDateStamp(iso) {
  const wrap = document.createElement("span");
  wrap.className = "date-stamp";
  const time = document.createElement("time");
  time.dateTime = iso || "";
  time.textContent = formatDate(iso);
  wrap.appendChild(time);
  return wrap;
}

function makeMapsLink(link) {
  const a = document.createElement("a");
  a.className = "ink-link";
  a.href = link;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = "Open in Google Maps";
  return a;
}

function visibleEntries() {
  return entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => activeFilter === filters[0] || typesOf(entry).includes(activeFilter))
    .sort((a, b) => (b.entry.date || "").localeCompare(a.entry.date || ""));
}

function shopKey(entry, index) {
  return String(entry.shop || "").trim().toLowerCase() || entryId(entry, index);
}

function shopGroups() {
  const groups = new Map();
  entries.forEach((entry, index) => {
    const key = shopKey(entry, index);
    if (!groups.has(key)) groups.set(key, { key, shop: entry.shop || "Untitled", visits: [] });
    groups.get(key).visits.push({ entry, index });
  });
  groups.forEach((group) => {
    group.visits.sort((a, b) => (b.entry.date || "").localeCompare(a.entry.date || ""));
  });
  return groups;
}

function groupPosition(group) {
  for (const visit of group.visits) {
    const pos = coordsFromLink(visit.entry.maps);
    if (pos) return pos;
  }
  return null;
}

function visibleMapGroups() {
  const result = [];
  shopGroups().forEach((group) => {
    const visits = group.visits.filter(({ entry }) =>
      activeFilter === filters[0] || typesOf(entry).includes(activeFilter));
    if (visits.length) result.push({ ...group, visits });
  });
  return result;
}

function emptyState(message, actionLabel, onAction) {
  const box = document.createElement("div");
  box.className = "empty-state";
  const p = document.createElement("p");
  p.textContent = message;
  box.appendChild(p);
  if (actionLabel) {
    const b = document.createElement("button");
    b.className = "ink-link";
    b.type = "button";
    b.textContent = actionLabel;
    b.addEventListener("click", onAction);
    box.appendChild(b);
  }
  return box;
}

/* ---------- Diary ---------- */

function makeFeatured(item, list, isEntering) {
  const { entry, index } = item;
  const id = entryId(entry, index);
  const photos = photosOf(entry);
  const el = document.createElement("article");
  el.className = "feature" + (isEntering ? " is-entering" : "");
  el.dataset.id = id;

  const media = document.createElement("figure");
  media.className = "plate";
  if (photos.length) {
    const img = document.createElement("img");
    img.className = "plate-photo";
    img.src = displaySrc(entry);
    img.alt = entry.shop ? "Photograph from " + entry.shop : "";
    img.loading = "eager";
    img.decoding = "async";
    img.onerror = () => {
      media.classList.add("is-missing");
      img.hidden = true;
    };
    media.appendChild(img);
  } else {
    media.classList.add("is-missing");
  }
  media.appendChild(makeMissingLabel(entry));

  const col = document.createElement("div");
  col.className = "plate-side";

  const head = document.createElement("div");
  head.className = "plate-head";
  const title = document.createElement("h1");
  title.className = "shop-name";
  title.lang = "th";
  title.textContent = entry.shop || "Untitled";
  const meta = document.createElement("p");
  meta.className = "plate-meta";
  const no = document.createElement("span");
  no.className = "plate-no";
  no.textContent = "PLATE " + plateNumber(entry);
  meta.appendChild(no);
  const bits = [formatDate(entry.date), dishLabel(typesOf(entry))].filter(Boolean);
  if (bits.length) {
    const rest = document.createElement("span");
    rest.textContent = " · " + bits.join(" · ");
    meta.appendChild(rest);
  }
  head.append(title, meta);
  appendNote(head, entry);

  col.append(head, makeNextPlate(list, item));
  el.append(media, col);
  return el;
}

function makeMissingLabel(entry) {
  const label = document.createElement("figcaption");
  label.className = "plate-missing";
  label.textContent = "PLATE " + plateNumber(entry) + " — PHOTO UNAVAILABLE";
  return label;
}

function makeNextPlate(list, item) {
  const idx = list.indexOf(item);
  const next = list[(idx + 1) % list.length];
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "next-plate";
  if (!next || list.length < 2) {
    btn.hidden = true;
    return btn;
  }
  const nextId = entryId(next.entry, next.index);
  const thumb = document.createElement("span");
  thumb.className = "next-plate-thumb";
  if (photosOf(next.entry).length) {
    const img = document.createElement("img");
    img.src = thumbSrc(next.entry);
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.draggable = false;
    img.onerror = () => { img.hidden = true; };
    thumb.appendChild(img);
  }
  const label = document.createElement("span");
  label.className = "next-plate-label";
  label.textContent = "Next plate";
  const num = document.createElement("span");
  num.className = "next-plate-no";
  num.textContent = plateNumber(next.entry);
  btn.append(thumb, label, num);
  btn.setAttribute("aria-label",
    "Next plate: " + plateNumber(next.entry) + ", " + (next.entry.shop || "untitled"));
  btn.addEventListener("click", () => goToPlate(nextId));
  return btn;
}

function goToPlate(id) {
  const feature = featuredBox.querySelector(".feature");
  if (!feature || prefersReducedMotion()) { selectPlate(id); return; }
  feature.classList.add("is-leaving");
  setTimeout(() => selectPlate(id), 150);
}

function renderDiary() {
  const list = diaryList();
  const shown = list.length;
  const filtered = shown !== entries.length;
  const isEntering = renderedPlateId !== null && renderedPlateId !== selectedPlateId;

  featuredBox.replaceChildren();
  if (!list.length) {
    featuredBox.appendChild(emptyState(
      filtered ? "No plates match this search or filter." : "The ledger is empty.",
      filtered ? "Show all plates" : null,
      () => setFilter(filters[0])
    ));
    renderedPlateId = null;
    return;
  }
  const selected = list.find((item) => entryId(item.entry, item.index) === selectedPlateId) || list[0];
  selectedPlateId = entryId(selected.entry, selected.index);
  featuredBox.appendChild(makeFeatured(selected, list, isEntering));
  renderedPlateId = selectedPlateId;
}

/* ---------- Archive ---------- */

const FLIGHT = "plate-flight";
let flight = null;

function canAnimate() {
  return typeof document.startViewTransition === "function" && !prefersReducedMotion();
}

function clearFlight() {
  document.querySelectorAll('[style*="view-transition-name"]').forEach((el) => {
    if (el.style.viewTransitionName === FLIGHT) el.style.viewTransitionName = "";
  });
}

function startFlight(update) {
  if (flight) {
    try { flight.skipTransition(); } catch (e) { /* already settled */ }
    flight = null;
    clearFlight();
  }
  const vt = document.startViewTransition(update);
  flight = vt;
  const settle = () => {
    if (flight === vt) flight = null;
    clearFlight();
  };
  vt.finished.then(settle, settle);
  setTimeout(settle, 1200);
  return vt;
}

function goRoute(hash) {
  if (location.hash === hash) { renderRoute(); return; }
  history.pushState(null, "", hash);
  renderRoute();
}

function makeArchiveTile(item) {
  const { entry, index } = item;
  const id = entryId(entry, index);
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "archive-tile";
  tile.dataset.id = id;
  tile.setAttribute("data-type", String(entry.type || ""));
  tile.setAttribute("data-year", (entry.date || "").slice(0, 4));
  if (id === selectedPlateId) tile.classList.add("is-current");

  const mat = document.createElement("span");
  mat.className = "archive-mat";
  const img = document.createElement("img");
  img.src = thumbSrc(entry);
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  img.draggable = false;
  img.width = 400;
  img.height = 267;
  img.onerror = () => { img.hidden = true; };
  mat.appendChild(img);

  const caption = document.createElement("span");
  caption.className = "archive-caption";
  const no = document.createElement("b");
  no.textContent = plateNumber(entry);
  const sub = document.createElement("span");
  sub.className = "archive-sub";
  sub.textContent = [formatDate(entry.date), dishLabel(entry.type)].filter(Boolean).join(" · ");
  caption.append(no, sub);

  tile.append(mat, caption);
  tile.setAttribute("aria-label",
    "Plate " + plateNumber(entry) + ", " + (entry.shop || "untitled") + (entry.date ? ", " + formatDate(entry.date) : ""));
  tile.addEventListener("click", (e) => openPlateFromArchive(id, tile, e.detail === 0));
  tile.addEventListener("pointerenter", () => preloadDisplay(entry), { once: true });
  tile.addEventListener("focus", () => preloadDisplay(entry), { once: true });
  return tile;
}

const preloaded = new Set();

function preloadDisplay(entry) {
  const src = displaySrc(entry);
  if (!src || preloaded.has(src)) return;
  const img = new Image();
  img.decoding = "async";
  img.onload = () => preloaded.add(src);
  img.src = src;
}

function archiveBatchSize() {
  return 40;
}

let archiveObserver = null;
let archiveLayoutFrame = 0;

function archiveColumnCount() {
  const w = archiveGrid.clientWidth;
  if (w >= 980) return 4;
  if (w >= 620) return 3;
  return 2;
}

function archiveGaps() {
  const w = archiveGrid.clientWidth;
  if (w <= 640) return { x: 12, y: 22 };
  return {
    x: Math.max(14, Math.min(22, w * 0.015)),
    y: Math.max(26, Math.min(40, w * 0.026))
  };
}

/* Genuine masonry: every tile keeps its own aspect ratio and stacks in the
   shortest column. DOM order stays chronological, so keyboard order matches. */
function layoutArchive() {
  const tiles = [...archiveGrid.querySelectorAll(".archive-tile")];
  if (!tiles.length) {
    archiveGrid.style.height = "";
    return;
  }
  const cols = archiveColumnCount();
  const { x: gapX, y: gapY } = archiveGaps();
  const width = archiveGrid.clientWidth;
  const colW = Math.max(80, (width - gapX * (cols - 1)) / cols);
  const heights = new Array(cols).fill(0);

  tiles.forEach((tile) => {
    let col = 0;
    for (let i = 1; i < cols; i++) {
      if (heights[i] < heights[col] - 0.5) col = i;
    }
    tile.style.width = colW + "px";
    const h = tile.offsetHeight;
    tile.style.transform = "translate(" + (col * (colW + gapX)) + "px," + heights[col] + "px)";
    heights[col] += h + gapY;
  });

  const total = Math.max(...heights) - gapY;
  archiveGrid.style.height = total + "px";
}

function queueArchiveLayout() {
  if (archiveLayoutFrame) cancelAnimationFrame(archiveLayoutFrame);
  archiveLayoutFrame = requestAnimationFrame(() => {
    archiveLayoutFrame = 0;
    layoutArchive();
  });
}

function appendArchiveSlice(list, from) {
  const slice = list.slice(from, from + archiveBatchSize());
  const frag = document.createDocumentFragment();
  slice.forEach((item) => frag.appendChild(makeArchiveTile(item)));
  archiveGrid.appendChild(frag);
  queueArchiveLayout();
  return from + slice.length;
}

function syncArchiveMore(list, shown) {
  const host = archiveGrid.parentElement;
  let more = host.querySelector(".archive-more");
  if (shown >= list.length) {
    if (more) more.remove();
    if (archiveObserver) { archiveObserver.disconnect(); archiveObserver = null; }
    return;
  }
  if (!more) {
    more = document.createElement("button");
    more.type = "button";
    more.className = "archive-more";
    more.addEventListener("click", () => {
      const all = diaryList();
      const next = appendArchiveSlice(all, archiveGrid.querySelectorAll(".archive-tile").length);
      syncArchiveMore(all, next);
      const first = archiveGrid.querySelectorAll(".archive-tile")[next - archiveBatchSize()];
      if (first) first.focus({ preventScroll: true });
    });
    host.appendChild(more);
  }
  const remaining = list.length - shown;
  more.textContent = "Load " + (remaining < archiveBatchSize() ? remaining : archiveBatchSize()) + " more plates";
  if (archiveObserver) archiveObserver.disconnect();
  if (typeof IntersectionObserver === "function") {
    archiveObserver = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) more.click();
    }, { rootMargin: "600px 0px" });
    archiveObserver.observe(more);
  }
}

function renderArchive() {
  const list = diaryList();
  archiveCount.textContent = pad(list.length) + (list.length === 1 ? " PLATE" : " PLATES");
  archiveGrid.replaceChildren();
  const oldMore = archiveGrid.parentElement.querySelector(".archive-more");
  if (oldMore) oldMore.remove();
  if (archiveObserver) { archiveObserver.disconnect(); archiveObserver = null; }
  const shown = appendArchiveSlice(list, 0);
  syncArchiveMore(list, shown);
  queueArchiveLayout();
}

function openPlateFromArchive(id, tile, fromKeyboard = false) {
  archiveReturn = { id, scrollY: window.scrollY, fromKeyboard };
  selectedPlateId = id;
  setLast(id);
  renderedPlateId = id;

  const item = diaryList().find((x) => entryId(x.entry, x.index) === id);
  const sharp = item ? displaySrc(item.entry) : "";
  const img = tile.querySelector("img");
  if (img && sharp && preloaded.has(sharp)) img.src = sharp;

  const land = () => {
    goRoute("#/diary");
    const plate = featuredBox.querySelector(".plate-photo");
    if (plate) plate.style.viewTransitionName = FLIGHT;
    window.scrollTo(0, 0);
    diaryPanel.focus({ preventScroll: true });
  };

  if (!canAnimate()) { land(); clearFlight(); return; }
  tile.style.viewTransitionName = FLIGHT;
  startFlight(land);
}

function returnToArchive() {
  if (!archiveReturn) return;
  const { id: target, scrollY: y, fromKeyboard } = archiveReturn;
  const plate = featuredBox.querySelector(".plate-photo");

  const land = () => {
    goRoute("#/archive");
    window.scrollTo(0, y);
    const tile = archiveGrid.querySelector('.archive-tile[data-id="' + CSS.escape(target) + '"]');
    if (tile) {
      tile.style.viewTransitionName = FLIGHT;
      if (fromKeyboard) tile.focus({ preventScroll: true });
    }
    archiveReturn = null;
  };

  if (!canAnimate() || !plate) { land(); clearFlight(); return; }
  plate.style.viewTransitionName = FLIGHT;
  startFlight(land);
}

/* ---------- Entry detail ---------- */

function makeMeta(entry) {
  const meta = document.createElement("p");
  meta.className = "detail-meta";
  const date = document.createElement("time");
  date.dateTime = entry.date || "";
  date.textContent = formatDate(entry.date);
  meta.appendChild(date);
  if (typeof entry.rating === "number") {
    const rating = document.createElement("span");
    rating.className = "rating";
    rating.textContent = "★ " + entry.rating + " / 5";
    meta.appendChild(rating);
  }
  if (entry.price != null && entry.price !== "") {
    const price = document.createElement("span");
    price.textContent = "฿" + entry.price;
    meta.appendChild(price);
  }
  return meta;
}

/* ---------- Map ---------- */

function pinIcon(entry) {
  const color = typeColor(typesOf(entry)[0] || "All");
  return L.divIcon({
    className: "map-pin",
    html: '<svg width="28" height="38" viewBox="0 0 28 38" aria-hidden="true">' +
      '<path d="M14 36.5S2.5 23.2 2.5 14a11.5 11.5 0 0 1 23 0c0 9.2-11.5 22.5-11.5 22.5Z" ' +
      'fill="' + color + '" stroke="#ffffff" stroke-width="2.2"/>' +
      '<circle cx="14" cy="14" r="4" fill="#ffffff"/></svg>',
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -34]
  });
}

function makePlaceRow(group) {
  const latest = group.visits[0].entry;
  const photos = photosOf(latest);
  const btn = document.createElement("button");
  btn.className = "place-row";
  btn.type = "button";
  btn.dataset.id = group.key;

  if (photos.length) {
    const img = document.createElement("img");
    img.className = "place-thumb";
    img.src = thumbSrc(latest);
    img.alt = "";
    img.loading = "lazy";
    img.onerror = () => { img.hidden = true; };
    btn.appendChild(img);
  } else {
    const blank = document.createElement("span");
    blank.className = "place-blank";
    btn.appendChild(blank);
  }
  const text = document.createElement("span");
  text.className = "place-text";
  const name = document.createElement("strong");
  name.lang = "th";
  name.textContent = group.shop;
  const sub = document.createElement("small");
  const count = group.visits.length;
  sub.textContent = pad(count) + (count === 1 ? " VISIT" : " VISITS") + " · " + formatDate(latest.date);
  text.append(name, sub);
  if (!groupPosition(group)) {
    const note = document.createElement("small");
    note.className = "place-note";
    note.textContent = "No pin for this place";
    text.appendChild(note);
  }
  btn.appendChild(text);
  btn.addEventListener("click", () => activateShop(group.key, btn));
  return btn;
}

function movePlaceFlag(id) {
  shopItemsBox.querySelectorAll(".place-row .tape-flag").forEach((flag) => flag.remove());
  const row = shopItemsBox.querySelector('.place-row[data-id="' + CSS.escape(id) + '"]');
  if (row) {
    const flag = document.createElement("span");
    flag.className = "tape-flag";
    flag.setAttribute("aria-label", "Selected place");
    row.appendChild(flag);
  }
}

function highlightShop(id) {
  shopItemsBox.querySelectorAll(".place-row").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.id === id);
  });
  markers.forEach((marker, markerId) => {
    const el = marker.getElement();
    if (el) el.classList.toggle("is-active", markerId === id);
  });
}

function visitBlocks(group, className, includeStamp = true) {
  const holder = document.createElement("div");
  group.visits.forEach(({ entry }) => {
    const block = document.createElement("div");
    block.className = className;
    const meta = document.createElement("div");
    meta.className = "visit-meta";
    if (includeStamp) meta.append(makeDateStamp(entry.date), makeStamp(entry));
    else meta.append(makeDateStamp(entry.date));
    block.appendChild(meta);
    appendNote(block, entry, "visit-note");
    holder.appendChild(block);
  });
  return holder;
}

function popupFor(group) {
  const box = document.createElement("div");
  const title = document.createElement("strong");
  title.lang = "th";
  title.textContent = group.shop;
  box.appendChild(title);
  const count = document.createElement("div");
  count.className = "visit-count";
  count.textContent = pad(group.visits.length) + (group.visits.length === 1 ? " VISIT" : " VISITS");
  box.appendChild(count);
  box.appendChild(visitBlocks(group, "visit-block", false));
  const withMaps = group.visits.find(({ entry }) => entry.maps);
  if (withMaps) box.appendChild(makeMapsLink(withMaps.entry.maps));
  return box;
}

function activateShop(id, trigger) {
  const group = visibleMapGroups().find((g) => g.key === id) || shopGroups().get(id);
  if (!group) return;
  const marker = markers.get(id);
  const pos = groupPosition(group);
  selectedShopKey = id;
  highlightShop(id);
  movePlaceFlag(id);

  if (pos && map) map.flyTo(pos, 16, { animate: !prefersReducedMotion() });
  if (!marker || !pos) {
    announce(group.shop + " has no map pin.");
    if (isPhone()) openSheet(group, trigger || null);
    return;
  }

  if (isPhone()) {
    openSheet(group, trigger || marker.getElement());
  } else {
    popupTrigger = trigger || marker.getElement();
    L.popup({ offset: [0, -34] })
      .setLatLng(marker.getLatLng())
      .setContent(popupFor(group))
      .openOn(map);
    const primary = document.querySelector(".leaflet-popup-content .ink-link");
    if (primary) primary.focus({ preventScroll: true });
  }
  announce(group.shop + ", " + group.visits.length + (group.visits.length === 1 ? " visit" : " visits") + " selected on the map.");
}

const PIN_MARK = '<svg viewBox="0 0 28 38" width="14" height="19" aria-hidden="true"><path d="M14 36.5S2.5 23.2 2.5 14a11.5 11.5 0 0 1 23 0c0 9.2-11.5 22.5-11.5 22.5Z" fill="currentColor" stroke="var(--paper)" stroke-width="2"/></svg>';

function renderPinLegend(groups) {
  const legend = $("pin-legend");
  const types = [];
  groups.forEach((group) => group.visits.forEach(({ entry }) => {
    typesOf(entry).forEach((type) => { if (!types.includes(type)) types.push(type); });
  }));
  legend.hidden = !types.length;
  legend.replaceChildren(...types.map((type) => {
    const row = document.createElement("span");
    row.className = "pin-key";
    row.style.color = typeColor(type);
    row.innerHTML = PIN_MARK;
    const label = document.createElement("span");
    label.textContent = dishLabel(type);
    row.appendChild(label);
    return row;
  }));
}

function renderShopList() {
  const list = visibleMapGroups();
  mapCount.textContent = pad(list.length) + (list.length === 1 ? " PLACE" : " PLACES");
  renderPinLegend(list);
  if (!list.length) {
    shopItemsBox.replaceChildren(emptyState(
      entries.length ? "No places for this dish." : "No places yet.",
      activeFilter !== filters[0] ? "Show all dishes" : null,
      () => setFilter(filters[0])
    ));
  } else {
    shopItemsBox.replaceChildren(...list.map(makePlaceRow));
    if (selectedShopKey) movePlaceFlag(selectedShopKey);
  }
  updateMapMarkers();
}

function updateMapMarkers() {
  if (!map) return;
  const allowed = new Set(visibleMapGroups().map((group) => group.key));
  const points = [];
  markers.forEach((marker, id) => {
    const group = shopGroups().get(id);
    const pos = group ? groupPosition(group) : null;
    if (allowed.has(id) && pos) {
      if (!map.hasLayer(marker)) marker.addTo(map);
      points.push(pos);
    } else if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  });
  if (points.length) {
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15, animate: !prefersReducedMotion() });
  }
}

function ensureMap() {
  if (map) {
    requestAnimationFrame(() => map.invalidateSize());
    return;
  }
  if (typeof L === "undefined") {
    $("map-error").hidden = false;
    return;
  }
  map = L.map("map", { scrollWheelZoom: true, zoomControl: false }).setView([13.7563, 100.5018], 12);
  const tiles = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors, and the GIS User Community",
      maxZoom: 19
    }
  ).addTo(map);

  let tileFailures = 0;
  tiles.on("tileerror", () => {
    tileFailures += 1;
    if (tileFailures === 1) {
      $("map-error").hidden = false;
      announce("The map tiles could not load.");
    }
  });

  shopGroups().forEach((group) => {
    const pos = groupPosition(group);
    if (!pos) return;
    const latest = group.visits[0].entry;
    const count = group.visits.length;
    const label = group.shop + ", " + dishLabel(latest.type)
      + (count > 1 ? ", " + count + " visits" : "");
    const marker = L.marker(pos, { icon: pinIcon(latest), title: label, keyboard: true });
    marker.on("add", () => {
      const node = marker.getElement();
      if (node) {
        node.setAttribute("aria-label", label);
        node.setAttribute("role", "button");
        node.classList.toggle("is-active", group.key === selectedShopKey);
      }
    });
    marker.on("click", () => activateShop(group.key, marker.getElement()));
    markers.set(group.key, marker);
  });

  map.on("popupclose", () => {
    if (popupTrigger && document.contains(popupTrigger)) popupTrigger.focus({ preventScroll: true });
    popupTrigger = null;
  });
  map.on("click", closeSheet);
  updateMapMarkers();
  requestAnimationFrame(() => map.invalidateSize());

  let missing = 0;
  shopGroups().forEach((group) => { if (!groupPosition(group)) missing += 1; });
  if (missing) announce("Some places have no map pin.");
}

/* keyboard activation for leaflet pins */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSheet();
    if (map) map.closePopup();
    if (archiveReturn && !diaryPanel.hidden) { returnToArchive(); return; }
    return;
  }
  const el = event.target;
  if (!el || !el.classList || !el.classList.contains("leaflet-marker-icon")) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    el.click();
  }
});

/* ---------- Phone sheet ---------- */

const sheetClose = $("sheet-close");
const sheetGrip = $("sheet-grip");

function openSheet(group, trigger) {
  if (!group) return;
  const latest = group.visits[0].entry;
  const count = group.visits.length;
  sheetTrigger = trigger || null;
  const sheetTag = $("sheet-tag");
  sheetTag.replaceChildren();
  typesOf(latest).forEach((type) => {
    const stamp = document.createElement("span");
    stamp.className = "dish-stamp";
    stamp.textContent = dishLabel(type);
    sheetTag.appendChild(stamp);
  });
  const sheetShop = $("sheet-shop");
  sheetShop.lang = "th";
  sheetShop.textContent = group.shop;
  $("sheet-date").textContent = pad(count) + (count === 1 ? " VISIT" : " VISITS");
  const noteBox = $("sheet-note");
  noteBox.replaceChildren(visitBlocks(group, "sheet-visit", false));
  const withMaps = group.visits.find(({ entry }) => entry.maps);
  const link = $("sheet-link");
  if (withMaps) { link.href = withMaps.entry.maps; link.hidden = false; }
  else link.hidden = true;
  sheet.dataset.open = "true";
  sheet.dataset.collapsed = "false";
  sheetGrip.setAttribute("aria-label", "Collapse details");
  sheetGrip.setAttribute("aria-expanded", "true");
  sheet.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => sheetClose.focus({ preventScroll: true }));
  announce(group.shop + ", " + count + (count === 1 ? " visit" : " visits") + " opened.");
}

function closeSheet() {
  if (sheet.dataset.open !== "true") return;
  sheet.dataset.open = "false";
  sheet.setAttribute("aria-hidden", "true");
  if (sheetTrigger && document.contains(sheetTrigger)) sheetTrigger.focus({ preventScroll: true });
  sheetTrigger = null;
}

function toggleSheet() {
  const collapsed = sheet.dataset.collapsed === "true";
  sheet.dataset.collapsed = String(!collapsed);
  sheetGrip.setAttribute("aria-label", collapsed ? "Collapse details" : "Expand details");
  sheetGrip.setAttribute("aria-expanded", String(collapsed));
}

sheetClose.addEventListener("click", closeSheet);
sheetGrip.addEventListener("click", toggleSheet);

/* ---------- Filters and routing ---------- */

const filterButtons = filters.map((label) => {
  const b = document.createElement("button");
  b.className = "filter";
  b.type = "button";
  b.dataset.filter = label;
  b.addEventListener("click", () => setFilter(label));
  return b;
});

function updateFilters() {
  const counts = {
    All: entries.length,
    ...Object.fromEntries(recordTypes.map((t) => [t, entries.filter((e) => typesOf(e).includes(t)).length]))
  };
  if (counts[activeFilter] === 0 && activeFilter !== filters[0]) activeFilter = filters[0];
  filterButtons.forEach((b) => {
    const label = filters.find((f) => f === b.dataset.filter);
    b.innerHTML = "";
    b.appendChild(document.createTextNode(dishLabel(label)));
    const n = document.createElement("b");
    n.textContent = pad(counts[label]);
    b.appendChild(n);
    b.hidden = counts[label] === 0 && label !== filters[0];
    b.setAttribute("aria-pressed", String(b.dataset.filter === activeFilter));
    b.setAttribute("aria-label", dishLabel(label) + ", " + counts[label] + (counts[label] === 1 ? " entry" : " entries"));
  });
}

function setFilter(label, rerender = true) {
  activeFilter = label;
  updateFilters();
  if (!rerender) return;
  renderDiary();
  renderShopList();
  const shown = visibleEntries().length;
  announce(label === filters[0]
    ? "Showing all entries. " + (shown === 1 ? "1 entry." : shown + " entries.")
    : "Showing " + dishLabel(label) + ". " + (shown === 1 ? "1 entry." : shown + " entries."));
}

const tabButtons = [["diary", "Diary"], ["archive", "Archive"], ["map", "Map"]].map(([name, label]) => {
  const b = document.createElement("button");
  b.className = "tab";
  b.type = "button";
  b.textContent = label;
  b.dataset.tab = name;
  b.addEventListener("click", () => {
    if (location.hash === "#/" + name) renderRoute();
    else location.hash = "#/" + name;
  });
  return b;
});

function parseRoute() {
  const view = location.hash.replace(/^#\/?/, "");
  if (view === "map") return { view: "map" };
  if (view === "archive") return { view: "archive" };
  return { view: "diary" };
}

function syncLayout() {
  const masthead = document.querySelector(".masthead");
  const content = document.querySelector(".content");
  if (masthead && content) {
    const top = parseFloat(getComputedStyle(content).paddingTop) || 0;
    const offset = Math.round(masthead.offsetHeight + top + 24);
    document.documentElement.style.setProperty("--map-offset", offset + "px");
  }
  listToggle.disabled = !isPhone();
  listToggle.setAttribute("aria-expanded", String(
    isPhone() ? ledgerList.dataset.expanded === "true" : true
  ));
}

function renderRoute() {
  const route = parseRoute();
  closeSheet();
  if (map) map.closePopup();
  syncLayout();
  updateFilters();
  filterBox.hidden = route.view !== "map";
  filterBox.parentElement.hidden = route.view !== "map";
  tabButtons.forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.tab === route.view));
  });
  diaryPanel.hidden = route.view !== "diary";
  archivePanel.hidden = route.view !== "archive";
  mapPanel.hidden = route.view !== "map";
  if (route.view !== "diary") document.body.classList.remove("diary-few");
  archiveBack.hidden = route.view !== "diary" || !archiveReturn;

  if (route.view === "map") {
    renderShopList();
    ensureMap();
    announce("Map view. " + (entries.length === 1 ? "1 entry." : entries.length + " entries."));
  } else if (route.view === "archive") {
    if (!selectedPlateId) {
      const first = diaryList()[0];
      if (first) selectedPlateId = entryId(first.entry, first.index);
    }
    renderArchive();
    announce("Archive view. " + (entries.length === 1 ? "1 plate." : entries.length + " plates."));
  } else {
    renderDiary();
    announce("Diary view. " + (entries.length === 1 ? "1 entry." : entries.length + " entries."));
  }
  window.scrollTo(0, archiveReturn && route.view === "archive" ? archiveReturn.scrollY : 0);
}

listToggle.addEventListener("click", () => {
  const open = ledgerList.dataset.expanded !== "true";
  ledgerList.dataset.expanded = String(open);
  listToggle.setAttribute("aria-expanded", String(open));
});

window.addEventListener("hashchange", renderRoute);
window.addEventListener("popstate", renderRoute);
archiveBack.addEventListener("click", returnToArchive);
let resizeWasPhone = () => window.innerWidth <= 600;
window.addEventListener("resize", () => {
  if (isPhone() !== resizeWasPhone()) { closeSheet(); if (map) map.closePopup(); }
  syncLayout();
  if (archivePanel && !archivePanel.hidden) queueArchiveLayout();
  if (map) requestAnimationFrame(() => map.invalidateSize());
});

/* ---------- boot ---------- */

tabsBox.append(...tabButtons);
filterBox.append(...filterButtons);
ledgerList.dataset.expanded = isPhone() ? "false" : "true";
updateFilters();
if (!location.hash) history.replaceState(null, "", "#/diary");
renderRoute();
