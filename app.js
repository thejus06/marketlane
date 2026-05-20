const defaultProducts = [
  {
    id: "p1",
    name: "Walnut Work Desk",
    price: 245,
    category: "Home",
    seller: "Maya R.",
    location: "Portland, OR",
    date: "2026-05-14",
    description: "Solid walnut desk with cable tray and minor corner wear.",
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p2",
    name: "Mirrorless Camera Kit",
    price: 620,
    category: "Electronics",
    seller: "Noah P.",
    location: "Seattle, WA",
    date: "2026-05-16",
    description: "Includes body, 35mm lens, charger, strap, and travel case.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p3",
    name: "Leather Weekender Bag",
    price: 138,
    category: "Fashion",
    seller: "Ari C.",
    location: "Chicago, IL",
    date: "2026-05-12",
    description: "Full-grain leather bag with brass hardware and shoe pocket.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p4",
    name: "Trail Bike",
    price: 410,
    category: "Outdoors",
    seller: "Jess T.",
    location: "Boulder, CO",
    date: "2026-05-18",
    description: "Hardtail mountain bike, recently tuned, medium frame.",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p5",
    name: "Design Book Bundle",
    price: 58,
    category: "Books",
    seller: "Priya S.",
    location: "New York, NY",
    date: "2026-05-10",
    description: "Five books on typography, systems design, and product craft.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p6",
    name: "Smart Espresso Scale",
    price: 72,
    category: "Electronics",
    seller: "Leo K.",
    location: "Austin, TX",
    date: "2026-05-17",
    description: "Rechargeable coffee scale with timer and silicone mat.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
];

const storageKey = "marketlane-products";
const cartKey = "marketlane-cart";

const state = {
  products: loadProducts(),
  cart: JSON.parse(localStorage.getItem(cartKey) || "[]"),
  query: "",
  category: "All",
  sort: "featured",
};

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const sortFilter = document.querySelector("#sortFilter");
const resultCount = document.querySelector("[data-result-count]");
const cartCount = document.querySelector("[data-cart-count]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItems = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const checkoutMessage = document.querySelector("[data-checkout-message]");

function loadProducts() {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  return [...saved, ...defaultProducts];
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function populateCategories() {
  const categories = [...new Set(state.products.map((product) => product.category))].sort();
  categoryFilter.innerHTML =
    '<option value="All">All categories</option>' +
    categories
      .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
      .join("");
}

function filteredProducts() {
  const query = state.query.toLowerCase().trim();
  const filtered = state.products.filter((product) => {
    const matchesCategory = state.category === "All" || product.category === state.category;
    const text = `${product.name} ${product.seller} ${product.location} ${product.description}`.toLowerCase();
    return matchesCategory && text.includes(query);
  });

  return filtered.sort((a, b) => {
    if (state.sort === "price-low") return a.price - b.price;
    if (state.sort === "price-high") return b.price - a.price;
    if (state.sort === "newest") return new Date(b.date) - new Date(a.date);
    return defaultProducts.findIndex((product) => product.id === a.id) - defaultProducts.findIndex((product) => product.id === b.id);
  });
}

function renderProducts() {
  const products = filteredProducts();
  resultCount.textContent = `${products.length} listing${products.length === 1 ? "" : "s"}`;

  if (!products.length) {
    productGrid.innerHTML = '<p class="empty-state">No products match your filters.</p>';
    return;
  }

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" />
          <div class="product-body">
            <div class="product-meta">
              <span>${escapeHtml(product.category)}</span>
              <small>${escapeHtml(product.location)}</small>
            </div>
            <div>
              <h3>${escapeHtml(product.name)}</h3>
              <p>${escapeHtml(product.description)}</p>
            </div>
            <p>Sold by <strong>${escapeHtml(product.seller)}</strong></p>
            <div class="price-row">
              <strong>${money(product.price)}</strong>
              <button type="button" data-add-cart="${escapeHtml(product.id)}">Add to cart</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCart() {
  const items = state.cart.map((id) => state.products.find((product) => product.id === id)).filter(Boolean);
  cartCount.textContent = items.length;
  cartTotal.textContent = money(items.reduce((sum, product) => sum + product.price, 0));

  if (!items.length) {
    cartItems.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = items
    .map(
      (product) => `
        <div class="cart-line">
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <p>${escapeHtml(product.seller)} - ${money(product.price)}</p>
          </div>
          <button type="button" data-remove-cart="${escapeHtml(product.id)}">Remove</button>
        </div>
      `,
    )
    .join("");
}

function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(state.cart));
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-cart]");
  if (!button) return;
  state.cart.push(button.dataset.addCart);
  checkoutMessage.textContent = "";
  saveCart();
  openCart();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-cart]");
  if (!button) return;
  const index = state.cart.indexOf(button.dataset.removeCart);
  if (index >= 0) state.cart.splice(index, 1);
  saveCart();
});

document.querySelector("[data-cart-open]").addEventListener("click", openCart);
document.querySelector("[data-cart-close]").addEventListener("click", closeCart);
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

document.querySelector("[data-checkout]").addEventListener("click", () => {
  if (!state.cart.length) {
    checkoutMessage.textContent = "Add an item before checkout.";
    return;
  }
  checkoutMessage.textContent = "Order request sent to sellers.";
  state.cart = [];
  saveCart();
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

categoryFilter.addEventListener("change", (event) => {
  state.category = event.target.value;
  renderProducts();
});

sortFilter.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

document.querySelector("#listingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const product = {
    id: `user-${Date.now()}`,
    name: data.get("name").trim(),
    price: Number(data.get("price")),
    category: data.get("category"),
    seller: "You",
    location: data.get("location").trim(),
    date: new Date().toISOString(),
    description: data.get("description").trim(),
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  };

  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  localStorage.setItem(storageKey, JSON.stringify([product, ...saved]));
  state.products.unshift(product);
  state.query = "";
  state.category = "All";
  searchInput.value = "";
  categoryFilter.value = "All";
  event.currentTarget.reset();
  populateCategories();
  renderProducts();
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, document.querySelector("#shop").offsetTop - 72);
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
});

populateCategories();
renderProducts();
renderCart();
