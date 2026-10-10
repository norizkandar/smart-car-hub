
"use strict";

/* =========================================================
   SMART CAR HUB — LUXURY AUTOMOTIVE DEMO
   Front-end only: HTML + CSS + JavaScript
========================================================= */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const STORAGE_KEY = "smartCarHubLuxury_v1";

const seedCars = [
  {id:"car-001",make:"Mercedes-Benz",model:"C 200 Avantgarde",year:2022,price:218000,mileage:28000,transmission:"Automatic",fuel:"Petrol",body:"Sedan",category:"Luxury",color:"Obsidian Black",location:"Kuala Lumpur",seller:"Elite Motor Gallery",phone:"0123456789",image:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80",description:"A refined executive sedan combining premium comfort, confident road manners and elegant design.",status:"Available",verified:true,createdAt:"2026-09-15"},
  {id:"car-002",make:"Porsche",model:"911 Carrera",year:2021,price:680000,mileage:19000,transmission:"Automatic",fuel:"Petrol",body:"Coupe",category:"Performance",color:"Silver",location:"Petaling Jaya",seller:"Prestige Auto",phone:"0123456788",image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",description:"A driver-focused sports coupe with iconic proportions and a thrilling performance character.",status:"Available",verified:true,createdAt:"2026-09-12"},
  {id:"car-003",make:"BMW",model:"330i M Sport",year:2023,price:248000,mileage:16000,transmission:"Automatic",fuel:"Petrol",body:"Sedan",category:"Luxury",color:"Alpine White",location:"Shah Alam",seller:"Bavarian Select",phone:"0123456787",image:"https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",description:"A sporty premium sedan with a modern cabin, responsive handling and everyday versatility.",status:"Available",verified:true,createdAt:"2026-09-10"},
  {id:"car-004",make:"Tesla",model:"Model 3 Long Range",year:2023,price:185000,mileage:22000,transmission:"Automatic",fuel:"Electric",body:"Sedan",category:"Electric",color:"Pearl White",location:"Kuala Lumpur",seller:"EV Select Malaysia",phone:"0123456786",image:"https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80",description:"A fully electric sedan offering a minimalist interior and convenient daily electric driving.",status:"Available",verified:true,createdAt:"2026-09-09"},
  {id:"car-005",make:"Range Rover",model:"Evoque R-Dynamic",year:2022,price:295000,mileage:31000,transmission:"Automatic",fuel:"Petrol",body:"SUV",category:"Luxury",color:"Santorini Black",location:"Mont Kiara",seller:"Crown Automotive",phone:"0123456785",image:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80",description:"A sophisticated luxury SUV with an elevated driving position and contemporary styling.",status:"Available",verified:true,createdAt:"2026-09-07"},
  {id:"car-006",make:"Honda",model:"Civic RS",year:2022,price:128000,mileage:35000,transmission:"CVT",fuel:"Petrol",body:"Sedan",category:"Performance",color:"Crystal Black",location:"Ipoh",seller:"DriveOne Auto",phone:"0123456784",image:"https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?auto=format&fit=crop&w=1000&q=80",description:"A practical, stylish sedan with a sporty appearance and a well-equipped cabin.",status:"Available",verified:false,createdAt:"2026-09-05"},
  {id:"car-007",make:"Toyota",model:"Harrier Premium",year:2021,price:155000,mileage:42000,transmission:"Automatic",fuel:"Petrol",body:"SUV",category:"SUV",color:"Dark Grey",location:"Penang",seller:"Island Autohaus",phone:"0123456783",image:"https://images.unsplash.com/photo-151 SUV?auto=format&fit=crop&w=1000&q=80",description:"A comfortable family-oriented SUV with a clean design and generous everyday practicality.",status:"Available",verified:true,createdAt:"2026-09-04"},
  {id:"car-008",make:"Mazda",model:"MX-5 RF",year:2022,price:235000,mileage:12000,transmission:"Automatic",fuel:"Petrol",body:"Sports",category:"Performance",color:"Soul Red",location:"Kuala Lumpur",seller:"Redline Motoring",phone:"0123456782",image:"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=80",description:"A compact sports car created around the joy of driving, with a distinctive retractable roof.",status:"Available",verified:true,createdAt:"2026-09-02"},
  {id:"car-009",make:"Hyundai",model:"Ioniq 5",year:2023,price:198000,mileage:18000,transmission:"Automatic",fuel:"Electric",body:"SUV",category:"Electric",color:"Matte Silver",location:"Petaling Jaya",seller:"EV Select Malaysia",phone:"0123456781",image:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80",description:"A distinctive electric crossover with a spacious cabin and a futuristic design language.",status:"Available",verified:true,createdAt:"2026-08-29"}
];

function defaultState() {
  return {
    cars: seedCars.map(car => ({...car})),
    favorites: [],
    compare: [],
    recent: [],
    savedSearches: [],
    inquiries: [],
    bookings: [],
    maintenance: [],
    reports: [],
    activities: [],
    mutedCars: [],
    currentPage: "home",
    finderResult: [],
    profile: {name:"Guest Driver", email:"", role:"visitor"}
  };
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState();
    const saved = JSON.parse(stored);
    const fresh = defaultState();
    return {...fresh, ...saved, profile:{...fresh.profile, ...(saved.profile || {})}};
  } catch (error) {
    console.warn("Smart Car Hub storage could not be read.", error);
    return defaultState();
  }
}

let state = loadState();
let toastTimeout;
let activeCategory = "";
let marketplaceFilters = {query:"", make:"", body:"", fuel:"", transmission:"", maxPrice:"", minYear:"", maxYear:"", sort:"newest", status:"Available"};

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    showToast("Browser storage is full or unavailable. Some changes may not persist.");
  }
}

function logActivity(action, detail) {
  state.activities.unshift({
    id: makeId("activity"),
    action,
    detail,
    date: new Date().toISOString()
  });
  state.activities = state.activities.slice(0, 100);
  saveState();
}

function makeId(prefix = "item") {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));
}

function money(value) {
  return "RM " + Number(value || 0).toLocaleString("en-MY", {maximumFractionDigits:0});
}

function shortMoney(value) {
  const number = Number(value || 0);
  if (number >= 1000000) return "RM " + (number / 1000000).toFixed(2) + "m";
  if (number >= 1000) return "RM " + (number / 1000).toFixed(0) + "k";
  return money(number);
}

function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHTML(value);
  return date.toLocaleDateString("en-MY", {day:"numeric", month:"short", year:"numeric"});
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 3200);
}

function getCar(id) {
  return state.cars.find(car => car.id === id);
}

function availableCars() {
  return state.cars.filter(car => car.status === "Available" && !state.mutedCars.includes(car.id));
}

