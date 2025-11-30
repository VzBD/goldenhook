'use client';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Button, Chip, Stack, useTheme } from '@mui/material';
import styles from './ProductCard.module.css';
import { useState } from 'react';
import QuickViewModal from './QuickViewModal';

type P = {
  id?: string|number;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  images?: string[];
  description?: string;
  color?: string;
  model?: string;
  inStock?: boolean;
  badges?: string[];
};

export default function ProductCard({ product }: { product: P }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  return (
    <>
      <Card sx={{
        borderRadius: 8,
        boxShadow: '0 4px 24px rgba(40,40,40,0.18)',
        border: '2px solid #23272f',
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: '0 12px 40px rgba(40,40,40,0.28)',
        },
        p: 2,
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ minWidth: 120, maxWidth: 140 }}>
            <CardMedia
              component="img"
              height="140"
              image={product.image || '/placeholder.png'}
              alt={product.name}
              loading="lazy"
              sx={{ borderRadius: 4, objectFit: 'contain', bgcolor: '#181a20', p: 1 }}
            />
            {product.images && product.images.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'center' }}>
                {product.images.map((img, idx) => (
                  <Box key={idx} sx={{ width: 32, height: 32, borderRadius: 2, overflow: 'hidden', border: '1px solid #31343b', bgcolor: '#23272f' }}>
                    <img src={img} alt={product.name + idx} className={styles.productImgThumb} />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
          <Box sx={{ flex: 1, pl: 2 }}>
            <Typography gutterBottom variant="h6" component="div" noWrap sx={{ fontWeight: 900, fontFamily: 'Inter, Roboto, Arial, sans-serif', color: theme.palette.text.primary }}>
              {product.name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {product.badges?.map((badge, idx) => (
                <Chip key={idx} label={badge} color="warning" size="small" sx={{ fontWeight: 700 }} />
              ))}
              {product.inStock && <Chip label="В наличии" color="success" size="small" />}
            </Stack>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>{product.description}</Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              {product.color && <Chip label={product.color} size="small" />}
              {product.model && <Chip label={product.model} size="small" />}
            </Stack>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.mode === 'dark' ? '#ff9800' : '#c77600' }}>{product.price} ₽</Typography>
            {product.oldPrice && (
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: theme.palette.text.secondary, fontWeight: 600 }}>{product.oldPrice} ₽</Typography>
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
        </Box>
      </Card>
      <QuickViewModal open={open} onClose={()=>setOpen(false)} product={product} />
    </>
  );
}
