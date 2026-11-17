const entries = window.DIARY_ENTRIES || [];
const filters = ["All", "Zhujiaofan", "Shaorou"];
let activeTab = "map";
let activeFilter = filters[0];
let map;

const tabBox = document.getElementById("tabs");
const filterBox = document.getElementById("filters");
const cardBox = document.getElementById("cards");
const mapPanel = document.getElementById("map-panel");
const diaryPanel = document.getElementById("diary-panel");
const statusEl = document.getElementById("status");

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
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric", month: "short", year: "numeric"
  }).format(new Date(y, m - 1, d));
}

function makeCard(entry, index) {
  const el = document.createElement("article");
  el.className = "card";
  el.dataset.index = String(index);
  el.tabIndex = -1; // focus target for the "Open in diary" jump

  if (entry.image) {
    const img = document.createElement("img");
    img.src = entry.image;
    img.alt = entry.shop;
    img.loading = "lazy";
    img.onerror = () => img.remove();
    el.appendChild(img);
  }

  const body = document.createElement("div");
  body.className = "card-body";

  const tag = document.createElement("span");
  tag.className = "chip";
  tag.textContent = entry.type;

  const name = document.createElement("h2");
  name.textContent = entry.shop;

  const date = document.createElement("time");
  date.textContent = formatDate(entry.date);

  const note = document.createElement("p");
  note.textContent = entry.note || "";

  body.append(tag, name, date, note);
  el.appendChild(body);
  return el;
}

function visibleEntries() {
  return entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => activeFilter === filters[0] || entry.type === activeFilter)
    .sort((a, b) => b.entry.date.localeCompare(a.entry.date));
}

function countPhrase() {
  return entries.length === 1 ? "1 shop." : entries.length + " shops.";
}

function announce(text) {
  statusEl.textContent = text;
}

function renderCards() {
  const list = visibleEntries();
  cardBox.replaceChildren(...list.map(({ entry, index }) => makeCard(entry, index)));

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty";

    const message = document.createElement("p");
    message.textContent = entries.length
      ? "No " + activeFilter + " entries yet."
      : "No shops yet.";

    const reset = document.createElement("button");
    reset.className = "btn";
    reset.textContent = "Show all";
    reset.addEventListener("click", () => {
      setFilter(filters[0]);
      const all = filterButtons.find((b) => b.dataset.filter === filters[0]);
      if (all) all.focus();
    });

    empty.append(message, reset);
    cardBox.appendChild(empty);
  }
}

const filterButtons = filters.map((label) => {
  const b = document.createElement("button");
  b.className = "btn";
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
  renderCards();
  announce(label === filters[0]
    ? "Showing all shops. " + countPhrase()
    : "Showing " + label + ". " + countPhrase());
}

const tabButtons = [["map", "Map"], ["diary", "Diary"]].map(([name, label]) => {
  const b = document.createElement("button");
  b.className = "btn";
  b.textContent = label;
  b.dataset.tab = name;
  b.addEventListener("click", () => setTab(name));
  return b;
});

function updateTabs() {
  tabButtons.forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.tab === activeTab));
  });
  mapPanel.hidden = activeTab !== "map";
  diaryPanel.hidden = activeTab !== "diary";
}

function setTab(name) {
  activeTab = name;
  updateTabs();
  if (name === "map") {
    if (map) map.invalidateSize();
    announce("Map view. " + countPhrase());
  } else {
    announce("Diary view. " + countPhrase());
  }
}

function openDiary(index) {
  const entry = entries[index];
  activeTab = "diary";
  // Land on a view that actually contains this card.
  if (entry) activeFilter = entry.type;
  updateTabs();
  updateFilters();
  renderCards();

  const card = cardBox.querySelector('[data-index="' + index + '"]');
  if (!card) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  card.focus({ preventScroll: true });
  card.classList.add("highlight");
  setTimeout(() => card.classList.remove("highlight"), 2000);
  if (entry) announce(entry.shop + " opened in the diary.");
}

const STEW_PIN =
  '<svg width="28" height="38" viewBox="0 0 28 38" aria-hidden="true">' +
  '<path d="M14 36.5S2.5 23.2 2.5 14a11.5 11.5 0 0 1 23 0c0 9.2-11.5 22.5-11.5 22.5Z" ' +
  'fill="#8a4b2a" stroke="#fff" stroke-width="2.2"/>' +
  '<circle cx="14" cy="14" r="4" fill="#fff"/></svg>';

