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
    <Container maxWidth="lg" sx={{ py: 2, display: 'grid', gap: 24 }}>
      <Box sx={{
        background: 'linear-gradient(120deg, #181818 0%, #232323 100%)',
        color:'#fff',
        borderRadius: 6,
        p: { xs:2, md:3 },
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        border: '2px solid #C7A008',
        fontFamily: 'Playfair Display, serif',
      }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>Golden Hook — магазин для риболовлі та активного відпочинку</Typography>
        <Typography variant="body1" sx={{ opacity: 0.85, mb: 1 }}>
          Найкращі снасті, екіпірування, електроніка та товари для природи. Акції, новинки та хіти продажу — все для вашого хобі!
        </Typography>
        <BannerCarousel />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{
            position: 'relative',
            height: { xs: 200, md: 360 },
            background: `linear-gradient(120deg, #e9ecef 0%, #f5f7fa 100%), url(/images/promo-1.jpg) center/cover no-repeat`,
            borderRadius: 4,
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            border: '2px solid #b7d3a6',
            fontFamily: 'Playfair Display, serif',
          }}>
            <CardActionArea href="/catalog?promo=1" sx={{ height: '100%' }}>
              <CardContent sx={{ position: 'absolute', bottom: 24, left: 24, bgcolor: 'rgba(255,255,255,0.92)', color: '#2d3a1a', borderRadius: 12, boxShadow: '0 2px 8px #b7d3a6' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#222' }}>Супер знижки тижня</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Обирайте найкращі пропозиції для себе</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Додайте додаткові промо-картки тут */}
          </Stack>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Популярні категорії</Typography>
        <PopularCategories />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Новинки</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', height: 180 }}>
              <CardMedia component="img" src="/promo/new-1.jpg" alt="Новинка 1" sx={{ width: 240, objectFit: 'cover' }} />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6">Нова колекція</Typography>
                <Typography variant="body2" color="text.secondary">Ознайомтеся зі свіжими надходженнями</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', height: 180 }}>
              <CardMedia component="img" src="/promo/new-2.jpg" alt="Новинка 2" sx={{ width: 240, objectFit: 'cover' }} />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6">Щойно додано</Typography>
                <Typography variant="body2" color="text.secondary">Встигніть купити першими</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Рекомендовані товари</Typography>
        {loading && <Typography color="text.secondary">Завантаження…</Typography>}
        {error && <Typography color="error">Помилка завантаження</Typography>}
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
