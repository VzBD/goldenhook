"use client";
import { ApolloProvider } from '@apollo/client/react';
import client from '../lib/apollo-client';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeModeProvider } from '@/contexts/ThemeModeContext';

export default function Providers({ children, initialTheme }: { children: React.ReactNode; initialTheme?: 'light'|'dark' }) {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
  <ThemeModeProvider initialMode={initialTheme}>
          {children}
        </ThemeModeProvider>
      </CartProvider>
    </ApolloProvider>
  );
}
