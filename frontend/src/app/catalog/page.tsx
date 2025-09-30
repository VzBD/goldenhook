import Page from '@/components/layout/Page';
import CatalogView from '@/components/CatalogView';

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Number(searchParams.page ?? '1') || 1;
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  const brand = typeof searchParams.brand === 'string' ? searchParams.brand : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : '';

  const variables = { page, pageSize: 12, q: q || undefined, brand: brand || undefined, category: category || undefined };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${API_URL}/graphql`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `
        query Catalog($page: Int, $pageSize: Int, $brand: String, $q: String, $category: String) {
          catalog(page: $page, pageSize: $pageSize, brand: $brand, q: $q, category: $category) {
            items { id name price image brand category }
            total
            page
            pageSize
            brands
            categories
          }
        }
      `,
      variables,
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  const initialData = json?.data?.catalog ?? null;

  return (
    <Page>
      <CatalogView initialFilters={{ page, q, brand, category, sort, pageSize: 12 }} initialData={initialData} />
    </Page>
  );
}
