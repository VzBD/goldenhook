"use client";
import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import NextLink from 'next/link';

export default function Footer() {
  return (
    <Box component="footer" sx={{
      mt: 8,
      pt: 6,
      pb: 4,
      bgcolor: 'linear-gradient(90deg, #111111 0%, #C7A008 100%)',
      color: '#fff',
      boxShadow: '0 -4px 24px rgba(199,160,8,0.12)',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      transition: 'background 0.5s',
    }}>
      <Container maxWidth="lg" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 4 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Golden Hook</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Снасти и экипировка для рыбалки и активного отдыха. Лучшие цены, быстрая доставка.</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>Навигация</Typography>
          <Box sx={{ display: 'grid' }}>
            <MuiLink component={NextLink} href="/catalog" underline="hover" sx={{ color: '#fff', opacity: 0.9, py: 0.5 }}>Каталог</MuiLink>
            <MuiLink component={NextLink} href="/blog" underline="hover" sx={{ color: '#fff', opacity: 0.9, py: 0.5 }}>Блог</MuiLink>
            <MuiLink component={NextLink} href="/account" underline="hover" sx={{ color: '#fff', opacity: 0.9, py: 0.5 }}>Кабинет</MuiLink>
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>Мы в соцсетях</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <MuiLink href="#" underline="hover" sx={{ color: '#fff', opacity: 0.9 }}>Instagram</MuiLink>
            <MuiLink href="#" underline="hover" sx={{ color: '#fff', opacity: 0.9 }}>Facebook</MuiLink>
            <MuiLink href="#" underline="hover" sx={{ color: '#fff', opacity: 0.9 }}>YouTube</MuiLink>
          </Box>
        </Box>
      </Container>
      <Container maxWidth="lg" sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>© {new Date().getFullYear()} Golden Hook</Typography>
      </Container>
    </Box>
  );
}
