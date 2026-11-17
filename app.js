const entries = window.DIARY_ENTRIES || [];
const tabs = ["ทั้งหมด", "ขาหมู", "หมูกรอบ"];
const tabBox = document.getElementById("tabs");
const cardBox = document.getElementById("cards");
let active = tabs[0];

function makeButton(label) {
  const b = document.createElement("button");
  b.textContent = label;
  b.className = label === active ? "active" : "";
  b.setAttribute("aria-pressed", String(label === active));
  b.addEventListener("click", () => {
    active = label;
    render();
  });
  return b;
}

function makeCard(entry) {
  const el = document.createElement("article");
  el.className = "card";

  const img = document.createElement("img");
  img.src = entry.image;
  img.alt = entry.shop;
  img.loading = "lazy";
  img.onerror = () => img.remove();
  el.appendChild(img);

  const body = document.createElement("div");
  body.className = "card-body";

  const tag = document.createElement("span");
  tag.className = "tag " + (entry.type === "หมูกรอบ" ? "crisp" : "stew");
  tag.textContent = entry.type;

  const name = document.createElement("h2");
  name.textContent = entry.shop;

  const date = document.createElement("time");
  const [y, m, d] = entry.date.split("-").map(Number);
  date.textContent = new Intl.DateTimeFormat("th-TH", {
    day: "numeric", month: "short", year: "numeric"
  }).format(new Date(y, m - 1, d));

  const note = document.createElement("p");
  note.textContent = entry.note || "";

  body.append(tag, name, date, note);
  el.appendChild(body);
  return el;
}

function render() {
  tabBox.replaceChildren(...tabs.map(makeButton));

  const list = entries
    .filter((e) => active === "ทั้งหมด" || e.type === active)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  cardBox.replaceChildren(...list.map(makeCard));

  if (!list.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "ยังไม่มีบันทึกในหมู่นี้";
    cardBox.appendChild(empty);
  }
}

render();
