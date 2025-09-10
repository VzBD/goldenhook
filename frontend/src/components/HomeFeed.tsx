"use client";
import { useQuery } from '@/lib/apollo-hooks';
import { GET_HOME_FEED } from '@/lib/queries';
import { Box, Container, Grid, Typography, Card, CardActionArea, CardContent, CardMedia, Stack } from '@mui/material';
import BannerCarousel from './BannerCarousel';
import PopularCategories from './PopularCategories';
import ProductCard from './ProductCard';

export default function HomeFeed() {
  const { data, loading, error } = useQuery<any>(GET_HOME_FEED, { variables: { limit: 8 } });

  return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'grid', gap: 32 }}>
      <Box sx={{ background: 'linear-gradient(180deg, #0b0b0b 0%, #111 100%)', color:'#fff', borderRadius: 2, p: { xs:2, md:3 } }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>Добро пожаловать в Golden Hook</Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>Снасти и экипировка для рыбалки — акции, новинки и хиты продаж</Typography>
        <BannerCarousel />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Главные акции</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card sx={{ position: 'relative', height: { xs: 200, md: 360 }, background: `#0b0b0b url(/images/fishing-1.jpg) center/cover no-repeat` }}>
              <CardActionArea href="/catalog?promo=1" sx={{ height: '100%' }}>
                <CardContent sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', borderRadius: 1 }}>
                  <Typography variant="h5">Супер скидки недели</Typography>
                  <Typography variant="body2">Подберите лучшие предложения</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Card sx={{ position: 'relative', height: 170, background: `#0b0b0b url(/images/fishing-2.jpg) center/cover no-repeat` }}>
                <CardActionArea href="/catalog?promo=2" sx={{ height: '100%' }}>
                  <CardContent sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', borderRadius: 1, py: 0.5, px: 1 }}>
                    <Typography variant="subtitle1">-20% на новинки</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card sx={{ position: 'relative', height: 170, background: `#0b0b0b url(/images/fishing-3.jpg) center/cover no-repeat` }}>
                <CardActionArea href="/catalog?promo=3" sx={{ height: '100%' }}>
                  <CardContent sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', borderRadius: 1, py: 0.5, px: 1 }}>
                    <Typography variant="subtitle1">Хиты продаж</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Популярные категории</Typography>
        <PopularCategories />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Новинки</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', height: 180 }}>
              <CardMedia component="img" src="/promo/new-1.jpg" alt="Новинка 1" sx={{ width: 240, objectFit: 'cover' }} />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6">Новая коллекция</Typography>
                <Typography variant="body2" color="text.secondary">Посмотрите свежие поступления</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', height: 180 }}>
              <CardMedia component="img" src="/promo/new-2.jpg" alt="Новинка 2" sx={{ width: 240, objectFit: 'cover' }} />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6">Только что добавлено</Typography>
                <Typography variant="body2" color="text.secondary">Успейте купить первыми</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Рекомендованные товары</Typography>
        {loading && <Typography color="text.secondary">Загрузка…</Typography>}
        {error && <Typography color="error">Ошибка загрузки</Typography>}
        {data?.products && (
          <Grid container spacing={2}>
            {data.products.map((p: any) => (
              <Grid item xs={12} sm={6} md={3} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
