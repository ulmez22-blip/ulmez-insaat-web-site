import { LOCALES } from '../lib/i18n';
import { getProducts, getProjects } from '../lib/db';

const SITE_URL = 'https://ulmezinsaat.com';

const STATIC_PATHS = [
  '',
  '/urunler',
  '/projelerimiz',
  '/bayilerimiz',
  '/emlak',
  '/hakkimizda',
  '/iletisim',
];

export default function sitemap() {
  const now = new Date();
  const entries = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
      });
    }
  }

  const products = getProducts();
  const projects = getProjects();

  for (const locale of LOCALES) {
    for (const p of products) {
      entries.push({
        url: `${SITE_URL}/${locale}/urunler/${p.sku}`,
        lastModified: p.createdAt ? new Date(p.createdAt) : now,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
    for (const proj of projects) {
      entries.push({
        url: `${SITE_URL}/${locale}/projelerimiz/${proj.slug}`,
        lastModified: proj.createdAt ? new Date(proj.createdAt) : now,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
