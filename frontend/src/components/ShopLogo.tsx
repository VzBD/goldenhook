'use client';
import Image from 'next/image';
import { Box } from '@mui/material';

export default function ShopLogo({ size = 120 }: { size?: number }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
      <Image
        src="/golden-hook-logo.png"
        alt="Golden Hook Logo"
        width={size}
        height={size}
        priority
        style={{ borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
      />
    </Box>
  );
}
