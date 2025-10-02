import dynamic from 'next/dynamic';
import Page from '@/components/layout/Page';
import type { Metadata } from 'next'

const api = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const query = `
      query Product($id: ID!) {
        product(id: $id) { id name description price images }
      }
    `
    const res = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id: params.id } }),
      // Кеш на минуту
      next: { revalidate: 60 },
    })
    const json = await res.json()
    const p = json?.data?.product as any
    if (!p) return {}
    const title = `${p.name} — Golden Hook`
    const description = (p.description || '').slice(0, 160)
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/product/${params.id}`
    const images = (p.images?.length ? p.images : ['/placeholder.png']).map((u: string) => ({ url: u }))
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url, type: 'website', images },
      twitter: { card: 'summary_large_image', title, description, images: images as any },
    }
  } catch {
    return {}
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const ProductView = dynamic(() => import('@/components/ProductView'), { ssr: false });

  // Получим минимальные данные для JSON-LD
  const api = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql'
  const query = `
    query Product($id: ID!) {
      product(id: $id) { id name description price oldPrice brand sku images }
    }
  `
  let ldJson: any = null
  try {
    const res = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id: params.id } }),
      next: { revalidate: 60 },
    })
    const json = await res.json()
    const p = json?.data?.product
    if (p) {
      const urlBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const url = `${urlBase}/product/${params.id}`
      ldJson = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        description: p.description,
        image: p.images?.length ? p.images : undefined,
        sku: p.sku,
        brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: 'UAH',
          price: p.price,
          availability: 'https://schema.org/InStock',
        },
      }
    }
  } catch {}

  return (
    <Page>
      {ldJson ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      ) : null}
      <ProductView id={params.id} />
    </Page>
  );
}
