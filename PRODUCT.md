# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences.

Visitors are strangers who like Thai pork rice. They arrive from a shared link, usually on a phone, and want to know where this person ate Zhujiaofan (khao kha mu, pork leg rice) or Shaorou (crispy pork), and what it was like. They read and then leave.

The owner is the only writer: one person recording their own meals. They are comfortable editing a data file and pushing to GitHub, and they do not want a CMS, an admin panel, or an account.

## Product Purpose

A public map-and-diary of where to eat two specific pork dishes in Bangkok. Each entry records a shop, the date, which of the two dishes was eaten, a photo, and a short note, and appears both as a pin on a map and as a card in a diary.

Success means a visitor who lands from a link can tell where the shops are, tell the two dishes apart at a glance, and read an honest account of one of them.

## Positioning

One person's first-hand record of exactly two dishes, both on one map, hand-picked rather than aggregated. A reviews platform could not copy it truthfully, because the value is that a single named person actually ate there. The scope is deliberately narrow: no ratings, no user submissions, no other dishes, no city guides.

## Operating Context

Adding an entry is a manual file edit: add an object to `data/entries.js` with date, shop, dish type, image path, the full Google Maps link (the one containing `@lat,lng`), and a note; drop the photo in `images/`; commit and push. GitHub Pages republishes about a minute later. There is no draft state and no preview step beyond a local static server.

Visitors have no workflow. They open a link, look, and close it.

## Capabilities and Constraints

- Two views: **Diary** (default) and **Map**, switched by tabs.
- Diary filters: `All`, `Zhujiaofan`, `Shaorou`.
- Map pins distinguish the two dishes by shape and colour, and a summary line gives the shop and per-dish counts.
- A pin opens a popup with the shop, date, dish, note, and an "Open in diary" action that switches views and lands on that card.
- Exactly two dish types exist. This is settled scope, not a starting point; the filter vocabulary does not grow.
- Read-only for every visitor, permanently. No comments, reactions, accounts, submissions, likes, or analytics-driven features.
- Static site: plain HTML, CSS, and vanilla JS, no build step, no framework, no server code, no database.
- Leaflet and OpenStreetMap tiles load from CDNs.
- Entries are hand-edited in `data/entries.js`; there is no editing UI and none is planned.
- Pin coordinates are parsed from a pasted Google Maps URL, so a short `maps.app.goo.gl` link silently yields no pin.
- Hosted on GitHub Pages, public repository.
- Must work on a phone: one-handed reading from a shared link is the main arrival case.

## Brand Commitments

- Interface language is English. Dish labels are pinyin readings, not Chinese characters: **Zhujiaofan**, **Shaorou**, and **Chao He Fen / Zha Hao Bing** (one combined type for a visit with both ผัดไทย and หอยทอด). The stored `type` keys are English identifiers; a render label maps them to pinyin. The brand mark 九 (nine) in the binding rail is a logo, not interface copy.
- The site is named **Kyuu**, read from the mark 九. The wordmark in the masthead and the page title both use "Kyuu".

## Evidence on Hand

- Exactly one sample entry exists in `data/entries.js` ("Sample Shop"), with an illustrated placeholder at `images/sample.svg`.
- There are no real shops, real photos, quotes, ratings, press, or traffic numbers yet.

Future work must not invent shops, visits, photographs, testimonials, or claims about places the owner has not recorded.

## Product Principles

1. If the owner did not eat there, it does not go on the site. Never invent a shop, a visit, or a detail about a meal.
2. The map answers "where", the diary answers "what was it like". Both stay true to the same real visit.
3. A visitor arriving from a shared link must understand the two dishes and find a shop within seconds, on a phone.
4. Every visitor path ends somewhere actionable: pin to card to the shop's map link.
5. The owner's writing stays a single hand-edited file. Protect that simplicity over feature growth.
