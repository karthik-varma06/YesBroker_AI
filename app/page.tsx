"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Brain,
  Zap,
  BarChart3,
  Building2,
  Search,
  Star,
  ArrowRight,
  MapPin,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { UIProperty } from "@/lib/mappers";
import NeuralBackground from "@/components/ui/NeuralBackground";

type Property = UIProperty;

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function FloatingStatusCard({
  icon,
  label,
  value,
  sub,
  accent = "blue",
  delay = 0,
  animClass = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: "blue" | "cyan" | "purple" | "green";
  delay?: number;
  animClass?: string;
}) {
  const accentMap = {
    blue: "blue",
    cyan: "cyan",
    purple: "purple",
    green: "green",
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`floating-card ${accent}-accent ${animClass} select-none transition-shadow duration-300 ${
        accent === "blue"
          ? "hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
          : accent === "cyan"
            ? "hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
            : accent === "purple"
              ? "hover:shadow-[0_0_30px_rgba(167,139,250,0.6)]"
              : "hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
      }`}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`floating-card ${accent}-accent ${animClass} select-none`}
      style={{ minWidth: 160 }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`icon-box-${accent} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}
          style={{
            background:
              accent === "blue"
                ? "rgba(59,130,246,0.15)"
                : accent === "cyan"
                  ? "rgba(34,211,238,0.15)"
                  : accent === "purple"
                    ? "rgba(124,58,237,0.15)"
                    : "rgba(16,185,129,0.15)",
            border: `1px solid ${
              accent === "blue"
                ? "rgba(59,130,246,0.3)"
                : accent === "cyan"
                  ? "rgba(34,211,238,0.3)"
                  : accent === "purple"
                    ? "rgba(124,58,237,0.3)"
                    : "rgba(16,185,129,0.3)"
            }`,
          }}
        >
          {icon}
        </div>
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{
              color:
                accent === "blue"
                  ? "#3B82F6"
                  : accent === "cyan"
                    ? "#22D3EE"
                    : accent === "purple"
                      ? "#a78bfa"
                      : "#10B981",
            }}
          >
            {label}
          </p>
          <p className="text-white font-bold text-sm leading-tight">{value}</p>
          {sub && (
            <p className="text-[#94A3B8] text-[10px] leading-tight mt-0.5">
              {sub}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/** Map a property title → the best matching local image path */
function getPropertyImage(title: string): string | null {
  const t = title.toLowerCase();
  // Order matters — check more-specific names first
  if (t.includes("sobha dream") || t.includes("sobhadream"))
    return "/images/Sobha_Dream.png";
  if (t.includes("sobha")) return "/images/Sobha.png";
  if (t.includes("brigade cornerstone") || t.includes("cornerstone"))
    return "/images/Brigade_Cornerstone.png";
  if (t.includes("brigade el dorado") || t.includes("el dorado"))
    return "/images/Brigade_El_Dorado.png";
  if (t.includes("brigade")) return "/images/Brigade_Cornerstone.png";
  if (t.includes("prestige")) return "/images/Prestige.png";
  if (t.includes("godrej")) return "/images/Godrej.png";
  if (t.includes("purva") || t.includes("puravankara"))
    return "/images/Purva.png";
  if (t.includes("assetz")) return "/images/Assetz.png";
  if (t.includes("sattva")) return "/images/Sattva.png";
  if (t.includes("lakeview") || t.includes("lake view"))
    return "/images/Lakeview.png";
  return null;
}

const FALLBACK_GRADIENTS = [
  "from-blue-900/50 to-blue-950/80",
  "from-cyan-900/40 to-slate-900/80",
  "from-violet-900/50 to-slate-950/80",
  "from-emerald-900/40 to-slate-900/80",
  "from-indigo-900/50 to-blue-950/80",
  "from-teal-900/40 to-slate-900/80",
];

function PropertyCard({
  property,
  index,
}: {
  property: Property;
  index: number;
}) {
  const imgSrc = getPropertyImage(property.title);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.07,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="glass-card overflow-hidden group cursor-pointer"
      id={`property-card-${index}`}
    >
      {/* Image area */}
      <div
        className={`relative h-52 overflow-hidden ${!imgSrc ? `bg-gradient-to-br ${FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]}` : ""}`}
      >
        {/* Real property image */}
        {imgSrc ? (
          <>
            <Image
              src={imgSrc}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Dark overlay so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/80 via-[#050816]/20 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-20 h-20 opacity-10 text-blue-400" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/90 to-transparent" />
          </>
        )}
        {/* Shimmer on hover */}
        <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
        {/* Top badges */}
        <div className="absolute top-3 left-3 z-10">
          <span className="badge-blue">
            {property.property_type || "Property"}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <span className="badge-success">Active</span>
        </div>
        {/* Location chip */}
        <div
          className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5"
          style={{
            background: "rgba(5,8,22,0.75)",
            borderRadius: 8,
            padding: "4px 10px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <MapPin className="w-3 h-3 text-[#22D3EE]" />
          <span className="text-[11px] text-[#F8FAFC] font-medium">
            {property.location}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[#F8FAFC] text-sm leading-snug flex-1 mr-2 line-clamp-2">
            {property.title}
          </h3>
        </div>

        {property.payment_plan && (
          <p className="text-[#94A3B8] text-xs mb-3 line-clamp-1 opacity-70">
            {property.payment_plan}
          </p>
        )}

        <div className="divider-glow mb-4" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#94A3B8] mb-0.5">Price</p>
            <p className="text-[#22D3EE] font-bold text-base">
              {formatPrice(property.price, property.currency)}
            </p>
          </div>
          <Link
            href={`/property/${property.id}`}
            className="btn-secondary text-xs px-3 py-2 rounded-xl"
            id={`view-property-${index}`}
          >
            View Details
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const aiFeatures = [
  {
    icon: Phone,
    title: "AI Voice Agent",
    description:
      "Vapi-powered 24/7 voice AI. Captures leads, answers property queries, books site visits — all hands-free and intelligent.",
    href: "/voice-agent",
    accent: "blue" as const,
    stat: "24/7",
    statLabel: "Always Active",
  },
  {
    icon: Search,
    title: "AI Property Search",
    description:
      'Gemini + RAG + Qdrant. Natural language: "3BHK under 2M sea view" → exact property matches in milliseconds.',
    href: "/search",
    accent: "cyan" as const,
    stat: "<100ms",
    statLabel: "Query Speed",
  },
  {
    icon: Zap,
    title: "AI Negotiation Engine",
    description:
      "Gemini analyzes market data and buyer psychology to generate optimal counter-offers and close deals faster.",
    href: "/negotiation",
    accent: "purple" as const,
    stat: "+45%",
    statLabel: "Faster Close",
  },
  {
    icon: BarChart3,
    title: "AI Analytics",
    description:
      "Real-time market intelligence and portfolio insights. Know which properties to push and when, powered by predictive AI.",
    href: "/analytics",
    accent: "blue" as const,
    stat: "97%",
    statLabel: "AI Accuracy",
  },
  {
    icon: Users,
    title: "AI CRM",
    description:
      "Intelligent client relationship management. Auto-qualifies leads, scores intent, and surfaces the hottest prospects first.",
    href: "/crm",
    accent: "cyan" as const,
    stat: "3x",
    statLabel: "Lead Quality",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp AI",
    description:
      "Automated WhatsApp follow-ups, property suggestions, and appointment booking — all via conversational AI.",
    href: "/whatsapp",
    accent: "purple" as const,
    stat: "89%",
    statLabel: "Response Rate",
  },
];

const kpiStats = [
  {
    icon: Building2,
    value: "10K+",
    label: "Properties Managed",
    sub: "Across 50+ cities",
    accent: "blue" as const,
  },
  {
    icon: Activity,
    value: "97%",
    label: "AI Accuracy",
    sub: "In recommendations",
    accent: "cyan" as const,
  },
  {
    icon: Zap,
    value: "45%",
    label: "Faster Closings",
    sub: "vs traditional",
    accent: "purple" as const,
  },
  {
    icon: DollarSign,
    value: "$2B+",
    label: "Transactions",
    sub: "Total value assisted",
    accent: "blue" as const,
  },
];

const workflowSteps = [
  {
    icon: Phone,
    label: "Call Comes In",
    desc: "Vapi Voice AI answers 24/7",
    num: "01",
  },
  {
    icon: Brain,
    label: "AI Qualifies",
    desc: "Intent & budget scored",
    num: "02",
  },
  {
    icon: Search,
    label: "Property Match",
    desc: "Semantic RAG search",
    num: "03",
  },
  {
    icon: Zap,
    label: "AI Negotiates",
    desc: "Optimal counter-offers",
    num: "04",
  },
  {
    icon: CheckCircle,
    label: "Deal Closed",
    desc: "Commission earned",
    num: "05",
  },
];

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);

  const phrases = [
    "Find a 4BHK villa under 10M...",
    "Show off-plan apartments with 8%+ rental yield...",
    "Luxury penthouse with city views...",
    "Investment property with high ROI...",
  ];

  // Typewriter
  useEffect(() => {
    const phrase = phrases[phraseIndex];
    let i = 0;
    setTypedText("");
    const typer = setInterval(() => {
      if (i < phrase.length) {
        setTypedText(phrase.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typer);
        setTimeout(
          () => setPhraseIndex((phraseIndex + 1) % phrases.length),
          2500,
        );
      }
    }, 45);
    return () => clearInterval(typer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phraseIndex]);

  // Properties
  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((d: UIProperty[]) => {
        if (Array.isArray(d)) setProperties(d.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen relative" style={{ background: "#050816" }}>
      {/* ══════════════════════════════════════════════
          ANIMATED NEURAL NETWORK BACKGROUND (ALL PAGES)
      ══════════════════════════════════════════════ */}
      <NeuralBackground />

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ paddingTop: "68px" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/HOME.png"
            alt="Luxury AI Real Estate Background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradients to blend smoothly into the dark background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050816] via-[#050816]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-[#050816]/40" />
          <div className="absolute inset-0 bg-[#050816]/20" />
        </div>

        {/* Hero layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center min-h-[calc(100vh-68px)] py-16">
            {/* ── LEFT: Text + CTAs ── */}
            <div className="flex flex-col justify-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 self-start mb-8"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: 100,
                  padding: "6px 14px",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                <span className="text-[12px] font-semibold text-[#22D3EE] tracking-wide uppercase">
                  Enterprise AI Platform for Real Estate
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display font-black tracking-tight leading-[1.05] mb-6"
                style={{
                  fontSize: "clamp(42px, 5.5vw, 72px)",
                  color: "#F8FAFC",
                }}
              >
                The <span className="text-gradient-aurora">AI-Powered</span>
                <br />
                Real Estate Agent
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-[#94A3B8] text-lg leading-relaxed mb-10 max-w-md"
              >
                Enterprise-grade AI operating system for modern real estate.
                Voice agents, negotiation engine, and intelligent marketplace in
                one platform.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <Link
                  href="/voice-agent"
                  id="hero-cta-primary"
                  className="btn-primary text-[14px] px-7 py-3.5"
                >
                  <div
                    className="flex items-center gap-1.5"
                    style={{ height: 16 }}
                  >
                    <span className="wave-bar h-2.5" />
                    <span className="wave-bar h-3.5" />
                    <span className="wave-bar h-4" />
                    <span className="wave-bar h-3.5" />
                    <span className="wave-bar h-2.5" />
                  </div>
                  Start AI Voice Agent
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/marketplace"
                  id="hero-cta-secondary"
                  className="btn-secondary text-[14px] px-7 py-3.5"
                >
                  <Building2 className="w-4 h-4" />
                  Browse Marketplace
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-5"
              >
                {[
                  "AI Voice Agents",
                  "Enterprise Ready",
                  "Secure Cloud",
                  "24/7 Automation",
                ].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span className="text-[12px] text-[#94A3B8] font-medium">
                      {badge}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to top, #050816 0%, rgba(5,8,22,0.8) 40%, transparent 100%)",
          }}
        />
        {/* Professional glowing line */}
        <div
          className="absolute bottom-0 inset-x-0 h-px z-20"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.3) 30%, rgba(34,211,238,0.6) 50%, rgba(59,130,246,0.3) 70%, transparent 100%)",
            boxShadow: "0 -2px 15px rgba(34,211,238,0.4)",
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════
          AI SEARCH BAR
      ══════════════════════════════════════════════ */}
      <section id="ai-search" className="relative z-10 py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-display font-black text-center mb-8 text-[#F8FAFC]"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
            >
              Ask anything about properties
            </h2>

            {/* Search bar */}
            <div
              className="relative rounded-2xl p-2"
              style={{
                background: "rgba(17,24,39,0.8)",
                border: "1px solid rgba(59,130,246,0.25)",
                backdropFilter: "blur(30px)",
                boxShadow:
                  "0 0 0 1px rgba(59,130,246,0.1), 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(59,130,246,0.08)",
              }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-3 px-2 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center w-full gap-3 flex-1">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(59,130,246,0.15)",
                      border: "1px solid rgba(59,130,246,0.3)",
                    }}
                  >
                    <Brain className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      searchQuery.trim() &&
                      (window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`)
                    }
                    placeholder={
                      typedText || "Ask AI anything about properties..."
                    }
                    className="flex-1 min-w-0 bg-transparent text-[#F8FAFC] placeholder-[#475569] outline-none text-sm sm:text-base font-medium"
                    id="hero-search-input"
                  />
                  <span className="hidden sm:inline cursor-blink text-[#3B82F6] font-light shrink-0">
                    |
                  </span>
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  id="hero-search-btn"
                  className="btn-primary w-full sm:w-auto justify-center text-sm px-5 py-3 sm:py-2.5 rounded-xl shrink-0 mt-1 sm:mt-0"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Link>
              </div>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {[
                "4BHK Palm Jumeirah",
                "ROI 8%+ Dubai",
                "Off-plan Creek Harbour",
                "Penthouse DIFC",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setSearchQuery(q)}
                  className="text-xs font-medium transition-all duration-200 px-4 py-2 rounded-full"
                  style={{
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.18)",
                    color: "#94A3B8",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#22D3EE";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(34,211,238,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#94A3B8";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(59,130,246,0.18)";
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS — WORKFLOW
      ══════════════════════════════════════════════ */}
      <section id="workflow" className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Faint horizontal glow line across center */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: "80%",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(59,130,246,0.15), rgba(34,211,238,0.15), transparent)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="section-label mb-4">Workflow</p>
            <h2
              className="font-display font-black text-[#F8FAFC]"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
            >
              From call to{" "}
              <span className="text-gradient-blue">closed deal</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 items-start relative">
            {/* Connector line */}
            <div
              className="hidden sm:block absolute top-10 left-[10%] right-[10%] h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(34,211,238,0.3), rgba(124,58,237,0.3), transparent)",
              }}
            />

            {workflowSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-4 relative z-10"
                id={`workflow-step-${i + 1}`}
              >
                {/* Circle icon */}
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(17,24,39,0.9)",
                    border: "1px solid rgba(59,130,246,0.25)",
                    backdropFilter: "blur(20px)",
                    boxShadow:
                      "0 4px 30px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.08)",
                  }}
                >
                  <step.icon className="w-8 h-8 text-[#3B82F6]" />
                  {/* Step number */}
                  <div
                    className="absolute -top-3 -right-3 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white"
                    style={{
                      background: "linear-gradient(135deg, #3B82F6, #22D3EE)",
                      fontSize: 10,
                    }}
                  >
                    {step.num}
                  </div>
                </div>
                <div>
                  <p className="text-[#F8FAFC] font-bold text-sm mb-1">
                    {step.label}
                  </p>
                  <p className="text-[#94A3B8] text-xs">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED PROPERTIES
      ══════════════════════════════════════════════ */}
      <section
        id="featured-properties"
        className="relative z-10 py-24 px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">Marketplace</p>
              <h2
                className="font-display font-black text-[#F8FAFC]"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
              >
                Featured Properties
              </h2>
            </div>
            <Link
              href="/marketplace"
              id="view-all-properties"
              className="btn-secondary text-sm hidden sm:flex"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {properties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 flex flex-col items-center gap-4"
            >
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.15)",
                }}
              >
                <Building2 className="w-9 h-9 text-[#3B82F6] opacity-50" />
              </div>
              <p className="text-[#94A3B8] text-sm">
                No properties found. Add properties via Supabase or the n8n
                workflow.
              </p>
              <Link href="/marketplace" className="btn-primary text-sm">
                Go to Marketplace
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}

          <div className="sm:hidden flex justify-center mt-8">
            <Link href="/marketplace" className="btn-secondary text-sm">
              View All Properties
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <section id="cta-banner" className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl p-12 text-center"
            style={{
              background: "rgba(17,24,39,0.8)",
              border: "1px solid rgba(59,130,246,0.2)",
              backdropFilter: "blur(30px)",
            }}
          >
            {/* Glow corner */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center top, rgba(59,130,246,0.15), transparent)",
              }}
            />
            <div
              className="absolute bottom-0 inset-x-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), rgba(34,211,238,0.4), transparent)",
              }}
            />

            <p className="section-label mb-5 relative z-10">
              Ready to automate?
            </p>
            <h2
              className="font-display font-black text-[#F8FAFC] mb-4 relative z-10"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
            >
              Start closing deals{" "}
              <span className="text-gradient-aurora">with AI</span>
            </h2>
            <p className="text-[#94A3B8] text-lg mb-10 max-w-xl mx-auto relative z-10">
              Deploy your AI real estate agent in minutes. Voice, search,
              negotiation, CRM — all in one enterprise platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <Link
                href="/voice-agent"
                id="cta-start-btn"
                className="btn-primary text-sm px-8 py-4"
              >
                <Phone className="w-4 h-4" />
                Start AI Voice Agent
              </Link>
              <Link
                href="/analytics"
                id="cta-analytics-btn"
                className="btn-secondary text-sm px-8 py-4"
              >
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER DIVIDER
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="divider-glow mb-10" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-sm text-[#F8FAFC]">
                <span className="text-gradient-blue">Yes</span>Broker AI
              </span>
            </div>
            <p className="text-[#475569] text-xs text-center">
              © 2025 YesBroker AI. Enterprise Real Estate Intelligence Platform.
            </p>
            <div className="flex gap-4">
              {["Privacy", "Terms", "Contact"].map((l) => (
                <Link
                  key={l}
                  href="#"
                  className="text-[#475569] hover:text-[#94A3B8] text-xs transition-colors"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
