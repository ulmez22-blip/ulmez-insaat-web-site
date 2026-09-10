import { getDict } from '../../../lib/i18n';
import { getSettings } from '../../../lib/db';
import Reveal, { RevealGroup, RevealItem } from '../../../components/Reveal';

export default function AboutPage({ params }) {
  const { locale } = params;
  const dict = getDict(locale);
  const { about } = getSettings();
  const aboutBody = about[locale] || dict.aboutBody;

  return (
    <div className="bg-charcoal text-paper min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <Reveal>
          <div className="eyebrow text-ochre mb-3">1980 — {new Date().getFullYear()}</div>
          <h1 className="font-display text-3xl font-bold mb-6">{dict.aboutTitle}</h1>
          <p className="text-paper/70 leading-relaxed text-lg mb-10">{aboutBody}</p>
        </Reveal>

        <RevealGroup className="grid grid-cols-2 gap-4">
          {dict.trustPoints.map((t, i) => (
            <RevealItem key={i}>
              <div className="border-l-2 border-brick pl-4 py-1 font-mono text-sm">
                {t}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
