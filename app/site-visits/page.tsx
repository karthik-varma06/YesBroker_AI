'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import type { UISiteVisit } from '@/lib/mappers';

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  confirmed: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', label: 'Confirmed' },
  booked: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', label: 'Booked' },
  pending: { color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', label: 'Pending' },
  completed: { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', label: 'Completed' },
  cancelled: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', label: 'Cancelled' },
};

export default function SiteVisitsPage() {
  const [visits, setVisits] = useState<UISiteVisit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVisits = () => {
    setLoading(true);
    fetch('/api/site-visit', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setVisits(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadVisits(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    await fetch('/api/site-visit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
  };

  const upcoming = visits.filter(v => ['confirmed', 'pending', 'booked'].includes(v.status));
  const completed = visits.filter(v => v.status === 'completed');
  const cancelled = visits.filter(v => v.status === 'cancelled');

  const VisitCard = ({ visit }: { visit: UISiteVisit }) => {
    const cfg = STATUS_CONFIG[visit.status] || STATUS_CONFIG.pending;
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5 border border-champagne-500/10 hover:border-champagne-500/20 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-semibold text-ivory-100">{visit.lead_name}</p>
            {visit.phone_number && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{visit.phone_number}</p>
            )}
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="w-4 h-4 text-champagne-400 shrink-0" />{visit.property_address}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4 text-champagne-400 shrink-0" />{visit.visit_date}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock className="w-4 h-4 text-champagne-400 shrink-0" />{visit.visit_time}
          </div>
          <p className="text-xs text-gray-600">Source: {visit.source}</p>
        </div>
        {['confirmed', 'pending', 'booked'].includes(visit.status) && (
          <div className="flex gap-2">
            {visit.status === 'pending' && (
              <button onClick={() => updateStatus(visit.id, 'confirmed')}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-2 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" />Confirm
              </button>
            )}
            {visit.status === 'confirmed' && (
              <button onClick={() => updateStatus(visit.id, 'completed')}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 py-2 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" />Mark Done
              </button>
            )}
            <button onClick={() => updateStatus(visit.id, 'cancelled')}
              className="px-3 text-xs text-gray-400 hover:text-red-400 glass border border-white/5 py-2 rounded-lg">
              <XCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-champagne-400 text-sm font-medium uppercase tracking-widest">Booking Management</span>
            <h1 className="text-4xl font-bold text-ivory-100 mt-2 mb-2">Site Visit Dashboard</h1>
            <p className="text-gray-400">From n8n bookSiteVisit tool, call_analytics.visit_booked, and frontend bookings.</p>
          </div>
          <button onClick={loadVisits} className="text-gray-400 hover:text-champagne-400 p-2">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </motion.div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Upcoming', value: upcoming.length, color: 'text-champagne-400' },
            { label: 'Completed', value: completed.length, color: 'text-blue-400' },
            { label: 'Cancelled', value: cancelled.length, color: 'text-red-400' },
            { label: 'Total', value: visits.length, color: 'text-ivory-100' },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4 border border-champagne-500/10 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading visits from Supabase…</div>
        ) : visits.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No site visits yet. Book via voice agent or property pages.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-ivory-100 mb-4">Upcoming Visits</h2>
              <div className="space-y-4">
                {upcoming.map(v => <VisitCard key={v.id} visit={v} />)}
                {upcoming.length === 0 && <p className="text-gray-500 text-sm">No upcoming visits.</p>}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ivory-100 mb-4">Past Visits</h2>
              <div className="space-y-4">
                {[...completed, ...cancelled].map(v => <VisitCard key={v.id} visit={v} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
