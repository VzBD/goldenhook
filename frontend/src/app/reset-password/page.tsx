"use client";
import { useSearchParams } from 'next/navigation';
import { Container, Typography, Alert, Box, Button, TextField } from '@mui/material';
import Page from '@/components/layout/Page';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const sp = useSearchParams();
  const token = sp.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle'|'ok'|'error'>('idle');
  const [msg, setMsg] = useState('');

  const submit = async ()=>{
    if (password.length < 6) { setStatus('error'); setMsg('Минимум 6 символов'); return; }
    if (password !== confirm) { setStatus('error'); setMsg('Пароли не совпадают'); return; }
    const res = await fetch(`${api}/auth/password/reset`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token, newPassword: password }) });
    const data = await res.json();
    if (data.ok) { setStatus('ok'); setMsg('Пароль обновлён'); } else { setStatus('error'); setMsg(data.error||'Ошибка'); }
  };

  return (
    <Page>
      <Container maxWidth="sm" sx={{ py:6 }}>
      <Typography variant="h4" sx={{ mb:2 }}>Сброс пароля</Typography>
      {status!=='idle' && (
        <Alert severity={status==='ok'?'success':'error'} sx={{ mb:2 }}>{msg}</Alert>
      )}
      <Box sx={{ display:'grid', gap:2 }}>
        <TextField label="Новый пароль" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <TextField label="Повторите пароль" type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
        <Button variant="contained" onClick={submit}>Сохранить</Button>
      </Box>
      </Container>
    </Page>
  );
}