const CRISP_PIN =
  '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">' +
  '<rect x="4.5" y="4.5" width="17" height="17" rx="3" transform="rotate(45 13 13)" ' +
  'fill="#a8761a" stroke="#fff" stroke-width="2.2"/></svg>';

function pinIcon(type) {
  const crisp = type === "Shaorou";
  return L.divIcon({
    className: "map-pin",
    html: crisp ? CRISP_PIN : STEW_PIN,
    iconSize: crisp ? [26, 26] : [28, 38],
    iconAnchor: crisp ? [13, 13] : [14, 38],
    popupAnchor: [0, crisp ? -14 : -34]
  });
}

const sheet = document.getElementById("sheet");
const sheetClose = document.getElementById("sheet-close");
const sheetOpen = document.getElementById("sheet-open");
const sheetTag = document.getElementById("sheet-tag");
const sheetShop = document.getElementById("sheet-shop");
const sheetDate = document.getElementById("sheet-date");
const sheetNote = document.getElementById("sheet-note");
let sheetIndex = -1;
let sheetTrigger = null;

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

  sheetTag.textContent = entry.type;
  sheetTag.className = "chip" + (entry.type === "Shaorou" ? " chip--crisp" : "");
  sheetShop.textContent = entry.shop;
  sheetDate.textContent = formatDate(entry.date);
  sheetNote.textContent = entry.note || "";

  sheet.dataset.open = "true";
  sheet.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => sheetClose.focus({ preventScroll: true }));

  const pos = coordsFromLink(entry.maps);
  if (pos && map) map.panTo(pos, { animate: !prefersReducedMotion() });

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
  if (index >= 0) openDiary(index);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSheet();
});

function renderSummary() {
  const el = document.getElementById("map-summary");
  if (!el) return;

  const counts = { Zhujiaofan: 0, Shaorou: 0 };
  entries.forEach((entry) => {
    if (counts[entry.type] !== undefined) counts[entry.type] += 1;
  });

  const lead = document.createElement("span");
  lead.className = "summary-lead";
  lead.textContent = entries.length === 1 ? "1 shop" : entries.length + " shops";

  const keys = Object.keys(counts).map((type) => {
    const key = document.createElement("span");
    key.className = "summary-key";
    const swatch = document.createElement("i");
    swatch.className = "swatch " + (type === "Shaorou" ? "swatch--crisp" : "swatch--stew");
    swatch.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.textContent = type + " " + counts[type];
    key.append(swatch, label);
    return key;
  });

  const parts = [lead];
  keys.forEach((key) => parts.push(document.createTextNode(" · "), key));
  el.replaceChildren(...parts);
}

function initMap() {
  map = L.map("map", { scrollWheelZoom: false }).setView([13.7563, 100.5018], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(map);

  const points = [];
  entries.forEach((entry, index) => {
    const pos = coordsFromLink(entry.maps);
    if (!pos) return;
    points.push(pos);

    const popup = document.createElement("div");
    const tag = document.createElement("span");
    tag.className = "chip" + (entry.type === "Shaorou" ? " chip--crisp" : "");
    tag.textContent = entry.type;
    const title = document.createElement("strong");
    title.textContent = entry.shop;
    const date = document.createElement("div");
    date.textContent = formatDate(entry.date);
    const note = document.createElement("p");
    note.textContent = entry.note || "";
    const button = document.createElement("button");
    button.className = "btn";
    button.textContent = "Open in diary";
    button.addEventListener("click", () => openDiary(index));
    popup.append(tag, title, date, note, button);

    const label = entry.shop + ", " + entry.type;
    const marker = L.marker(pos, { icon: pinIcon(entry.type), title: label }).addTo(map);
    const el = marker.getElement();
    if (el) el.setAttribute("aria-label", label);

    marker.on("click", () => {
      if (isPhone()) {
        openSheet(index, marker);
        return;
      }
      L.popup({ offset: [0, -34] })
        .setLatLng(pos)
        .setContent(popup)
        .openOn(map);
    });
  });

  map.on("click", closeSheet);

  if (points.length) {
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
  }
}

tabBox.append(...tabButtons);
filterBox.append(...filterButtons);
updateTabs();
updateFilters();
renderCards();
renderSummary();
initMap();
