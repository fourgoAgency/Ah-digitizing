"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChange } from '@/lib/firebase';
import { User } from 'firebase/auth';

type CustomUser = { email: string; role: string; id: string } | null;

type AuthContextValue = {
  adminUser: User | null;
  customUser: CustomUser;
  loading: boolean;
  signInCustom: (email: string, password: string) => Promise<{ ok?: boolean; error?: string; role?: string }>;
  signOutCustom: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [customUser, setCustomUser] = useState<CustomUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((u) => {
      setAdminUser(u);
      setLoading(false);
    });
    // check session cookie for custom user
    (async () => {
      try {
        const res = await fetch('/api/auth/session');
        const j = await res.json();
        if (j?.authenticated && j.user) {
          setCustomUser(j.user);
        }
      } catch (e) {
        // ignore
      }
    })();

    return () => unsubscribe();
  }, []);

  async function signInCustom(email: string, password: string) {
    const res = await fetch('/api/auth/firelogin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const j = await res.json();
    if (res.ok && j?.ok) {
      setCustomUser({ email, role: j.role, id: j.id || '' });
      return { ok: true, role: j.role };
    }
    return { error: j?.error || 'Login failed' };
  }

  async function signOutCustom() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCustomUser(null);
  }

  return (
    <AuthContext.Provider value={{ adminUser, customUser, loading, signInCustom, signOutCustom }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
