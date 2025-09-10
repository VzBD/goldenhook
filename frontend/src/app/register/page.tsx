"use client";
import { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';
import Page from '@/components/layout/Page';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';

const schema = z.object({
  email: z.string().email('Некорректный email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Минимум 6 символов'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((v) => v - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    setError(null); setOk(false);
    try {
      const res = await fetch(`${api}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Ошибка регистрации');
        return;
      }
      setOk(true);
    } catch {
      setError('Сеть недоступна');
    }
  };

  const resendEmail = async () => {
    if (cooldown > 0) return;
    const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value;
    if (!email) return;
    await fetch(`${api}/auth/activate/email/resend`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    setCooldown(60);
  };

  const resendPhone = async () => {
    if (cooldown > 0) return;
    const phone = (document.querySelector('input[name="phone"]') as HTMLInputElement)?.value;
    if (!phone) return;
    await fetch(`${api}/auth/activate/phone/resend`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
    setCooldown(60);
  };

  return (
    <Page>
      <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Регистрация</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {ok && <Alert severity="success" sx={{ mb: 2 }}>Аккаунт создан. Проверьте email/SMS для активации.</Alert>}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        <InputMask mask="+9 (999) 999-99-99" onChange={(e) => setValue('phone', e.target.value)}>
          {/* @ts-expect-error mask passes props */}
          {(props) => <TextField {...props} name="phone" label="Телефон (опционально)" error={!!errors.phone} helperText={errors.phone?.message} />}
        </InputMask>
        <TextField label="Пароль" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
        <Button type="submit" variant="contained" disabled={isSubmitting}>Зарегистрироваться</Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="text" onClick={resendEmail} disabled={cooldown>0}>Отправить письмо ещё раз{cooldown>0?` (${cooldown}s)`:''}</Button>
          <Button variant="text" onClick={resendPhone} disabled={cooldown>0}>Отправить SMS ещё раз{cooldown>0?` (${cooldown}s)`:''}</Button>
        </Box>
      </Box>
      </Container>
    </Page>
  );
}
