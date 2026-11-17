const entries = window.DIARY_ENTRIES || [];
const filters = ["All", "Zhujiaofan", "Shaorou"];
let activeTab = "map";
let activeFilter = filters[0];

const tabBox = document.getElementById("tabs");
const filterBox = document.getElementById("filters");
const cardBox = document.getElementById("cards");
const mapPanel = document.getElementById("map-panel");
const diaryPanel = document.getElementById("diary-panel");
let map;

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
  tag.className = "tag";
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

function renderDiary() {
  filterBox.replaceChildren(...filters.map((label) => {
    const b = document.createElement("button");
    b.textContent = label;
    b.className = label === activeFilter ? "active" : "";
    b.setAttribute("aria-pressed", String(label === activeFilter));
    b.addEventListener("click", () => {
      activeFilter = label;
      renderDiary();
    });
    return b;
  }));

  const list = entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => activeFilter === filters[0] || entry.type === activeFilter)
    .sort((a, b) => b.entry.date.localeCompare(a.entry.date));

  cardBox.replaceChildren(...list.map(({ entry, index }) => makeCard(entry, index)));

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty";

    const message = document.createElement("p");
    message.textContent = "No " + activeFilter + " entries yet.";

    const reset = document.createElement("button");
    reset.textContent = "Show all";
    reset.addEventListener("click", () => {
      activeFilter = filters[0];
      renderDiary();
    });

    empty.append(message, reset);
    cardBox.appendChild(empty);
  }
}

function renderTabs() {
  tabBox.replaceChildren(...["map", "diary"].map((name) => {
    const b = document.createElement("button");
    b.textContent = name === "map" ? "Map" : "Diary";
    b.className = activeTab === name ? "active" : "";
    b.setAttribute("aria-pressed", String(activeTab === name));
    b.addEventListener("click", () => {
      activeTab = name;
      renderTabs();
      if (name === "map") map.invalidateSize();
    });
    return b;
  }));
  mapPanel.hidden = activeTab !== "map";
  diaryPanel.hidden = activeTab !== "diary";
}

function openDiary(index) {
  activeTab = "diary";
  renderTabs();
  renderDiary();
  const card = cardBox.querySelector('[data-index="' + index + '"]');
  if (!card) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  card.classList.add("highlight");
  setTimeout(() => card.classList.remove("highlight"), 2000);
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
    const title = document.createElement("strong");
    title.textContent = entry.shop;
    const date = document.createElement("div");
    date.textContent = formatDate(entry.date);
    const note = document.createElement("p");
    note.textContent = entry.note || "";
    const button = document.createElement("button");
    button.textContent = "Open in diary";
    button.addEventListener("click", () => openDiary(index));
    popup.append(title, date, note, button);

    L.marker(pos, { alt: entry.shop, title: entry.shop }).addTo(map).bindPopup(popup);
  });

  if (points.length) {
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
  }
}

renderTabs();
renderDiary();
initMap();
