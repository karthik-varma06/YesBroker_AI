'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, PhoneOff, Brain, User, Clock,
  MessageSquare, CheckCircle, AlertCircle, RefreshCw, Mic
} from 'lucide-react';

type CallState = 'idle' | 'connecting' | 'active' | 'ended';

/** A single chat bubble — one per speaker turn */
type Bubble = {
  id: string;
  speaker: 'AI' | 'User';
  text: string;
};

type CallLog = {
  id: string;
  call_id: string;
  customer_phone?: string;
  customer_name?: string;
  summary?: string;
  sentiment?: string;
  call_status: string;
  duration_seconds?: number;
  property_queried?: string;
  interest_score?: number;
  created_at: string;
};

// ── Waveform bars — deterministic heights, animated client-side only ──────
function Waveform({ active, speaking }: { active: boolean; speaking: boolean }) {
  const bars = 16;
  return (
    <div className="flex items-end gap-0.5 h-10 justify-center">
      {Array.from({ length: bars }).map((_, i) => {
        // Deterministic base height using sin — no Math.random()
        const baseH = 4 + Math.abs(Math.sin(i * 0.8)) * 20;
        return (
          <motion.div
            key={i}
            className={`w-1 rounded-full ${speaking ? 'bg-emerald-300' : 'bg-emerald-400'}`}
            animate={
              active
                ? {
                    height: [`${4}px`, `${baseH}px`, `${4}px`],
                    opacity: [0.4, speaking ? 1 : 0.7, 0.4],
                  }
                : { height: '4px', opacity: 0.25 }
            }
            transition={
              active
                ? {
                    duration: 0.5 + i * 0.04,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.03,
                  }
                : { duration: 0.3 }
            }
          />
        );
      })}
    </div>
  );
}