function safeImage(url) {
  const fallback = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80";
  if (!url || !/^https:\/\/images\.unsplash\.com\//i.test(url)) return fallback;
  return url;
}

function getFilteredCars(filters = {}) {
  let cars = [...state.cars];
  if (filters.status && filters.status !== "All") cars = cars.filter(car => car.status === filters.status);
  if (filters.query) {
    const q = filters.query.toLowerCase().trim();
    cars = cars.filter(car => [car.make, car.model, car.body, car.category, car.location, car.color]
      .some(value => String(value || "").toLowerCase().includes(q)));
  }
  if (filters.make) cars = cars.filter(car => car.make === filters.make);
  if (filters.body) cars = cars.filter(car => car.body === filters.body);
  if (filters.fuel) cars = cars.filter(car => car.fuel === filters.fuel);
  if (filters.transmission) cars = cars.filter(car => car.transmission === filters.transmission);
  if (filters.maxPrice) cars = cars.filter(car => car.price <= Number(filters.maxPrice));
  if (filters.minYear) cars = cars.filter(car => car.year >= Number(filters.minYear));
  if (filters.maxYear) cars = cars.filter(car => car.year <= Number(filters.maxYear));
  if (filters.category) cars = cars.filter(car => car.category === filters.category || car.body === filters.category);
  switch (filters.sort) {
    case "price-low": cars.sort((a,b) => a.price - b.price); break;
    case "price-high": cars.sort((a,b) => b.price - a.price); break;
    case "year-new": cars.sort((a,b) => b.year - a.year); break;
    case "mileage-low": cars.sort((a,b) => a.mileage - b.mileage); break;
    default: cars.sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }
  return cars;
}

function carCard(car) {
  const favorite = state.favorites.includes(car.id);
  const compared = state.compare.includes(car.id);
  return `
    <article class="car-card">
      <div class="car-image-wrap">
        <img class="car-image" src="${escapeHTML(safeImage(car.image))}" alt="${escapeHTML(car.make + " " + car.model)}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80'">
        <span class="car-badge">${escapeHTML(car.category || car.body)}</span>
        <span class="car-status ${car.status === "Sold" ? "sold" : ""}">${escapeHTML(car.status)}</span>
        <button class="favorite-button ${favorite ? "is-favorite" : ""}" data-action="favorite" data-id="${escapeHTML(car.id)}" aria-label="Toggle favourite" title="Save to My Garage">${favorite ? "♥" : "♡"}</button>
      </div>
      <div class="car-body">
        <div class="car-make">${escapeHTML(car.make)} · ${car.year}</div>
        <h3 class="car-title">${escapeHTML(car.model)}</h3>
        <div class="car-price">${money(car.price)} <small>estimated asking price</small></div>
        <div class="car-specs">
          <span>◷ ${Number(car.mileage).toLocaleString()} km</span>
          <span>⚙ ${escapeHTML(car.transmission)}</span>
          <span>⛽ ${escapeHTML(car.fuel)}</span>
          <span>⌖ ${escapeHTML(car.location)}</span>
        </div>
        <div class="car-card-actions">
          <button class="gold-button" data-action="details" data-id="${escapeHTML(car.id)}">View details ↗</button>
          <button class="mini-outline" data-action="compare" data-id="${escapeHTML(car.id)}" title="${compared ? "Remove from comparison" : "Add to comparison"}">${compared ? "✓ Added" : "⇄ Compare"}</button>
        </div>
      </div>
    </article>`;
}

function renderCars(target, cars, emptyTitle = "No vehicles found", emptyText = "Try changing your filters.") {
  const container = typeof target === "string" ? $(target) : target;
  if (!container) return;
  container.innerHTML = cars.length
    ? cars.map(carCard).join("")
    : `<div class="empty-state"><h3>${escapeHTML(emptyTitle)}</h3><p>${escapeHTML(emptyText)}</p></div>`;
}

function renderHome() {
  const featured = availableCars().slice(0, 6);
  renderCars("#featuredCars", featured, "The collection is waiting", "Add a listing in Seller Centre to get started.");
  $("#heroCarCount").textContent = String(availableCars().length).padStart(2, "0");
}

function renderCompareCount() {
  const count = $("#compareCount");
  if (count) count.textContent = state.compare.length;
}

function renderPage(page) {
  state.currentPage = page;
  saveState();
  $$(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.page === page));
  $("#navLinks").classList.remove("open");

  if (page === "home") {
    $("#app").innerHTML = homeMarkup();
    bindHomeMarkup();
    renderHome();
    window.scrollTo({top:0, behavior:"smooth"});
    return;
  }

  const renderers = {
    marketplace: renderMarketplace,
    compare: renderCompare,
    garage: renderGarage,
    finance: renderFinance,
    seller: renderSeller,
    admin: renderAdmin,
    finder: renderFinder,
    maintenance: renderMaintenance,
    insights: renderInsights,
    account: renderAccount
  };
  (renderers[page] || renderHome)();
  window.scrollTo({top:0, behavior:"smooth"});
}

function homeMarkup() {
  return `
    <section class="hero">
      <div class="hero-image"></div><div class="hero-shade"></div>
      <div class="hero-content">
        <p class="eyebrow"><span></span> A NEW STANDARD IN CAR DISCOVERY</p>
        <h1>Find the car.<br>Feel the <em>difference.</em></h1>
        <p class="hero-description">A considered collection of remarkable machines. Discover, compare and find the car that feels unmistakably yours.</p>
        <div class="hero-actions"><button class="gold-button" data-page="marketplace">Explore the collection <span>↗</span></button><button class="outline-button" data-page="finder">Find my perfect car <span>→</span></button></div>
        <div class="hero-stats"><div><strong>${String(availableCars().length).padStart(2,"0")}</strong><span>VEHICLES</span></div><div><strong>01</strong><span>DESTINATION</span></div><div><strong>∞</strong><span>POSSIBILITIES</span></div></div>
      </div><div class="hero-side-label">EXCELLENCE IN EVERY DETAIL — EST. 2026</div>
    </section>
    <section class="search-strip"><div class="search-heading"><span class="gold-line"></span><span>YOUR NEXT DRIVE STARTS HERE</span></div>
      <form id="quickSearch" class="quick-search">
        <label class="search-field"><span>MAKE OR MODEL</span><input id="quickQuery" placeholder="e.g. BMW, Porsche..."></label>
        <label class="search-field"><span>MAXIMUM BUDGET (RM)</span><select id="quickBudget"><option value="">Any budget</option><option value="50000">RM 50,000</option><option value="100000">RM 100,000</option><option value="200000">RM 200,000</option><option value="350000">RM 350,000</option><option value="500000">RM 500,000</option></select></label>
        <label class="search-field"><span>BODY TYPE</span><select id="quickBody"><option value="">All body types</option><option>Sedan</option><option>SUV</option><option>Coupe</option><option>Hatchback</option><option>Sports</option><option>MPV</option></select></label>
        <button class="gold-button search-submit" type="submit">Search <span>↗</span></button>
      </form>
    </section>
    <section class="section"><div class="section-heading"><div><p class="eyebrow">THE CURATED COLLECTION</p><h2>Exceptional <em>by nature.</em></h2></div><button class="text-link" data-page="marketplace">View all vehicles ↗</button></div>
      <div class="category-row" id="categoryRow"><button class="category-chip selected" data-category="">All vehicles</button><button class="category-chip" data-category="Luxury">Luxury</button><button class="category-chip" data-category="Performance">Performance</button><button class="category-chip" data-category="Electric">Electric</button><button class="category-chip" data-category="SUV">SUV</button></div>
      <div class="car-grid" id="featuredCars"></div>
    </section>
    <section class="manifesto"><div class="manifesto-image"></div><div class="manifesto-copy"><p class="eyebrow">MORE THAN A MARKETPLACE</p><h2>Made for those<br>who <em>love the drive.</em></h2><p>From the first search to the first mile, Smart Car Hub brings your automotive journey into one considered space.</p><div class="manifesto-points"><div><span>01</span><p><b>Discover with purpose</b><small>Find vehicles that fit your lifestyle.</small></p></div><div><span>02</span><p><b>Compare with confidence</b><small>Review the details that matter.</small></p></div><div><span>03</span><p><b>Move at your pace</b><small>Plan finance and arrange a viewing.</small></p></div></div><button class="gold-button" data-page="finder">Discover your match ↗</button></div></section>
    <section class="section tools-section"><div class="section-heading"><div><p class="eyebrow">THE SMART ADVANTAGE</p><h2>Your journey, <em>refined.</em></h2></div></div>
      <div class="tool-grid"><button class="tool-card" data-page="finder"><span class="tool-icon">✳</span><span class="tool-number">01 / DISCOVER</span><strong>AI Car Finder</strong><p>Get a tailored shortlist from our demo collection.</p><span class="tool-arrow">Explore ↗</span></button><button class="tool-card" data-page="compare"><span class="tool-icon">⇄</span><span class="tool-number">02 / EVALUATE</span><strong>Compare vehicles</strong><p>Compare up to four vehicles side by side.</p><span class="tool-arrow">Compare ↗</span></button><button class="tool-card" data-page="finance"><span class="tool-icon">▤</span><span class="tool-number">03 / PLAN</span><strong>Finance centre</strong><p>Estimate your monthly instalments and deposit.</p><span class="tool-arrow">Calculate ↗</span></button><button class="tool-card" data-page="maintenance"><span class="tool-icon">⚙</span><span class="tool-number">04 / OWNERSHIP</span><strong>Maintenance tracker</strong><p>Keep service records and track upcoming maintenance.</p><span class="tool-arrow">Manage ↗</span></button></div>
    </section>
    <section class="insight-banner"><div><p class="eyebrow">KNOW THE MARKET</p><h2>Better informed.<br><em>Better driven.</em></h2><p>Explore trends in our current demo collection.</p></div><button class="outline-button" data-page="insights">Explore market insights ↗</button></section>
    <section class="section newsletter-section"><p class="eyebrow">THE SMART JOURNAL</p><h2>Good taste. <em>Great drives.</em></h2><p>Save your preferences in your browser and return to your shortlist anytime.</p><button class="gold-button" data-page="garage">Open my garage ↗</button></section>`;
}

function bindHomeMarkup() {
  $("#quickSearch")?.addEventListener("submit", event => {
    event.preventDefault();
    marketplaceFilters = {
      ...marketplaceFilters,
      query: $("#quickQuery").value.trim(),
      maxPrice: $("#quickBudget").value,
      body: $("#quickBody").value,
      status: "Available"
    };
    renderPage("marketplace");
  });
  $$(".category-chip").forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    $$(".category-chip").forEach(chip => chip.classList.toggle("selected", chip === button));
    renderCars("#featuredCars", getFilteredCars({status:"Available", category:activeCategory}));
  }));
}

