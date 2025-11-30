"use client";
import { Grid, Typography } from '@mui/material';
import ProductCard from './ProductCard';

const demo = [
  { id: 1, name: 'Удилище Golden X', price: 4990, image: '/placeholder.png' },
  { id: 2, name: 'Катушка Storm 3000', price: 6990, image: '/placeholder.png' },
  { id: 3, name: 'Смарт-часы Ultra', price: 5900, image: '/placeholder.png' },
  { id: 4, name: 'Палатка Trek 2', price: 12990, image: '/placeholder.png' },
];

export default function RecommendedProducts() {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Рекомендованные товары</Typography>
      <Grid container spacing={2}>
        {demo.map((p) => (
          <Grid item xs={12} sm={6} md={3} key={p.id}>
            <ProductCard product={p} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
