import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const api = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql'
  const now = new Date().toISOString()

  const staticRoutes = ['', '/catalog', '/cart', '/login', '/register'].map((p) => ({
    url: `${base}${p || '/'}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1.0 : 0.6,
  }))

  try {
    const query = `query { products(limit: 1000) { id } }`
    const res = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    })
    const json = await res.json()
    const products: Array<{ id: string | number }> = json?.data?.products || []
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${base}/product/${p.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
    return [...staticRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
