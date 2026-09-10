import { getDict } from '../../../lib/i18n';
import { getDealers, getCatalogs } from '../../../lib/db';
import DealerBadge from '../../../components/DealerBadge';
import Reveal, { RevealGroup, RevealItem } from '../../../components/Reveal';

export default function DealersPage({ params }) {
  const { locale } = params;
  const dict = getDict(locale);
  const dealers = getDealers();
  const catalogs = getCatalogs();

  // group catalogs by brand, keeping only brands that actually have catalogs
  const catalogGroups = dealers
    .map((d) => ({ dealer: d, items: catalogs.filter((c) => c.dealerName === d.name) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="bg-charcoal text-paper min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <Reveal>
          <h1 className="font-display text-3xl font-bold mb-2">{dict.dealersTitle}</h1>
          <p className="text-paper/60 mb-10 max-w-xl">{dict.dealersSubtitle}</p>
        </Reveal>

        {dealers.length === 0 ? (
          <p className="text-sm text-paper/60">—</p>
        ) : (
          <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dealers.map((d) => (
              <RevealItem key={d.name}>
                <DealerBadge dealer={d} dict={dict} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>

      {/* E-Katalog, folded into this page to save a nav slot */}
      <div id="e-katalog" className="scroll-mt-24 bg-navy">
        <div className="max-w-4xl mx-auto px-5 py-16">
          {catalogGroups.length === 0 ? (
            <Reveal className="text-center">
              <h2 className="font-display text-2xl font-bold mb-4">{dict.ekatalogTitle}</h2>
              <p className="text-paper/60 mb-8">{dict.ekatalogBody}</p>
              <span className="inline-block bg-paper/10 text-paper/60 text-sm font-medium px-6 py-3 rounded cursor-not-allowed">
                {dict.ekatalogButton}
              </span>
            </Reveal>
          ) : (
            <>
              <Reveal>
                <h2 className="font-display text-2xl font-bold mb-8 text-center">{dict.catalogsTitle}</h2>
              </Reveal>
              <RevealGroup className="space-y-4">
                {catalogGroups.map(({ dealer, items }) => (
                  <RevealItem key={dealer.name}>
                    <div className="bg-white text-charcoal border border-charcoal/10 rounded-lg p-5 flex flex-wrap items-center gap-5">
                      <div className="w-28 h-14 shrink-0 flex items-center justify-center">
                        {dealer.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={dealer.logo} alt={dealer.name} className="max-h-14 max-w-full object-contain" />
                        ) : (
                          <span className="font-display font-bold text-charcoal/70">{dealer.name}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-[200px] flex flex-wrap gap-2">
                        {items.map((c) => (
                          <a
                            key={c.id}
                            href={c.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 border border-charcoal/20 hover:border-brick hover:text-goldtext rounded px-3 py-2 text-sm transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" />
                            </svg>
                            {c.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
