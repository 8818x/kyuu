// Add a shop: copy the block below and push.
// Required: date, shop, type, image, maps, note.
// type: "Zhujiaofan" or "Shaorou"
// maps: paste the FULL Google Maps link from your browser bar - the one with @lat,lng in it.
//
// Optional extras (leave out any you do not have):
//   id: "my-shop-01"        // stable link for #/e/... (generated from date + shop if omitted)
//   photos: ["images/a.webp", "images/b.webp"]  // multiple photos; replaces "image" on the detail page
//   rating: 4.5             // shown as "4.5 / 5"
//   price: 180              // shown as "฿180"
// Old entries with only "image" still work exactly as before.
window.DIARY_ENTRIES = [
  {
    date: "2026-11-17",
    shop: "Sample Shop",
    type: "Zhujiaofan",
    image: "images/sample-food.jpg",
    maps: "https://www.google.com/maps/@13.7406,100.5094,17z?hl=en",
    note: "Rich broth, tender pork. Replace this with your own note."
  }
];
