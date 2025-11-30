"use client";
import { AppBar, Box, Toolbar, Container, Button, Popover, Grid, Typography, Divider, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import Link from 'next/link';
import Logo from './Logo';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { useQuery } from '@/lib/apollo-hooks';
import { GET_CATEGORIES } from '@/lib/queries';
import { useThemeMode } from '@/contexts/ThemeModeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const catalogItems = [
  'Электроника','Одежда и обувь','Дом и интерьер','Красота и здоровье','Детские товары','Спорт и отдых','Автотовары','Аксессуары'
];

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const [q, setQ] = useState('');
  const router = useRouter();
  const { data } = useQuery<any>(GET_CATEGORIES);
  const categories: string[] = data?.catalog?.categories ?? [];
  const { mode, toggle } = useThemeMode();
  return (
    <AppBar position="sticky" color="inherit" elevation={3} sx={{
      borderBottom: '1px solid #eee',
      backdropFilter: 'saturate(180%) blur(6px)',
      bgcolor: 'linear-gradient(90deg, #f7f6f2 0%, #fffbe5 100%)',
      boxShadow: '0 4px 24px rgba(199,160,8,0.08)',
      transition: 'background 0.5s',
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }} aria-label="На главную">
              <Logo />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'nowrap' }}>
            <Button component={Link} href="/" color="primary">Главная</Button>
            <Button
              color="primary"
              onMouseEnter={handleOpen}
              onClick={handleOpen}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >Каталог</Button>
            <TextField
              size="small"
              placeholder="Поиск..."
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==='Enter'){ router.push(`/catalog?q=${encodeURIComponent(q)}`); } }}
              sx={{ minWidth: 220, display: { xs: 'none', md: 'inline-flex' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="Поиск" onClick={()=>router.push(`/catalog?q=${encodeURIComponent(q)}`)}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button component={Link} href="/blog" color="primary">Блог</Button>
            <Button component={Link} href="/account" color="primary">Кабинет</Button>
            <Button component={Link} href="/login" color="primary">Вход</Button>
            <Button component={Link} href="/register" color="primary">Регистрация</Button>
            <Button component={Link} href="/cart" color="primary">Корзина</Button>
            <Tooltip title={mode==='light' ? 'Тёмная тема' : 'Светлая тема'}>
              <IconButton aria-label="Переключить тему" onClick={toggle} color="primary">
                {mode==='light' ? <DarkModeIcon/> : <LightModeIcon/>}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { onMouseLeave: handleClose } as any }}
      >
        <Box sx={{ p: 2, width: { xs: 300, sm: 540 } }}>
          <Typography variant="subtitle2" sx={{ px: 1, pb: 1, color: 'text.secondary' }}>Категории</Typography>
          <Divider sx={{ mb: 1 }} />
          <Grid container spacing={1} columns={{ xs: 6, sm: 12 }}>
            {(categories.length?categories:catalogItems).map((t) => (
              <Grid key={t} xs={6} sm={4}>
                <Button component={Link} href={`/catalog?cat=${encodeURIComponent(t)}`} color="inherit" sx={{ justifyContent: 'flex-start', textTransform: 'none', width: '100%' }}>
                  {t}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </AppBar>
  );
}
