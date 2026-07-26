import { useAuth } from '@/context/AuthProvider';

export default function DesignerHeader() {
  const { customUser } = useAuth();
  const displayName = customUser?.email?.split('@')[0] || 'Designer';

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Designer workspace</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Welcome back, {displayName}</h1>
            <p className="mt-1 text-sm text-slate-600">Review assigned orders and keep production moving.</p>
          </div>
          <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            {customUser?.role === 'designer' ? 'Designer' : 'Workspace'}
          </div>
        </div>
      </div>
    </header>
  );
}
