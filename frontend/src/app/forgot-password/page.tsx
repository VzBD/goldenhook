"use client";
import { Container, Typography, Alert, Box, Button, TextField } from '@mui/material';
import Page from '@/components/layout/Page';
import { useState, useEffect } from 'react';

export default function ForgotPasswordPage() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'ok'|'error'>('idle');
  const [msg, setMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);
  useEffect(()=>{ if (cooldown<=0) return; const id = setInterval(()=>setCooldown(v=>v-1),1000); return ()=>clearInterval(id); },[cooldown]);

  const submit = async ()=>{
    const res = await fetch(`${api}/auth/password/forgot`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (data.ok) { setStatus('ok'); setMsg('Если email существует, мы отправили ссылку.'); setCooldown(60); } else { setStatus('error'); setMsg(data.error||'Ошибка'); }
  };

  return (
    <Page>
      <Container maxWidth="sm" sx={{ py:6 }}>
      <Typography variant="h4" sx={{ mb:2 }}>Восстановление пароля</Typography>
      {status!=='idle' && <Alert severity={status==='ok'?'success':'error'} sx={{ mb:2 }}>{msg}</Alert>}
      <Box sx={{ display:'grid', gap:2 }}>
        <TextField label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Button variant="contained" onClick={submit} disabled={cooldown>0}>Отправить{cooldown>0?` (${cooldown}s)`:''}</Button>
      </Box>
      </Container>
    </Page>
  );
}
