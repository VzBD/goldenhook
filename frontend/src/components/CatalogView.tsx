"use client";
import { useState } from 'react';
import { useQuery } from '@/lib/apollo-hooks';
import { GET_CATALOG } from '@/lib/queries';
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, MenuItem, Pagination, Select, SelectChangeEvent, Stack, TextField, Typography, Skeleton } from '@mui/material';
import ProductCard from './ProductCard';

export default function CatalogView() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [brandsChecked, setBrandsChecked] = useState<string[]>([]);
  const [categoriesChecked, setCategoriesChecked] = useState<string[]>([]);

  const { data, loading, error } = useQuery<any>(GET_CATALOG, {
  variables: { page, pageSize: 12, q: q || undefined, brand: brand || undefined, category: category || undefined, sort: sort || undefined },
  });

  const total = data?.catalog?.total || 0;
  const pageSize = data?.catalog?.pageSize || 12;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Каталог товаров</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField placeholder="Поиск" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} size="small" />
        <Select displayEmpty value={brand} onChange={(e: SelectChangeEvent) => { setBrand(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 160 }}>
          <MenuItem value=""><em>Все бренды</em></MenuItem>
          {(data?.catalog?.brands || []).map((b: string) => (
            <MenuItem key={b} value={b}>{b}</MenuItem>
          ))}
        </Select>
        <Select displayEmpty value={category} onChange={(e: SelectChangeEvent) => { setCategory(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 200 }}>
          <MenuItem value=""><em>Все категории</em></MenuItem>
          {(data?.catalog?.categories || []).map((c: string) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </Select>
        <Select displayEmpty value={sort} onChange={(e: SelectChangeEvent) => { setSort(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 200 }}>
          <MenuItem value=""><em>Сортировка</em></MenuItem>
          <MenuItem value="price_asc">Цена: по возрастанию</MenuItem>
          <MenuItem value="price_desc">Цена: по убыванию</MenuItem>
          <MenuItem value="new">Новинки</MenuItem>
          <MenuItem value="popular">Популярное</MenuItem>
        </Select>
        <Button variant="text" onClick={() => { setQ(''); setBrand(''); setCategory(''); setSort(''); setPage(1); }}>Сбросить фильтры</Button>
      </Stack>

      {loading && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" width={120} height={28} />
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={28} />
                  ))}
                </Stack>
              </Box>
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" width={120} height={28} />
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={28} />
                  ))}
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Skeleton variant="rounded" height={240} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      {error && <Typography color="error">Ошибка загрузки</Typography>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle1">Бренды</Typography>
            <Stack>
              {(data?.catalog?.brands || []).map((b: string) => (
                <FormControlLabel key={b} control={<Checkbox checked={brandsChecked.includes(b)} onChange={(_, ch) => setBrandsChecked((prev) => ch ? [...prev, b] : prev.filter((x) => x !== b))} />} label={b} />
              ))}
            </Stack>
          </Box>
          <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
            <Typography variant="subtitle1">Категории</Typography>
            <Stack>
              {(data?.catalog?.categories || []).map((c: string) => (
                <FormControlLabel key={c} control={<Checkbox checked={categoriesChecked.includes(c)} onChange={(_, ch) => setCategoriesChecked((prev) => ch ? [...prev, c] : prev.filter((x) => x !== c))} />} label={c} />
              ))}
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {(data?.catalog?.items || []).map((p: any) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
      </Box>
    </Container>
  );
}
