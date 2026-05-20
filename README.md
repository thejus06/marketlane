# MarketLane

MarketLane is a responsive marketplace website for buying and selling products. It includes product browsing, search, category and sort filters, a shopping cart drawer, checkout feedback, and a seller listing form.

## Features

- Browse featured product listings
- Search by product, seller, location, or description
- Filter products by category
- Sort by featured, price, or newest listing
- Add and remove products from the cart
- Publish new seller listings
- Save cart and user-created listings in the browser with `localStorage`

## Run Locally

Open `index.html` directly in a browser, or serve the folder with a local static server:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Then visit:

```text
http://127.0.0.1:4173/index.html
```

## Project Files

- `index.html` - page structure and marketplace sections
- `styles.css` - responsive layout and visual design
- `app.js` - filtering, cart behavior, checkout feedback, and listing persistence

## Notes

This is a front-end demo. Listings and cart contents are saved in the current browser only, so clearing site data will reset user-created products and cart state.
