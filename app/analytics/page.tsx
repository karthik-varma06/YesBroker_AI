'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Phone, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type AnalyticsData = {
  totalLeads: number;
  totalCalls: number;
  totalVisits: number;
  totalProperties: number;
  hotLeads: number;
  conversions: number;
  revenue: number;
  sentiment: { positive: number; neutral: number; negative: number };
  funnel: { calls: number; leads: number; visits: number; offers: number; deals: number };
  monthlyTrend: { month: string; leads: number; calls: number }[];
  propertyPerformance: { name: string; inquiries: number; visits: number; deals: number }[];
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 border border-champagne-500/20 text-xs">
      <p className="text-champagne-400 font-medium mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setMetrics(d))
      .catch(() => setMetrics(null))
      .finally(() => setLoading(false));
  }, []);

  const m = metrics ?? {
    totalLeads: 0, totalCalls: 0, totalVisits: 0, totalProperties: 0,
    hotLeads: 0, conversions: 0, revenue: 0,
    sentiment: { positive: 0, neutral: 0, negative: 0 },
    funnel: { calls: 0, leads: 0, visits: 0, offers: 0, deals: 0 },
    monthlyTrend: [], propertyPerformance: [],
  };

  const sentimentData = [
    { name: 'Positive', value: m.sentiment.positive || 1, color: '#10b981' },
    { name: 'Neutral', value: m.sentiment.neutral || 1, color: '#D4AF37' },
    { name: 'Negative', value: m.sentiment.negative || 1, color: '#ef4444' },
  ];

  const funnelData = [
    { stage: 'Calls', value: m.funnel.calls },
    { stage: 'Leads', value: m.funnel.leads },
    { stage: 'Visits', value: m.funnel.visits },
    { stage: 'Offers', value: m.funnel.offers },
    { stage: 'Deals', value: m.funnel.deals },
  ];

  const kpis = [
    { label: 'Total Leads', value: m.totalLeads.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'AI Calls', value: m.totalCalls.toLocaleString(), icon: Phone, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Site Visits', value: m.totalVisits.toLocaleString(), icon: Calendar, color: 'text-champagne-400', bg: 'bg-champagne-400/10' },
    { label: 'Deal Value', value: m.revenue > 0 ? formatPrice(m.revenue) : '—', icon: DollarSign, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-champagne-400 text-sm font-medium uppercase tracking-widest">Real-Time Intelligence</span>
          <h1 className="text-4xl font-bold text-ivory-100 mt-2 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Live from call_logs · call_analytics · leads · negotiation_logs</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading analytics…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {kpis.map((kpi, i) => (
                <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-5 border border-champagne-500/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                    {m.hotLeads > 0 && kpi.label === 'Total Leads' && (
                      <span className="text-xs text-emerald-400 flex items-center gap-0.5 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        <ArrowUpRight className="w-3 h-3" />{m.hotLeads} hot
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-ivory-100">{kpi.value}</p>
                  <p className="text-gray-400 text-sm mt-0.5">{kpi.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 glass rounded-2xl p-6 border border-champagne-500/10">
                <h3 className="text-sm font-medium text-ivory-100 mb-5">Lead & Call Trends</h3>
                {m.monthlyTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={m.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="leads" stroke="#D4AF37" fill="#D4AF3733" strokeWidth={2} name="Leads" />
                      <Area type="monotone" dataKey="calls" stroke="#60a5fa" fill="#60a5fa33" strokeWidth={2} name="Calls" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-sm py-16 text-center">Trend data appears after your first voice calls.</p>
                )}
              </div>

              <div className="glass rounded-2xl p-6 border border-champagne-500/10">
                <h3 className="text-sm font-medium text-ivory-100 mb-5">Call Sentiment</h3>
                <div className="flex justify-center mb-4">
                  <PieChart width={160} height={160}>
                    <Pie data={sentimentData} cx={75} cy={75} innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                      {sentimentData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
                <div className="space-y-2">
                  {sentimentData.map(s => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        <span className="text-gray-400">{s.name}</span>
                      </div>
                      <span className="font-medium text-ivory-100">{m.totalCalls > 0 ? `${s.value}%` : '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 border border-champagne-500/10">
                <h3 className="text-sm font-medium text-ivory-100 mb-5">Property Performance</h3>
                {m.propertyPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={m.propertyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="inquiries" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Inquiries" />
                      <Bar dataKey="visits" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Visits" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-sm py-16 text-center">Add properties in Supabase to see performance.</p>
                )}
              </div>

              <div className="glass rounded-2xl p-6 border border-champagne-500/10">
                <h3 className="text-sm font-medium text-ivory-100 mb-5">Conversion Funnel</h3>
                <div className="space-y-3">
                  {funnelData.map((item, i) => {
                    const pct = funnelData[0].value > 0 ? (item.value / funnelData[0].value) * 100 : 0;
                    return (
                      <div key={item.stage}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-400">{item.stage}</span>
                          <span className="text-ivory-100 font-medium">{item.value.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.15 }}
                            className="h-2 rounded-full bg-gradient-to-r from-champagne-600 to-champagne-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
