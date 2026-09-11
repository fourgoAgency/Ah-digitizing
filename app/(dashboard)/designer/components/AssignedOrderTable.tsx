
export default function AssignedOrderTable(orders: { id: string; client: string; type: string; status: string; due: string }[]) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-950">Assigned orders</h2>
        <p className="mt-1 text-sm text-slate-600">A simple overview of your active work queue.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order.id} className="text-sm text-slate-700">
                <td className="px-5 py-4 font-medium text-slate-950">{order.id}</td>
                <td className="px-5 py-4">{order.client}</td>
                <td className="px-5 py-4">{order.type}</td>
                <td className="px-5 py-4">{order.status}</td>
                <td className="px-5 py-4">{order.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
