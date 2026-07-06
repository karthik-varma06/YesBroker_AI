'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { use } from 'react';
import Link from 'next/link';
import { Building2, MapPin, Brain, Phone, Calendar, Star, ChevronLeft, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { UIProperty } from '@/lib/mappers';

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<UIProperty | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'investment' | 'area'>('overview');
  const [visitForm, setVisitForm] = useState({ name: '', phone: '', date: '' });
  const [visitBooked, setVisitBooked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d?.id) setProperty(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const gradients = ['from-amber-900/60', 'from-blue-900/60', 'from-emerald-900/60', 'from-violet-900/60'];
  const gradient = gradients[parseInt(id.replace(/\D/g, '') || '0', 10) % gradients.length];

  const bookVisit = async () => {
    if (!property || !visitForm.name || !visitForm.phone || !visitForm.date) return;
    try {
      await fetch('/api/site-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_name: visitForm.name,
          lead_phone: visitForm.phone,
          property_id: property.id,
          property_address: property.title,
          visit_date: visitForm.date,
          visit_time: '10:00',
          notes: `Site visit for ${property.title}`,
        }),
      });
    } catch { /* non-blocking */ }
    setVisitBooked(true);
  };

  if (loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center text-gray-500">Loading property…</div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-gray-500 gap-4">
        <p>Property not found in Supabase.</p>
        <Link href="/marketplace" className="text-champagne-400 hover:underline">Back to Marketplace</Link>
      </div>
    );
  }

  const amenities = property.amenities.length
    ? property.amenities
    : ['Premium Location', 'Modern Amenities', 'RERA Registered', 'Flexible Payment Plan'];

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <Link href="/marketplace" className="flex items-center gap-2 text-gray-400 hover:text-champagne-400 text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" />Back to Marketplace
        </Link>
      </div>

      <div className={`relative h-96 bg-gradient-to-br ${gradient} to-obsidian-800 mb-8`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="w-32 h-32 text-champagne-500/10" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ivory-100 mb-1">{property.title}</h1>
              <p className="text-gray-300 flex items-center gap-1"><MapPin className="w-4 h-4" />{property.location}</p>
              {property.rera_number && <p className="text-xs text-gray-500 mt-1">RERA: {property.rera_number}</p>}
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-champagne-400">{formatPrice(property.price, property.currency)}</p>
              {property.minimum_price && (
                <p className="text-gray-400 text-sm">Floor: {formatPrice(property.minimum_price)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Type', value: property.property_type },
                { label: 'Status', value: property.availability_status ?? property.status },
                { label: 'Possession', value: property.possession_date ?? 'TBD' },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl p-4 border border-champagne-500/10 text-center">
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-sm font-semibold text-ivory-100 mt-0.5 capitalize">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {[['overview', 'Overview'], ['investment', 'AI Investment'], ['area', 'Details']].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`text-sm px-4 py-2 rounded-xl transition-all ${activeTab === key ? 'bg-champagne-500 text-obsidian-900 font-medium' : 'glass border border-champagne-500/10 text-gray-400'}`}>
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-5">
                <div className="glass rounded-2xl p-6 border border-champagne-500/10">
                  <h3 className="font-semibold text-ivory-100 mb-3">About This Property</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{property.description}</p>
                  {property.payment_plan && (
                    <p className="text-gray-400 text-sm mt-3"><strong className="text-champagne-400">Payment:</strong> {property.payment_plan}</p>
                  )}
                </div>
                <div className="glass rounded-2xl p-6 border border-champagne-500/10">
                  <h3 className="font-semibold text-ivory-100 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {amenities.map(a => (
                      <div key={a} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-champagne-400 rounded-full" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'investment' && (
              <div className="glass rounded-2xl p-6 border border-champagne-500/20">
                <div className="flex items-center gap-2 mb-5">
                  <Brain className="w-5 h-5 text-champagne-400" />
                  <h3 className="font-semibold text-ivory-100">AI Investment Analysis</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">AI Score</p>
                    <p className="text-xl font-bold text-champagne-400">{property.investment_score}/100</p>
                  </div>
                  <div className="glass rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Listed Price</p>
                    <p className="text-xl font-bold text-emerald-400">{formatPrice(property.price)}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'area' && (
              <div className="glass rounded-2xl p-6 border border-champagne-500/10">
                <h3 className="font-semibold text-ivory-100 mb-4">Location — {property.location}</h3>
                {property.locality_advantages && (
                  <p className="text-sm text-gray-300 mb-4">{property.locality_advantages}</p>
                )}
                {property.builder_details && (
                  <p className="text-sm text-gray-400"><strong className="text-ivory-100">Builder:</strong> {property.builder_details}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 border border-champagne-500/20">
              <h3 className="font-semibold text-ivory-100 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-champagne-400" />Book Site Visit</h3>
              {visitBooked ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <Star className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <p className="text-emerald-400 font-medium">Visit Booked!</p>
                  <p className="text-xs text-gray-400 mt-1">Saved to Supabase — n8n will send WhatsApp if configured</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <input placeholder="Full Name" value={visitForm.name} onChange={e => setVisitForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full glass border border-champagne-500/10 rounded-xl px-4 py-2.5 text-ivory-100 placeholder-gray-500 outline-none text-sm" />
                  <input placeholder="Phone Number" value={visitForm.phone} onChange={e => setVisitForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full glass border border-champagne-500/10 rounded-xl px-4 py-2.5 text-ivory-100 placeholder-gray-500 outline-none text-sm" />
                  <input type="date" value={visitForm.date} onChange={e => setVisitForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full glass border border-champagne-500/10 rounded-xl px-4 py-2.5 text-ivory-100 outline-none text-sm [color-scheme:dark]" />
                  <button onClick={bookVisit}
                    className="w-full bg-gradient-to-r from-champagne-600 to-champagne-500 text-obsidian-900 font-bold py-3 rounded-xl hover:opacity-90 transition-all text-sm">
                    Book Site Visit
                  </button>
                </div>
              )}
            </div>

            <div className="glass rounded-2xl p-5 border border-blue-500/20">
              <Phone className="w-4 h-4 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400 mb-4">Ask our Vapi voice agent about this property — same n8n backend.</p>
              <Link href="/voice-agent" className="block text-center bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium py-2.5 rounded-xl">
                Start AI Call
              </Link>
            </div>

            <div className="glass rounded-2xl p-5 border border-champagne-500/20">
              <Zap className="w-4 h-4 text-champagne-400 mb-2" />
              <Link href="/negotiation" className="block text-center bg-champagne-500/10 border border-champagne-500/20 text-champagne-400 text-sm font-medium py-2.5 rounded-xl">
                Negotiate with AI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
