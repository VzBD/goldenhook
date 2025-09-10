"use client";
import { Container } from '@mui/material';
export default function Page({ children, maxWidth = 'lg' as const }: { children: React.ReactNode; maxWidth?: 'sm'|'md'|'lg'|'xl'|false }) {
  return <Container maxWidth={maxWidth} sx={{ py: { xs: 2, md: 4 } }}>{children}</Container>;
}
