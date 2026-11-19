const entries = window.DIARY_ENTRIES || [];
const filters = ["All", "Zhujiaofan", "Shaorou"];

let activeFilter = filters[0];
let map = null;
let markers = new Map();
let selectedId = null;
let lastOpenedId = null;
let sheetIndex = -1;
let sheetTrigger = null;

const tabsBox = document.getElementById("tabs");
const filterBox = document.getElementById("filters");
const diaryPanel = document.getElementById("diary-panel");
const mapPanel = document.getElementById("map-panel");
const entryPanel = document.getElementById("entry-panel");
const featuredBox = document.getElementById("featured");
const cardsBox = document.getElementById("cards");
const shopItemsBox = document.getElementById("shop-items");
const entryContent = document.getElementById("entry-content");
const diaryCount = document.getElementById("diary-count");
const mapCount = document.getElementById("map-count");
const statusEl = document.getElementById("status");
const sheet = document.getElementById("sheet");

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
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric", month: "short", year: "numeric"
  }).format(new Date(y, m - 1, d));
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
  return entry.type === "Shaorou";
}

function makeChip(entry) {
  const chip = document.createElement("span");
  chip.className = "chip" + (isCrisp(entry) ? " chip--olive" : "");
  chip.textContent = entry.type || "";
  return chip;
}

function makeMapsLink(link) {
  const a = document.createElement("a");
  a.className = "link";
  a.href = link;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = "Open in Google Maps";
  return a;
}

function makeMeta(entry) {
  const meta = document.createElement("p");
  meta.className = "detail-meta";
  const date = document.createElement("time");
  date.textContent = formatDate(entry.date);
  meta.appendChild(date);
  const sep = () => {
    const s = document.createElement("span");
    s.className = "visually-hidden";
    s.textContent = ", ";
    return s;
  };
  if (typeof entry.rating === "number") {
    const rating = document.createElement("span");
    rating.className = "rating";
    rating.textContent = "★ " + entry.rating + " / 5";
    meta.append(sep(), rating);
  }
  if (entry.price != null && entry.price !== "") {
    const price = document.createElement("span");
    price.textContent = "฿" + entry.price;
    meta.append(sep(), price);
  }
  return meta;
}

function visibleEntries() {
  return entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => activeFilter === filters[0] || entry.type === activeFilter)
    .sort((a, b) => (b.entry.date || "").localeCompare(a.entry.date || ""));
}

function countPhrase() {
  return entries.length === 1 ? "1 entry." : entries.length + " entries.";
}

function announce(text) {
  statusEl.textContent = text;
}

function emptyState(message) {
  const box = document.createElement("div");
  box.className = "empty";
  const p = document.createElement("p");
  p.textContent = message;
  box.appendChild(p);
  if (entries.length) {
    const reset = document.createElement("button");
    reset.className = "btn";
    reset.textContent = "Show all";
    reset.addEventListener("click", () => {
      setFilter(filters[0]);
      const all = filterButtons.find((b) => b.dataset.filter === filters[0]);
      if (all) all.focus();
    });
    box.appendChild(reset);
  }
  return box;
}

/* ---------- Diary ---------- */

function makeFeatured({ entry, index }) {
  const id = entryId(entry, index);
  const photos = photosOf(entry);
  const el = document.createElement("article");
  el.className = "feature";
  el.dataset.id = id;

  if (photos.length) {
    const media = document.createElement("a");
    media.className = "feature-media";
    media.href = "#/e/" + encodeURIComponent(id);
    media.setAttribute("aria-label", "Open " + entry.shop);
    const img = document.createElement("img");
    img.src = photos[0];
    img.alt = entry.shop;
    img.loading = "eager";
    img.decoding = "async";
    img.onerror = () => { media.hidden = true; };
    media.appendChild(img);
    el.appendChild(media);
  }

  const body = document.createElement("div");
  body.className = "feature-body";
  const tagLine = document.createElement("div");
  tagLine.className = "feature-tag";
  const dot = document.createElement("span");
  dot.className = "feature-dot";
  dot.setAttribute("aria-hidden", "true");
  tagLine.append(dot, makeChip(entry));

  const title = document.createElement("h2");
  const link = document.createElement("a");
  link.href = "#/e/" + encodeURIComponent(id);
  link.textContent = entry.shop || "Untitled";
  title.appendChild(link);

  const date = document.createElement("time");
  date.textContent = formatDate(entry.date);

  body.append(tagLine, title, date);
  if (entry.note) {
    const excerpt = document.createElement("p");
    excerpt.className = "excerpt";
    excerpt.textContent = entry.note;
    body.appendChild(excerpt);
  }
  const read = document.createElement("a");
  read.className = "read-link";
  read.href = "#/e/" + encodeURIComponent(id);
  read.textContent = "Read entry";
  body.appendChild(read);

  el.appendChild(body);
  return el;
}

