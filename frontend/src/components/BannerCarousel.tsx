"use client";
import { Box, Typography } from '@mui/material';

const banners = [
  { id: 1, title: 'Лучшие предложения', subtitle: 'Скидки до 30% на популярные товары', img: '/images/promo-1.jpg' },
  { id: 2, title: 'Новинки', subtitle: 'Свежие поступления для вашего дома и семьи', img: '/images/promo-2.jpg' },
  { id: 3, title: 'Хиты продаж', subtitle: 'Топовые товары сезона', img: '/images/promo-3.jpg' },
];

export default function BannerCarousel() {
  return (
    <Box sx={{
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      display: 'flex',
      gap: 2,
      pb: 1,
      position: 'relative',
      minHeight: 240,
      background: 'linear-gradient(120deg, #f5f7fa 0%, #e9ecef 100%)',
        borderRadius: 4,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      {banners.map((b) => (
        <Box
          key={b.id}
          sx={{
            position: 'relative',
            minWidth: { xs: '85%', sm: '60%', md: '45%' },
            height: 220,
              borderRadius: 4,
            overflow: 'hidden',
            color: '#fff',
            scrollSnapAlign: 'start',
            background: `linear-gradient(120deg, #e8e5c6 0%, #b7d3a6 100%), url(${b.img}) center/cover no-repeat`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            border: '2px solid #b7d3a6',
            fontFamily: 'Playfair Display, serif',
            animation: 'fadeIn 0.8s',
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55))' }} />
          <Box sx={{ position: 'absolute', left: 24, bottom: 24, right: 24 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, letterSpacing: 0.2, color: '#2d3a1a', textShadow: '0 2px 8px #fff' }}>{b.title}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.98, mt: 0.5, fontWeight: 600, color: '#3e4c2a', textShadow: '0 1px 4px #fff' }}>{b.subtitle}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
