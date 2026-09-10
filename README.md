# Ülmez İnşaat — Website

🔗 **Live site:** [ulmezinsaat.com](https://ulmezinsaat.com)

A fully functional, live production website for Ülmez İnşaat, a construction-materials
retailer in Diyarbakır, Turkey (est. 1980). Built with Next.js (App Router): a
public-facing storefront (product catalog, quote cart, reference projects, dealer
network, real-estate listings) plus a full custom admin panel for managing all of it
no external CMS, no database, just the file system as a lightweight content store.

> Note: the `data/` folder (products, projects, etc.) holds live business data and
> isn't included in this repo. To run it yourself, seed it with sample data instead
> see below.

## Features

- **Pages**: Home, Products, Reference Projects, Dealerships + E-Catalog, Real Estate
  (for sale/rent), About, Contact, Quote Cart
- **3 languages**: Turkish (default), English, Kurdish switchable from the header
- **Quote cart**: customers pick products, enter quantities, and submit a quote
  request with contact info (no online payment this is a B2B/wholesale-style
  request flow, not e-commerce checkout)
- **Product & project photo galleries**: unlimited photos per item from the admin
  panel, with one markable as the "main" photo; displayed as a gallery with a
  full-screen lightbox viewer (keyboard/click navigation) on the public pages
- **Direct file upload**: admin can upload photos straight from their device
  ("📤 Upload" button) no need to host images elsewhere and paste a URL
- **Admin panel** (`/admin`): full CRUD for products, projects, real-estate listings,
  and catalogs; view incoming quote requests; site-wide settings (phone numbers,
  About/Contact copy, address) editable per language
- **Security**: salted+hashed admin password (changeable from the panel itself, no
  redeploy needed), HMAC-signed session cookies, brute-force lockout on login
  (5 attempts → 15-minute cooldown, per IP)
- Ships with 19 sample products real ones can be added from the admin panel;
  products without a photo yet fall back to a simple color-swatch placeholder card

## Architecture note

All content lives in flat JSON files (`data/*.json`), read/written directly on the
server's disk intentionally no database. Pages that depend on this data are marked
`export const dynamic = 'force-dynamic'`, so every request reads the current file
state; this was a deliberate fix during development after discovering Next.js would
otherwise statically prerender these pages at build time, which would have meant
admin edits never showing up on the live site without a full rebuild.

## Running locally

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
cp .env.local.example .env.local   # set your own admin password
npm run dev
```

Open `http://localhost:3000` in your browser.

To populate it with sample data: `npm run seed`

## Admin panel

- URL: `/admin` (e.g. `http://localhost:3000/admin`)
- Default password: whatever you set in `.env.local` **change it before going
  live.** Once logged in, this can also be changed directly from **Settings →
  Change Admin Password**, no file editing or redeploy required.

## Deployment

This site is deployed on a small Ubuntu VPS (not a serverless platform like Vercel),
which was a deliberate choice: since content and uploaded photos are stored as files
on disk rather than in a database or cloud storage bucket, the app needs a server
with a **persistent filesystem** to keep that data across restarts and deploys.
Serverless platforms reset their filesystem on every deploy, which would silently
wipe uploaded photos and any admin-added content.

**Stack in production:**

1. Ubuntu server, Node.js 20
2. App built with `npm run build` and run continuously via **PM2** (auto-restarts on
   crash or server reboot)
3. **Nginx** as a reverse proxy from ports 80/443 to the Node app on port 3000
4. **Certbot** (Let's Encrypt) for free, auto-renewing SSL
5. `ufw` firewall (SSH, HTTP, HTTPS only) and SSH key-only authentication
   (password login disabled)

**Basic setup steps, for reference:**

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# app
npm install
cp .env.local.example .env.local   # set ADMIN_PASSWORD and ADMIN_SESSION_SECRET
npm run build

# process manager
sudo npm install -g pm2
pm2 start npm --name ulmez-insaat -- start
pm2 save
pm2 startup

# nginx + certbot handle the reverse proxy and SSL from there
```

### Backups

Even with persistent storage, a single VPS is still a single point of failure, so
`data/` and `public/uploads/` should be backed up regularly (e.g. a weekly cron job
copying them somewhere else).

## Folder structure (summary)

```
app/[locale]/         → localized pages (tr/en/ku)
app/api/               → backend routes (products, projects, dealers, catalogs,
                          listings, settings, file upload, admin auth)
app/admin/             → admin panel pages
components/            → UI components
data/                  → product/category/project/dealer/catalog/listing/quote/
                          settings data (JSON, gitignored — see note above)
lib/                   → data access, i18n strings, admin auth
public/uploads/        → photos uploaded from the admin panel (gitignored)
```
