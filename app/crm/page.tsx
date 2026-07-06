'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Calendar, Search, Brain, Star, Clock, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { UILead, UICallLog, UISiteVisit } from '@/lib/mappers';

const STATUS_COLORS: Record<string, string> = {
  hot: 'bg-red-500/10 text-red-400 border-red-500/20',
  warm: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  cold: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  converted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default function CRMPage() {
  const [leads, setLeads] = useState<UILead[]>([]);
  const [callLogs, setCallLogs] = useState<UICallLog[]>([]);
  const [siteVisits, setSiteVisits] = useState<UISiteVisit[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'calls' | 'visits'>('leads');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/leads', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/calls', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/site-visit', { cache: 'no-store' }).then(r => r.json()),
    ])
      .then(([leadsData, callsData, visitsData]) => {
        if (Array.isArray(leadsData)) setLeads(leadsData);
        if (Array.isArray(callsData)) setCallLogs(callsData);
        if (Array.isArray(visitsData)) setSiteVisits(visitsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredLeads = leads.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone_number.includes(search);
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Hot Leads', value: leads.filter(l => l.status === 'hot').length, icon: Star, color: 'text-red-400', bg: 'bg-red-400/10' },
    { label: 'Calls Logged', value: callLogs.length, icon: Phone, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Visits Booked', value: siteVisits.length, icon: Calendar, color: 'text-champagne-400', bg: 'bg-champagne-400/10' },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-champagne-400 text-sm font-medium uppercase tracking-widest">CRM Intelligence</span>
          <h1 className="text-4xl font-bold text-ivory-100 mt-2 mb-2">CRM Dashboard</h1>
          <p className="text-gray-400">Live data from Supabase — populated by your n8n Real Estate Voice Agent Pro workflow.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5 border border-champagne-500/10">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-ivory-100">{s.value}</p>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { key: 'leads', label: 'Leads', count: leads.length },
            { key: 'calls', label: 'Call Logs', count: callLogs.length },
            { key: 'visits', label: 'Site Visits', count: siteVisits.length },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as 'leads' | 'calls' | 'visits')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-champagne-500 text-obsidian-900' : 'glass border border-champagne-500/10 text-gray-400 hover:text-ivory-100'}`}>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-obsidian-900/20' : 'bg-white/10'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {activeTab === 'leads' && (
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
                className="w-full glass border border-champagne-500/10 focus:border-champagne-500/30 rounded-xl pl-10 pr-4 py-2.5 text-ivory-100 placeholder-gray-500 outline-none text-sm" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="glass border border-champagne-500/10 rounded-xl px-4 py-2.5 text-sm text-ivory-100 outline-none bg-transparent">
              {['all', 'hot', 'warm', 'cold', 'converted'].map(s => (
                <option key={s} value={s} className="bg-obsidian-800 capitalize">{s === 'all' ? 'All Status' : s}</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading CRM data from Supabase…</div>
        ) : (
          <>
            {activeTab === 'leads' && (
              <div className="glass rounded-2xl border border-champagne-500/10 overflow-hidden">
                {filteredLeads.length === 0 ? (
                  <p className="text-center py-12 text-gray-500 text-sm">No leads yet — start a voice call to capture leads via n8n.</p>
                ) : (
                  <div className="divide-y divide-champagne-500/5">
                    {filteredLeads.map((lead, i) => (
                      <motion.div key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        className="px-6 py-5 flex items-center gap-4 hover:bg-white/2 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-br from-champagne-500/20 to-champagne-600/20 rounded-full flex items-center justify-center text-champagne-400 font-bold text-sm shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-sm font-semibold text-ivory-100">{lead.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium uppercase ${STATUS_COLORS[lead.status] || STATUS_COLORS.cold}`}>
                              {lead.status}
                            </span>
                            {lead.interest_score > 0 && (
                              <span className="text-xs text-champagne-400">{lead.interest_score}/100</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{lead.phone_number}</p>
                          {lead.next_action && <p className="text-xs text-gray-500 mt-1">{lead.next_action}</p>}
                        </div>
                        <div className="hidden sm:flex flex-col items-end gap-1">
                          <p className="text-xs text-gray-300">{lead.interest}</p>
                          <p className="text-xs text-champagne-400 font-medium">{lead.budget}</p>
                        </div>
                        <div className="text-xs text-gray-500 hidden md:block">{formatDate(lead.created_at)}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calls' && (
              <div className="glass rounded-2xl border border-champagne-500/10 overflow-hidden">
                {callLogs.length === 0 ? (
                  <p className="text-center py-12 text-gray-500 text-sm">No calls logged yet.</p>
                ) : (
                  <div className="divide-y divide-champagne-500/5">
                    {callLogs.map((log, i) => (
                      <motion.div key={log.id ?? log.call_id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                        className="px-6 py-5 hover:bg-white/2 transition-colors">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/10">
                            <Phone className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-ivory-100">
                                {log.customer_name || log.customer_phone || 'Unknown caller'}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 capitalize">{log.call_status}</span>
                                {log.duration_seconds != null && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {Math.floor(log.duration_seconds / 60)}m {log.duration_seconds % 60}s
                                  </span>
                                )}
                              </div>
                            </div>
                            {log.property_queried && (
                              <p className="text-xs text-gray-500 mt-1">Property: {log.property_queried}</p>
                            )}
                          </div>
                        </div>
                        {log.summary && (
                          <div className="ml-13 glass rounded-xl p-3 border border-champagne-500/5">
                            <p className="text-xs text-gray-400 flex items-center gap-1 mb-1.5"><Brain className="w-3 h-3 text-champagne-400" />AI Call Summary</p>
                            <p className="text-xs text-gray-300">{log.summary}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'visits' && (
              <div className="glass rounded-2xl border border-champagne-500/10 overflow-hidden">
                {siteVisits.length === 0 ? (
                  <p className="text-center py-12 text-gray-500 text-sm">No site visits booked yet.</p>
                ) : (
                  <div className="divide-y divide-champagne-500/5">
                    {siteVisits.map((visit, i) => (
                      <motion.div key={visit.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                        className="px-6 py-5 flex items-center gap-4 hover:bg-white/2 transition-colors">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/10">
                          <Calendar className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-sm font-medium text-ivory-100">{visit.lead_name}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium bg-emerald-500/10 text-emerald-400">{visit.status}</span>
                          </div>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{visit.property_address}</p>
                          <p className="text-xs text-gray-500">{visit.phone_number}</p>
                        </div>
                        <div className="text-right text-xs text-gray-400">
                          <p className="text-ivory-100 font-medium">{visit.visit_date}</p>
                          <p>{visit.visit_time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
