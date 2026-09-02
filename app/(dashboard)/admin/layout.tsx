'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/(dashboard)/Sidebar';


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminSession() {
      try {
        const res = await fetch('/api/auth/session', {
          cache: 'no-store',
          credentials: 'include',
        });
        const data = await res.json();
        
        // Check for admin session or custom admin user
        if (data?.authenticated && data?.user?.role === 'admin') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }
      } catch (err) {
        setIsAuthenticated(false);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAdminSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}