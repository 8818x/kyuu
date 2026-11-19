const entries = window.DIARY_ENTRIES || [];
const baseTypes = ["Zhujiaofan", "Shaorou"];
const dishNames = {
  All: "All",
  Zhujiaofan: "Zhujiaofan",
  Shaorou: "Shaorou",
  PadThaiHoiTod: "Pad Thai / Hoi Tod"
};

function typesOf(entry) {
  if (Array.isArray(entry.type)) return entry.type;
  return entry.type ? [entry.type] : [];
}

const dishLabel = (type) => Array.isArray(type)
  ? type.map(dishLabel).join(" / ")
  : (dishNames[type] || type || "");

const recordTypes = [...new Set(entries.flatMap(typesOf))];
const filters = ["All", ...baseTypes.filter((t) => recordTypes.includes(t)),
  ...recordTypes.filter((t) => !baseTypes.includes(t) && t !== "All")];
const LAST_KEY = "food-diary-last";

let activeFilter = filters[0];
let searchTerm = "";
let map = null;
let markers = new Map();
let selectedShopKey = null;
let sheetTrigger = null;
let popupTrigger = null;
let zoomTrigger = null;
let stripUpdater = null;

const $ = (id) => document.getElementById(id);
const tabsBox = $("tabs");
const filterBox = $("filters");
const diaryPanel = $("diary-panel");
const mapPanel = $("map-panel");
const entryPanel = $("entry-panel");
const featuredBox = $("featured");
const stripBox = $("strip");
const shopItemsBox = $("shop-items");
const entryContent = $("entry-content");
const ledgerCount = $("ledger-count");
const mapCount = $("map-count");
const statusEl = $("status");
const sheet = $("sheet");
const searchInput = $("shop-search");
const listToggle = $("list-toggle");
const ledgerList = document.querySelector(".ledger-list");
const lightbox = $("lightbox");

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
  if (Array.isArray(entry.photos) && entry.photos.length) return entry.photos;
  return entry.image ? [entry.image] : [];
}

function entryId(entry, index) {
  if (entry.id != null && entry.id !== "") return String(entry.id);
  const base = (entry.date || "") + "-" + (entry.shop || index + 1);
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "entry-" + (index + 1);
}

function findById(id) {
  return entries.findIndex((entry, i) => entryId(entry, i) === id);
}

function isCrisp(entry) {
  return typesOf(entry).some((type) => type === "Shaorou");
}

