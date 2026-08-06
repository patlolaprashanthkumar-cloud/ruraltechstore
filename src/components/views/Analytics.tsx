import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Download, Users, FileText, IndianRupee, Award, ArrowUpRight, ArrowDownRight, Calendar, RefreshCw } from 'lucide-react';

type Period = '7d' | '30d' | '90d' | '1y';

const DATA: Record<Period, { revenue: number[]; labels: string[]; applications: number; users: number; services: number; commissions: number }> = {
  '7d': {
    revenue: [4200, 5800, 3900, 7100, 6400, 8200, 9500],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applications: 47, users: 12, services: 156, commissions: 45100,
  },
  '30d': {
    revenue: [38000, 42000, 35000, 51000, 47000, 62000, 58000, 71000, 65000, 80000, 75000, 88000],
    labels: ['W1', 'W1', 'W1', 'W2', 'W2', 'W2', 'W2', 'W3', 'W3', 'W3', 'W4', 'W4'],
    applications: 186, users: 43, services: 612, commissions: 182000,
  },
  '90d': {
    revenue: [120000, 145000, 132000, 168000, 155000, 192000, 178000, 215000, 201000, 238000, 225000, 262000],
    labels: ['Jan W1', 'Jan W2', 'Jan W3', 'Jan W4', 'Feb W1', 'Feb W2', 'Feb W3', 'Feb W4', 'Mar W1', 'Mar W2', 'Mar W3', 'Mar W4'],
    applications: 542, users: 128, services: 1840, commissions: 546000,
  },
  '1y': {
    revenue: [85000, 92000, 78000, 105000, 118000, 134000, 128000, 145000, 152000, 168000, 175000, 195000],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    applications: 2148, users: 487, services: 7320, commissions: 1575000,
  },
};

const TOP_SERVICES = [
  { name: 'Passport Application', category: 'Documentation', count: 342, revenue: 171000, growth: 12.4 },
  { name: 'Aadhaar Update', category: 'Identity', count: 289, revenue: 57800, growth: 8.7 },
  { name: 'Pan Card Services', category: 'Documentation', count: 256, revenue: 76800, growth: -2.1 },
  { name: 'UPI Registration', category: 'Finance', count: 198, revenue: 29700, growth: 24.5 },
  { name: 'Driving Licence', category: 'Transport', count: 167, revenue: 100200, growth: 5.8 },
  { name: 'Birth Certificate', category: 'Civil', count: 145, revenue: 29000, growth: 15.2 },
];

const CATEGORY_BREAKDOWN = [
  { name: 'Documentation', pct: 35, color: 'bg-blue-500' },
  { name: 'Finance', pct: 22, color: 'bg-green-500' },
  { name: 'Healthcare', pct: 18, color: 'bg-red-400' },
  { name: 'Agriculture', pct: 12, color: 'bg-amber-500' },
  { name: 'Education', pct: 8, color: 'bg-purple-500' },
  { name: 'Others', pct: 5, color: 'bg-gray-400' },
];

const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<Period>('30d');
  const d = DATA[period];
  const prevMap: Record<Period, { revenue: number; applications: number; users: number }> = {
    '7d': { revenue: 39000, applications: 41, users: 9 },
    '30d': { revenue: 158000, applications: 162, users: 38 },
    '90d': { revenue: 480000, applications: 498, users: 110 },
    '1y': { revenue: 1320000, applications: 1890, users: 412 },
  };
  const prev = prevMap[period];
  const totalRev = d.revenue.reduce((s, v) => s + v, 0);
  const revChange = (((totalRev - prev.revenue) / prev.revenue) * 100).toFixed(1);
  const appChange = (((d.applications - prev.applications) / prev.applications) * 100).toFixed(1);
  const userChange = (((d.users - prev.users) / prev.users) * 100).toFixed(1);
  const maxRev = Math.max(...d.revenue);

  const exportCSV = () => {
    const rows = [['Period', 'Revenue', 'Applications', 'New Users', 'Commissions'], [period, totalRev, d.applications, d.users, d.commissions]];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `analytics-${period}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const Trend = ({ val }: { val: string }) => {
    const pos = parseFloat(val) >= 0;
    return (
      <span className={`flex items-center gap-0.5 text-xs font-semibold ${pos ? 'text-green-600' : 'text-red-500'}`}>
        {pos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
        {Math.abs(parseFloat(val))}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-500 text-sm mt-0.5">Track performance metrics and business insights</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {(['7d', '30d', '90d', '1y'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${period === p ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: fmt(totalRev), change: revChange, icon: IndianRupee, color: 'green', sub: 'vs prev period' },
          { label: 'Applications', value: d.applications, change: appChange, icon: FileText, color: 'blue', sub: 'vs prev period' },
          { label: 'New Users', value: d.users, change: userChange, icon: Users, color: 'teal', sub: 'vs prev period' },
          { label: 'Commissions', value: fmt(d.commissions), change: '8.3', icon: Award, color: 'amber', sub: 'estimated' },
        ].map(kpi => {
          const Icon = kpi.icon;
          const pos = parseFloat(kpi.change) >= 0;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg bg-${kpi.color}-100 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${kpi.color}-600`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${pos ? 'text-green-600' : 'text-red-500'}`}>
                  {pos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {Math.abs(parseFloat(kpi.change))}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <div>
                <p className="text-sm font-medium text-gray-700">{kpi.label}</p>
                <p className="text-xs text-gray-400">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800">Revenue Trend</h3>
              <p className="text-xs text-gray-400 mt-0.5">Total: {fmt(totalRev)}</p>
            </div>
            <BarChart2 className="w-5 h-5 text-gray-300" />
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {d.revenue.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full">
                  <div
                    style={{ height: `${(v / maxRev) * 128}px` }}
                    className="w-full bg-blue-100 group-hover:bg-blue-200 rounded-t-sm transition-colors relative"
                  >
                    <div
                      style={{ height: `${(v / maxRev) * 128 * 0.7}px` }}
                      className="w-full bg-blue-500 group-hover:bg-blue-600 rounded-t-sm transition-colors absolute bottom-0"
                    />
                  </div>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {fmt(v)}
                  </div>
                </div>
                <span className="text-xs text-gray-400 truncate w-full text-center">{d.labels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {CATEGORY_BREAKDOWN.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{cat.name}</span>
                  <span className="text-gray-500">{cat.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full transition-all`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">Based on service completions</p>
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Top Performing Services</h3>
          <span className="text-xs text-gray-400">Last {period}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Count</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Revenue</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TOP_SERVICES.map((s, i) => (
                <tr key={s.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800 flex items-center gap-2">
                    <span className="w-5 h-5 bg-gray-100 text-gray-500 rounded text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    {s.name}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{s.category}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-800">{s.count}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-800">{fmt(s.revenue)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`flex items-center justify-end gap-0.5 text-xs font-semibold ${s.growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {s.growth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {Math.abs(s.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
