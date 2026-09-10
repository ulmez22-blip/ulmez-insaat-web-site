import { getDict } from '../../../lib/i18n';
import { getSettings } from '../../../lib/db';
import Reveal from '../../../components/Reveal';

export default function ContactPage({ params }) {
  const { locale } = params;
  const dict = getDict(locale);
  const { phones, contact, address } = getSettings();
  const contactBody = contact[locale] || dict.contactBody;
  const addressValue = address[locale] || dict.addressValue;

  return (
    <div className="bg-charcoal text-paper min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-5 py-12">
        <Reveal>
          <h1 className="font-display text-3xl font-bold mb-3">{dict.contactTitle}</h1>
          <p className="text-paper/70 mb-10">{contactBody}</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-8">
          <Reveal delay={0.1} className="space-y-5 font-mono text-sm">
            <div>
              <div className="eyebrow text-ochre mb-1">{dict.address_label}</div>
              <p>{addressValue}</p>
            </div>
            {phones.length > 0 && (
              <div>
                <div className="eyebrow text-ochre mb-1">{dict.phone}</div>
                <div className="space-y-1">
                  {phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} className="block text-ochre hover:text-brick">
                      {p}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="eyebrow text-ochre mb-1">Instagram</div>
              <a href="https://instagram.com/ulmezinsaat" target="_blank" rel="noopener noreferrer" className="text-ochre hover:text-brick">
                @ulmezinsaat
              </a>
            </div>
            <div>
              <div className="eyebrow text-ochre mb-1">
                {locale === 'tr' ? 'Yol Tarifi' : locale === 'en' ? 'Directions' : 'Rê'}
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=%C3%9Clmez+%C4%B0n%C5%9Faat+Kayap%C4%B1nar+Diyarbak%C4%B1r"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ochre hover:text-brick"
              >
                Google Maps →
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <iframe
              title="map"
              className="w-full h-64 rounded border border-paper/10"
              loading="lazy"
              src="https://www.google.com/maps?q=%C3%9Clmez+%C4%B0n%C5%9Faat+Kayap%C4%B1nar+Diyarbak%C4%B1r&z=16&output=embed"
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
