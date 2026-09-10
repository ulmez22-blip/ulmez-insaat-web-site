import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const QUOTES_FILE = path.join(DATA_DIR, 'quotes.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const DEALERS_FILE = path.join(DATA_DIR, 'dealers.json');
const LISTINGS_FILE = path.join(DATA_DIR, 'listings.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const CATALOGS_FILE = path.join(DATA_DIR, 'catalogs.json');

function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return fallback;
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const TR_MAP = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', İ: 'i', Ç: 'c', Ğ: 'g', Ö: 'o', Ş: 's', Ü: 'u' };

function slugify(text) {
  return String(text || '')
    .split('')
    .map((ch) => TR_MAP[ch] || ch)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueSlug(base, existingSlugs) {
  let slug = base || 'proje';
  let i = 2;
  while (existingSlugs.includes(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

export function getCategories() {
  return readJSON(CATEGORIES_FILE, []);
}

export function getProducts() {
  return readJSON(PRODUCTS_FILE, []);
}

export function getProductBySku(sku) {
  return getProducts().find((p) => p.sku === sku);
}

export function getProjects() {
  return readJSON(PROJECTS_FILE, []);
}

export function getProjectById(id) {
  return getProjects().find((p) => p.id === Number(id));
}

export function getProjectBySlug(slug) {
  return getProjects().find((p) => p.slug === slug);
}

export function addProject(project) {
  const projects = getProjects();
  const nextId = projects.length ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
  const slug = project.slug || uniqueSlug(slugify(project.name?.tr), projects.map((p) => p.slug));
  const newProject = {
    id: nextId,
    createdAt: new Date().toISOString(),
    images: [],
    videoUrl: '',
    ...project,
    slug,
  };
  projects.push(newProject);
  writeJSON(PROJECTS_FILE, projects);
  return newProject;
}

export function updateProject(id, updates) {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === Number(id));
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...updates };
  writeJSON(PROJECTS_FILE, projects);
  return projects[idx];
}

export function deleteProject(id) {
  const projects = getProjects();
  const filtered = projects.filter((p) => p.id !== Number(id));
  writeJSON(PROJECTS_FILE, filtered);
  return filtered.length !== projects.length;
}

export function getDealers() {
  return readJSON(DEALERS_FILE, []);
}

export function getListings() {
  return readJSON(LISTINGS_FILE, []);
}

export function addListing(listing) {
  const listings = getListings();
  const nextId = listings.length ? Math.max(...listings.map((l) => l.id)) + 1 : 1;
  const newListing = {
    id: nextId,
    createdAt: new Date().toISOString(),
    images: [],
    price: '',
    ...listing,
  };
  listings.push(newListing);
  writeJSON(LISTINGS_FILE, listings);
  return newListing;
}

export function updateListing(id, updates) {
  const listings = getListings();
  const idx = listings.findIndex((l) => l.id === Number(id));
  if (idx === -1) return null;
  listings[idx] = { ...listings[idx], ...updates };
  writeJSON(LISTINGS_FILE, listings);
  return listings[idx];
}

export function deleteListing(id) {
  const listings = getListings();
  const filtered = listings.filter((l) => l.id !== Number(id));
  writeJSON(LISTINGS_FILE, filtered);
  return filtered.length !== listings.length;
}

export function getCatalogs() {
  return readJSON(CATALOGS_FILE, []);
}

export function addCatalog(catalog) {
  const catalogs = getCatalogs();
  const nextId = catalogs.length ? Math.max(...catalogs.map((c) => c.id)) + 1 : 1;
  const newCatalog = {
    id: nextId,
    createdAt: new Date().toISOString(),
    ...catalog,
  };
  catalogs.push(newCatalog);
  writeJSON(CATALOGS_FILE, catalogs);
  return newCatalog;
}

export function updateCatalog(id, updates) {
  const catalogs = getCatalogs();
  const idx = catalogs.findIndex((c) => c.id === Number(id));
  if (idx === -1) return null;
  catalogs[idx] = { ...catalogs[idx], ...updates };
  writeJSON(CATALOGS_FILE, catalogs);
  return catalogs[idx];
}

export function deleteCatalog(id) {
  const catalogs = getCatalogs();
  const filtered = catalogs.filter((c) => c.id !== Number(id));
  writeJSON(CATALOGS_FILE, filtered);
  return filtered.length !== catalogs.length;
}

const EMPTY_LOCALIZED = { tr: '', en: '', ku: '' };

export function getSettings() {
  const raw = readJSON(SETTINGS_FILE, {});
  const phones = Array.isArray(raw.phones)
    ? raw.phones.filter((p) => String(p || '').trim())
    : (raw.phone ? [raw.phone] : []);
  return {
    phones,
    about: { ...EMPTY_LOCALIZED, ...(raw.about || {}) },
    contact: { ...EMPTY_LOCALIZED, ...(raw.contact || {}) },
    address: { ...EMPTY_LOCALIZED, ...(raw.address || {}) },
  };
}

export function updateSettings(updates) {
  const current = getSettings();
  const next = {
    phones: Array.isArray(updates.phones)
      ? updates.phones.map((p) => String(p || '').trim()).filter(Boolean)
      : current.phones,
    about: { ...current.about, ...(updates.about || {}) },
    contact: { ...current.contact, ...(updates.contact || {}) },
    address: { ...current.address, ...(updates.address || {}) },
  };
  writeJSON(SETTINGS_FILE, next);
  return next;
}

export function addProduct(product) {
  const products = getProducts();
  const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct = { id: nextId, createdAt: new Date().toISOString(), featured: false, images: [], ...product };
  products.push(newProduct);
  writeJSON(PRODUCTS_FILE, products);
  return newProduct;
}

export function updateProduct(id, updates) {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === Number(id));
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates };
  writeJSON(PRODUCTS_FILE, products);
  return products[idx];
}

export function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== Number(id));
  writeJSON(PRODUCTS_FILE, filtered);
  return filtered.length !== products.length;
}

export function getQuotes() {
  return readJSON(QUOTES_FILE, []);
}

export function addQuote(quote) {
  const quotes = getQuotes();
  const nextId = quotes.length ? Math.max(...quotes.map((q) => q.id)) + 1 : 1;
  const newQuote = {
    id: nextId,
    status: 'new',
    createdAt: new Date().toISOString(),
    ...quote,
  };
  quotes.push(newQuote);
  writeJSON(QUOTES_FILE, quotes);
  return newQuote;
}

export function updateQuoteStatus(id, status) {
  const quotes = getQuotes();
  const idx = quotes.findIndex((q) => q.id === Number(id));
  if (idx === -1) return null;
  quotes[idx].status = status;
  writeJSON(QUOTES_FILE, quotes);
  return quotes[idx];
}
