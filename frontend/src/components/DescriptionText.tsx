'use client';
import { Typography } from '@mui/material';
import { notoSans } from '@/fonts';

export default function DescriptionText({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="body1"
      sx={{
        fontFamily: notoSans.style.fontFamily,
        color: 'text.secondary',
        fontWeight: 400,
        fontSize: '1rem',
      }}
      className={notoSans.className}
    >
      {children}
    </Typography>
  );
}
