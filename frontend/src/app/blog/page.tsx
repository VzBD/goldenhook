import { Container, Typography } from '@mui/material';
import Page from '@/components/layout/Page';

export default function BlogPage() {
  return (
    <Page>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Блог / Новости</Typography>
        <Typography sx={{ mt: 2 }}>Лента статей и новостей — плейсхолдер</Typography>
      </Container>
    </Page>
  );
}
