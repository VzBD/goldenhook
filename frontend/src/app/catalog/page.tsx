import dynamic from 'next/dynamic';
import Page from '@/components/layout/Page';
const CatalogView = dynamic(() => import('@/components/CatalogView'), { ssr: false });

export default function CatalogPage() {
  return (
    <Page>
      <CatalogView />
    </Page>
  );
}
