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
let stripUpdater = null;
let pendingReveal = false;

const $ = (id) => document.getElementById(id);
const tabsBox = $("tabs");
const filterBox = $("filters");
const diaryPanel = $("diary-panel");
const mapPanel = $("map-panel");
const featuredBox = $("featured");
const stripBox = $("strip");
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

function currentThread() {
  return stripBox.querySelector(".thread");
}

function centerThumb(el) {
  const thread = currentThread();
  if (!thread || !el) return;
  const threadRect = thread.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const offset = elRect.left - threadRect.left;
  const target = thread.scrollLeft + offset - (thread.clientWidth - elRect.width) / 2;
  const max = Math.max(0, thread.scrollWidth - thread.clientWidth);
  thread.scrollLeft = Math.max(0, Math.min(target, max));
}

function ensureVisible(el) {
  const thread = currentThread();
  if (!thread || !el) return;
  const threadRect = thread.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const inset = Math.min(48, thread.clientWidth * 0.12);
  if (elRect.left >= threadRect.left + inset && elRect.right <= threadRect.right - inset) return;
  centerThumb(el);
}

function selectPlate(id, keepFocus = true) {
  const item = visibleEntries().find((x) => entryId(x.entry, x.index) === id);
  if (!item) return;
  selectedPlateId = id;
  setLast(id);
  pendingReveal = true;
  renderDiary();
  announce("Plate " + plateNumber(item.entry) + ", " + (item.entry.shop || "untitled"));
  if (!keepFocus) return;
  const next = stripBox.querySelector('.print-thumb[data-id="' + CSS.escape(id) + '"]');
  if (next) next.focus({ preventScroll: true });
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

function makeFeatured(item) {
  const { entry, index } = item;
  const id = entryId(entry, index);
  const photos = photosOf(entry);
  const el = document.createElement("article");
  el.className = "feature";
  el.dataset.id = id;

  if (photos.length) {
    const media = document.createElement("div");
    media.className = "plate";
    const img = document.createElement("img");
    img.className = "plate-photo";
    img.src = displaySrc(entry);
    img.alt = entry.shop ? "Photograph from " + entry.shop : "";
    img.loading = "eager";
    img.decoding = "async";
    const label = document.createElement("span");
    label.className = "plate-label";
    label.textContent = "PLATE " + plateNumber(entry);
    img.onerror = () => {
      media.classList.add("is-missing");
      img.style.visibility = "hidden";
      label.textContent = "PLATE " + plateNumber(entry) + " — PHOTO UNAVAILABLE";
    };
    media.append(img, label);
    el.appendChild(media);
  }

  const body = document.createElement("div");
  body.className = "feature-body";
  const marks = document.createElement("div");
  marks.className = "marks";
  marks.append(makeDateStamp(entry.date), makeStamp(entry));

  const title = document.createElement("h1");
  title.className = "shop-name";
  title.lang = "th";
  title.textContent = entry.shop || "Untitled";

  body.append(marks, title);
  appendNote(body, entry);
  el.appendChild(body);
  return el;
}

function makeThumb(item, isCurrent) {
  const { entry, index } = item;
  const id = entryId(entry, index);
  const photos = photosOf(entry);
  const el = document.createElement("button");
  el.className = "print-thumb" + (isCurrent ? " is-current" : "");
  el.type = "button";
  el.dataset.id = id;
  if (photos.length) el.setAttribute("aria-label", "View photograph from " + (entry.shop || "this plate"));

  const mat = document.createElement("span");
  mat.className = "thumb-mat";
  if (photos.length) {
    const img = document.createElement("img");
    img.src = thumbSrc(entry);
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.draggable = false;
    img.onerror = () => { img.hidden = true; };
    mat.appendChild(img);
  }
  const meta = document.createElement("span");
  meta.className = "thumb-meta";
  const no = document.createElement("b");
  no.textContent = plateNumber(entry);
  const name = document.createElement("span");
  name.className = "thumb-title";
  name.lang = "th";
  name.textContent = entry.shop || "Untitled";
  meta.append(no, name);
  el.append(mat, meta);

  if (id === getLast()) {
    const flag = document.createElement("span");
    flag.className = "tape-flag";
    flag.setAttribute("aria-label", "Last viewed");
    el.appendChild(flag);
  }
  if (photos.length) {
    el.setAttribute("aria-label", "View plate from " + (entry.shop || "this plate"));
    el.addEventListener("click", (e) => selectPlate(id, e.detail === 0));
  } else {
    el.disabled = true;
  }
  return el;
}

function renderDiary() {
  const list = diaryList();
  const shown = list.length;
  const filtered = shown !== entries.length;

  featuredBox.replaceChildren();
  stripBox.replaceChildren();
  if (!list.length) {
    featuredBox.appendChild(emptyState(
      filtered ? "No plates match this search or filter." : "The ledger is empty.",
      filtered ? "Show all plates" : null,
      () => setFilter(filters[0])
    ));
    return;
  }
  const selected = list.find((item) => entryId(item.entry, item.index) === selectedPlateId) || list[0];
  featuredBox.appendChild(makeFeatured(selected));

  const currentId = entryId(selected.entry, selected.index);
  const thread = document.createElement("div");
  thread.className = "thread";
  thread.tabIndex = 0;
  thread.setAttribute("role", "listbox");
  thread.setAttribute("aria-label", "Photograph archive — click a plate, or use the arrow keys");
  thread.append(...list.map((item) => {
    const thumb = makeThumb(item, entryId(item.entry, item.index) === currentId);
    thumb.setAttribute("role", "option");
    thumb.setAttribute("aria-selected", String(entryId(item.entry, item.index) === currentId));
    return thumb;
  }));
  stripBox.appendChild(thread);

  stripUpdater = () => {
    const active = thread.querySelector(".print-thumb.is-current");
    if (active) centerThumb(active);
  };

  const active = thread.querySelector(".print-thumb.is-current");
  if (active) {
    if (pendingReveal) {
      pendingReveal = false;
      ensureVisible(active);
    } else {
      centerThumb(active);
    }
  }
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

const tabButtons = [["diary", "Diary"], ["map", "Map"]].map(([name, label]) => {
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
  return location.hash.replace(/^#\/?/, "") === "map" ? { view: "map" } : { view: "diary" };
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
  mapPanel.hidden = route.view !== "map";
  if (route.view !== "diary") document.body.classList.remove("diary-few");

  if (route.view === "map") {
    renderShopList();
    ensureMap();
    announce("Map view. " + (entries.length === 1 ? "1 entry." : entries.length + " entries."));
  } else {
    renderDiary();
    announce("Diary view. " + (entries.length === 1 ? "1 entry." : entries.length + " entries."));
    const last = getLast();
    if (last) {
      const link = stripBox.querySelector('.print-thumb[data-id="' + CSS.escape(last) + '"]');
      if (link) link.focus();
    }
  }
  window.scrollTo(0, 0);
}

listToggle.addEventListener("click", () => {
  const open = ledgerList.dataset.expanded !== "true";
  ledgerList.dataset.expanded = String(open);
  listToggle.setAttribute("aria-expanded", String(open));
});

/* filmstrip interactions — delegated so re-renders keep one listener set */
let filmDrag = null;
let filmSuppressClick = false;

stripBox.addEventListener("pointerdown", (e) => {
  const thread = e.target.closest(".thread");
  if (!thread || e.pointerType !== "mouse" || e.button !== 0) return;
  filmDrag = { thread, id: e.pointerId, x: e.clientX, scroll: thread.scrollLeft, moved: false };
});

stripBox.addEventListener("pointermove", (e) => {
  if (!filmDrag || e.pointerId !== filmDrag.id) return;
  const dx = e.clientX - filmDrag.x;
  if (Math.abs(dx) > 4) filmDrag.moved = true;
  if (filmDrag.moved) {
    filmDrag.thread.classList.add("is-dragging");
    filmDrag.thread.scrollLeft = filmDrag.scroll - dx;
  }
});

function endFilmDrag(e) {
  if (!filmDrag || e.pointerId !== filmDrag.id) return;
  const thread = filmDrag.thread;
  thread.classList.remove("is-dragging");
  if (filmDrag.moved) {
    filmSuppressClick = true;
    setTimeout(() => { filmSuppressClick = false; }, 0);
  }
  filmDrag = null;
}
stripBox.addEventListener("pointerup", endFilmDrag);
stripBox.addEventListener("pointercancel", endFilmDrag);

stripBox.addEventListener("click", (e) => {
  if (!filmSuppressClick) return;
  e.preventDefault();
  e.stopPropagation();
  filmSuppressClick = false;
}, true);

stripBox.addEventListener("wheel", (e) => {
  const thread = e.target.closest(".thread");
  if (!thread) return;
  const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  if (!delta) return;
  const max = Math.max(0, thread.scrollWidth - thread.clientWidth);
  if ((delta > 0 && thread.scrollLeft >= max - 1) || (delta < 0 && thread.scrollLeft <= 1)) return;
  e.preventDefault();
  thread.style.scrollBehavior = "auto";
  thread.scrollLeft += delta;
  thread.style.scrollBehavior = "";
}, { passive: false });

stripBox.addEventListener("keydown", (e) => {
  const thread = e.target.closest(".thread");
  if (!thread) return;
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
  e.preventDefault();
  const list = diaryList();
  if (!list.length) return;
  let idx = list.findIndex((x) => entryId(x.entry, x.index) === selectedPlateId);
  if (idx < 0) idx = 0;
  if (e.key === "Home") idx = 0;
  else if (e.key === "End") idx = list.length - 1;
  else idx = Math.max(0, Math.min(list.length - 1, idx + (e.key === "ArrowRight" ? 1 : -1)));
  const target = list[idx];
  selectPlate(entryId(target.entry, target.index));
});

window.addEventListener("hashchange", renderRoute);
let resizeWasPhone = () => window.innerWidth <= 600;
window.addEventListener("resize", () => {
  if (isPhone() !== resizeWasPhone()) { closeSheet(); if (map) map.closePopup(); }
  syncLayout();
  if (stripUpdater) stripUpdater();
  if (map) requestAnimationFrame(() => map.invalidateSize());
});

/* ---------- boot ---------- */

tabsBox.append(...tabButtons);
filterBox.append(...filterButtons);
ledgerList.dataset.expanded = isPhone() ? "false" : "true";
updateFilters();
if (!location.hash) history.replaceState(null, "", "#/diary");
renderRoute();
