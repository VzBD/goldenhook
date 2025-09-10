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
      <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Вход</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {ok && <Alert severity="success" sx={{ mb: 2 }}>Успешно</Alert>}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        <TextField label="Пароль" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
        <Button type="submit" variant="contained" disabled={isSubmitting}>Войти</Button>
        <Button variant="outlined" color="secondary" href={(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/auth/google'}>
          Войти через Google
        </Button>
        <Link href="/reset-password" underline="hover">Забыли пароль?</Link>
      </Box>
      </Container>
    </Page>
  );
}
