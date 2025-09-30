import Page from '@/components/layout/Page'
import CatalogView from '@/components/CatalogView'

// Params slug: category
// Query: q, price_from, price_to, inStock, sort, page

type Search = { [k: string]: string | string[] | undefined }

type Params = { category: string }

function parseFilters(params: Params, searchParams: Search) {
  const category = decodeURIComponent(params.category || '')
  const sp = new URLSearchParams(searchParams as any)
  const q = sp.get('q') || ''
  const brand = sp.get('brand') || ''
  const priceFrom = sp.get('price_from')
  const priceTo = sp.get('price_to')
  const inStock = sp.get('inStock')
  const sort = sp.get('sort') || ''
  const page = Number(sp.get('page') || '1')
  return {
    q,
    brand,
    category,
    priceFrom: priceFrom ? Number(priceFrom) : undefined,
    priceTo: priceTo ? Number(priceTo) : undefined,
    inStock: inStock === '1' ? true : undefined,
    sort: sort || undefined,
    page,
    pageSize: 12,
  }
}

async function fetchCatalog(vars: any) {
  const api = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql'
  const query = `
    query Catalog($page: Int, $pageSize: Int, $brand: String, $q: String, $category: String, $priceFrom: Int, $priceTo: Int, $inStock: Boolean, $sort: String) {
      catalog(page: $page, pageSize: $pageSize, brand: $brand, q: $q, category: $category, priceFrom: $priceFrom, priceTo: $priceTo, inStock: $inStock, sort: $sort) {
        items { id name price image brand category }
        total
        page
        pageSize
        brands
        categories
      }
    }
  `
  const res = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: vars }),
    next: { revalidate: 60 },
  })
  const json = await res.json()
  return json?.data?.catalog
}

export default async function CatalogCategoryPage({ params, searchParams }: { params: Params, searchParams: Search }) {
  const vars = parseFilters(params, searchParams)
  const catalog = await fetchCatalog(vars)
  return (
    <Page>
      <CatalogView initialFilters={vars} initialData={catalog} />
    </Page>
  )
}
