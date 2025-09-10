"use client";
import { Box, Typography } from '@mui/material';

const banners = [
  { id: 1, title: 'Акции недели', subtitle: 'Скидки до 30% на снасти', img: '/images/fishing-1.jpg' },
  { id: 2, title: 'Новинки', subtitle: 'Летняя коллекция', img: '/images/fishing-2.jpg' },
  { id: 3, title: 'Хиты продаж', subtitle: 'Выбор рыболовов', img: '/images/fishing-3.jpg' },
];

export default function BannerCarousel() {
  return (
    <Box sx={{ overflowX: 'auto', scrollSnapType: 'x mandatory', display: 'flex', gap: 2, pb: 1 }}>
      {banners.map((b) => (
        <Box
          key={b.id}
          sx={{
            position: 'relative',
            minWidth: { xs: '85%', sm: '60%', md: '45%' },
            height: 220,
            borderRadius: 2,
            overflow: 'hidden',
            color: '#fff',
            scrollSnapAlign: 'start',
            background: `#0b0b0b url(${b.img}) center/cover no-repeat`,
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55))' }} />
          <Box sx={{ position: 'absolute', left: 16, bottom: 16, right: 16 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1, letterSpacing: 0.2 }}>{b.title}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.95, mt: 0.5 }}>{b.subtitle}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
