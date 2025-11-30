"use client";
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';

const items = [
  { title: 'Электроника' },
  { title: 'Одежда и обувь' },
  { title: 'Дом и интерьер' },
  { title: 'Красота и здоровье' },
  { title: 'Детские товары' },
  { title: 'Спорт и отдых' },
  { title: 'Автотовары' },
  { title: 'Аксессуары' },
];

export default function PopularCategories() {
  return (
    <Grid container spacing={2} columns={{ xs: 2, sm: 8, md: 12 }}>
      {items.map((it) => (
        <Grid key={it.title} xs={2} sm={4} md={3}>
          <Card>
            <CardActionArea>
              <CardContent>
                <Typography align="center">{it.title}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