function makeCard({ entry, index }) {
  const id = entryId(entry, index);
  const photos = photosOf(entry);
  const el = document.createElement("article");
  el.className = "entry-card";
  el.dataset.id = id;

  if (photos.length) {
    const media = document.createElement("a");
    media.className = "entry-card-media";
    media.href = "#/e/" + encodeURIComponent(id);
    media.setAttribute("aria-label", "Open " + entry.shop);
    const img = document.createElement("img");
    img.src = photos[0];
    img.alt = entry.shop;
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = () => { media.hidden = true; };
    media.appendChild(img);
    el.appendChild(media);
  }

  const body = document.createElement("div");
  body.className = "entry-card-body";
  const title = document.createElement("h3");
  const link = document.createElement("a");
  link.href = "#/e/" + encodeURIComponent(id);
  link.textContent = entry.shop || "Untitled";
  title.appendChild(link);
  const date = document.createElement("time");
  date.textContent = formatDate(entry.date);
  body.append(makeChip(entry), title, date);
  el.appendChild(body);
  return el;
}

function renderDiary() {
  const list = visibleEntries();
  diaryCount.textContent = list.length === 1 ? "1 entry" : list.length + " entries";
  featuredBox.replaceChildren();
  if (list.length) featuredBox.appendChild(makeFeatured(list[0]));
  cardsBox.replaceChildren(
    ...(list.length > 1 ? list.slice(1).map(makeCard) : []),
    ...(list.length === 0 ? [emptyState(entries.length ? "No " + activeFilter + " entries yet." : "No shops yet.")] : [])
  );
}

/* ---------- Entry detail ---------- */

