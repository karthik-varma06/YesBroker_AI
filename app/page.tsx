'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Phone, Brain, Zap, BarChart3, MessageSquare, Building2,
  Search, Star, ChevronRight, Users, ArrowRight,
  Sparkles, MapPin
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

import type { UIProperty } from '@/lib/mappers';

type Property = UIProperty;

function PropertyCard({ property, index }: { property: Property; index: number }) {
  const colors = ['from-amber-900/40', 'from-blue-900/40', 'from-emerald-900/40', 'from-violet-900/40', 'from-rose-900/40', 'from-cyan-900/40'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="glass rounded-2xl overflow-hidden group cursor-pointer border border-champagne-500/10 hover:border-champagne-500/30 transition-all duration-300"
    >
      <div className={`relative h-48 bg-gradient-to-br ${colors[index % colors.length]} to-obsidian-800`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="w-16 h-16 text-champagne-500/20" />
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/70 text-xs">
          <MapPin className="w-3 h-3" />
          <span>{property.location}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-ivory-100 text-sm">{property.title}</h3>
          <span className="text-xs text-champagne-400 ml-2 shrink-0">{property.property_type}</span>
        </div>
        {property.payment_plan && <p className="text-gray-500 text-xs mb-3 line-clamp-2">{property.payment_plan}</p>}
        <div className="flex items-center justify-between">
          <p className="text-champagne-400 font-bold">{formatPrice(property.price, property.currency)}</p>
          <Link href={`/property/${property.id}`} className="text-xs bg-champagne-500/10 hover:bg-champagne-500/20 text-champagne-400 px-3 py-1.5 rounded-lg transition-all border border-champagne-500/20">View →</Link>
        </div>
      </div>
    </motion.div>
  );
}

const aiFeatures = [
  { icon: Phone, title: 'AI Voice Agent', description: 'Vapi-powered 24/7 voice AI. Captures leads, answers property queries, books site visits — all hands-free.', href: '/voice-agent', color: 'from-blue-600 to-blue-800' },
  { icon: Search, title: 'AI Property Search', description: 'Gemini + RAG + Qdrant. Natural language: "3BHK under 2M sea view" → exact property matches instantly.', href: '/search', color: 'from-violet-600 to-violet-800' },
  { icon: Zap, title: 'AI Negotiation Engine', description: 'Gemini analyzes market data and buyer psychology to generate optimal counter-offers and close deals faster.', href: '/negotiation', color: 'from-amber-600 to-amber-800' },


];



export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const phrases = [
    'Find a 4BHK villa under 10M...',
    'Show off-plan apartments with 8%+ rental yield...',
    'Luxury penthouse with city views...',
    'Investment property with high ROI...',
  ];

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    let i = 0; setTypedText('');
    const typer = setInterval(() => {
      if (i < phrase.length) { setTypedText(phrase.slice(0, i + 1)); i++; }
      else { clearInterval(typer); setTimeout(() => setPhraseIndex((phraseIndex + 1) % phrases.length), 2500); }
    }, 45);
    return () => clearInterval(typer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phraseIndex]);

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then((d: UIProperty[]) => { if (Array.isArray(d)) setProperties(d.slice(0, 6)); })
      .catch(() => { });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Aurora */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-champagne-500/6 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-champagne-600/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16">
        <div className="max-w-5xl mx-auto text-center z-10">

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-ivory-100">The AI-Powered</span><br />
            <span className="gold-text">Real Estate Agent</span>
          </motion.h1>



          {/* AI Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="relative max-w-3xl mx-auto mb-8">
            <div className="glass-strong rounded-2xl p-2 border border-champagne-500/20 shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-3">
                <Brain className="w-5 h-5 text-champagne-500 shrink-0" />
                <input type="text" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchQuery.trim() && (window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`)}
                  placeholder={typedText || 'Ask AI anything about properties...'}
                  className="flex-1 bg-transparent text-ivory-100 placeholder-gray-500 outline-none text-base" />
                <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="bg-gradient-to-r from-champagne-600 to-champagne-500 text-obsidian-900 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-champagne-500/20">
                  <Search className="w-4 h-4" />Search
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {['4BHK Palm Jumeirah', 'ROI 8%+ Dubai', 'Off-plan Creek Harbour', 'Penthouse DIFC'].map(q => (
                <button key={q} onClick={() => setSearchQuery(q)}
                  className="text-xs text-gray-500 hover:text-champagne-400 bg-white/3 hover:bg-champagne-500/10 border border-white/5 hover:border-champagne-500/20 px-3 py-1.5 rounded-full transition-all">
                  {q}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/voice-agent"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-champagne-600 to-champagne-500 text-obsidian-900 font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-champagne-500/20">
              <Phone className="w-4 h-4" />Start AI Voice Agent<ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/marketplace"
              className="flex items-center justify-center gap-2 px-8 py-4 glass border border-champagne-500/20 text-ivory-100 font-semibold rounded-xl hover:border-champagne-500/40 transition-all">
              <Building2 className="w-4 h-4" />Browse Marketplace
            </Link>
          </motion.div>
        </div>


      </section>



      {/* AI FEATURES */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-champagne-400 text-sm font-medium uppercase tracking-widest">AI-First Platform</span>
            <h2 className="text-4xl font-bold text-ivory-100 mt-3 mb-4">Every feature powered by AI</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Not a portal with AI features. An AI system with a real estate interface.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiFeatures.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <motion.div whileHover={{ scale: 1.02, y: -4 }} className="glass rounded-2xl p-6 border border-champagne-500/10 hover:border-champagne-500/30 transition-all duration-300 group h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-ivory-100 font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{f.description}</p>
                  <Link href={f.href} className="text-champagne-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Explore <ArrowRight className="w-3.5 h-3.5" /></Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-champagne-500/3 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-champagne-400 text-sm font-medium uppercase tracking-widest">Workflow</span>
            <h2 className="text-4xl font-bold text-ivory-100 mt-3">From call to closed deal</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 items-start">
            {[
              { icon: Phone, label: 'Call Comes In', desc: 'Vapi Voice AI answers 24/7' },
              { icon: Brain, label: 'AI Qualifies' },
              { icon: Search, label: 'Property Match' },
              { icon: Zap, label: 'AI Negotiates' },
              { icon: Star, label: 'Deal Closed' },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-2 sm:text-center">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 glass rounded-full flex items-center justify-center border border-champagne-500/20">
                    <step.icon className="w-5 h-5 text-champagne-400" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-champagne-500 rounded-full flex items-center justify-center text-xs font-bold text-obsidian-900">{i + 1}</div>
                </div>
                <div>
                  <p className="text-ivory-100 font-medium text-sm">{step.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES — from Supabase */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-champagne-400 text-sm font-medium uppercase tracking-widest">Marketplace</span>
              <h2 className="text-3xl font-bold text-ivory-100 mt-2">Featured Properties</h2>
            </div>
            <Link href="/marketplace" className="text-champagne-400 text-sm flex items-center gap-1 hover:gap-2 transition-all glass px-4 py-2 rounded-lg border border-champagne-500/20">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {properties.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No properties found. Add properties via Supabase or the n8n workflow.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
            </div>
          )}
        </div>
      </section>






    </div>
  );
}
