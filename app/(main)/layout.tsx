import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartSidebarProvider } from '@/components/shop/CartSidebarContext';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <CartSidebarProvider>
      <Header />
      {children}
      <Footer />
    </CartSidebarProvider>
  );
}
