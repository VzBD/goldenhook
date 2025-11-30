"use client";
import { useQuery } from '@/lib/apollo-hooks';
import { GET_PRODUCT } from '@/lib/queries';
import { Box, Button, Container, Grid, ImageList, ImageListItem, Rating, Stack, TextField, Typography, useTheme } from '@mui/material';
import { useCart } from '@/contexts/CartContext';
import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

export default function ProductView({ id }: { id: string }) {
  const theme = useTheme();
  const { data, loading, error } = useQuery<any>(GET_PRODUCT, { variables: { id } });
  const p = data?.product;
  const { addItem } = useCart();

  useEffect(() => {
    if (p) {
      analytics.viewItem({ id: p.id, name: p.name, price: p.price })
    }
  }, [p])

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: theme.palette.background.paper, borderRadius: 8, boxShadow: '0 4px 32px rgba(40,40,40,0.18)', color: theme.palette.text.primary }}>
      {loading && <Typography color="text.secondary">Загрузка…</Typography>}
      {error && <Typography color="error">Ошибка загрузки</Typography>}
      {p && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: '#23272f', borderRadius: 8, p: 2, boxShadow: '0 2px 12px #23272f' }}>
                <ImageList variant="masonry" cols={1} gap={8}>
                  {(p.images?.length ? p.images : ['/placeholder.png']).map((src: string, i: number) => (
                    <ImageListItem key={i}>
                      <img src={src} alt={p.name} loading="lazy" style={{ width: '100%', borderRadius: 2, background: '#181a20' }} />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: '#23272f', borderRadius: 8, p: 3, boxShadow: '0 2px 12px #23272f', minHeight: 340 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.mode === 'dark' ? '#ff9800' : '#c77600' }}>{p.name}</Typography>
                <Typography sx={{ mt: 1, color: theme.palette.text.secondary }}>Артикул: {p.sku} · Бренд: {p.brand}</Typography>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.text.primary }}>{p.price} ₽</Typography>
                  {p.oldPrice && (
                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: theme.palette.text.secondary, fontWeight: 600 }}>{p.oldPrice} ₽</Typography>
                  )}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="contained" sx={{
                    fontWeight: 700,
                    fontSize: 16,
                    borderRadius: 4,
                    boxShadow: '0 2px 8px #ff9800',
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)'
                      : 'linear-gradient(90deg, #c77600 0%, #ffe0b2 100%)',
                    color: theme.palette.mode === 'dark' ? '#23272f' : '#fff',
                    '&:hover': {
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(90deg, #ffb74d 0%, #ff9800 100%)'
                        : 'linear-gradient(90deg, #ffe0b2 0%, #c77600 100%)',
                      boxShadow: '0 6px 24px #ff9800',
                    },
                  }} onClick={() => {
                    addItem({ id: p.id, name: p.name, price: p.price, image: p.images?.[0] })
                    analytics.addToCart({ id: p.id, name: p.name, price: p.price, quantity: 1 })
                  }}>Купить</Button>
                  <Button variant="outlined" sx={{
                    fontWeight: 700,
                    fontSize: 16,
                    borderRadius: 4,
                    borderColor: theme.palette.mode === 'dark' ? '#ff9800' : '#c77600',
                    color: theme.palette.mode === 'dark' ? '#ff9800' : '#c77600',
                    background: theme.palette.background.paper,
                    '&:hover': {
                      background: theme.palette.background.default,
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.mode === 'dark' ? '#ff9800' : '#c77600',
                    },
                  }}>Быстрая покупка</Button>
                </Stack>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>Характеристики</Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {(p.specs || []).map((s: any, i: number) => (
                      <Typography key={i} sx={{ color: theme.palette.text.primary }}>{s.key}: {s.value}</Typography>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, bgcolor: '#23272f', borderRadius: 8, p: 3, boxShadow: '0 2px 12px #23272f' }}>
            <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#ff9800' : '#c77600' }}>Описание</Typography>
            <Typography sx={{ mt: 1, color: theme.palette.text.primary }}>{p.description}</Typography>
          </Box>

          <Box sx={{ mt: 4, bgcolor: '#23272f', borderRadius: 8, p: 3, boxShadow: '0 2px 12px #23272f' }}>
            <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#ff9800' : '#c77600' }}>Отзывы покупателей</Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {(p.reviews || []).map((r: any) => (
                <Box key={r.id} sx={{ border: '1px solid #31343b', borderRadius: 4, p: 2, bgcolor: '#181a20' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography fontWeight={600} sx={{ color: theme.palette.text.secondary }}>{r.author}</Typography>
                    <Rating value={r.rating} readOnly size="small" />
                  </Stack>
                  <Typography sx={{ mt: 1, color: theme.palette.text.primary }}>{r.comment}</Typography>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 2, border: '1px solid #31343b', borderRadius: 4, p: 2, bgcolor: '#181a20' }}>
              <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.secondary }}>Оставить отзыв</Typography>
              <Stack spacing={2}>
                <Rating name="new-rating" defaultValue={5} />
                <TextField label="Ваш отзыв" multiline rows={3} fullWidth sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 2 }} />
                <Button variant="outlined" sx={{ color: theme.palette.mode === 'dark' ? '#ff9800' : '#c77600', borderColor: theme.palette.mode === 'dark' ? '#ff9800' : '#c77600', fontWeight: 700 }}>Отправить</Button>
              </Stack>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}
