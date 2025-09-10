import type { Metadata } from 'next'
import './globals.css'
import { montserrat, playfair, roboto, notoSans } from '../fonts'
import Providers from './providers'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Golden Hook',
  description: 'Интернет-магазин товаров для рыбалки и туризма',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const themeMode = cookieStore.get('theme-mode')?.value as 'light'|'dark' | undefined;
  return (
    <html lang="ru" className={`${montserrat.variable} ${playfair.variable} ${roboto.variable} ${notoSans.variable}`}>
      <body>
        <Providers initialTheme={themeMode}>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
