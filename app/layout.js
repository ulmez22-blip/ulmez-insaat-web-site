import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';

const SITE_URL = 'https://ulmezinsaat.com';
const DESCRIPTION = '1980\'den beri Diyarbakır Kayapınar\'da yapı market: seramik, vitrifiye, parke, yalıtım ve yapı kimyasalları.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ülmez İnşaat — Diyarbakır Yapı Market',
    template: '%s — Ülmez İnşaat',
  },
  description: DESCRIPTION,
  keywords: ['Ülmez İnşaat', 'Diyarbakır yapı market', 'Kayapınar', 'seramik', 'vitrifiye', 'yapı kimyasalları', 'inşaat malzemeleri'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Ülmez İnşaat',
    title: 'Ülmez İnşaat — Diyarbakır Yapı Market',
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{ url: '/logo.jpg', width: 1024, height: 800, alt: 'Ülmez İnşaat' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ülmez İnşaat — Diyarbakır Yapı Market',
    description: DESCRIPTION,
    images: ['/logo.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="font-body bg-paper text-charcoal">
        {children}
      </body>
    </html>
  );
}
