import dynamic from 'next/dynamic';
import Page from '@/components/layout/Page';

export default function ProductPage({ params }: { params: { id: string } }) {
  const ProductView = dynamic(() => import('@/components/ProductView'), { ssr: false });
  return (
    <Page>
      <ProductView id={params.id} />
    </Page>
  );
}