function pageFrame(title, subtitle, content, actions = "") {
  $("#app").innerHTML = `<section class="page-shell"><div class="page-header"><div><p class="eyebrow">SMART CAR HUB / ${escapeHTML(title.toUpperCase())}</p><h1>${escapeHTML(title)}</h1><p>${escapeHTML(subtitle)}</p></div><div>${actions}</div></div>${content}</section>`;
}

function renderMarketplace() {
  const makes = [...new Set(state.cars.map(car => car.make))].sort();
  const makeOptions = makes.map(make => `<option value="${escapeHTML(make)}" ${marketplaceFilters.make === make ? "selected" : ""}>${escapeHTML(make)}</option>`).join("");
  pageFrame("The Marketplace", "Explore the collection and find the right vehicle for your next chapter.", `
    <div class="page-toolbar">
      <input id="filterQuery" class="filter-control filter-search" value="${escapeHTML(marketplaceFilters.query)}" placeholder="Search make, model, colour or location...">
      <select id="filterMake" class="filter-control"><option value="">All makes</option>${makeOptions}</select>
      <select id="filterBody" class="filter-control"><option value="">All body types</option>${["Sedan","SUV","Coupe","Hatchback","Sports","MPV"].map(x=>`<option ${marketplaceFilters.body===x?"selected":""}>${x}</option>`).join("")}</select>
      <select id="filterFuel" class="filter-control"><option value="">All fuel types</option>${["Petrol","Diesel","Hybrid","Electric"].map(x=>`<option ${marketplaceFilters.fuel===x?"selected":""}>${x}</option>`).join("")}</select>
      <select id="filterTransmission" class="filter-control"><option value="">Any transmission</option>${["Automatic","Manual","CVT"].map(x=>`<option ${marketplaceFilters.transmission===x?"selected":""}>${x}</option>`).join("")}</select>
      <select id="filterMaxPrice" class="filter-control"><option value="">Any budget</option>${[50000,100000,150000,200000,300000,500000,800000].map(n=>`<option value="${n}" ${String(marketplaceFilters.maxPrice)===String(n)?"selected":""}>Up to ${money(n)}</option>`).join("")}</select>
      <select id="filterMinYear" class="filter-control"><option value="">Any year</option>${[2025,2024,2023,2022,2021,2020,2019].map(y=>`<option value="${y}" ${String(marketplaceFilters.minYear)===String(y)?"selected":""}>${y} onwards</option>`).join("")}</select>
      <select id="filterSort" class="filter-control"><option value="newest">Recently listed</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="year-new">Newest model year</option><option value="mileage-low">Lowest mileage</option></select>
      <button id="resetFilters" class="outline-button">Reset filters</button>
    </div>
    <p id="marketCount" class="muted-text"></p><div class="car-grid" id="marketCars"></div>
    <div class="panel" style="margin-top:25px"><h3>Save this search</h3><p>Save your current filters locally for your next visit.</p><button id="saveSearch" class="gold-button">Save search ♡</button></div>
  `);
  $("#filterSort").value = marketplaceFilters.sort;
  const update = () => {
    marketplaceFilters = {
      ...marketplaceFilters,
      query: $("#filterQuery").value.trim(),
      make: $("#filterMake").value,
      body: $("#filterBody").value,
      fuel: $("#filterFuel").value,
      transmission: $("#filterTransmission").value,
      maxPrice: $("#filterMaxPrice").value,
      minYear: $("#filterMinYear").value,
      sort: $("#filterSort").value,
      status: "Available"
    };
    const cars = getFilteredCars(marketplaceFilters);
    $("#marketCount").textContent = `${cars.length} vehicle${cars.length === 1 ? "" : "s"} match your filters.`;
    renderCars("#marketCars", cars);
  };
  ["filterQuery","filterMake","filterBody","filterFuel","filterTransmission","filterMaxPrice","filterMinYear","filterSort"].forEach(id => {
    const element = $("#" + id);
    element.addEventListener(id === "filterQuery" ? "input" : "change", update);
  });
  $("#resetFilters").addEventListener("click", () => {
    marketplaceFilters = {query:"",make:"",body:"",fuel:"",transmission:"",maxPrice:"",minYear:"",maxYear:"",sort:"newest",status:"Available"};
    renderMarketplace();
  });
  $("#saveSearch").addEventListener("click", () => {
    const label = [marketplaceFilters.query, marketplaceFilters.make, marketplaceFilters.body, marketplaceFilters.maxPrice ? "Up to " + money(marketplaceFilters.maxPrice) : ""].filter(Boolean).join(" · ") || "All available vehicles";
    state.savedSearches.unshift({id:makeId("search"),label,filters:{...marketplaceFilters},date:new Date().toISOString()});
    state.savedSearches = state.savedSearches.slice(0,30);
    saveState();
    logActivity("Saved search", label);
    showToast("Search saved to My Garage.");
  });
  update();
}

function toggleFavorite(id) {
  if (!getCar(id)) return;
  if (state.favorites.includes(id)) {
    state.favorites = state.favorites.filter(item => item !== id);
    showToast("Removed from My Garage.");
  } else {
    state.favorites.unshift(id);
    showToast("Saved to My Garage.");
  }
  saveState();
  logActivity("Updated favourites", getCar(id).make + " " + getCar(id).model);
  refreshCurrentPage();
}

function toggleCompare(id) {
  if (!getCar(id)) return;
  if (state.compare.includes(id)) {
    state.compare = state.compare.filter(item => item !== id);
    showToast("Removed from comparison.");
  } else if (state.compare.length >= 4) {
    showToast("You can compare up to 4 cars at a time.");
    return;
  } else {
    state.compare.push(id);
    showToast("Added to comparison.");
  }
  saveState();
  renderCompareCount();
  refreshCurrentPage();
}

function refreshCurrentPage() {
  if (state.currentPage === "home") {
    $("#heroCarCount").textContent = String(availableCars().length).padStart(2,"0");
    renderCars("#featuredCars", getFilteredCars({status:"Available",category:activeCategory}));
  } else if (state.currentPage === "marketplace") {
    renderMarketplace();
  } else if (state.currentPage === "garage") {
    renderGarage();
  } else if (state.currentPage === "compare") {
    renderCompare();
  } else if (state.currentPage === "admin") {
    renderAdmin();
  } else if (state.currentPage === "insights") {
    renderInsights();
  }
}

