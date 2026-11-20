// Add a shop: copy the block below and push.
// Required: date, shop, type, image, maps.
// type: "Zhujiaofan", "Shaorou", "PadThaiHoiTod" (Pad Thai / Hoi Tod), "Roti", "ALaCarte" (A la carte) or "KhaoKhaMu" (Khao Kha Mu)
//       the stored key is an English identifier; the label is romanised Thai
// maps: paste the FULL Google Maps link from your browser bar - the one with @lat,lng in it.
//       A short share.google link will not create a map pin.
// display: optional 1200px 3:2 derivative used on cards; the original image is kept for 1:1 view.
// note: optional — leave blank or omit and no note line is shown.
//
// Optional extras (leave out any you do not have):
//   id: "my-shop-01"        // stable link for #/e/... (generated from date + shop if omitted)
//   rating: 4.5             // shown as "4.5 / 5"
//   price: 180              // shown as "฿180"
// Old entries with only "image" still work exactly as before.
window.DIARY_ENTRIES = [
  {
    date: "2025-11-26",
    shop: "ผัดไท หอยทอด กร& เก้า",
    type: "PadThaiHoiTod",
    image: "images/1795090695048.jpg",
    display: "images/1795090695048-display.webp",
    maps: "https://www.google.com/maps/@13.824002421411782,100.51619379335499,17z?hl=en",
    note: ""
  },
  {
    date: "2026-04-02",
    shop: "โรตีเจ้าฟ้า",
    type: "Roti",
    image: "images/IMG_20260402_124650.jpg",
    display: "images/IMG_20260402_124650-display.webp",
    maps: "https://www.google.com/maps/@7.878388933281209,98.38048871016771,17z?hl=en",
    note: ""
  },
  {
    date: "2026-03-30",
    shop: "ครัวฤกษ์ดี",
    type: "ALaCarte",
    image: "images/IMG_20260330_105602.jpg",
    display: "images/IMG_20260330_105602-display.webp",
    maps: "https://www.google.com/maps/@13.824947753681437,100.51541869932095,17z?hl=en",
    note: ""
  },
  {
    date: "2026-03-27",
    shop: "เจ๊ฮายกระเพราถาดพระนครเหนือ",
    type: "KhaoKhaMu",
    image: "images/IMG_20260327_184343.jpg",
    display: "images/IMG_20260327_184343-display.webp",
    maps: "https://www.google.com/maps/@13.823726,100.516154,17z?hl=en"
  }
];