function pad(n) {
  return String(n).padStart(3, "0");
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

function makeStamp(entry) {
  const wrap = document.createElement("span");
  wrap.className = "dish-stamps";
  typesOf(entry).forEach((type) => {
    const stamp = document.createElement("span");
    stamp.className = "dish-stamp" + (type === "Shaorou" ? " dish-stamp--crisp" : "");
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

function searchMatches(entry) {
  if (!searchTerm) return true;
  const haystack = [entry.shop, typesOf(entry).join(" "), entry.note].join(" ").toLowerCase();
  return haystack.indexOf(searchTerm) !== -1;
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
      (activeFilter === filters[0] || typesOf(entry).includes(activeFilter)) && searchMatches(entry));
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
    const media = document.createElement("button");
    media.className = "plate";
    media.type = "button";
    media.setAttribute("aria-label", "View photograph at full size");
    const img = document.createElement("img");
    img.className = "plate-photo";
    img.src = photos[0];
    img.alt = entry.shop ? "Photograph from " + entry.shop : "";
    img.loading = "eager";
    img.decoding = "async";
    const label = document.createElement("span");
    label.className = "plate-label";
    label.textContent = "写真 " + pad(index + 1);
    img.onerror = () => {
      media.classList.add("is-missing");
      media.disabled = true;
      img.style.visibility = "hidden";
      label.textContent = "写真 " + pad(index + 1) + " / PHOTO UNAVAILABLE";
    };
    media.addEventListener("click", () => openLightbox(photos[0], img.alt, media));
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
  title.textContent = entry.shop || "Untitled";

  body.append(marks, title);
  const note = document.createElement("p");
  note.className = "inscription" + (entry.note ? "" : " inscription--empty");
  note.textContent = entry.note || "No note recorded.";
  body.appendChild(note);
  el.appendChild(body);
  return el;
}

function makeThumb(item, isCurrent) {
  const { entry, index } = item;
  const id = entryId(entry, index);
  const photos = photosOf(entry);
  const el = document.createElement("div");
  el.className = "print-thumb" + (isCurrent ? " is-current" : "");
  el.dataset.id = id;

  const mat = document.createElement("span");
  mat.className = "thumb-mat";
  if (photos.length) {
    const img = document.createElement("img");
    img.src = photos[0];
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = () => { img.hidden = true; };
    mat.appendChild(img);
  }
  const meta = document.createElement("span");
  meta.className = "thumb-meta";
  const no = document.createElement("b");
  no.textContent = pad(index + 1);
  const name = document.createElement("span");
  name.textContent = entry.shop || "Untitled";
  meta.append(no, name);
  el.append(mat, meta);

  if (id === getLast()) {
    const flag = document.createElement("span");
    flag.className = "tape-flag";
    flag.setAttribute("aria-label", "Last viewed");
    el.appendChild(flag);
  }
  return el;
}

function renderDiary() {
  const list = visibleEntries();
  const shown = list.length;
  const filtered = shown !== entries.length;

  ledgerCount.innerHTML = "";
  const no = document.createElement("span");
  no.textContent = pad(entries.length);
  const unit = document.createElement("small");
  unit.textContent = "写真";
  ledgerCount.append(no, unit);
  ledgerCount.setAttribute("aria-label", entries.length + (entries.length === 1 ? " plate recorded" : " plates recorded"));

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
  featuredBox.appendChild(makeFeatured(list[0]));

  document.body.classList.toggle("diary-few", list.length > 0 && list.length <= 3);

  const head = document.createElement("div");
  head.className = "strip-head";
  const left = document.createElement("span");
  left.textContent = "THE LEDGER";
  const right = document.createElement("span");
  right.textContent = pad(list.length) + " 写真";
  head.append(left);

  const inner = document.createElement("div");
  inner.className = "strip-inner";
  const currentId = entryId(list[0].entry, list[0].index);
  inner.append(...list.map((item) => makeThumb(item, entryId(item.entry, item.index) === currentId)));

  if (list.length > 4) {
    const nav = document.createElement("div");
    nav.className = "strip-nav";
    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "strip-nav-btn";
    prev.setAttribute("aria-label", "Earlier plates");
    prev.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M14 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const next = document.createElement("button");
    next.type = "button";
    next.className = "strip-nav-btn";
    next.setAttribute("aria-label", "Later plates");
    next.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M10 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const range = document.createElement("span");
    range.className = "strip-range";
    const updateRange = () => {
      const first = inner.firstElementChild;
      const step = first ? first.getBoundingClientRect().width + 12 : 1;
      const start = Math.min(list.length, Math.floor(inner.scrollLeft / step) + 1);
      const visible = Math.max(1, Math.ceil(inner.clientWidth / step));
      const end = Math.min(list.length, start + visible - 1);
      range.textContent = pad(start) + "–" + pad(end) + " / " + pad(list.length);
      prev.disabled = inner.scrollLeft <= 2;
      next.disabled = inner.scrollLeft + inner.clientWidth >= inner.scrollWidth - 2;
    };
    const jump = (dir) => {
      inner.scrollBy({ left: dir * inner.clientWidth * 0.9, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    };
    prev.addEventListener("click", () => jump(-1));
    next.addEventListener("click", () => jump(1));
    inner.addEventListener("scroll", updateRange, { passive: true });
    stripUpdater = updateRange;
    nav.append(prev, range, next);
    head.append(nav);
    requestAnimationFrame(updateRange);
  } else {
    stripUpdater = null;
  }
  head.append(right);
  stripBox.append(head, inner);

  const tape = $("binding-tape");
  if (tape) tape.hidden = !getLast();
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

function openLightbox(src, alt, trigger) {
  const holder = $("lightbox-image");
  holder.innerHTML = "";
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  holder.appendChild(img);
  zoomTrigger = trigger || null;
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("lightbox-close").focus({ preventScroll: true });
}

function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (zoomTrigger && document.contains(zoomTrigger)) zoomTrigger.focus({ preventScroll: true });
  zoomTrigger = null;
}

$("lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

function renderEntry(id) {
  const index = findById(id);
  if (index < 0) {
    const back = document.createElement("a");
    back.className = "back-link";
    back.href = "#/diary";
    back.textContent = "← All entries";
    const msg = document.createElement("p");
    msg.className = "empty-state";
    msg.textContent = "That entry was not found.";
    entryContent.replaceChildren(back, msg);
    announce("Entry not found.");
    return;
  }

  const entry = entries[index];
  const photos = photosOf(entry);
  setLast(id);

  const wrap = document.createElement("article");
  wrap.className = "detail";
  const back = document.createElement("a");
  back.className = "back-link";
  back.href = "#/diary";
  back.textContent = "← All entries";

  const head = document.createElement("div");
  head.className = "detail-head";
  const marks = document.createElement("div");
  marks.className = "marks";
  marks.append(makeDateStamp(entry.date), makeStamp(entry));
  const title = document.createElement("h1");
  title.className = "detail-title";
  title.tabIndex = -1;
  title.textContent = entry.shop || "Untitled";
  head.append(marks, title, makeMeta(entry));
  wrap.append(back, head);

  if (photos.length) {
    const figure = document.createElement("figure");
    figure.className = "detail-plate";
    const main = document.createElement("img");
    main.className = "detail-photo";
    main.src = photos[0];
    main.alt = entry.shop ? "Photograph from " + entry.shop : "";
    main.decoding = "async";
    const cap = document.createElement("figcaption");
    const label = document.createElement("span");
    label.className = "plate-label";
    label.style.position = "static";
    const labelFor = (i) => "写真 " + pad(index + 1) + " / PHOTO " + pad(i + 1) + " OF " + pad(photos.length);
    label.textContent = labelFor(0);
    main.onerror = () => {
      figure.classList.add("is-missing");
      main.style.visibility = "hidden";
      label.textContent = "写真 " + pad(index + 1) + " / PHOTO UNAVAILABLE";
      zoom.hidden = true;
    };
    const zoom = document.createElement("button");
    zoom.className = "ink-link";
    zoom.type = "button";
    zoom.textContent = "View at 1:1";
    zoom.addEventListener("click", () => openLightbox(main.src, main.alt, zoom));
    cap.append(label, zoom);
    figure.append(main, cap);
    wrap.appendChild(figure);

    if (photos.length > 1) {
      const thumbs = document.createElement("div");
      thumbs.className = "detail-thumbs";
      photos.forEach((src, i) => {
        const btn = document.createElement("button");
        btn.className = "thumb-btn";
        btn.type = "button";
        btn.setAttribute("aria-label", "Show photo " + (i + 1));
        btn.setAttribute("aria-pressed", String(i === 0));
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.loading = "lazy";
        img.onerror = () => { img.hidden = true; };
        btn.appendChild(img);
        btn.addEventListener("click", () => {
          main.src = src;
          main.alt = (entry.shop || "Entry") + ", photo " + (i + 1);
          main.style.visibility = "visible";
          figure.classList.remove("is-missing");
          label.textContent = labelFor(i);
          zoom.hidden = false;
          thumbs.querySelectorAll(".thumb-btn").forEach((b) => b.setAttribute("aria-pressed", "false"));
          btn.setAttribute("aria-pressed", "true");
        });
        thumbs.appendChild(btn);
      });
      wrap.appendChild(thumbs);
    }
  }

  const note = document.createElement("p");
  note.className = "detail-note inscription" + (entry.note ? "" : " inscription--empty");
  note.textContent = entry.note || "No note recorded.";
  wrap.appendChild(note);
  if (entry.maps) {
    const actions = document.createElement("div");
    actions.className = "detail-actions";
    actions.appendChild(makeMapsLink(entry.maps));
    wrap.appendChild(actions);
  }

  entryContent.replaceChildren(wrap);
  title.focus({ preventScroll: true });
  announce(entry.shop + " entry opened.");
}

/* ---------- Map ---------- */

const STEW_PIN =
  '<svg width="28" height="38" viewBox="0 0 28 38" aria-hidden="true">' +
  '<path d="M14 36.5S2.5 23.2 2.5 14a11.5 11.5 0 0 1 23 0c0 9.2-11.5 22.5-11.5 22.5Z" ' +
  'fill="#bf2f1e" stroke="#ffffff" stroke-width="2.2"/>' +
  '<circle cx="14" cy="14" r="4" fill="#ffffff"/></svg>';
const CRISP_PIN =
  '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">' +
  '<rect x="4.5" y="4.5" width="17" height="17" rx="3" transform="rotate(45 13 13)" ' +
  'fill="#161514" stroke="#ffffff" stroke-width="2.2"/></svg>';

function pinIcon(entry) {
  const crisp = isCrisp(entry);
  return L.divIcon({
    className: "map-pin",
    html: crisp ? CRISP_PIN : STEW_PIN,
    iconSize: crisp ? [26, 26] : [28, 38],
    iconAnchor: crisp ? [13, 13] : [14, 38],
    popupAnchor: [0, crisp ? -14 : -34]
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
    img.src = photos[0];
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
  name.textContent = group.shop;
  const sub = document.createElement("small");
  const count = group.visits.length;
  sub.textContent = dishLabel(latest.type) + " · " + pad(count) + (count === 1 ? " VISIT" : " VISITS") + " · " + formatDate(latest.date);
  text.append(name, sub);
  if (!groupPosition(group)) {
    const note = document.createElement("small");
    note.className = "place-note";
    note.textContent = "No pin for this place";
    text.appendChild(note);
  }
  btn.appendChild(text);
  if (group.visits.some(({ entry, index }) => entryId(entry, index) === getLast())) {
    const flag = document.createElement("span");
    flag.className = "tape-flag";
    flag.setAttribute("aria-label", "Last viewed");
    btn.appendChild(flag);
  }
  btn.addEventListener("click", () => activateShop(group.key, btn));
  return btn;
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

function visitBlocks(group, className) {
  const holder = document.createElement("div");
  group.visits.forEach(({ entry }) => {
    const block = document.createElement("div");
    block.className = className;
    const meta = document.createElement("div");
    meta.className = "visit-meta";
    meta.append(makeDateStamp(entry.date), makeStamp(entry));
    block.appendChild(meta);
    if (entry.note) {
      const note = document.createElement("p");
      note.className = "visit-note";
      note.textContent = entry.note;
      block.appendChild(note);
    }
    holder.appendChild(block);
  });
  return holder;
}

function popupFor(group) {
  const box = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = group.shop;
  box.appendChild(title);
  const count = document.createElement("div");
  count.className = "visit-count";
  count.textContent = pad(group.visits.length) + (group.visits.length === 1 ? " VISIT" : " VISITS");
  box.appendChild(count);
  box.appendChild(visitBlocks(group, "visit-block"));
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

  if (pos && map) map.panTo(pos, { animate: !prefersReducedMotion() });
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

function renderShopList() {
  const list = visibleMapGroups();
  mapCount.textContent = pad(list.length) + (list.length === 1 ? " PLACE" : " PLACES");
  if (!list.length) {
    shopItemsBox.replaceChildren(emptyState(
      entries.length ? "No places match this search." : "No places yet.",
      searchTerm || activeFilter !== filters[0] ? "Clear search and filter" : null,
      () => { searchTerm = ""; searchInput.value = ""; setFilter(filters[0]); }
    ));
  } else {
    shopItemsBox.replaceChildren(...list.map(makePlaceRow));
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
  map = L.map("map", { scrollWheelZoom: false }).setView([13.7563, 100.5018], 12);
  const tiles = L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
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
    closeLightbox();
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
    stamp.className = "dish-stamp" + (type === "Shaorou" ? " dish-stamp--crisp" : "");
    stamp.textContent = dishLabel(type);
    sheetTag.appendChild(stamp);
  });
  $("sheet-shop").textContent = group.shop;
  $("sheet-date").textContent = pad(count) + (count === 1 ? " VISIT" : " VISITS");
  const noteBox = $("sheet-note");
  noteBox.replaceChildren(visitBlocks(group, "sheet-visit"));
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
    ...Object.fromEntries(baseTypes.map((t) => [t, entries.filter((e) => typesOf(e).includes(t)).length])),
    ...Object.fromEntries(recordTypes.filter((t) => !baseTypes.includes(t))
      .map((t) => [t, entries.filter((e) => typesOf(e).includes(t)).length]))
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
  ledgerCount.setAttribute("aria-label", entries.length + (entries.length === 1 ? " plate recorded" : " plates recorded"));
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
  const hash = location.hash.replace(/^#\/?/, "");
  if (hash === "map") return { view: "map" };
  if (hash.indexOf("e/") === 0) return { view: "entry", id: decodeURIComponent(hash.slice(2)) };
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
  closeLightbox();
  syncLayout();
  updateFilters();
  tabButtons.forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.tab === route.view || (route.view === "entry" && b.dataset.tab === "diary")));
  });
  diaryPanel.hidden = route.view !== "diary";
  mapPanel.hidden = route.view !== "map";
  entryPanel.hidden = route.view !== "entry";
  if (route.view !== "diary") document.body.classList.remove("diary-few");

  if (route.view === "map") {
    renderShopList();
    ensureMap();
    announce("Map view. " + (entries.length === 1 ? "1 entry." : entries.length + " entries."));
  } else if (route.view === "entry") {
    renderEntry(route.id);
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

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderShopList();
});

listToggle.addEventListener("click", () => {
  const open = ledgerList.dataset.expanded !== "true";
  ledgerList.dataset.expanded = String(open);
  listToggle.setAttribute("aria-expanded", String(open));
});

window.addEventListener("hashchange", renderRoute);
window.addEventListener("resize", () => {
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
