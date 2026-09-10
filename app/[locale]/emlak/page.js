import { getDict } from '../../../lib/i18n';
import { getListings, getSettings } from '../../../lib/db';
import Reveal, { RevealGroup, RevealItem } from '../../../components/Reveal';
import ListingCard from '../../../components/ListingCard';

export default function EmlakPage({ params }) {
  const { locale } = params;
  const dict = getDict(locale);
  const listings = getListings();
  const { phones } = getSettings();
  const phone = phones[0];

  return (
    <div className="bg-charcoal text-paper min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <Reveal>
          <h1 className="font-display text-3xl font-bold mb-2">{dict.emlakTitle}</h1>
          <p className="text-paper/60 mb-2 max-w-xl">{dict.emlakSubtitle}</p>
          {phone && (
            <p className="text-sm mb-10">
              <span className="text-paper/60">{dict.emlakCallCta}: </span>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-ochre hover:text-brick font-medium">
                {phone}
              </a>
            </p>
          )}
          {!phone && <div className="mb-10" />}
        </Reveal>

        {listings.length === 0 ? (
          <p className="text-sm text-paper/60">{dict.emlakEmpty}</p>
        ) : (
          <RevealGroup className="grid md:grid-cols-3 gap-4">
            {listings.map((l) => (
              <RevealItem key={l.id}>
                <ListingCard listing={l} locale={locale} dict={dict} phones={phones} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </div>
  );
}
