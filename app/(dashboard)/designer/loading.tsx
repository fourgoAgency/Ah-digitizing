export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900" />
        <p className="text-sm text-slate-600">Loading designer dashboard...</p>
      </div>
    </div>
  );
}
