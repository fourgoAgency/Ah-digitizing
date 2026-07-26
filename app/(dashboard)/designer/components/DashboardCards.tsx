const cards = [
  { label: 'Assigned orders', value: '12', note: '3 due today' },
  { label: 'In progress', value: '7', note: '2 awaiting review' },
  { label: 'Completed', value: '28', note: 'This month' },
];

export default function DashboardCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <span className="text-3xl font-bold text-slate-950">{card.value}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{card.note}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
