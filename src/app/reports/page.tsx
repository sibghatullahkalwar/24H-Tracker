"use client";

import { useState, useEffect } from 'react';
import { TopAppBar } from '@/components/TopAppBar';
import { BottomNav } from '@/components/BottomNav';
import { formatDuration } from '@/hooks/useTimer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Breakdown = { sectionId: string; name: string; duration: number };
type ReportData = { totalTrackedTime: number; breakdown: Breakdown[] };

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports/today');
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    // Refresh every minute to update active timer stats
    const interval = setInterval(fetchReports, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalFormatted = data ? formatDuration(data.totalTrackedTime) : '0h 0m';

  // Prepare chart data (minutes instead of seconds for better readability)
  const chartData = data?.breakdown.map(b => ({
    name: b.name,
    minutes: Math.round(b.duration / 60)
  })).sort((a, b) => b.minutes - a.minutes) || [];

  const colors = ['#22c55e', '#006e2f', '#4ae176', '#dce5d9'];

  return (
    <div className="pb-28">
      <TopAppBar title="Reports" />
      
      <main className="max-w-md mx-auto px-5 pt-6 space-y-6">
        {/* Daily Summary */}
        <section className="bg-white rounded-[16px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Summary</span>
            <span className="material-symbols-outlined text-green-600">trending_up</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Total Tracked Today</p>
            <h2 className="text-3xl font-bold text-green-700">{loading ? '...' : totalFormatted}</h2>
          </div>
        </section>

        {/* Chart */}
        <section className="bg-white rounded-[16px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100">
          <h3 className="font-semibold text-lg mb-4 text-slate-900">Time Allocation</h3>
          <div className="h-48 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No data for today.
              </div>
            )}
          </div>
        </section>

        {/* Detailed Breakdown List */}
        <section className="space-y-4">
          <h3 className="font-semibold text-lg text-slate-900 px-1">Details</h3>
          {data?.breakdown.map((item, index) => {
            const percentage = data.totalTrackedTime > 0 
              ? Math.round((item.duration / data.totalTrackedTime) * 100) 
              : 0;

            return (
              <div key={item.sectionId} className="bg-white rounded-[16px] p-4 shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-between border border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-700">timer</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-base">{item.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatDuration(item.duration)}</p>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">{percentage}% of total</p>
                </div>
              </div>
            );
          })}
        </section>
      </main>
      
      <BottomNav currentPath="/reports" />
    </div>
  );
}
