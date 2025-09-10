"use client";
import { Dialog, DialogContent, DialogTitle, Box, Typography, Button, Stack } from '@mui/material';

export default function QuickViewModal({ open, onClose, product }: { open: boolean; onClose: ()=>void; product: any }) {
  if (!product) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product.name}</DialogTitle>
      <DialogContent>
        <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
          <Box component="img" src={product.image||'/placeholder.png'} alt={product.name} sx={{ width: { xs:'100%', md: 260 }, borderRadius: 1, objectFit: 'cover' }} />
          <Box sx={{ flex:1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>{product.price} ₽</Typography>
            {product.oldPrice && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration:'line-through' }}>{product.oldPrice} ₽</Typography>
            )}
            <Typography variant="body2" sx={{ mt: 1 }}>{product.description?.slice(0,180)}{product.description?.length>180?'…':''}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained" href={`/product/${product.id}`}>Подробнее</Button>
              <Button variant="outlined">В корзину</Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}