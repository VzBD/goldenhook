'use client';
import { Typography } from '@mui/material';
import { playfair } from '@/fonts';

export default function Logo() {
  return (
    <Typography
      variant="h5"
      component="span"
      sx={{
        fontFamily: playfair.style.fontFamily,
        fontWeight: 700,
        color: 'secondary.main',
        letterSpacing: 2,
        textShadow: '0 2px 8px rgba(0,0,0,0.15)',
        cursor: 'pointer',
      }}
      className={playfair.className}
    >
      Golden Hook
    </Typography>
  );
}
