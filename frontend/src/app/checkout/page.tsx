import { Container, Typography } from '@mui/material';
import Page from '@/components/layout/Page';

export default function CheckoutPage() {
  return (
    <Page>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Оформление заказа</Typography>
        <Typography sx={{ mt: 2 }}>Доставка и оплата — плейсхолдер</Typography>
        <Typography sx={{ mt: 2 }}>Контактные данные покупателя — плейсхолдер</Typography>
        <Typography sx={{ mt: 2 }}>Подтверждение заказа — плейсхолдер</Typography>
      </Container>
    </Page>
  );
}
