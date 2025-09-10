import { createTheme } from '@mui/material/styles';
import { brand, radii } from './theme/tokens';
export const createAppTheme = (mode: 'light'|'dark' = 'light') => createTheme({
  palette: {
    mode,
    primary: { main: brand.primary },
    secondary: { main: brand.secondary },
    text: mode === 'light' ? { primary: '#1a1a1a', secondary: '#666' } : { primary: '#fff', secondary: '#bbb' },
    background: mode === 'light' ? { default: brand.background, paper: brand.paper } : { default: '#0c0c0c', paper: '#111' },
    divider: mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'
  },
  typography: {
    fontFamily: 'var(--font-sans), system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h1: { fontFamily: 'var(--font-serif)', fontWeight: 900, letterSpacing: 0.2 },
    h2: { fontFamily: 'var(--font-serif)', fontWeight: 900 },
    h3: { fontFamily: 'var(--font-serif)', fontWeight: 800 },
    h4: { fontWeight: 800 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: radii.md },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.06)',
    '0 2px 6px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.10)',
    '0 6px 16px rgba(0,0,0,0.10)',
    '0 8px 20px rgba(0,0,0,0.12)',
    '0 10px 22px rgba(0,0,0,0.12)',
    '0 12px 24px rgba(0,0,0,0.12)',
    '0 14px 26px rgba(0,0,0,0.12)',
    '0 16px 28px rgba(0,0,0,0.12)',
    '0 18px 30px rgba(0,0,0,0.12)',
    '0 20px 32px rgba(0,0,0,0.12)',
    '0 22px 34px rgba(0,0,0,0.12)',
    '0 24px 36px rgba(0,0,0,0.12)',
    '0 26px 38px rgba(0,0,0,0.12)',
    '0 28px 40px rgba(0,0,0,0.12)',
    '0 30px 42px rgba(0,0,0,0.12)',
    '0 32px 44px rgba(0,0,0,0.12)',
    '0 34px 46px rgba(0,0,0,0.12)',
    '0 36px 48px rgba(0,0,0,0.12)',
    '0 38px 50px rgba(0,0,0,0.12)',
    '0 40px 52px rgba(0,0,0,0.12)',
    '0 42px 54px rgba(0,0,0,0.12)',
    '0 44px 56px rgba(0,0,0,0.12)',
    '0 46px 58px rgba(0,0,0,0.14)',
  ],
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'saturate(180%) blur(6px)',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
        contained: {
          boxShadow: '0 6px 14px rgba(199,160,8,0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform .18s ease, box-shadow .18s ease',
          willChange: 'transform',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#111',
          '&:hover': { color: '#C7A008' },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.14)'
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
  },
});

const theme = createAppTheme('light');
export default theme;
