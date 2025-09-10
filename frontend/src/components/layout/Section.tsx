"use client";
import { Box, Typography } from '@mui/material';
export default function Section({ title, children, mb = 3 }: { title?: string; children: React.ReactNode; mb?: number }) {
  return (
    <Box sx={{ mb }}>
      {title ? <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography> : null}
      {children}
    </Box>
  );
}
