"use client";
import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import Page from '@/components/layout/Page';

export default function AccountPage() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [me, setMe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${api}/auth/me`, { credentials: 'include' });
        const data = await res.json();
        setMe(data);
      } catch (e) {
        setError('Сеть недоступна');
      }
    })();
  }, [api]);

  return (
    <Page>
      <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Кабинет</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {me?.authenticated ? (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Typography>Email: {me.user.email}</Typography>
          <Typography>Роль: {me.user.role}</Typography>
          {!me.user.isActive && <Alert severity="warning">Аккаунт не подтверждён. Проверьте email/SMS или перейдите на страницу активации.</Alert>}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" href="/">На главную</Button>
            <Button color="secondary" onClick={async ()=>{
              await fetch(`${api}/auth/logout`, { method: 'POST', credentials: 'include' });
              window.location.href = '/';
            }}>Выйти</Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Typography>Вы не авторизованы.</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" href="/login">Войти</Button>
            <Button variant="outlined" href="/register">Регистрация</Button>
          </Box>
        </Box>
      )}
      </Container>
    </Page>
  );
}
