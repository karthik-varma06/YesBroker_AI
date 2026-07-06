'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, AlertTriangle, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { UIProperty, UINegotiationRound } from '@/lib/mappers';

type NegotiationResult = {
  propertyPrice: number;
  buyerOffer: number;
  counterOffer: number;
  interestScore: number;
  recommendation: string;
  escalate: boolean;
  aiReason: string;
  accepted?: boolean;
};

type Round = NegotiationResult & { round: number };

export default function NegotiationPage() {
  const [properties, setProperties] = useState<UIProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<UIProperty | null>(null);
  const [buyerOffer, setBuyerOffer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [history, setHistory] = useState<UINegotiationRound[]>([]);

  useEffect(() => {
    fetch('/api/properties', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: UIProperty[]) => {
        if (Array.isArray(d) && d.length) {
          setProperties(d);
          setSelectedProperty(d[0]);
        }
      })
      .catch(() => {});

    fetch('/api/negotiations', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: UINegotiationRound[]) => {
        if (Array.isArray(d)) setHistory(d);
      })
      .catch(() => {});
  }, []);

  const handleNegotiate = async () => {
    if (!selectedProperty || !buyerOffer || isNaN(Number(buyerOffer))) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          propertyPrice: selectedProperty.price,
          minimumPrice: selectedProperty.minimum_price,
          buyerOffer: Number(buyerOffer) * 100_000,
          propertyTitle: selectedProperty.title,
        }),
      });
      const data = await res.json();
      setResult(data);
      setRounds(prev => [{ ...data, round: prev.length + 1 }, ...prev]);
      fetch('/api/negotiations', { cache: 'no-store' })
        .then(r => r.json())
        .then((d: UINegotiationRound[]) => { if (Array.isArray(d)) setHistory(d); });
    } catch {
      alert('Negotiation engine unavailable');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';

  const scoreBg = (score: number) =>
    score >= 80 ? 'bg-emerald-400/10 border-emerald-400/20' : score >= 60 ? 'bg-amber-400/10 border-amber-400/20' : 'bg-red-400/10 border-red-400/20';

  if (!selectedProperty && properties.length === 0) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center text-gray-500">
        Loading properties from Supabase…
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-champagne-400 text-sm font-medium uppercase tracking-widest">Synced with n8n</span>
          <h1 className="text-4xl font-bold text-ivory-100 mt-2 mb-2">Negotiation Engine</h1>
          <p className="text-gray-400">Uses seller_price & minimum_price from Supabase — same logic as voice agent negotiatePrice tool.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="glass rounded-2xl p-5 border border-champagne-500/10">
              <h3 className="text-sm font-medium text-ivory-100 mb-4">Select Property</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {properties.map(p => (
                  <button key={p.id} onClick={() => { setSelectedProperty(p); setResult(null); setBuyerOffer(''); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${selectedProperty?.id === p.id ? 'border-champagne-500 bg-champagne-500/10 text-ivory-100' : 'border-white/5 text-gray-400 hover:border-champagne-500/20 hover:bg-white/3'}`}>
                    <p className="font-medium text-xs">{p.title}</p>
                    <p className="text-champagne-400 text-xs mt-0.5 font-bold">{formatPrice(p.price, p.currency)}</p>
                    {p.minimum_price && <p className="text-gray-500 text-xs">Floor: {formatPrice(p.minimum_price)}</p>}
                  </button>
                ))}
              </div>
            </div>

            {selectedProperty && (
              <div className="glass rounded-2xl p-5 border border-champagne-500/10">
                <h3 className="text-sm font-medium text-ivory-100 mb-4">Buyer&apos;s Offer (Lakhs)</h3>
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1">Listed Price</p>
                  <p className="text-2xl font-bold text-champagne-400">{formatPrice(selectedProperty.price)}</p>
                </div>
                <input
                  type="number"
                  value={buyerOffer}
                  onChange={e => setBuyerOffer(e.target.value)}
                  placeholder={`e.g. ${Math.round(selectedProperty.price / 100_000 * 0.9)}`}
                  className="w-full glass border border-champagne-500/10 focus:border-champagne-500/30 rounded-xl px-4 py-3 text-ivory-100 placeholder-gray-600 outline-none text-sm mb-4"
                />
                <div className="flex gap-2 mb-4 flex-wrap">
                  {[0.95, 0.90, 0.85, 0.80].map(pct => (
                    <button key={pct} onClick={() => setBuyerOffer(String(Math.round(selectedProperty.price / 100_000 * pct)))}
                      className="text-xs glass border border-white/5 hover:border-champagne-500/20 px-3 py-1.5 rounded-lg text-gray-400 hover:text-champagne-400 transition-all">
                      {(pct * 100).toFixed(0)}%
                    </button>
                  ))}
                </div>
                <button onClick={handleNegotiate} disabled={loading || !buyerOffer}
                  className="w-full bg-gradient-to-r from-champagne-600 to-champagne-500 text-obsidian-900 font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40">
                  {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Analyzing...</> : <><Brain className="w-4 h-4" />Negotiate with AI</>}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-5">
            <AnimatePresence>
              {result && selectedProperty && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="glass rounded-2xl p-6 border border-champagne-500/20 mb-5">
                    <div className="flex items-center gap-2 mb-5">
                      <Brain className="w-5 h-5 text-champagne-400" />
                      <h3 className="font-semibold text-ivory-100">AI Negotiation Analysis</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Listed Price', value: result.propertyPrice, color: 'text-ivory-100' },
                        { label: 'Buyer Offer', value: result.buyerOffer, color: 'text-amber-400' },
                        { label: 'AI Counter', value: result.counterOffer, color: 'text-emerald-400' },
                      ].map(item => (
                        <div key={item.label} className="glass rounded-xl p-4 border border-white/5 text-center">
                          <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                          <p className={`font-bold ${item.color} text-sm`}>{formatPrice(item.value)}</p>
                        </div>
                      ))}
                    </div>
                    <div className={`rounded-xl p-4 border ${scoreBg(result.interestScore)} mb-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Buyer Interest Score</span>
                        <span className={`text-2xl font-bold ${scoreColor(result.interestScore)}`}>{result.interestScore}/100</span>
                      </div>
                    </div>
                    <div className="glass rounded-xl p-4 border border-blue-500/10 mb-4">
                      <p className="text-xs text-blue-400 mb-1">AI Recommendation</p>
                      <p className="text-sm text-gray-300">{result.recommendation}</p>
                    </div>
                    <div className="glass rounded-xl p-4 border border-champagne-500/10">
                      <p className="text-xs text-champagne-400 mb-1">Analysis</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{result.aiReason}</p>
                    </div>
                    {result.escalate && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <p className="text-xs text-amber-300">AI recommends escalating to senior agent for this negotiation.</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!result && (
              <div className="glass rounded-2xl p-12 border border-champagne-500/10 text-center">
                <Zap className="w-12 h-12 text-champagne-400/30 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Select a property and enter a buyer offer in Lakhs</p>
              </div>
            )}

            {(rounds.length > 0 || history.length > 0) && (
              <div className="glass rounded-2xl border border-champagne-500/10">
                <div className="px-5 py-4 border-b border-champagne-500/10">
                  <h3 className="text-sm font-medium text-ivory-100">Negotiation Timeline (from Supabase)</h3>
                </div>
                <div className="divide-y divide-champagne-500/5 max-h-64 overflow-y-auto">
                  {(history.length ? history : rounds.map((r, i) => ({
                    id: String(i),
                    buyer_offer: r.buyerOffer,
                    counter_offer: r.counterOffer,
                    buyer_interest_score: r.interestScore,
                    created_at: new Date().toISOString(),
                    lead_phone: '',
                    call_id: '',
                    seller_price: r.propertyPrice,
                    round_number: r.round,
                  }))).slice(0, 10).map((r, i) => (
                    <div key={r.id ?? i} className="px-5 py-4 flex items-center gap-4 text-xs">
                      <div className="w-8 h-8 glass rounded-full flex items-center justify-center font-bold text-champagne-400 border border-champagne-500/20">
                        {r.round_number ?? i + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <div><p className="text-gray-500">Offer</p><p className="text-amber-400 font-medium">{formatPrice(r.buyer_offer)}</p></div>
                        <div><p className="text-gray-500">Counter</p><p className="text-emerald-400 font-medium">{formatPrice(r.counter_offer ?? 0)}</p></div>
                        <div><p className="text-gray-500">Score</p><p className={`font-bold ${scoreColor(r.buyer_interest_score ?? 0)}`}>{r.buyer_interest_score ?? '—'}/100</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
