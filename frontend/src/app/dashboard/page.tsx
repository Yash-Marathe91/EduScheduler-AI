export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-slate-500 mt-2">
          Overview of your institution's academic scheduling and operations.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder cards to fulfill the "wowed" minimal UI requirement */}
        {[
          { label: 'Total Faculty', value: '142', change: '+4 this month' },
          { label: 'Active Departments', value: '8', change: 'Stable' },
          { label: 'Schedules Generated', value: '24', change: '+12% from last term' },
          { label: 'System Health', value: '99.9%', change: 'All systems operational' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
