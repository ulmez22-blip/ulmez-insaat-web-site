'use client';

import Link from 'next/link';
import LogoWatermark from './LogoWatermark';

export default function Footer({ locale, dict, phones = [] }) {
  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/urunler`, label: dict.nav.products },
    { href: `/${locale}/projelerimiz`, label: dict.nav.projects },
    { href: `/${locale}/bayilerimiz`, label: dict.nav.dealers },
    { href: `/${locale}/emlak`, label: dict.nav.emlak },
    { href: `/${locale}/hakkimizda`, label: dict.nav.about },
    { href: `/${locale}/iletisim`, label: dict.nav.contact },
  ];

  return (
    <footer className="relative bg-charcoal text-paper/80 overflow-hidden">
      <LogoWatermark className="z-0 w-[420px] h-[420px] -right-24 -bottom-24 hidden sm:block" />
      <div className="relative z-10 max-w-6xl mx-auto px-5 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 font-display font-bold text-lg text-paper mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-icon.png"
              alt=""
              className="h-8 w-8 object-contain shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            Ülmez <span className="text-brick">İnşaat</span>
          </div>
          <p className="text-sm">{dict.tagline}</p>
        </div>

        <div className="text-sm">
          <div className="eyebrow text-ochre mb-2">{dict.quickLinks}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-brick w-fit">{l.label}</Link>
            ))}
          </div>
        </div>

        <div className="text-sm">
          <div className="eyebrow text-ochre mb-2">{dict.contactTitle}</div>
          <p>{dict.addressValue}</p>
          {phones.length > 0 && (
            <div className="mt-2 space-y-1">
              {phones.map((p) => (
                <p key={p}>
                  <a href={`tel:${p.replace(/\s+/g, '')}`} className="hover:text-brick">{p}</a>
                </p>
              ))}
            </div>
          )}
          <p className="mt-2">
            <a href="https://instagram.com/ulmezinsaat" target="_blank" rel="noopener noreferrer" className="hover:text-brick">
              Instagram: @ulmezinsaat
            </a>
          </p>
        </div>

        <div className="text-sm">
          <div className="eyebrow text-ochre mb-2">{dict.workHours}</div>
          <div className="flex justify-between gap-4 max-w-[220px]">
            <span>{dict.workHoursWeekday}</span>
            <span className="text-paper/60">08:00 - 18:00</span>
          </div>
          <div className="flex justify-between gap-4 max-w-[220px] mt-1">
            <span>{dict.workHoursWeekend}</span>
            <span className="text-paper/60">{dict.closed}</span>
          </div>
        </div>
      </div>
      <div className="relative z-10 border-t border-paper/10 text-center text-xs py-4 font-mono">
        © {new Date().getFullYear()} Ülmez İnşaat — {dict.footerRights}
      </div>
    </footer>
  );
}