function showDialog(html) {
  $("#dialogContent").innerHTML = html;
  const dialog = $("#appDialog");
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closeDialog() {
  const dialog = $("#appDialog");
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function addRecent(id) {
  state.recent = [id, ...state.recent.filter(item => item !== id)].slice(0,12);
  saveState();
}

function showDetails(id) {
  const car = getCar(id);
  if (!car) return showToast("This listing is no longer available.");
  addRecent(id);
  const isFav = state.favorites.includes(id);
  const isCompared = state.compare.includes(id);
  showDialog(`
    <div class="detail-layout">
      <div><img class="detail-image" src="${escapeHTML(safeImage(car.image))}" alt="${escapeHTML(car.make+" "+car.model)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80'"><p class="muted-text">${escapeHTML(car.location)} · Listed ${formatDate(car.createdAt)}</p></div>
      <div><p class="eyebrow">${escapeHTML(car.category)} / ${escapeHTML(car.make)}</p><h2 style="font-size:31px;margin-bottom:8px">${escapeHTML(car.model)}</h2><div class="detail-price">${money(car.price)}</div><p class="detail-description">${escapeHTML(car.description || "Contact the seller for more information about this vehicle.")}</p>
      <div class="detail-spec-grid">${[
        ["Year",car.year],["Mileage",Number(car.mileage).toLocaleString()+" km"],["Transmission",car.transmission],["Fuel",car.fuel],["Body type",car.body],["Colour",car.color],["Seller",car.seller],["Status",car.status]
      ].map(([label,value])=>`<div class="detail-spec"><small>${escapeHTML(label)}</small><strong>${escapeHTML(value)}</strong></div>`).join("")}</div>
      ${car.status === "Available" ? `<div class="form-actions"><button class="gold-button" data-action="inquiry" data-id="${escapeHTML(id)}">Enquire ↗</button><button class="outline-button" data-action="booking" data-id="${escapeHTML(id)}">Book test drive</button></div>` : `<p class="notice">This listing is marked as sold.</p>`}
      <div class="form-actions"><button class="mini-outline" data-action="favorite" data-id="${escapeHTML(id)}">${isFav?"♥ Saved":"♡ Save to garage"}</button><button class="mini-outline" data-action="compare" data-id="${escapeHTML(id)}">${isCompared?"✓ In comparison":"⇄ Compare"}</button><button class="mini-outline" data-action="report" data-id="${escapeHTML(id)}">Report listing</button></div>
      </div>
    </div>`);
}

function renderCompare() {
  const cars = state.compare.map(getCar).filter(Boolean);
  pageFrame("Compare Vehicles", "Review the details side by side. Select up to four cars from the marketplace.", `
    ${cars.length < 4 ? `<div class="notice">You have ${cars.length}/4 cars selected. Visit the marketplace to add more.</div>` : ""}
    <div class="compare-grid">${cars.length ? cars.map(car => `<article class="compare-card"><img src="${escapeHTML(safeImage(car.image))}" alt="${escapeHTML(car.model)}"><div class="compare-card-content"><p class="eyebrow">${escapeHTML(car.make)}</p><h3>${escapeHTML(car.model)}</h3><div class="detail-price" style="font-size:24px">${money(car.price)}</div>${[
      ["Year",car.year],["Mileage",Number(car.mileage).toLocaleString()+" km"],["Fuel",car.fuel],["Transmission",car.transmission],["Body",car.body],["Location",car.location]
    ].map(([key,val])=>`<div class="compare-spec"><span>${key}</span><span>${escapeHTML(val)}</span></div>`).join("")}<button class="outline-button compare-remove" data-action="compare" data-id="${escapeHTML(car.id)}">Remove</button><button class="text-link" data-action="details" data-id="${escapeHTML(car.id)}">View details ↗</button></div></article>`).join("") : `<div class="empty-state"><h3>Your comparison starts here</h3><p>Add up to four vehicles from the marketplace to compare their specifications.</p><button class="gold-button" data-page="marketplace">Browse vehicles ↗</button></div>`}</div>
    ${cars.length ? `<div class="form-actions"><button id="clearCompare" class="outline-button">Clear comparison</button><button class="gold-button" data-page="marketplace">Add another car ↗</button></div>` : ""}
  `);
  $("#clearCompare")?.addEventListener("click", () => {
    state.compare = [];
    saveState();
    renderCompareCount();
    renderCompare();
  });
}

function renderGarage() {
  const favorites = state.favorites.map(getCar).filter(Boolean);
  const recent = state.recent.map(getCar).filter(Boolean);
  pageFrame("My Garage", "Your saved vehicles, recent views and saved searches — stored in this browser.", `
    <div class="dashboard-grid">
      <div class="stat-card"><span>Saved vehicles</span><strong>${favorites.length}</strong><small>Your personal shortlist</small></div>
      <div class="stat-card"><span>Recently viewed</span><strong>${recent.length}</strong><small>Last 12 vehicles</small></div>
      <div class="stat-card"><span>Saved searches</span><strong>${state.savedSearches.length}</strong><small>Searches in this browser</small></div>
      <div class="stat-card"><span>Comparison</span><strong>${state.compare.length}/4</strong><small>Vehicles selected</small></div>
    </div>
    <div class="section-heading"><div><p class="eyebrow">YOUR SHORTLIST</p><h2 style="font-size:32px">Saved <em>vehicles.</em></h2></div></div>
    <div class="car-grid" id="garageFavorites"></div>
    <div class="section-heading" style="margin-top:40px"><div><p class="eyebrow">YOUR HISTORY</p><h2 style="font-size:32px">Recently <em>viewed.</em></h2></div></div>
    <div class="car-grid" id="garageRecent"></div>
    <div class="panel" style="margin-top:35px"><h2>Saved searches</h2><div id="savedSearchList"></div></div>
    <div class="panel"><h2>Your profile</h2><p>Optional local demo profile. It does not create a secure online account.</p><form id="profileForm" class="form-grid"><div class="form-group"><label for="profileName">Display name</label><input class="form-control" id="profileName" value="${escapeHTML(state.profile.name)}" required maxlength="70"></div><div class="form-group"><label for="profileEmail">Email address</label><input class="form-control" id="profileEmail" type="email" value="${escapeHTML(state.profile.email)}" placeholder="you@example.com"></div><div class="form-group full"><button class="gold-button" type="submit">Save local profile</button></div></form></div>
  `);
  renderCars("#garageFavorites", favorites, "No saved vehicles yet", "Tap the heart on any listing to add it to your garage.");
  renderCars("#garageRecent", recent, "Nothing viewed yet", "Open a vehicle listing to see it here.");
  $("#savedSearchList").innerHTML = state.savedSearches.length ? state.savedSearches.map(search => `<div class="list-row"><div><h3>${escapeHTML(search.label)}</h3><p>Saved ${formatDate(search.date)}</p></div><div class="list-row-actions"><button data-action="run-search" data-id="${escapeHTML(search.id)}">Run search</button><button data-action="delete-search" data-id="${escapeHTML(search.id)}">Delete</button></div></div>`).join("") : `<p>No saved searches yet. Save a search from the marketplace.</p>`;
  $("#profileForm").addEventListener("submit", event => {
    event.preventDefault();
    state.profile.name = $("#profileName").value.trim() || "Guest Driver";
    state.profile.email = $("#profileEmail").value.trim();
    saveState();
    logActivity("Updated local profile", state.profile.name);
    showToast("Local profile saved.");
  });
}

function renderFinance() {
  pageFrame("Finance Centre", "Explore an illustrative car loan estimate before speaking with a lender.", `
    <div class="notice">Demo estimate only. The rate is an example, not a bank offer or approval. Actual rates, fees, insurance and eligibility vary.</div>
    <div class="split-layout"><div class="panel"><h2>Build your estimate</h2><form id="financeForm">
      <div class="form-group"><label for="financeCar">Choose a vehicle</label><select id="financeCar" class="form-control"><option value="">Enter a price manually</option>${availableCars().map(car=>`<option value="${car.price}">${escapeHTML(car.make+" "+car.model)} — ${money(car.price)}</option>`).join("")}</select></div>
      <div class="form-group" style="margin-top:16px"><label for="financePrice">Vehicle price (RM)</label><input id="financePrice" class="form-control" type="number" min="1000" max="10000000" value="200000" required></div>
      <div class="form-group" style="margin-top:16px"><label for="financeDeposit">Deposit (RM)</label><input id="financeDeposit" class="form-control" type="number" min="0" max="10000000" value="20000" required></div>
      <div class="form-group" style="margin-top:16px"><label for="financeRate">Illustrative annual interest rate (%)</label><input id="financeRate" class="form-control" type="number" min="0" max="30" step="0.1" value="3.5" required></div>
      <div class="form-group" style="margin-top:16px"><label for="financeYears">Loan term</label><select id="financeYears" class="form-control"><option value="3">3 years</option><option value="5">5 years</option><option value="7" selected>7 years</option><option value="9">9 years</option></select></div>
      <div class="form-actions"><button type="submit" class="gold-button">Calculate estimate ↗</button></div>
    </form></div><div class="panel"><p class="eyebrow">YOUR ESTIMATE</p><div id="financeResults"></div><p class="form-help">This calculator uses a simple flat-rate estimate for demonstration. It is not a quotation.</p></div></div>
  `);
  const calculate = () => {
    const price = Math.max(0, Number($("#financePrice").value));
    const deposit = Math.min(price, Math.max(0, Number($("#financeDeposit").value)));
    const rate = Math.max(0, Number($("#financeRate").value));
    const years = Number($("#financeYears").value);
    const principal = price - deposit;
    const interest = principal * rate / 100 * years;
    const total = principal + interest;
    const monthly = total / (years * 12);
    $("#financeResults").innerHTML = `<div class="calc-results"><div class="calc-result"><span>Monthly estimate</span><strong>${money(monthly)}</strong></div><div class="calc-result"><span>Loan amount</span><strong>${money(principal)}</strong></div><div class="calc-result"><span>Estimated interest</span><strong>${money(interest)}</strong></div><div class="calc-result"><span>Total loan repayment</span><strong>${money(total)}</strong></div></div><div class="list-row"><div><h3>Vehicle price</h3><p>Before any additional fees</p></div><strong>${money(price)}</strong></div><div class="list-row"><div><h3>Deposit</h3><p>${price > 0 ? Math.round(deposit/price*100) : 0}% of vehicle price</p></div><strong>${money(deposit)}</strong></div><button id="saveFinance" class="outline-button" style="margin-top:20px">Save estimate locally</button>`;
    $("#saveFinance").addEventListener("click", () => {
      const estimate = {id:makeId("finance"),price,deposit,rate,years,monthly,date:new Date().toISOString()};
      state.maintenance.push({...estimate,type:"finance-estimate"});
      saveState();
      showToast("Estimate saved locally in your browser.");
    });
  };
  $("#financeCar").addEventListener("change", () => {
    if ($("#financeCar").value) $("#financePrice").value = $("#financeCar").value;
    calculate();
  });
  $("#financeForm").addEventListener("submit", event => { event.preventDefault(); calculate(); });
  calculate();
}

function renderSeller() {
  pageFrame("Seller Centre", "Create and manage demo vehicle listings. Listing data is stored in this browser.", `
    <div class="notice">Use a public image URL for your listing photo. Demo listings are not published to a shared online marketplace.</div>
    <div class="split-layout"><div class="panel"><h2 id="listingFormTitle">Create a listing</h2>
      <form id="listingForm" class="form-grid">
        <input type="hidden" id="listingId">
        <div class="form-group"><label for="listingMake">Make *</label><input id="listingMake" class="form-control" required maxlength="60" placeholder="e.g. BMW"></div>
        <div class="form-group"><label for="listingModel">Model *</label><input id="listingModel" class="form-control" required maxlength="80" placeholder="e.g. 330i M Sport"></div>
        <div class="form-group"><label for="listingYear">Year *</label><input id="listingYear" class="form-control" type="number" min="1980" max="2027" required value="2023"></div>
        <div class="form-group"><label for="listingPrice">Price (RM) *</label><input id="listingPrice" class="form-control" type="number" min="1000" max="100000000" required placeholder="200000"></div>
        <div class="form-group"><label for="listingMileage">Mileage (km) *</label><input id="listingMileage" class="form-control" type="number" min="0" max="2000000" required value="25000"></div>
        <div class="form-group"><label for="listingBody">Body type *</label><select id="listingBody" class="form-control" required>${["Sedan","SUV","Coupe","Hatchback","Sports","MPV"].map(x=>`<option>${x}</option>`).join("")}</select></div>
        <div class="form-group"><label for="listingCategory">Category *</label><select id="listingCategory" class="form-control">${["Luxury","Performance","Electric","SUV","Everyday"].map(x=>`<option>${x}</option>`).join("")}</select></div>
        <div class="form-group"><label for="listingFuel">Fuel *</label><select id="listingFuel" class="form-control">${["Petrol","Diesel","Hybrid","Electric"].map(x=>`<option>${x}</option>`).join("")}</select></div>
        <div class="form-group"><label for="listingTransmission">Transmission *</label><select id="listingTransmission" class="form-control">${["Automatic","Manual","CVT"].map(x=>`<option>${x}</option>`).join("")}</select></div>
        <div class="form-group"><label for="listingColor">Colour</label><input id="listingColor" class="form-control" maxlength="50" placeholder="Black"></div>
        <div class="form-group"><label for="listingLocation">Location *</label><input id="listingLocation" class="form-control" required maxlength="100" placeholder="Kuala Lumpur"></div>
        <div class="form-group"><label for="listingSeller">Seller / dealer *</label><input id="listingSeller" class="form-control" required maxlength="100" value="${escapeHTML(state.profile.name || "Guest Driver")}"></div>
        <div class="form-group"><label for="listingPhone">Contact phone</label><input id="listingPhone" class="form-control" maxlength="30" placeholder="Optional"></div>
        <div class="form-group full"><label for="listingImage">Photo URL (HTTPS)</label><input id="listingImage" class="form-control" type="url" placeholder="https://images.unsplash.com/..."></div>
        <div class="form-group full"><label for="listingDescription">Description</label><textarea id="listingDescription" class="form-control" maxlength="1000" placeholder="Tell buyers about the vehicle..."></textarea></div>
        <div class="form-group full"><label class="inline-check"><input id="listingVerified" type="checkbox"> Mark as seller-verified in this demo</label><span class="form-help">This checkbox is only a demo label, not actual identity verification.</span></div>
        <div class="form-group full form-actions"><button class="gold-button" type="submit">Save listing ↗</button><button class="outline-button" id="cancelListingEdit" type="button">Clear form</button></div>
      </form>
    </div><div class="panel"><h2>Your listing centre</h2><div class="stat-card"><span>Total listings in this browser</span><strong>${state.cars.length}</strong></div><div class="stat-card" style="margin-top:12px"><span>Available</span><strong>${availableCars().length}</strong></div><p>Use the controls below to edit, mark sold or remove a listing. The admin demo can moderate any listing in this browser.</p></div></div>
    <div class="data-panel"><h3>Manage listings</h3><table class="data-table"><thead><tr><th>VEHICLE</th><th>PRICE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody id="sellerRows"></tbody></table></div>
  `);
  const clearForm = () => {
    $("#listingForm").reset();
    $("#listingId").value = "";
    $("#listingYear").value = 2023;
    $("#listingMileage").value = 25000;
    $("#listingSeller").value = state.profile.name || "Guest Driver";
    $("#listingFormTitle").textContent = "Create a listing";
  };
  $("#cancelListingEdit").addEventListener("click", clearForm);
  $("#listingForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = $("#listingId").value;
    const old = id ? getCar(id) : null;
    const car = {
      id: id || makeId("car"),
      make: $("#listingMake").value.trim(),
      model: $("#listingModel").value.trim(),
      year: Number($("#listingYear").value),
      price: Number($("#listingPrice").value),
      mileage: Number($("#listingMileage").value),
      body: $("#listingBody").value,
      category: $("#listingCategory").value,
      fuel: $("#listingFuel").value,
      transmission: $("#listingTransmission").value,
      color: $("#listingColor").value.trim() || "Not specified",
      location: $("#listingLocation").value.trim(),
      seller: $("#listingSeller").value.trim(),
      phone: $("#listingPhone").value.trim(),
      image: safeImage($("#listingImage").value.trim()),
      description: $("#listingDescription").value.trim() || "Contact the seller for more details.",
      verified: $("#listingVerified").checked,
      status: old?.status || "Available",
      createdAt: old?.createdAt || new Date().toISOString().slice(0,10)
    };
    if (!car.make || !car.model || !car.location || !car.seller || car.price <= 0 || car.mileage < 0) {
      return showToast("Please check the required listing fields.");
    }
    if (old) {
      state.cars = state.cars.map(item => item.id === id ? car : item);
      logActivity("Edited listing", car.make + " " + car.model);
      showToast("Listing updated.");
    } else {
      state.cars.unshift(car);
      logActivity("Created listing", car.make + " " + car.model);
      showToast("Listing added to the demo marketplace.");
    }
    saveState();
    renderSeller();
  });
  renderSellerRows();
}

function renderSellerRows() {
  const tbody = $("#sellerRows");
  if (!tbody) return;
  tbody.innerHTML = state.cars.map(car => `<tr><td><strong>${escapeHTML(car.make)} ${escapeHTML(car.model)}</strong><br><span class="muted-text">${car.year} · ${escapeHTML(car.location)}</span></td><td>${money(car.price)}</td><td><span class="status-pill ${car.status==="Sold"?"sold":car.status==="Pending"?"pending":""}">${escapeHTML(car.status)}</span></td><td><div class="table-actions"><button data-action="edit-car" data-id="${escapeHTML(car.id)}">Edit</button><button data-action="toggle-sold" data-id="${escapeHTML(car.id)}">${car.status==="Sold"?"Relist":"Mark sold"}</button><button data-action="details" data-id="${escapeHTML(car.id)}">View</button></div></td></tr>`).join("");
}

function editCar(id) {
  const car = getCar(id);
  if (!car) return;
  renderPage("seller");
  $("#listingId").value = car.id;
  $("#listingMake").value = car.make;
  $("#listingModel").value = car.model;
  $("#listingYear").value = car.year;
  $("#listingPrice").value = car.price;
  $("#listingMileage").value = car.mileage;
  $("#listingBody").value = car.body;
  $("#listingCategory").value = car.category;
  $("#listingFuel").value = car.fuel;
  $("#listingTransmission").value = car.transmission;
  $("#listingColor").value = car.color;
  $("#listingLocation").value = car.location;
  $("#listingSeller").value = car.seller;
  $("#listingPhone").value = car.phone || "";
  $("#listingImage").value = car.image || "";
  $("#listingDescription").value = car.description || "";
  $("#listingVerified").checked = !!car.verified;
  $("#listingFormTitle").textContent = "Edit listing";
  $("#listingForm").scrollIntoView({behavior:"smooth",block:"start"});
}

function toggleSold(id) {
  const car = getCar(id);
  if (!car) return;
  car.status = car.status === "Sold" ? "Available" : "Sold";
  saveState();
  logActivity(car.status === "Sold" ? "Marked sold" : "Relisted vehicle", car.make + " " + car.model);
  showToast(car.status === "Sold" ? "Vehicle marked as sold." : "Vehicle relisted.");
  renderSeller();
}

function renderAdmin() {
  const available = state.cars.filter(car => car.status === "Available").length;
  const sold = state.cars.filter(car => car.status === "Sold").length;
  pageFrame("Admin Dashboard", "Local demo administration. Changes affect only this browser's data.", `
    <div class="notice">This is not a secure admin system. There is no authentication or role protection in this front-end demo. Do not store real customer data here.</div>
    <div class="dashboard-grid"><div class="stat-card"><span>Total listings</span><strong>${state.cars.length}</strong><small>All demo listings</small></div><div class="stat-card"><span>Available</span><strong>${available}</strong><small>Currently listed</small></div><div class="stat-card"><span>Sold</span><strong>${sold}</strong><small>Marked sold</small></div><div class="stat-card"><span>Inquiries</span><strong>${state.inquiries.length}</strong><small>Local demo records</small></div></div>
    <div class="data-panel"><h3>Listing moderation</h3><table class="data-table"><thead><tr><th>VEHICLE</th><th>SELLER</th><th>PRICE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody id="adminRows"></tbody></table></div>
    <div class="split-layout"><div class="data-panel"><h3>Listing reports</h3><div id="reportList" style="padding:0 18px"></div></div><div class="data-panel"><h3>Recent activity</h3><div id="activityList" style="padding:0 18px"></div></div></div>
    <div class="panel"><h3>Demo data controls</h3><p>Export or restore the local demo data. Reset will replace custom listings and local preferences with the starter demo data.</p><div class="form-actions"><button id="exportData" class="gold-button">Export JSON</button><button id="resetDemo" class="danger-button">Reset demo data</button></div></div>
  `);
  $("#adminRows").innerHTML = state.cars.map(car => `<tr><td>${escapeHTML(car.make)} ${escapeHTML(car.model)}<br><span class="muted-text">${car.year}</span></td><td>${escapeHTML(car.seller)}</td><td>${money(car.price)}</td><td><span class="status-pill ${car.status==="Sold"?"sold":car.status==="Pending"?"pending":""}">${escapeHTML(car.status)}</span></td><td><div class="table-actions"><button data-action="toggle-sold" data-id="${escapeHTML(car.id)}">${car.status==="Sold"?"Relist":"Mark sold"}</button><button data-action="edit-car" data-id="${escapeHTML(car.id)}">Edit</button><button data-action="delete-car" data-id="${escapeHTML(car.id)}">Delete</button></div></td></tr>`).join("");
  $("#reportList").innerHTML = state.reports.length ? state.reports.map(report => `<div class="list-row"><div><h3>${escapeHTML(report.reason)}</h3><p>${escapeHTML(report.carLabel)} · ${formatDate(report.date)}</p><p>${escapeHTML(report.note || "No additional details.")}</p></div><div class="list-row-actions"><button data-action="resolve-report" data-id="${escapeHTML(report.id)}">Resolve</button></div></div>`).join("") : `<p>No listing reports yet.</p>`;
  $("#activityList").innerHTML = state.activities.slice(0,12).map(item => `<div class="list-row"><div><h3>${escapeHTML(item.action)}</h3><p>${escapeHTML(item.detail)}</p><p>${formatDate(item.date)}</p></div></div>`).join("") || `<p>No activity recorded yet.</p>`;
  $("#exportData").addEventListener("click", exportData);
  $("#resetDemo").addEventListener("click", () => {
    if (!confirm("Reset Smart Car Hub demo data in this browser? This cannot be undone.")) return;
    state = defaultState();
    saveState();
    renderPage("admin");
    renderCompareCount();
    showToast("Demo data reset.");
  });
}

function deleteCar(id) {
  const car = getCar(id);
  if (!car) return;
  if (!confirm(`Delete ${car.make} ${car.model} from this browser's demo marketplace?`)) return;
  state.cars = state.cars.filter(item => item.id !== id);
  state.favorites = state.favorites.filter(item => item !== id);
  state.compare = state.compare.filter(item => item !== id);
  state.recent = state.recent.filter(item => item !== id);
  state.mutedCars = state.mutedCars.filter(item => item !== id);
  saveState();
  logActivity("Deleted listing", car.make + " " + car.model);
  showToast("Listing deleted.");
  renderAdmin();
  renderCompareCount();
}

function renderFinder() {
  pageFrame("AI Car Finder", "Tell us what matters. This demo uses local rules to rank vehicles — it does not call an AI service.", `
    <div class="split-layout"><div class="panel"><p class="eyebrow">YOUR DRIVING PROFILE</p><h2>Find your kind of car.</h2>
      <form id="finderForm">
        <div class="form-group"><label for="finderBudget">Maximum budget (RM)</label><input class="form-control" id="finderBudget" type="number" min="10000" max="10000000" step="5000" value="250000" required></div>
        <div class="form-group" style="margin-top:16px"><label for="finderUse">Main purpose</label><select id="finderUse" class="form-control"><option value="daily">Everyday driving</option><option value="family">Family and space</option><option value="performance">Performance and driving enjoyment</option><option value="luxury">Luxury and comfort</option><option value="eco">Electric and efficiency</option></select></div>
        <div class="form-group" style="margin-top:16px"><label for="finderBody">Preferred body type</label><select id="finderBody" class="form-control"><option value="">No preference</option>${["Sedan","SUV","Coupe","Hatchback","Sports","MPV"].map(x=>`<option>${x}</option>`).join("")}</select></div>
        <div class="form-group" style="margin-top:16px"><label for="finderFuel">Fuel preference</label><select id="finderFuel" class="form-control"><option value="">No preference</option>${["Petrol","Diesel","Hybrid","Electric"].map(x=>`<option>${x}</option>`).join("")}</select></div>
        <div class="form-group" style="margin-top:16px"><label for="finderYear">Minimum model year</label><select id="finderYear" class="form-control"><option value="0">Any year</option>${[2025,2024,2023,2022,2021,2020].map(x=>`<option value="${x}">${x} onwards</option>`).join("")}</select></div>
        <div class="form-actions"><button class="gold-button" type="submit">Find my matches ✳</button></div>
      </form>
    </div><div class="panel"><p class="eyebrow">HOW MATCHING WORKS</p><h2>A smarter shortlist.</h2><p>Each available demo vehicle receives a score based on how closely it fits your budget and preferences.</p><div class="manifesto-points"><div><span>01</span><p><b>Budget fit</b><small>Vehicles inside your budget receive a higher score.</small></p></div><div><span>02</span><p><b>Purpose fit</b><small>Body type and category help match your needs.</small></p></div><div><span>03</span><p><b>Preference fit</b><small>Fuel, year and vehicle type contribute to ranking.</small></p></div></div><p class="form-help">Scores are heuristic demo estimates, not an independent vehicle assessment or purchase recommendation.</p></div></div>
    <div id="finderResults" style="margin-top:35px"></div>
  `);
  $("#finderForm").addEventListener("submit", event => {
    event.preventDefault();
    const budget = Number($("#finderBudget").value);
    const use = $("#finderUse").value;
    const body = $("#finderBody").value;
    const fuel = $("#finderFuel").value;
    const year = Number($("#finderYear").value);
    const scored = availableCars().map(car => {
      let score = 0;
      const reasons = [];
      if (car.price <= budget) { score += 40; reasons.push("Within budget"); }
      else if (car.price <= budget * 1.15) { score += 15; reasons.push("Near budget"); }
      if (body && car.body === body) { score += 20; reasons.push("Preferred body type"); }
      if (fuel && car.fuel === fuel) { score += 15; reasons.push("Fuel preference"); }
      if (year && car.year >= year) { score += 10; reasons.push("Preferred model year"); }
      const categoryMatch = {family:["SUV","MPV"],performance:["Performance"],luxury:["Luxury"],eco:["Electric"]};
      if ((categoryMatch[use] || []).includes(car.category) || (categoryMatch[use] || []).includes(car.body)) { score += 15; reasons.push("Fits your driving purpose"); }
      if (use === "daily" && ["Sedan","Hatchback"].includes(car.body)) { score += 10; reasons.push("Practical body style"); }
      return {...car, matchScore:Math.min(100,score), matchReasons:reasons};
    }).sort((a,b)=>b.matchScore-a.matchScore).slice(0,5);
    state.finderResult = scored.map(car=>car.id);
    saveState();
    $("#finderResults").innerHTML = `<div class="section-heading"><div><p class="eyebrow">YOUR PERSONAL SHORTLIST</p><h2 style="font-size:32px">Your best <em>matches.</em></h2></div></div>${scored.length ? `<div class="split-layout"><div class="car-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${scored.map(car=>`<div class="result-card"><div class="result-score">${car.matchScore}% match</div><h3>${escapeHTML(car.make)} ${escapeHTML(car.model)}</h3><p>${money(car.price)} · ${car.year} · ${escapeHTML(car.body)}</p><p>${escapeHTML(car.matchReasons.join(" · ") || "Available vehicle in the demo collection")}</p><div class="form-actions"><button class="gold-button" data-action="details" data-id="${escapeHTML(car.id)}">View car ↗</button><button class="mini-outline" data-action="compare" data-id="${escapeHTML(car.id)}">⇄ Compare</button></div></div>`).join("")}</div><div class="panel"><h3>Before you decide</h3><p>Check the vehicle history, ownership costs, service records and inspection results. Verify details with the seller before making a purchase.</p><button class="outline-button" data-page="finance">Estimate finance ↗</button></div></div>` : `<div class="empty-state"><h3>No matches available</h3><p>Try a larger budget or broaden your preferences.</p></div>`}`;
  });
}

function renderMaintenance() {
  const records = state.maintenance.filter(item => item.type !== "finance-estimate");
  pageFrame("Maintenance Tracker", "Keep simple service records in this browser. This is not a connected vehicle diagnostics service.", `
    <div class="notice">Maintenance reminders are based on dates you enter. The demo does not read mileage from a vehicle or send notifications while the site is closed.</div>
    <div class="split-layout"><div class="panel"><h2>Add a service record</h2><form id="maintenanceForm" class="form-grid">
      <div class="form-group full"><label for="maintenanceCar">Vehicle</label><select id="maintenanceCar" class="form-control"><option value="">Choose a vehicle (optional)</option>${state.cars.map(car=>`<option value="${escapeHTML(car.id)}">${escapeHTML(car.make+" "+car.model)} · ${car.year}</option>`).join("")}</select></div>
      <div class="form-group"><label for="maintenanceType">Service type *</label><select id="maintenanceType" class="form-control">${["Oil and filter","Tyres","Brakes","Battery","General inspection","Scheduled service","Other"].map(x=>`<option>${x}</option>`).join("")}</select></div>
      <div class="form-group"><label for="maintenanceDate">Service date *</label><input id="maintenanceDate" class="form-control" type="date" required></div>
      <div class="form-group"><label for="maintenanceNext">Next service date</label><input id="maintenanceNext" class="form-control" type="date"></div>
      <div class="form-group"><label for="maintenanceCost">Cost (RM)</label><input id="maintenanceCost" class="form-control" type="number" min="0" max="1000000" value="0"></div>
      <div class="form-group full"><label for="maintenanceNote">Notes</label><textarea id="maintenanceNote" class="form-control" maxlength="500" placeholder="Workshop, mileage, parts replaced..."></textarea></div>
      <div class="form-group full"><button class="gold-button" type="submit">Save service record ↗</button></div>
    </form></div><div class="panel"><h2>Maintenance tips</h2><div class="manifesto-points"><div><span>01</span><p><b>Keep service receipts</b><small>Record the work completed and the date.</small></p></div><div><span>02</span><p><b>Check your handbook</b><small>Follow the vehicle manufacturer's service schedule.</small></p></div><div><span>03</span><p><b>Plan ahead</b><small>Use the next-service date to plan your visit.</small></p></div></div></div></div>
    <div class="panel" style="margin-top:28px"><h2>Service history</h2><div id="maintenanceRecords"></div></div>
  `);
  $("#maintenanceDate").value = new Date().toISOString().slice(0,10);
  $("#maintenanceForm").addEventListener("submit", event => {
    event.preventDefault();
    const car = getCar($("#maintenanceCar").value);
    state.maintenance.unshift({
      id:makeId("service"),
      type:"service",
      carId:car?.id || "",
      carLabel:car ? car.make + " " + car.model : "Unassigned vehicle",
      serviceType:$("#maintenanceType").value,
      date:$("#maintenanceDate").value,
      nextDate:$("#maintenanceNext").value,
      cost:Number($("#maintenanceCost").value || 0),
      note:$("#maintenanceNote").value.trim()
    });
    saveState();
    logActivity("Added maintenance record", car ? car.make + " " + car.model : "Unassigned vehicle");
    renderMaintenance();
    showToast("Service record saved.");
  });
  renderMaintenanceRecords();
}

function renderMaintenanceRecords() {
  const container = $("#maintenanceRecords");
  if (!container) return;
  const records = state.maintenance.filter(item => item.type !== "finance-estimate");
  container.innerHTML = records.length ? records.map(record => {
    const overdue = record.nextDate && record.nextDate < new Date().toISOString().slice(0,10);
    return `<div class="list-row"><div><h3>${escapeHTML(record.serviceType)}</h3><p>${escapeHTML(record.carLabel || "Vehicle")} · Service date: ${formatDate(record.date)}</p><p>${record.nextDate ? "Next service: " + formatDate(record.nextDate) : "No next-service date set"}${overdue ? " · OVERDUE" : ""}</p><p>${escapeHTML(record.note || "")}</p></div><div class="list-row-actions"><strong>${money(record.cost)}</strong><button data-action="delete-maintenance" data-id="${escapeHTML(record.id)}">Delete</button></div></div>`;
  }).join("") : `<div class="empty-state"><h3>No service records yet</h3><p>Add your first maintenance record using the form above.</p></div>`;
}

function renderInsights() {
  const cars = availableCars();
  const average = cars.length ? cars.reduce((sum,car)=>sum+car.price,0)/cars.length : 0;
  const medianList = cars.map(car=>car.price).sort((a,b)=>a-b);
  const median = medianList.length ? medianList[Math.floor(medianList.length/2)] : 0;
  const byMake = Object.entries(cars.reduce((acc,car)=>{acc[car.make]=(acc[car.make]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]);
  const byFuel = Object.entries(cars.reduce((acc,car)=>{acc[car.fuel]=(acc[car.fuel]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]);
  const byBody = Object.entries(cars.reduce((acc,car)=>{acc[car.body]=(acc[car.body]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]);
  const bars = list => list.length ? `<div class="bar-list">${list.map(([name,count])=>`<div class="bar-item"><div class="bar-item-head"><span>${escapeHTML(name)}</span><span>${count}</span></div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(2,count/Math.max(...list.map(x=>x[1]))*100)}%"></div></div></div>`).join("")}</div>` : `<p>No data available.</p>`;
  pageFrame("Market Insights", "A live summary of this browser's available demo listings, not a complete market valuation.", `
    <div class="notice">All statistics are calculated from current Smart Car Hub demo listings. They are not official Malaysian market data or a valuation guide.</div>
    <div class="insights-grid"><div class="insight-card"><p class="eyebrow">AVAILABLE VEHICLES</p><strong>${cars.length}</strong><p>Currently available listings</p></div><div class="insight-card"><p class="eyebrow">AVERAGE ASKING PRICE</p><strong>${shortMoney(average)}</strong><p>Mean asking price in this demo</p></div><div class="insight-card"><p class="eyebrow">MEDIAN ASKING PRICE</p><strong>${shortMoney(median)}</strong><p>Middle price in this demo</p></div></div>
    <div class="insights-grid" style="margin-top:16px"><div class="panel"><h3>Listings by make</h3>${bars(byMake)}</div><div class="panel"><h3>Listings by fuel type</h3>${bars(byFuel)}</div><div class="panel"><h3>Listings by body type</h3>${bars(byBody)}</div></div>
    <div class="panel"><h3>Price distribution</h3>${bars([["Below RM 100k",cars.filter(c=>c.price<100000).length],["RM 100k–199k",cars.filter(c=>c.price>=100000&&c.price<200000).length],["RM 200k–399k",cars.filter(c=>c.price>=200000&&c.price<400000).length],["RM 400k and above",cars.filter(c=>c.price>=400000).length]])}</div>
    <button class="gold-button" data-page="marketplace">Explore listings ↗</button>
  `);
}

function renderAccount() {
  pageFrame("Account & Preferences", "A local profile scaffold for the demo. It is not a secure sign-in system.", `
    <div class="notice">No password, login session, or online identity is created by this page. Do not enter passwords or sensitive personal details.</div>
    <div class="panel"><h2>Local profile</h2><form id="accountForm" class="form-grid"><div class="form-group"><label for="accountName">Display name</label><input class="form-control" id="accountName" value="${escapeHTML(state.profile.name)}" required></div><div class="form-group"><label for="accountEmail">Email (optional)</label><input class="form-control" id="accountEmail" type="email" value="${escapeHTML(state.profile.email)}"></div><div class="form-group"><label for="accountRole">Demo view preference</label><select id="accountRole" class="form-control"><option value="visitor">Visitor</option><option value="buyer">Buyer</option><option value="seller">Seller</option><option value="admin">Admin demo</option></select></div><div class="form-group full"><button class="gold-button" type="submit">Save preferences</button></div></form></div>
  `);
  $("#accountRole").value = state.profile.role || "visitor";
  $("#accountForm").addEventListener("submit", event => {
    event.preventDefault();
    state.profile.name = $("#accountName").value.trim() || "Guest Driver";
    state.profile.email = $("#accountEmail").value.trim();
    state.profile.role = $("#accountRole").value;
    saveState();
    logActivity("Updated preferences", state.profile.name);
    showToast("Preferences saved in this browser.");
  });
}

function openInquiry(id) {
  const car = getCar(id);
  if (!car) return;
  showDialog(`<p class="eyebrow">CONTACT THE SELLER</p><h2 style="font-size:30px">Enquire about ${escapeHTML(car.model)}</h2><p>${escapeHTML(car.make)} ${escapeHTML(car.model)} · ${money(car.price)}</p><form id="inquiryForm" class="form-grid"><input type="hidden" id="inquiryCarId" value="${escapeHTML(id)}"><div class="form-group"><label for="inquiryName">Your name *</label><input id="inquiryName" class="form-control" required maxlength="70" value="${escapeHTML(state.profile.name)}"></div><div class="form-group"><label for="inquiryEmail">Email *</label><input id="inquiryEmail" class="form-control" type="email" required maxlength="120" value="${escapeHTML(state.profile.email)}"></div><div class="form-group full"><label for="inquiryMessage">Message *</label><textarea id="inquiryMessage" class="form-control" required maxlength="1000">Hi, I'm interested in the ${escapeHTML(car.make)} ${escapeHTML(car.model)}. Could you share more details?</textarea></div><div class="form-group full"><button class="gold-button" type="submit">Save demo inquiry ↗</button></div></form><p class="form-help">This form saves a local demo record; it does not send an email to the seller.</p>`);
  $("#inquiryForm").addEventListener("submit", event => {
    event.preventDefault();
    state.inquiries.unshift({id:makeId("inquiry"),carId:id,carLabel:car.make+" "+car.model,name:$("#inquiryName").value.trim(),email:$("#inquiryEmail").value.trim(),message:$("#inquiryMessage").value.trim(),date:new Date().toISOString(),status:"New"});
    saveState();
    logActivity("Saved inquiry", car.make + " " + car.model);
    closeDialog();
    showToast("Inquiry saved locally. No email was sent.");
  });
}

function openBooking(id) {
  const car = getCar(id);
  if (!car) return;
  const minDate = new Date().toISOString().slice(0,10);
  showDialog(`<p class="eyebrow">ARRANGE A VIEWING</p><h2 style="font-size:30px">Book a test drive.</h2><p>${escapeHTML(car.make)} ${escapeHTML(car.model)} · ${escapeHTML(car.location)}</p><form id="bookingForm" class="form-grid"><input type="hidden" id="bookingCarId" value="${escapeHTML(id)}"><div class="form-group"><label for="bookingName">Your name *</label><input id="bookingName" class="form-control" required maxlength="70" value="${escapeHTML(state.profile.name)}"></div><div class="form-group"><label for="bookingEmail">Email *</label><input id="bookingEmail" class="form-control" type="email" required maxlength="120" value="${escapeHTML(state.profile.email)}"></div><div class="form-group"><label for="bookingDate">Preferred date *</label><input id="bookingDate" class="form-control" type="date" min="${minDate}" required></div><div class="form-group"><label for="bookingTime">Preferred time *</label><select id="bookingTime" class="form-control"><option>10:00</option><option>11:00</option><option>13:00</option><option>14:00</option><option>15:00</option><option>16:00</option></select></div><div class="form-group full"><label for="bookingNote">Additional note</label><textarea id="bookingNote" class="form-control" maxlength="500" placeholder="Optional"></textarea></div><div class="form-group full"><button class="gold-button" type="submit">Save demo booking ↗</button></div></form><p class="form-help">The request is saved locally and is not confirmed with the seller.</p>`);
  $("#bookingForm").addEventListener("submit", event => {
    event.preventDefault();
    state.bookings.unshift({id:makeId("booking"),carId:id,carLabel:car.make+" "+car.model,name:$("#bookingName").value.trim(),email:$("#bookingEmail").value.trim(),date:$("#bookingDate").value,time:$("#bookingTime").value,note:$("#bookingNote").value.trim(),createdAt:new Date().toISOString(),status:"Demo request"});
    saveState();
    logActivity("Created test-drive request", car.make + " " + car.model);
    closeDialog();
    showToast("Demo test-drive request saved. It is not yet confirmed.");
  });
}

function openReport(id) {
  const car = getCar(id);
  if (!car) return;
  showDialog(`<p class="eyebrow">LISTING MODERATION</p><h2 style="font-size:30px">Report this listing.</h2><p>${escapeHTML(car.make)} ${escapeHTML(car.model)}</p><form id="reportForm"><div class="form-group"><label for="reportReason">Reason *</label><select id="reportReason" class="form-control"><option>Incorrect information</option><option>Suspicious listing</option><option>Duplicate listing</option><option>Inappropriate content</option><option>Other</option></select></div><div class="form-group" style="margin-top:15px"><label for="reportNote">Details</label><textarea id="reportNote" class="form-control" maxlength="500"></textarea></div><div class="form-actions"><button class="gold-button" type="submit">Submit demo report</button></div></form><p class="form-help">Reports are recorded locally for the admin demo. No moderation team is notified.</p>`);
  $("#reportForm").addEventListener("submit", event => {
    event.preventDefault();
    state.reports.unshift({id:makeId("report"),carId:id,carLabel:car.make+" "+car.model,reason:$("#reportReason").value,note:$("#reportNote").value.trim(),date:new Date().toISOString(),status:"Open"});
    saveState();
    logActivity("Reported listing", car.make + " " + car.model);
    closeDialog();
    showToast("Demo report saved.");
  });
}

function exportData() {
  const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "smart-car-hub-demo-data.json";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("Demo data export prepared.");
}

function deleteSavedSearch(id) {
  state.savedSearches = state.savedSearches.filter(item => item.id !== id);
  saveState();
  renderGarage();
  showToast("Saved search deleted.");
}

function runSavedSearch(id) {
  const search = state.savedSearches.find(item => item.id === id);
  if (!search) return;
  marketplaceFilters = {...marketplaceFilters, ...search.filters};
  renderPage("marketplace");
}

function resolveReport(id) {
  const report = state.reports.find(item => item.id === id);
  if (!report) return;
  state.reports = state.reports.filter(item => item.id !== id);
  logActivity("Resolved demo report", report.carLabel);
  saveState();
  renderAdmin();
  showToast("Report removed from the open queue.");
}

function deleteMaintenance(id) {
  state.maintenance = state.maintenance.filter(item => item.id !== id);
  saveState();
  renderMaintenance();
  showToast("Record deleted.");
}

/* =========================================================
   GLOBAL EVENT HANDLERS
========================================================= */

document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    event.preventDefault();
    renderPage(pageButton.dataset.page);
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const {action, id} = actionButton.dataset;

  switch (action) {
    case "favorite": toggleFavorite(id); break;
    case "compare": toggleCompare(id); break;
    case "details": showDetails(id); break;
    case "inquiry": openInquiry(id); break;
    case "booking": openBooking(id); break;
    case "report": openReport(id); break;
    case "edit-car": editCar(id); break;
    case "toggle-sold": toggleSold(id); break;
    case "delete-car": deleteCar(id); break;
    case "delete-search": deleteSavedSearch(id); break;
    case "run-search": runSavedSearch(id); break;
    case "resolve-report": resolveReport(id); break;
    case "delete-maintenance": deleteMaintenance(id); break;
  }
});

$("#closeDialog").addEventListener("click", closeDialog);
$("#appDialog").addEventListener("click", event => {
  if (event.target === $("#appDialog")) closeDialog();
});

$("#mobileMenu").addEventListener("click", () => {
  $("#navLinks").classList.toggle("open");
});

window.addEventListener("scroll", () => {
  $("#backToTop").classList.toggle("visible", window.scrollY > 400);
});

$("#backToTop").addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

/* =========================================================
   STARTUP
========================================================= */

function initializeApp() {
  // Remove references to cars that no longer exist.
  const ids = new Set(state.cars.map(car => car.id));
  state.favorites = state.favorites.filter(id => ids.has(id));
  state.compare = state.compare.filter(id => ids.has(id)).slice(0,4);
  state.recent = state.recent.filter(id => ids.has(id));
  saveState();
  renderCompareCount();
  renderHome();
  // The static HTML already contains the home page layout.
}

initializeApp();
