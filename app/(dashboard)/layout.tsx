"use client"

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/context/AuthProvider';
import { onAuthStateChange } from '@/lib/firebase';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      if (!authUser) {
        router.push('/login');
        return;
      }

      // Verify admin session cookie on the server
      try {
        const res = await fetch('/api/auth/verify-admin');

        if (!res.ok) {
          // Not an admin - redirect to home
          router.push('/');
          return;
        }

        setIsAdmin(true);
        setLoading(false);
      } catch (error) {
        console.error('Admin verification failed:', error);
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Logining...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-foreground/80">You do not have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
}
