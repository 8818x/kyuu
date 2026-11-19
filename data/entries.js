// Add a shop: copy the block below and push.
// Required: date, shop, type, image, maps, note.
// type: "Zhujiaofan" (猪脚饭), "Shaorou" (烧肉), "PadThai" (泰式炒河粉), "HoiThod" (泰式炸蚝饼)
//       or an array of them for a visit with more than one dish, e.g. ["PadThai", "HoiThod"]
// maps: paste the FULL Google Maps link from your browser bar - the one with @lat,lng in it.
//       A short share.google link will not create a map pin.
//
// Optional extras (leave out any you do not have):
//   id: "my-shop-01"        // stable link for #/e/... (generated from date + shop if omitted)
//   photos: ["images/a.webp", "images/b.webp"]  // multiple photos; replaces "image" on the detail page
//   rating: 4.5             // shown as "4.5 / 5"
//   price: 180              // shown as "฿180"
// Old entries with only "image" still work exactly as before.
window.DIARY_ENTRIES = [
  {
    date: "2025-11-26",
    shop: "ผัดไท หอยทอด กร& เก้า",
    type: ["PadThai", "HoiThod"],
    image: "images/sample-food.jpg",
    maps: "https://share.google/X9DNMraTA3ZSJJkiS",
    note: ""
  }
];
