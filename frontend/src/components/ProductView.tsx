"use client";
import { useQuery } from '@/lib/apollo-hooks';
import { GET_PRODUCT } from '@/lib/queries';
import { Box, Button, Container, Grid, ImageList, ImageListItem, Rating, Stack, TextField, Typography } from '@mui/material';
import { useCart } from '@/contexts/CartContext';
import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

export default function ProductView({ id }: { id: string }) {
  const { data, loading, error } = useQuery<any>(GET_PRODUCT, { variables: { id } });
  const p = data?.product;
  const { addItem } = useCart();

  useEffect(() => {
    if (p) {
      analytics.viewItem({ id: p.id, name: p.name, price: p.price })
    }
  }, [p])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading && <Typography color="text.secondary">Загрузка…</Typography>}
      {error && <Typography color="error">Ошибка загрузки</Typography>}
      {p && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ImageList variant="masonry" cols={1} gap={8}>
                {(p.images?.length ? p.images : ['/placeholder.png']).map((src: string, i: number) => (
                  <ImageListItem key={i}>
                    <img src={src} alt={p.name} loading="lazy" style={{ width: '100%', borderRadius: 8 }} />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4">{p.name}</Typography>
              <Typography sx={{ mt: 1 }} color="text.secondary">Артикул: {p.sku} · Бренд: {p.brand}</Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>{p.price} ₽ {p.oldPrice ? <Typography component="span" color="text.secondary" sx={{ textDecoration: 'line-through', ml: 1 }}>{p.oldPrice} ₽</Typography> : null}</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={() => {
                  addItem({ id: p.id, name: p.name, price: p.price, image: p.images?.[0] })
                  analytics.addToCart({ id: p.id, name: p.name, price: p.price, quantity: 1 })
                }}>
                  Купить
                </Button>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Характеристики</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {(p.specs || []).map((s: any, i: number) => (
                    <Typography key={i} color="text.secondary">{s.key}: {s.value}</Typography>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Описание</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>{p.description}</Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Отзывы покупателей</Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {(p.reviews || []).map((r: any) => (
                <Box key={r.id} sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography fontWeight={600}>{r.author}</Typography>
                    <Rating value={r.rating} readOnly size="small" />
                  </Stack>
                  <Typography sx={{ mt: 1 }}>{r.comment}</Typography>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 2, border: '1px solid #eee', borderRadius: 2, p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Оставить отзыв</Typography>
              <Stack spacing={2}>
                <Rating name="new-rating" defaultValue={5} />
                <TextField label="Ваш отзыв" multiline rows={3} fullWidth />
                <Button variant="outlined">Отправить</Button>
              </Stack>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}