function renderEntry(id) {
  const index = findById(id);
  if (index < 0) {
    const back = document.createElement("a");
    back.className = "back";
    back.href = "#/diary";
    back.textContent = "All entries";
    const msg = document.createElement("p");
    msg.className = "empty";
    msg.textContent = "That entry was not found.";
    entryContent.replaceChildren(back, msg);
    announce("Entry not found.");
    return;
  }

  const entry = entries[index];
  const photos = photosOf(entry);
  lastOpenedId = id;

  const wrap = document.createElement("article");
  wrap.className = "detail";

  const back = document.createElement("a");
  back.className = "back";
  back.href = "#/diary";
  back.textContent = "All entries";

  const head = document.createElement("div");
  head.className = "detail-head";
  const title = document.createElement("h1");
  title.className = "detail-title";
  title.tabIndex = -1;
  title.textContent = entry.shop || "Untitled";
  head.append(makeChip(entry), title, makeMeta(entry));

  wrap.appendChild(back);
  wrap.appendChild(head);

  if (photos.length) {
    const figure = document.createElement("figure");
    figure.className = "detail-photos";
    const main = document.createElement("img");
    main.className = "detail-main";
    main.src = photos[0];
    main.alt = entry.shop;
    main.decoding = "async";
    main.onerror = () => { main.hidden = true; };
    figure.appendChild(main);
    if (photos.length > 1) {
      const thumbs = document.createElement("div");
      thumbs.className = "thumbs";
      photos.forEach((src, i) => {
        const btn = document.createElement("button");
        btn.className = "thumb";
        btn.type = "button";
        btn.setAttribute("aria-label", "Show photo " + (i + 1));
        btn.setAttribute("aria-pressed", String(i === 0));
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.loading = "lazy";
        btn.appendChild(img);
        btn.addEventListener("click", () => {
          main.src = src;
          main.alt = entry.shop + ", photo " + (i + 1);
          thumbs.querySelectorAll(".thumb").forEach((b) => b.setAttribute("aria-pressed", "false"));
          btn.setAttribute("aria-pressed", "true");
        });
        thumbs.appendChild(btn);
      });
      figure.appendChild(thumbs);
    }
    wrap.appendChild(figure);
  }

  if (entry.note) {
    const note = document.createElement("p");
    note.className = "detail-note";
    note.textContent = entry.note;
    wrap.appendChild(note);
  }

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
  'fill="#ff6129" stroke="#171a20" stroke-width="2.2"/>' +
  '<circle cx="14" cy="14" r="4" fill="#171a20"/></svg>';

const CRISP_PIN =
  '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">' +
  '<rect x="4.5" y="4.5" width="17" height="17" rx="3" transform="rotate(45 13 13)" ' +
  'fill="#99af67" stroke="#171a20" stroke-width="2.2"/></svg>';

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

function makeShopItem({ entry, index }) {
  const id = entryId(entry, index);
  const photos = photosOf(entry);
  const btn = document.createElement("button");
  btn.className = "shop-item";
  btn.type = "button";
  btn.dataset.id = id;

  if (photos.length) {
    const img = document.createElement("img");
    img.className = "shop-thumb";
    img.src = photos[0];
    img.alt = "";
    img.loading = "lazy";
    img.onerror = () => { img.hidden = true; };
    btn.appendChild(img);
  } else {
    const blank = document.createElement("span");
    blank.className = "shop-no-photo";
    btn.appendChild(blank);
  }
  const text = document.createElement("span");
  text.className = "shop-text";
  const name = document.createElement("strong");
  name.textContent = entry.shop || "Untitled";
  const sub = document.createElement("small");
  sub.textContent = (entry.type || "") + " · " + formatDate(entry.date);
  text.append(name, sub);
  btn.appendChild(text);
  btn.addEventListener("click", () => activateShop(id, true));
  return btn;
}

function renderShopList() {
  const list = visibleEntries();
  mapCount.textContent = list.length === 1 ? "1 place" : list.length + " places";
  shopItemsBox.replaceChildren(
    ...(list.length ? list.map(makeShopItem) : [emptyState("No places to show.")])
  );
  updateMapMarkers();
}

function highlightShop(id, scroll) {
  selectedId = id;
  shopItemsBox.querySelectorAll(".shop-item").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.id === id);
  });
  markers.forEach((marker, markerId) => {
    const el = marker.getElement();
    if (el) el.classList.toggle("is-active", markerId === id);
  });
  if (scroll) {
    const item = shopItemsBox.querySelector('.shop-item[data-id="' + CSS.escape(id) + '"]');
    if (item) item.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

function popupFor(entry, index) {
  const box = document.createElement("div");
  box.appendChild(makeChip(entry));
  const title = document.createElement("strong");
  title.textContent = entry.shop || "Untitled";
  box.appendChild(title);
  const date = document.createElement("div");
  date.textContent = formatDate(entry.date);
  box.appendChild(date);
  if (entry.note) {
    const note = document.createElement("p");
    note.textContent = entry.note;
    box.appendChild(note);
  }
  if (entry.maps) box.appendChild(makeMapsLink(entry.maps));
  const open = document.createElement("button");
  open.className = "btn btn--primary";
  open.type = "button";
  open.textContent = "Open entry";
  open.addEventListener("click", () => {
    location.hash = "#/e/" + encodeURIComponent(entryId(entry, index));
  });
  box.appendChild(open);
  return box;
}

function activateShop(id, fromList) {
  const index = findById(id);
  if (index < 0) return;
  const entry = entries[index];
  const marker = markers.get(id);
  highlightShop(id, true);

  const pos = coordsFromLink(entry.maps);
  if (pos && map) map.panTo(pos, { animate: !prefersReducedMotion() });

  if (!marker) return;
  if (isPhone()) {
    openSheet(index, marker);
  } else {
    L.popup({ offset: [0, -34] })
      .setLatLng(marker.getLatLng())
      .setContent(popupFor(entry, index))
      .openOn(map);
  }
  if (fromList) announce(entry.shop + " selected on the map.");
}

function updateMapMarkers() {
  if (!map) return;
  const allowed = new Set(visibleEntries().map(({ entry, index }) => entryId(entry, index)));
  const points = [];
  markers.forEach((marker, id) => {
    const index = findById(id);
    const entry = entries[index];
    const pos = entry ? coordsFromLink(entry.maps) : null;
    if (allowed.has(id) && pos) {
      if (!map.hasLayer(marker)) marker.addTo(map);
      points.push(pos);
    } else if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  });
  if (points.length) {
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
  }
}

function ensureMap() {
  if (map) {
    requestAnimationFrame(() => map.invalidateSize());
    return;
  }
  if (typeof L === "undefined") {
    const err = document.getElementById("map-error");
    if (err) err.hidden = false;
    return;
  }

  map = L.map("map", { scrollWheelZoom: false }).setView([13.7563, 100.5018], 12);
  const tiles = L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
      maxZoom: 19
    }
  ).addTo(map);

  let tileFailures = 0;
  const mapError = document.getElementById("map-error");
  tiles.on("tileerror", () => {
    tileFailures += 1;
    if (tileFailures === 1) {
      if (mapError) mapError.hidden = false;
      announce("The map tiles could not load.");
    }
  });

  entries.forEach((entry, index) => {
    const pos = coordsFromLink(entry.maps);
    if (!pos) return;
    const id = entryId(entry, index);
    const label = (entry.shop || "Untitled") + ", " + (entry.type || "");
    const marker = L.marker(pos, { icon: pinIcon(entry), title: label });
    const el = marker.getElement ? marker.getElement() : null;
    if (el) el.setAttribute("aria-label", label);
    marker.on("add", () => {
      const node = marker.getElement();
      if (node) {
        node.setAttribute("aria-label", label);
        node.classList.toggle("is-active", id === selectedId);
      }
    });
    marker.on("click", () => activateShop(id, false));
    markers.set(id, marker);
  });

  map.on("click", closeSheet);
  updateMapMarkers();
  requestAnimationFrame(() => map.invalidateSize());
}

