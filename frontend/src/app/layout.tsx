import type { Metadata } from 'next'
import './globals.css'
import { montserrat, playfair, roboto, notoSans } from '../fonts'
import Providers from './providers'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { cookies } from 'next/headers'
import Script from 'next/script'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Golden Hook',
  description: 'Универсальный интернет-магазин: электроника, одежда, дом, спорт, красота и многое другое',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Golden Hook',
    title: 'Golden Hook',
    description: 'Универсальный интернет-магазин: электроника, одежда, дом, спорт, красота и многое другое',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golden Hook',
    description: 'Универсальный интернет-магазин: электроника, одежда, дом, спорт, красота и многое другое',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const themeMode = cookieStore.get('theme-mode')?.value as 'light'|'dark' | undefined;
  return (
    <html lang="ru" className={`${montserrat.variable} ${playfair.variable} ${roboto.variable} ${notoSans.variable}`}>
      <body>
        {/* GA4 */}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        ) : null}
        <Providers initialTheme={themeMode}>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
