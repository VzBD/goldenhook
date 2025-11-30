"use client";
import { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Alert, Link } from '@mui/material';
import Page from '@/components/layout/Page';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    setError(null); setOk(false);
    try {
      const res = await fetch(`${api}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Ошибка входа');
        return;
      }
      setOk(true);
      window.location.href = '/account';
    } catch (e: any) {
      setError('Сеть недоступна');
    }
  };

  return (
    <Page>
      <Container maxWidth="sm" sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
      }}>
        <Box sx={{
          width: '100%',
          bgcolor: 'rgba(255,255,255,0.85)',
          boxShadow: '0 8px 32px rgba(199,160,8,0.10)',
          borderRadius: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h4" sx={{ mb: 3, fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#C7A008' }}>Вход</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {ok && <Alert severity="success" sx={{ mb: 2 }}>Успешно</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2, width: '100%' }}>
            <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} sx={{ borderRadius: 4, fontFamily: 'Inter, Roboto, Arial, sans-serif' }} />
            <TextField label="Пароль" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} sx={{ borderRadius: 4, fontFamily: 'Inter, Roboto, Arial, sans-serif' }} />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(199,160,8,0.18)',
              background: 'linear-gradient(90deg, #C7A008 0%, #fffbe5 100%)',
              color: '#111',
              '&:hover': {
                background: 'linear-gradient(90deg, #fffbe5 0%, #C7A008 100%)',
                boxShadow: '0 6px 24px rgba(199,160,8,0.22)',
              },
            }}>Войти</Button>
            <Button variant="outlined" color="secondary" href={(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/auth/google'} sx={{
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 8,
              borderColor: '#C7A008',
              color: '#C7A008',
              background: 'linear-gradient(90deg, #fffbe5 0%, #fff 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #fffbe5 0%, #C7A008 100%)',
                color: '#111',
                borderColor: '#C7A008',
              },
            }}>
              Войти через Google
            </Button>
            <Link href="/reset-password" underline="hover" sx={{ color: '#C7A008', fontWeight: 600, textAlign: 'center' }}>Забыли пароль?</Link>
          </Box>
        </Box>
      </Container>
    </Page>
  );
}
