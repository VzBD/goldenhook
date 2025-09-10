"use client";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@/theme';

type Mode = 'light'|'dark';
const Ctx = createContext<{mode: Mode; toggle: ()=>void}>({ mode: 'light', toggle: ()=>{} });

export function ThemeModeProvider({ children, initialMode }: { children: React.ReactNode; initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode ?? 'light');
  // hydrate from localStorage or system preference on client only
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('theme-mode') as Mode | null;
      if (saved === 'light' || saved === 'dark') {
        setMode(saved);
        return;
      }
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    } catch { /* noop */ }
  }, []);
  const theme = useMemo(()=>createAppTheme(mode), [mode]);
  const toggle = ()=> setMode(m=> {
    const next = m==='light'?'dark':'light';
    try { window.localStorage.setItem('theme-mode', next); } catch {}
    // notify server to set httpOnly cookie for SSR
    try { fetch('/api/theme', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: next }) }).catch(()=>{}); } catch {}
    return next;
  });
  return (
    <Ctx.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Ctx.Provider>
  );
}

export const useThemeMode = ()=> useContext(Ctx);