import { Container, Typography } from '@mui/material';
import Page from '@/components/layout/Page';

export default function CartPage() {
  return (
    <Page>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Корзина</Typography>
        <Typography sx={{ mt: 2 }}>Товары, количество, сумма — плейсхолдер</Typography>
      </Container>
    </Page>
  );
}
