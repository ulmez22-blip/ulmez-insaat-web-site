import { getDict } from '../../../lib/i18n';
import { getCategories, getProducts } from '../../../lib/db';
import ProductGrid from '../../../components/ProductGrid';
import Reveal from '../../../components/Reveal';

export default function ProductsPage({ params, searchParams }) {
  const { locale } = params;
  const dict = getDict(locale);
  const categories = getCategories();
  const products = getProducts();
  const initialCategory = searchParams?.kategori || 'all';

  return (
    <div className="bg-charcoal text-paper min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <Reveal>
          <h1 className="font-display text-3xl font-bold mb-8">{dict.nav.products}</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <ProductGrid
            products={products}
            categories={categories}
            locale={locale}
            dict={dict}
            initialCategory={initialCategory}
          />
        </Reveal>
      </div>
    </div>
  );
}
