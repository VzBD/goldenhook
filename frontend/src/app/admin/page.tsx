"use client";
import { useState } from 'react';
import { useQuery, useMutation } from '@/lib/apollo-hooks';
import { GET_ADMIN_PRODUCTS, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '@/lib/admin-queries';
import { Box, Container, Grid, Paper, Typography, Button, TextField, Divider, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

import Page from '@/components/layout/Page';

export default function AdminPage() {
	const [page, setPage] = useState(1);
	const [q, setQ] = useState('');
	const [editing, setEditing] = useState<{ id?: string; name: string; price: string; image?: string; description?: string } | null>(null);

	const { data, loading, refetch } = useQuery<any>(GET_ADMIN_PRODUCTS, { variables: { page, pageSize: 10, q } });
	const [createProduct] = useMutation(CREATE_PRODUCT, { onCompleted: () => refetch() });
	const [updateProduct] = useMutation(UPDATE_PRODUCT, { onCompleted: () => refetch() });
	const [deleteProduct] = useMutation(DELETE_PRODUCT, { onCompleted: () => refetch() });

	const items = data?.adminProducts?.items ?? [];
	const total = data?.adminProducts?.total ?? 0;
	const pageSize = data?.adminProducts?.pageSize ?? 10;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));

		return (
			<Page>
				<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
				<Typography variant="h4">Админ-панель</Typography>
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Button component={Link} href="/" variant="outlined">На сайт</Button>
					<Button color="secondary" onClick={async ()=>{
						await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
						window.location.href = '/';
					}}>Выйти</Button>
				</Box>
			</Box>

			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>Товары</Typography>
						<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
							<TextField size="small" label="Поиск" fullWidth value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') refetch({ page: 1, pageSize: 10, q }); }} />
							<Button variant="contained" onClick={() => setEditing({ name: '', price: '' })}>Новый товар</Button>
						</Box>
						<Divider sx={{ mb: 2 }} />

						{loading ? (
							<Typography color="text.secondary">Загрузка…</Typography>
						) : (
							<>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell>ID</TableCell>
											<TableCell>Название</TableCell>
											<TableCell>Цена</TableCell>
											<TableCell>Действия</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{items.map((p: any) => (
											<TableRow key={p.id} hover>
												<TableCell>{p.id}</TableCell>
												<TableCell>{p.name}</TableCell>
												<TableCell>{p.price}</TableCell>
												<TableCell>
													<Button size="small" onClick={() => setEditing({ id: String(p.id), name: p.name, price: String(p.price), image: p.image })}>Редакт.</Button>
													<Button size="small" color="error" onClick={() => deleteProduct({ variables: { id: p.id } })}>Удалить</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
									<Pagination count={pageCount} page={page} onChange={(_, v) => { setPage(v); refetch({ page: v, pageSize: 10, q }); }} />
								</Box>
							</>
						)}
					</Paper>
				</Grid>
				<Grid item xs={12} md={4}>
					<Paper sx={{ p: 2, mb: 3 }}>
						<Typography variant="h6" gutterBottom>Заказы</Typography>
						<Typography color="text.secondary">(Заглушка) Список заказов появится позже</Typography>
					</Paper>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>Промо/Новости</Typography>
						<Typography color="text.secondary">(Заглушка) Формы создания промо/новостей добавим после схемы</Typography>
					</Paper>
				</Grid>
			</Grid>

			<Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
				<DialogTitle>{editing?.id ? 'Редактирование товара' : 'Новый товар'}</DialogTitle>
				<DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
					<TextField label="Название" value={editing?.name ?? ''} onChange={(e) => setEditing((s) => ({ ...(s as any), name: e.target.value }))} fullWidth />
					<TextField label="Цена" type="number" value={editing?.price ?? ''} onChange={(e) => setEditing((s) => ({ ...(s as any), price: e.target.value }))} fullWidth />
					<TextField label="Картинка (URL)" value={editing?.image ?? ''} onChange={(e) => setEditing((s) => ({ ...(s as any), image: e.target.value }))} fullWidth />
					<TextField label="Описание" multiline minRows={3} value={editing?.description ?? ''} onChange={(e) => setEditing((s) => ({ ...(s as any), description: e.target.value }))} fullWidth />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditing(null)}>Отмена</Button>
					<Button variant="contained" onClick={async () => {
						if (!editing) return;
						const input = { name: editing.name, price: parseFloat(editing.price || '0'), image: editing.image, description: editing.description ?? '' };
						if (editing.id) await updateProduct({ variables: { id: editing.id, input } });
						else await createProduct({ variables: { input } });
						setEditing(null);
					}}>Сохранить</Button>
				</DialogActions>
			</Dialog>
				</Container>
			</Page>
	);
}
