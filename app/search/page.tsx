'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Brain, Send, Building2, MapPin, TrendingUp, Sparkles, Mic, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const SUGGESTED = [
  'Find a 3BHK in Dubai Marina under AED 3M',
  'Show me off-plan apartments with rental yield above 8%',
  'Luxury penthouse with Burj Khalifa views',
  'Best investment properties in Downtown Dubai',
  'Villa with private pool in Palm Jumeirah',
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [messages, setMessages] = useState<{ role: 'user'|'ai'; content: string; properties?: any[] }[]>([]);
  const [input, setInput] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (initialQ) {
      setInput('');
      handleSearch(initialQ);
    }
  }, []);

  async function handleSearch(query: string) {
    if (!query.trim() || loading) return;
    const userMsg = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.answer, properties: data.properties }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, AI search is unavailable. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-20 flex flex-col max-w-4xl mx-auto px-4 pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-8 text-center">
        <h1 className="text-4xl font-bold text-ivory-100 mb-2">AI Property Discovery</h1>
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass rounded-2xl p-8 border border-champagne-500/10 text-center">
              <Sparkles className="w-12 h-12 text-champagne-400 mx-auto mb-4" />
              <h3 className="text-ivory-100 font-semibold mb-2">Ask me anything about properties</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => handleSearch(s)}
                  className="glass rounded-xl p-4 text-left border border-champagne-500/10 hover:border-champagne-500/30 transition-all text-sm text-gray-300 hover:text-ivory-100">
                  <Brain className="w-4 h-4 text-champagne-400 mb-2" />{s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="bg-champagne-500/20 border border-champagne-500/30 rounded-2xl rounded-br-sm px-5 py-3 max-w-lg">
                  <p className="text-ivory-100 text-sm">{msg.content}</p>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="glass rounded-2xl rounded-bl-sm p-5 border border-champagne-500/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-champagne-400" />
                      <span className="text-xs text-champagne-400 font-medium">YesBroker AI</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {msg.properties.map((p: any, pi: number) => (
                        <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: pi * 0.1 }}
                          className="glass rounded-xl p-4 border border-champagne-500/10 hover:border-champagne-500/30 transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-ivory-100 text-sm font-medium leading-tight">{p.title}</h4>
                            {p.investment_score && (
                              <span className="text-xs text-champagne-400 font-bold ml-2 shrink-0">{p.investment_score}</span>
                            )}
                          </div>
                          {p.area && <p className="text-gray-500 text-xs flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{p.area}</p>}
                          <p className="text-champagne-400 font-bold text-sm">{formatPrice(p.price, p.currency)}</p>
                          {p.rental_yield && <p className="text-emerald-400 text-xs flex items-center gap-1"><TrendingUp className="w-3 h-3" />{p.rental_yield}% yield</p>}
                          <Link href={`/property/${p.id}`} className="mt-3 block text-center text-xs bg-champagne-500/10 hover:bg-champagne-500/20 text-champagne-400 px-3 py-1.5 rounded-lg transition-all border border-champagne-500/20">
                            View Property →
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass rounded-2xl p-4 border border-champagne-500/10">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-champagne-400 animate-pulse" />
                <span className="text-xs text-gray-400">Searching properties...</span>
                <div className="flex gap-1">
                  {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-champagne-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-champagne-500/10">
        <div className="glass-strong rounded-2xl p-2 border border-champagne-500/20">
          <div className="flex items-center gap-3 px-4 py-2">
            <Brain className="w-5 h-5 text-champagne-500 shrink-0" />
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch(input)}
              placeholder="Ask about properties in natural language..."
              className="flex-1 bg-transparent text-ivory-100 placeholder-gray-500 outline-none text-sm" />
            {messages.length > 0 && (
              <button onClick={() => setMessages([])} className="p-2 rounded-lg text-gray-500 hover:text-gray-300 transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => handleSearch(input)} disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-champagne-600 to-champagne-500 text-obsidian-900 p-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}><SearchContent /></Suspense>;
}
