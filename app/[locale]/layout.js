import { LOCALES, getDict } from '../../lib/i18n';
import { getSettings } from '../../lib/db';
import { QuoteCartProvider } from '../../components/QuoteCartContext';
import MotionProvider from '../../components/MotionProvider';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// All page content under here is read live from the data/ JSON files on every
// request (products, projects, dealers, listings, settings). Without this,
// Next.js would bake these pages into static HTML at build time, and admin
// panel edits would not appear on the live site until the app is rebuilt.
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }) {
  const { locale } = params;
  const dict = getDict(locale);
  const { phones } = getSettings();

  return (
    <MotionProvider>
      <QuoteCartProvider>
        <Header locale={locale} dict={dict} />
        <main className="min-h-[60vh]">{children}</main>
        <Footer locale={locale} dict={dict} phones={phones} />
      </QuoteCartProvider>
    </MotionProvider>
  );
}
