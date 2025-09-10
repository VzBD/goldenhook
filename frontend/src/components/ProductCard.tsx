'use client';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { useState } from 'react';
import QuickViewModal from './QuickViewModal';

type P = { id?: string|number; name: string; price: number; image?: string; oldPrice?: number; description?: string };

export default function ProductCard({ product }: { product: P }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card>
        <CardActionArea onClick={()=>setOpen(true)}>
          <CardMedia component="img" height="160" image={product.image || '/placeholder.png'} alt={product.name} loading="lazy" sizes="(max-width: 600px) 100vw, 33vw" />
          <CardContent>
            <Typography gutterBottom variant="subtitle1" component="div" noWrap>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.price} ₽
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <QuickViewModal open={open} onClose={()=>setOpen(false)} product={product} />
    </>
  );
}
