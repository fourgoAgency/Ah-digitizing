'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthProvider';

function DesignerGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { adminUser, customUser, loading, customLoading } = useAuth();

  useEffect(() => {
    if (loading || customLoading) return;

    const role = customUser?.role;
    const isDesigner = role === 'designer';
    const isAdmin = Boolean(adminUser);

    if (!isDesigner && !isAdmin) {
      router.replace('/login');
    }
  }, [adminUser, customLoading, customUser?.role, loading, router]);

  if (loading || customLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900" />
          <p className="text-sm text-slate-600">Loading designer dashboard...</p>
        </div>
      </div>
    );
  }

  if (!customUser?.role && !adminUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900" />
          <p className="text-sm text-slate-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function DesignerLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DesignerGate>{children}</DesignerGate>
    </AuthProvider>
  );
}
