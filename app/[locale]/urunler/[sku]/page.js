import { notFound } from 'next/navigation';
import { getDict } from '../../../../lib/i18n';
import { getProductBySku, getProducts } from '../../../../lib/db';
import Gallery from '../../../../components/Gallery';
import AddToQuoteButton from '../../../../components/AddToQuoteButton';
import ProductCard from '../../../../components/ProductCard';
import Reveal, { RevealGroup, RevealItem } from '../../../../components/Reveal';

export default function ProductDetail({ params }) {
  const { locale, sku } = params;
  const dict = getDict(locale);
  const product = getProductBySku(sku);
  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.category === product.category && p.sku !== product.sku)
    .slice(0, 4);

  return (
    <div className="bg-charcoal text-paper min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          <Reveal>
            <Gallery
              images={product.images}
              alt={product.name[locale]}
              color={product.color}
              sku={product.sku}
              className="h-72 md:h-full rounded-lg min-h-[280px]"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="eyebrow text-ochre mb-2">{product.sku}</div>
            <h1 className="font-display text-3xl font-bold mb-3">{product.name[locale]}</h1>
            <p className="text-paper/70 mb-6 leading-relaxed">{product.desc[locale]}</p>

            <dl className="grid grid-cols-2 gap-4 mb-8 font-mono text-sm border-y border-paper/10 py-4">
              <div>
                <dt className="text-paper/50 text-xs">{dict.unit}</dt>
                <dd>{product.unit}</dd>
              </div>
              <div>
                <dt className="text-paper/50 text-xs">{dict.spec}</dt>
                <dd>{product.spec}</dd>
              </div>
            </dl>

            <AddToQuoteButton product={product} dict={dict} />
          </Reveal>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <h2 className="font-display text-xl font-bold mb-6">
                {locale === 'tr' ? 'Benzer Ürünler' : locale === 'en' ? 'Related Products' : 'Berhemên Wekhev'}
              </h2>
            </Reveal>
            <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <RevealItem key={p.id}>
                  <ProductCard product={p} locale={locale} dict={dict} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )}
      </div>
    </div>
  );
}
