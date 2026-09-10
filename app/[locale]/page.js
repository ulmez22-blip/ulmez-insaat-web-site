import Link from 'next/link';
import { getDict } from '../../lib/i18n';
import { getCategories, getProducts, getSettings } from '../../lib/db';
import MaterialSwatch from '../../components/MaterialSwatch';
import ProductCard from '../../components/ProductCard';
import LogoWatermark from '../../components/LogoWatermark';
import ParallaxHero from '../../components/ParallaxHero';
import AnimatedCounter from '../../components/AnimatedCounter';
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal';

export default function Home({ params }) {
  const { locale } = params;
  const dict = getDict(locale);
  const categories = getCategories();
  const products = getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const { about: aboutSettings } = getSettings();
  const aboutBody = aboutSettings[locale] || dict.aboutBody;

  return (
    <div>
      {/* Hero */}
      <ParallaxHero locale={locale} dict={dict} />

      {/* Stats strip */}
      <section id="stats" className="bg-navy">
        <RevealGroup className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: 45, suffix: '+', format: true, label: dict.stats.experience },
            { value: 1980, suffix: '', format: false, label: dict.stats.founded },
            { value: 5000, suffix: '+', format: true, label: dict.stats.products },
          ].map((s) => (
            <RevealItem key={s.label}>
              <div className="bg-navylight border border-paper/10 rounded-lg px-6 py-8 text-center h-full">
                <div className="font-display text-3xl md:text-4xl font-bold text-brick">
                  <AnimatedCounter value={s.value} suffix={s.suffix} format={s.format} />
                </div>
                <div className="text-sm text-paper/70 mt-2">{s.label}</div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Neden Ülmez İnşaat */}
      <section className="bg-charcoal text-paper">
        <Reveal className="max-w-4xl mx-auto px-5 pt-16 pb-8 text-center">
          <h2 className="font-display text-2xl font-bold mb-3">{dict.whyUsTitle}</h2>
          <p className="text-paper/60">{dict.whyUsSubtitle}</p>
        </Reveal>
        <RevealGroup className="max-w-6xl mx-auto px-5 pb-16 grid sm:grid-cols-3 gap-8">
          {dict.whyUsPoints.map((p, i) => (
            <RevealItem key={i}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brick text-charcoal flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-display font-medium mb-2">{p.title}</h3>
                <p className="text-sm text-paper/60 leading-relaxed max-w-xs mx-auto">{p.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Categories */}
      <section className="bg-navy">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <Reveal>
            <h2 className="font-display text-2xl font-bold mb-8 text-paper">{dict.categoriesTitle}</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <RevealItem key={c.slug}>
                <Link
                  href={`/${locale}/urunler?kategori=${c.slug}`}
                  className="notch-card border border-charcoal/10 bg-white text-charcoal p-5 hover:border-brick hover:-translate-y-1 transition-all duration-200 group block h-full"
                >
                  <div className="font-display font-medium mb-1 group-hover:text-goldtext">{c.name[locale]}</div>
                  <p className="text-xs text-charcoal/60">{c.desc[locale]}</p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* About teaser */}
      <section className="relative bg-charcoal text-paper overflow-hidden">
        <LogoWatermark className="z-0 w-[520px] h-[520px] -right-32 top-1/2 -translate-y-1/2 hidden md:block" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <h2 className="font-display text-2xl font-bold mb-4">{dict.aboutTitle}</h2>
            <p className="text-paper/70 leading-relaxed">{aboutBody}</p>
          </Reveal>
          <RevealGroup className="grid grid-cols-3 gap-2" stagger={0.05}>
            {products.slice(0, 6).map((p) => (
              <RevealItem key={p.id}>
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.name[locale]} className="h-24 w-full rounded object-cover" />
                ) : (
                  <MaterialSwatch color={p.color} sku={p.sku} className="h-24 rounded" />
                )}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-navy">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <Reveal>
            <h2 className="font-display text-2xl font-bold mb-8 text-paper">{dict.featuredTitle}</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <RevealItem key={p.id}>
                <ProductCard product={p} locale={locale} dict={dict} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-charcoal text-paper">
        <Reveal className="max-w-2xl mx-auto px-5 py-20 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">{dict.ctaBannerTitle}</h2>
          <p className="text-paper/70 mb-8">{dict.ctaBannerBody}</p>
          <Link
            href={`/${locale}/iletisim`}
            className="inline-block bg-paper hover:bg-white hover:-translate-y-0.5 transition-all text-charcoal px-6 py-3 rounded font-medium text-sm"
          >
            {dict.ctaBannerButton}
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