/* ---------- Phone sheet ---------- */

const sheetClose = document.getElementById("sheet-close");
const sheetOpen = document.getElementById("sheet-open");
const sheetTag = document.getElementById("sheet-tag");
const sheetShop = document.getElementById("sheet-shop");
const sheetDate = document.getElementById("sheet-date");
const sheetNote = document.getElementById("sheet-note");
const sheetLink = document.getElementById("sheet-link");

function isPhone() {
  return window.matchMedia("(max-width: 600px)").matches;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function openSheet(index, marker) {
  const entry = entries[index];
  if (!entry) return;
  sheetIndex = index;
  sheetTrigger = marker && marker.getElement ? marker.getElement() : null;
  sheetTag.textContent = entry.type || "";
  sheetTag.className = "chip" + (isCrisp(entry) ? " chip--olive" : "");
  sheetShop.textContent = entry.shop || "Untitled";
  sheetDate.textContent = formatDate(entry.date);
  sheetNote.textContent = entry.note || "";
  if (entry.maps) {
    sheetLink.href = entry.maps;
    sheetLink.hidden = false;
  } else {
    sheetLink.hidden = true;
  }
  sheet.dataset.open = "true";
  sheet.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => sheetClose.focus({ preventScroll: true }));
  announce(entry.shop + " details opened.");
}

function closeSheet() {
  if (sheet.dataset.open !== "true") return;
  sheet.dataset.open = "false";
  sheet.setAttribute("aria-hidden", "true");
  if (sheetTrigger && document.contains(sheetTrigger)) {
    sheetTrigger.focus({ preventScroll: true });
  }
  sheetTrigger = null;
}

sheetClose.addEventListener("click", closeSheet);
sheetOpen.addEventListener("click", () => {
  const index = sheetIndex;
  closeSheet();
  if (index >= 0) location.hash = "#/e/" + encodeURIComponent(entryId(entries[index], index));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSheet();
});

/* ---------- Filters and routing ---------- */

const filterButtons = filters.map((label) => {
  const b = document.createElement("button");
  b.className = "filter";
  b.type = "button";
  b.textContent = label;
  b.dataset.filter = label;
  b.addEventListener("click", () => setFilter(label));
  return b;
});

function updateFilters() {
  filterButtons.forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.filter === activeFilter));
  });
}

function setFilter(label) {
  activeFilter = label;
  updateFilters();
  renderDiary();
  renderShopList();
  const shown = visibleEntries().length;
  announce(label === filters[0]
    ? "Showing all entries. " + (shown === 1 ? "1 entry." : shown + " entries.")
    : "Showing " + label + ". " + (shown === 1 ? "1 entry." : shown + " entries."));
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

function renderRoute() {
  const route = parseRoute();
  closeSheet();
  tabButtons.forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.tab === route.view || (route.view === "entry" && b.dataset.tab === "diary")));
  });
  diaryPanel.hidden = route.view !== "diary";
  mapPanel.hidden = route.view !== "map";
  entryPanel.hidden = route.view !== "entry";

  if (route.view === "map") {
    renderShopList();
    ensureMap();
    announce("Map view. " + countPhrase());
  } else if (route.view === "entry") {
    renderEntry(route.id);
  } else {
    renderDiary();
    announce("Diary view. " + countPhrase());
    if (lastOpenedId) {
      const link = cardsBox.querySelector('.entry-card[data-id="' + CSS.escape(lastOpenedId) + '"] a')
        || featuredBox.querySelector('.feature[data-id="' + CSS.escape(lastOpenedId) + '"] h2 a');
      if (link) link.focus({ preventScroll: true });
    }
  }
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", renderRoute);

/* ---------- boot ---------- */

tabsBox.append(...tabButtons);
filterBox.append(...filterButtons);
updateFilters();
if (!location.hash) history.replaceState(null, "", "#/diary");
renderRoute();
