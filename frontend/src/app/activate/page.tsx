"use client";
import { useSearchParams } from 'next/navigation';
import { Container, Typography, Alert, Box, Button, TextField } from '@mui/material';
import Page from '@/components/layout/Page';
import InputMask from 'react-input-mask';
import { useEffect, useState } from 'react';

export default function ActivatePage() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const sp = useSearchParams();
  const token = sp.get('token');
  const [status, setStatus] = useState<'idle'|'ok'|'error'>('idle');
  const [msg, setMsg] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(()=>{
    if (!token) return;
    (async ()=>{
      const res = await fetch(`${api}/auth/activate/email`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token }) });
      const data = await res.json();
      if (data.ok) { setStatus('ok'); setMsg('Email подтверждён'); } else { setStatus('error'); setMsg(data.error||'Ошибка'); }
    })();
  },[token, api]);

  useEffect(()=>{
    if (cooldown<=0) return; const id = setInterval(()=>setCooldown(v=>v-1),1000); return ()=>clearInterval(id);
  },[cooldown]);

  const submitPhone = async ()=>{
    const res = await fetch(`${api}/auth/activate/phone`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ phone, code }) });
    const data = await res.json();
    if (data.ok) { setStatus('ok'); setMsg('Телефон подтверждён'); } else { setStatus('error'); setMsg(data.error||'Ошибка'); }
  };

  const resendPhone = async ()=>{
    if (cooldown>0) return; await fetch(`${api}/auth/activate/phone/resend`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ phone }) }); setCooldown(60);
  };

  return (
    <Page>
      <Container maxWidth="sm" sx={{ py:6 }}>
      <Typography variant="h4" sx={{ mb:2 }}>Активация</Typography>
      {status!=='idle' && (
        <Alert severity={status==='ok'?'success':'error'} sx={{ mb:2 }}>{msg}</Alert>
      )}
      <Box sx={{ display:'grid', gap:1 }}>
        <InputMask mask="+9 (999) 999-99-99" value={phone} onChange={(e)=>setPhone(e.target.value)}>
          {/* @ts-expect-error mask passes props */}
          {(props) => <TextField {...props} label="Телефон" />}
        </InputMask>
        <TextField label="Код из SMS" value={code} onChange={(e)=>setCode(e.target.value)} />
        <Box sx={{ display:'flex', gap:1 }}>
          <Button variant="contained" onClick={submitPhone}>Подтвердить телефон</Button>
          <Button variant="text" onClick={resendPhone} disabled={cooldown>0}>Отправить код ещё раз{cooldown>0?` (${cooldown}s)`:''}</Button>
        </Box>
      </Box>
      </Container>
    </Page>
  );
}