export default function VoiceAgentPage() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [duration, setDuration] = useState(0);

  // Each element = one chat bubble (one per speaker turn)
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  // Track which speaker produced the last bubble so we can merge
  const lastSpeakerRef = useRef<'AI' | 'User' | null>(null);

  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [vapiError, setVapiError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const vapiRef = useRef<unknown>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const bubbleIdCounter = useRef(0);

  const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY ?? '';
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? '';

  // ── Load call logs ──────────────────────────────────────────────────────
  const loadLogs = useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/calls', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCallLogs(Array.isArray(data) ? data.slice(0, 15) : []);
    } catch (e) {
      console.error('loadLogs', e);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  // Poll call logs while a call is active (n8n writes to Supabase async)
  useEffect(() => {
    if (callState !== 'active' && callState !== 'ended') return;
    const interval = setInterval(loadLogs, 8000);
    return () => clearInterval(interval);
  }, [callState, loadLogs]);

  // ── Auto-scroll transcript ─────────────────────────────────────────────
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [bubbles]);

  // ── Call timer ────────────────────────────────────────────────────────
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (callState === 'active') {
      t = setInterval(() => setDuration(d => d + 1), 1000);
    } else if (callState === 'idle') {
      setDuration(0);
    }
    return () => clearInterval(t);
  }, [callState]);

  // ── Cleanup on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const v = vapiRef.current as any;
      if (v) { try { v.stop(); } catch { /* noop */ } }
    };
  }, []);

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ── Append text to an existing bubble OR create a new one ─────────────
  const pushOrMerge = (speaker: 'AI' | 'User', text: string) => {
    if (!text.trim()) return;
    setBubbles(prev => {
      const last = prev[prev.length - 1];
      // Same speaker → append to existing bubble with a space
      if (last && last.speaker === speaker) {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          text: (last.text + ' ' + text).trim(),
        };
        return updated;
      }
      // New speaker → new bubble
      bubbleIdCounter.current += 1;
      return [
        ...prev,
        { id: `bubble-${bubbleIdCounter.current}`, speaker, text: text.trim() },
      ];
    });
    lastSpeakerRef.current = speaker;
  };

  // ── Start call ────────────────────────────────────────────────────────
  const startCall = async () => {
    setVapiError('');
    if (!assistantId) {
      setVapiError('Add NEXT_PUBLIC_VAPI_ASSISTANT_ID in .env.local then restart the server.');
      return;
    }
    setCallState('connecting');
    setBubbles([]);
    lastSpeakerRef.current = null;

    try {
      const { default: Vapi } = await import('@vapi-ai/web');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vapi = new (Vapi as any)(apiKey);
      vapiRef.current = vapi;

      vapi.on('call-start', () => setCallState('active'));

      vapi.on('call-end', () => {
        setCallState('ended');
        setIsSpeaking(false);
        setTimeout(() => {
          setCallState('idle');
          loadLogs();
        }, 3500);
      });

      vapi.on('speech-start', () => setIsSpeaking(true));
      vapi.on('speech-end', () => setIsSpeaking(false));

      vapi.on('message', (msg: {
        type: string;
        role?: string;
        transcript?: string;
        transcriptType?: string;
      }) => {
        // Only process final transcripts — each final = one sentence/utterance
        if (msg.type === 'transcript' && msg.transcriptType === 'final') {
          const speaker: 'AI' | 'User' = msg.role === 'assistant' ? 'AI' : 'User';
          pushOrMerge(speaker, msg.transcript ?? '');
        }
      });

      vapi.on('error', (err: { message?: string }) => {
        console.error('Vapi error', err);
        setVapiError(err?.message ?? 'Voice connection error.');
        setCallState('idle');
      });

      await vapi.start(assistantId);
    } catch (err) {
      console.error(err);
      setVapiError('Failed to start call. Check your Vapi API key and assistant ID.');
      setCallState('idle');
    }
  };

  // ── End call ─────────────────────────────────────────────────────────
  const endCall = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v = vapiRef.current as any;
    if (v) { try { v.stop(); } catch { /* noop */ } }
    setCallState('ended');
    setIsSpeaking(false);
    setTimeout(() => {
      setCallState('idle');
      loadLogs();
    }, 3500);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-20">
      <div className="max-w-6xl mx-auto">

        {/* Header — no fake labels */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-ivory-100 mb-2">Voice Agent</h1>
          <p className="text-gray-400">
            {callState === 'idle' && 'Ready — click the button to start a live AI call.'}
            {callState === 'connecting' && 'Connecting to Vapi…'}
            {callState === 'active' && `Live call · ${formatDuration(duration)}`}
            {callState === 'ended' && 'Call complete — saving to Supabase…'}
          </p>
        </motion.div>

        {/* Error banner */}
        {vapiError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {vapiError}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left: Call controls ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Big call button card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 border border-champagne-500/10 text-center">

              {/* Pulsing rings while active */}
              <div className="relative inline-flex items-center justify-center mb-6">
                {callState === 'active' && (
                  <>
                    <motion.div
                      className="absolute rounded-full border-2 border-emerald-400/30"
                      animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ width: 104, height: 104 }}
                    />
                    <motion.div
                      className="absolute rounded-full border border-emerald-400/15"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      style={{ width: 104, height: 104 }}
                    />
                  </>
                )}
                <button
                  id="vapi-call-btn"
                  onClick={
                    callState === 'idle' ? startCall :
                    callState === 'active' ? endCall : undefined
                  }
                  disabled={callState === 'connecting' || callState === 'ended'}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                    callState === 'active'
                      ? 'bg-red-500 hover:bg-red-400 shadow-red-500/30'
                      : callState === 'connecting'
                      ? 'bg-amber-500 animate-pulse shadow-amber-500/30'
                      : callState === 'ended'
                      ? 'bg-gray-600 shadow-gray-600/30'
                      : 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-emerald-500/30'
                  }`}
                >
                  {callState === 'active' ? <PhoneOff className="w-10 h-10 text-white" /> :
                   callState === 'connecting' ? <Phone className="w-10 h-10 text-white" /> :
                   callState === 'ended' ? <CheckCircle className="w-10 h-10 text-white" /> :
                   <Phone className="w-10 h-10 text-white" />}
                </button>
              </div>

              {/* Status labels */}
              <div className="space-y-1 mb-6">
                {callState === 'idle' && <>
                  <p className="text-ivory-100 font-semibold">Start AI Voice Call</p>
                  <p className="text-gray-500 text-sm">Tap to connect</p>
                </>}
                {callState === 'connecting' && <>
                  <p className="text-amber-400 font-semibold">Connecting…</p>
                  <p className="text-gray-500 text-sm">Initializing Vapi</p>
                </>}
                {callState === 'active' && <>
                  <p className="text-emerald-400 font-semibold">{formatDuration(duration)}</p>
                  <p className="text-gray-400 text-sm">
                    {isSpeaking ? '🔊 AI Speaking' : '🎙 Listening'}
                  </p>
                </>}
                {callState === 'ended' && <>
                  <p className="text-champagne-400 font-semibold">Call Complete</p>
                  <p className="text-gray-500 text-sm">Saving to CRM…</p>
                </>}
              </div>

              {/* Live waveform */}
              <Waveform active={callState === 'active'} speaking={isSpeaking} />
            </motion.div>

            {/* Duration + Status only — removed non-working Call ID & Sentiment */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4 border border-champagne-500/10">
                <div className="w-7 h-7 bg-emerald-400/10 rounded-lg flex items-center justify-center mb-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-semibold text-emerald-400">
                  {callState === 'active' ? formatDuration(duration) : '—'}
                </p>
              </div>
              <div className="glass rounded-xl p-4 border border-champagne-500/10">
                <div className="w-7 h-7 bg-blue-400/10 rounded-lg flex items-center justify-center mb-2">
                  <Mic className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="text-sm font-semibold text-blue-400 capitalize">{callState}</p>
              </div>
            </div>
          </div>

          {/* ── Right: Transcript + Call history ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Live transcript */}
            <div className="glass rounded-2xl border border-champagne-500/10 flex flex-col"
              style={{ height: 400 }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-champagne-500/10">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-champagne-400" />
                  <span className="text-sm font-medium text-ivory-100">Live Transcript</span>
                </div>
                {callState === 'active' && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                    Recording
                  </span>
                )}
              </div>

              <div ref={transcriptRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {bubbles.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                    <Phone className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm">Start a call to see the conversation here</p>
                    {!assistantId && (
                      <p className="text-xs mt-2 text-amber-500/70">
                        ⚠ Set NEXT_PUBLIC_VAPI_ASSISTANT_ID in .env.local
                      </p>
                    )}
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {bubbles.map(bubble => (
                    <motion.div
                      key={bubble.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 ${bubble.speaker === 'User' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        bubble.speaker === 'AI'
                          ? 'bg-champagne-500/20 text-champagne-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {bubble.speaker === 'AI'
                          ? <Brain className="w-3.5 h-3.5" />
                          : <User className="w-3.5 h-3.5" />}
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        bubble.speaker === 'AI'
                          ? 'glass border border-champagne-500/10 text-gray-200 rounded-tl-sm'
                          : 'bg-blue-500/15 border border-blue-500/20 text-gray-100 rounded-tr-sm'
                      }`}>
                        {bubble.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Recent Calls */}
            <div className="glass rounded-2xl border border-champagne-500/10">
              <div className="px-5 py-4 border-b border-champagne-500/10 flex items-center justify-between">
                <h3 className="text-sm font-medium text-ivory-100">Recent Calls</h3>
                <button
                  onClick={loadLogs}
                  disabled={isLoadingLogs}
                  className="text-gray-500 hover:text-champagne-400 transition-colors disabled:opacity-40"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {callLogs.length === 0 ? (
                <div className="px-5 py-10 text-center text-gray-500 text-sm">
                  {isLoadingLogs ? 'Loading…' : 'No calls recorded yet.'}
                </div>
              ) : (
                <div className="divide-y divide-champagne-500/5 max-h-72 overflow-y-auto">
                  {callLogs.map((log, i) => (
                    <motion.div
                      key={log.id ?? log.call_id ?? i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="px-5 py-4 flex items-start gap-4 hover:bg-white/2 transition-colors"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        log.call_status === 'completed' || log.call_status === 'ended' ? 'bg-emerald-500/10' :
                        log.call_status === 'active' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                      }`}>
                        <Phone className={`w-4 h-4 ${
                          log.call_status === 'completed' || log.call_status === 'ended' ? 'text-emerald-400' :
                          log.call_status === 'active' ? 'text-amber-400' : 'text-blue-400'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-ivory-100 truncate">
                            {log.customer_name || log.customer_phone || 'Unknown caller'}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 capitalize ${
                            log.call_status === 'completed' || log.call_status === 'ended'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : log.call_status === 'active'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {log.call_status}
                          </span>
                        </div>

                        {log.summary && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-1">{log.summary}</p>
                        )}
                        {log.property_queried && (
                          <p className="text-xs text-champagne-500/70 mb-1">🏠 {log.property_queried}</p>
                        )}

                        <p className="text-xs text-gray-600 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(log.created_at).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                          {log.duration_seconds != null && (
                            <span>· {Math.floor(log.duration_seconds / 60)}m {log.duration_seconds % 60}s</span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
