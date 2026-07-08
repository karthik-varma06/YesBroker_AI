"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Search,
  MapPin,
  Filter,
  ArrowRight,
  Star,
  Heart,
  X,
  ChevronDown,
  Phone,
  Home,
  Waves,
  Dumbbell,
  Trees,
  Car,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { UIProperty } from "@/lib/mappers";
import { demoProperties } from "@/lib/utils";
import NeuralBackground from "@/components/ui/NeuralBackground";

/* ─────────────────────────────────────────────
   IMAGE MATCHER
───────────────────────────────────────────── */
function getPropertyImage(title: string): string | null {
  const t = title.toLowerCase();
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
  "from-blue-900/70 to-blue-950",
  "from-cyan-900/60 to-slate-900",
  "from-violet-900/70 to-slate-950",
  "from-emerald-900/60 to-slate-900",
  "from-indigo-900/70 to-blue-950",
  "from-teal-900/60 to-slate-900",
];

/* ─────────────────────────────────────────────
   EXTRACT BHK from property_type string
───────────────────────────────────────────── */
function extractBHK(type: string): number | null {
  const m = type.match(/(\d+)\s*bhk/i);
  return m ? parseInt(m[1]) : null;
}

/* ─────────────────────────────────────────────
   SINGLE PROPERTY CARD — matches reference image
───────────────────────────────────────────── */
function PropertyCard({
  property,
  index,
  liked,
  onLike,
}: {
  property: UIProperty;
  index: number;
  liked: boolean;
  onLike: () => void;
}) {
  const imgSrc = getPropertyImage(property.title);
  const bhk = extractBHK(property.property_type);
  const daysAgo = Math.floor(Math.random() * 5) + 1; // simulate listing age

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex flex-col"
      style={{
        background: "rgba(11,18,32,0.9)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18,
        overflow: "hidden",
        transition:
          "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease",
        cursor: "pointer",
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.22 },
      }}
      onHoverStart={(e) => {
        (e.target as HTMLElement).closest("[data-card]");
      }}
      id={`prop-card-${index}`}
    >
      {/* ── IMAGE SECTION ── */}
      <div
        className={`relative overflow-hidden shrink-0 ${!imgSrc ? `bg-gradient-to-br ${FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]}` : "bg-[#0B1220]"}`}
        style={{ height: 220 }}
      >
        {imgSrc ? (
          <>
            <Image
              src={imgSrc}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              priority={index < 3}
            />
            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="w-16 h-16 opacity-10 text-blue-400" />
          </div>
        )}

        {/* ── Top-left: Featured badge ── */}
        {property.featured && (
          <div
            className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{
              background: "rgba(245,158,11,0.2)",
              border: "1px solid rgba(245,158,11,0.5)",
              color: "#F59E0B",
              backdropFilter: "blur(8px)",
            }}
          >
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        )}

        {/* ── Top-right: Heart ── */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onLike();
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            background: "rgba(5,8,22,0.7)",
            border: `1px solid ${liked ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.15)"}`,
            backdropFilter: "blur(8px)",
          }}
          id={`like-btn-${index}`}
        >
          <Heart
            className="w-3.5 h-3.5 transition-colors"
            style={{
              color: liked ? "#EF4444" : "#94A3B8",
              fill: liked ? "#EF4444" : "none",
            }}
          />
        </button>

        {/* ── Bottom-left: BHK badge ── */}
        {bhk && (
          <div
            className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-lg text-[11px] font-bold"
            style={{
              background: "rgba(5,8,22,0.8)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#F8FAFC",
              backdropFilter: "blur(8px)",
            }}
          >
            {bhk} BHK
          </div>
        )}
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3
          className="font-display font-bold text-[15px] leading-snug mb-2 line-clamp-1"
          style={{ color: "#F8FAFC" }}
        >
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "#22D3EE" }}
          />
          <span className="text-xs" style={{ color: "#94A3B8" }}>
            {property.location}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-xs leading-relaxed line-clamp-2 mb-3"
          style={{ color: "#64748B" }}
        >
          {property.description}
        </p>

        {/* Amenity tags */}
        {property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.amenities.slice(0, 3).map((a, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94A3B8",
                }}
              >
                {a}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94A3B8",
                }}
              >
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p
              className="font-display font-black text-lg leading-none"
              style={{ color: "#F8FAFC" }}
            >
              {formatPrice(property.price, property.currency)}
            </p>
            {property.minimum_price && (
              <p className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>
                Floor: {formatPrice(property.minimum_price)}
              </p>
            )}
          </div>
          <Link
            href={`/property/${property.id}`}
            id={`view-detail-${index}`}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all"
            style={{
              color: "#22D3EE",
              border: "1px solid rgba(34,211,238,0.25)",
              background: "rgba(34,211,238,0.08)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(34,211,238,0.15)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(34,211,238,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(34,211,238,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(34,211,238,0.25)";
            }}
          >
            View Details
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* ── Bottom row: Listed date ── */}
        <div
          className="flex items-center justify-between mt-4 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span className="text-[11px]" style={{ color: "#475569" }}>
            Listed {daysAgo} day{daysAgo > 1 ? "s" : ""} ago
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function MarketplacePage() {
  const [properties, setProperties] = useState<UIProperty[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200_000_000);
  const [selectedBHK, setSelectedBHK] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [cityOpen, setCityOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const CITIES = [
    "All",
    "Bangalore",
    "Whitefield",
    "Panathur",
    "Dubai",
    "Abu Dhabi",
  ];
  const TYPES = ["All", "Apartment", "Villa", "Penthouse", "Townhouse", "Plot"];
  const BHK_OPTIONS = [1, 2, 3, 4];
  const AMENITY_ICONS: Record<string, React.ReactNode> = {
    Pool: <Waves className="w-4 h-4" />,
    Gym: <Dumbbell className="w-4 h-4" />,
    Garden: <Trees className="w-4 h-4" />,
    Parking: <Car className="w-4 h-4" />,
  };
  const AMENITY_LIST = ["Pool", "Gym", "Garden", "Parking"];
  const SORT_OPTIONS = [
    { value: "featured", label: "Featured First" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "newest", label: "Newest First" },
  ];

  /* ── Fetch ── */
  useEffect(() => {
    fetch("/api/properties", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: UIProperty[]) => {
        if (Array.isArray(d) && d.length) {
          setProperties(d);
        } else {
          setProperties(
            demoProperties.map((p) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              location: `${p.area}, ${p.city}`,
              area: p.area ?? "",
              city: p.city,
              property_type: p.property_type,
              price: p.price,
              currency: p.currency,
              amenities: [],
              featured: p.featured ?? false,
              status: p.status ?? "available",
              investment_score: p.investment_score ?? 80,
            })),
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── Filter + sort ── */
  const filtered = useMemo(() => {
    let r = [...properties];

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.property_type.toLowerCase().includes(q) ||
          p.area?.toLowerCase().includes(q),
      );
    }

    // City
    if (selectedCity !== "All")
      r = r.filter(
        (p) =>
          p.city?.toLowerCase().includes(selectedCity.toLowerCase()) ||
          p.location.toLowerCase().includes(selectedCity.toLowerCase()),
      );

    // Type
    if (selectedType !== "All")
      r = r.filter((p) =>
        p.property_type.toLowerCase().includes(selectedType.toLowerCase()),
      );

    // Price
    r = r.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // BHK
    if (selectedBHK.length > 0)
      r = r.filter((p) => {
        const b = extractBHK(p.property_type);
        return b !== null && selectedBHK.includes(b);
      });

    // Amenities
    if (selectedAmenities.length > 0)
      r = r.filter((p) =>
        selectedAmenities.every((a) =>
          p.amenities.some((pa) => pa.toLowerCase().includes(a.toLowerCase())),
        ),
      );

    // Sort
    if (sortBy === "price-asc") r.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") r.sort((a, b) => b.price - a.price);
    if (sortBy === "featured")
      r.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return r;
  }, [
    properties,
    search,
    selectedCity,
    selectedType,
    minPrice,
    maxPrice,
    selectedBHK,
    selectedAmenities,
    sortBy,
  ]);

  const clearAll = () => {
    setSearch("");
    setSelectedCity("All");
    setSelectedType("All");
    setMinPrice(0);
    setMaxPrice(200_000_000);
    setSelectedBHK([]);
    setSelectedAmenities([]);
  };

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );

  const toggleBHK = (b: number) =>
    setSelectedBHK((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
    );

  const toggleLike = (id: string) =>
    setLikedIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const activeFilters = [
    selectedCity !== "All",
    selectedType !== "All",
    maxPrice < 200_000_000,
    selectedBHK.length > 0,
    selectedAmenities.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen relative" style={{ background: "#050816" }}>
      <NeuralBackground />

      <div className="relative z-10" style={{ paddingTop: 68 }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          {/* ══════════════════════════════
              PAGE HEADER
          ══════════════════════════════ */}
          <div className="py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
            >
              {/* Left: Title */}
              <div>
                <h1
                  className="font-display font-black leading-none mb-2"
                  style={{
                    fontSize: "clamp(36px, 4.5vw, 58px)",
                    color: "#F8FAFC",
                  }}
                >
                  Property{" "}
                  <span className="text-gradient-aurora">Marketplace</span>
                </h1>
              </div>

              {/* Right: Stats strip */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-4 gap-3 shrink-0"
              >
                {[].map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center p-3 rounded-2xl"
                    style={{
                      background: "rgba(11,18,32,0.8)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      minWidth: 90,
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="mb-1.5">{s.icon}</div>
                    <p
                      className="font-display font-black text-lg leading-none"
                      style={{ color: "#F8FAFC" }}
                    >
                      {s.val}
                    </p>
                    <p
                      className="text-[9px] mt-0.5 text-center leading-tight"
                      style={{ color: "#94A3B8" }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* ══════════════════════════════
              SEARCH + SORT BAR
          ══════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#475569" }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties, areas, types…"
                id="marketplace-search"
                className="w-full pl-11 pr-4 py-3.5 text-sm outline-none rounded-2xl"
                style={{
                  background: "rgba(11,18,32,0.9)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#F8FAFC",
                  backdropFilter: "blur(20px)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>

            {/* City selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setCityOpen(!cityOpen);
                  setTypeOpen(false);
                }}
                id="city-selector"
                className="w-full sm:w-auto flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-medium whitespace-nowrap"
                style={{
                  background: "rgba(11,18,32,0.9)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#F8FAFC",
                  backdropFilter: "blur(20px)",
                  minWidth: 140,
                }}
              >
                <MapPin className="w-3.5 h-3.5" style={{ color: "#22D3EE" }} />
                {selectedCity === "All" ? "All Cities" : selectedCity}
                <ChevronDown
                  className="w-3.5 h-3.5 ml-auto"
                  style={{
                    color: "#475569",
                    transform: cityOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              <AnimatePresence>
                {cityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-full z-50 rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(11,18,32,0.98)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      backdropFilter: "blur(30px)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    }}
                  >
                    {CITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setSelectedCity(c);
                          setCityOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                        style={{
                          color: selectedCity === c ? "#22D3EE" : "#94A3B8",
                          background:
                            selectedCity === c
                              ? "rgba(34,211,238,0.08)"
                              : "transparent",
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="marketplace-sort"
              className="w-full sm:w-auto px-4 py-3.5 text-sm rounded-2xl outline-none"
              style={{
                background: "rgba(11,18,32,0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#F8FAFC",
                backdropFilter: "blur(20px)",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option
                  key={o.value}
                  value={o.value}
                  style={{ background: "#0B1220" }}
                >
                  {o.label}
                </option>
              ))}
            </select>

            {/* Filters button */}
            <button
              id="filter-toggle"
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all relative"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                color: "white",
                boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
              }}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilters > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
                  style={{ background: "#EF4444", color: "white" }}
                >
                  {activeFilters}
                </span>
              )}
            </button>
          </motion.div>

          {/* ══════════════════════════════
              MAIN LAYOUT: Sidebar + Grid
          ══════════════════════════════ */}
          <div className="flex gap-5 pb-24">
            {/* ── LEFT SIDEBAR FILTERS ── */}
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="shrink-0 hidden lg:flex flex-col gap-0"
              style={{
                width: 230,
                background: "rgba(11,18,32,0.9)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 18,
                backdropFilter: "blur(24px)",
                height: "fit-content",
                position: "sticky",
                top: 84,
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  className="font-semibold text-sm"
                  style={{ color: "#F8FAFC" }}
                >
                  Filters
                </span>
                {activeFilters > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[11px] font-semibold transition-colors"
                    style={{ color: "#3B82F6" }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="p-5 space-y-6">
                {/* Location */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <ChevronDown
                      className="w-3 h-3"
                      style={{ color: "#3B82F6" }}
                    />
                    <label
                      className="text-xs font-semibold"
                      style={{ color: "#F8FAFC" }}
                    >
                      Location
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setCityOpen(!cityOpen);
                        setTypeOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: selectedCity === "All" ? "#64748B" : "#F8FAFC",
                      }}
                    >
                      {selectedCity === "All"
                        ? "Select location"
                        : selectedCity}
                      <ChevronDown
                        className="w-3.5 h-3.5"
                        style={{ color: "#475569" }}
                      />
                    </button>
                    <AnimatePresence>
                      {cityOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl overflow-hidden"
                          style={{
                            background: "rgba(11,18,32,0.98)",
                            border: "1px solid rgba(59,130,246,0.2)",
                            backdropFilter: "blur(30px)",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                          }}
                        >
                          {CITIES.map((c) => (
                            <button
                              key={c}
                              onClick={() => {
                                setSelectedCity(c);
                                setCityOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs transition-colors"
                              style={{
                                color:
                                  selectedCity === c ? "#22D3EE" : "#94A3B8",
                                background:
                                  selectedCity === c
                                    ? "rgba(34,211,238,0.08)"
                                    : "transparent",
                              }}
                            >
                              {c}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <ChevronDown
                      className="w-3 h-3"
                      style={{ color: "#3B82F6" }}
                    />
                    <label
                      className="text-xs font-semibold"
                      style={{ color: "#F8FAFC" }}
                    >
                      Property Type
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setTypeOpen(!typeOpen);
                        setCityOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: selectedType === "All" ? "#64748B" : "#F8FAFC",
                      }}
                    >
                      {selectedType === "All" ? "All Types" : selectedType}
                      <ChevronDown
                        className="w-3.5 h-3.5"
                        style={{ color: "#475569" }}
                      />
                    </button>
                    <AnimatePresence>
                      {typeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl overflow-hidden"
                          style={{
                            background: "rgba(11,18,32,0.98)",
                            border: "1px solid rgba(59,130,246,0.2)",
                            backdropFilter: "blur(30px)",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                          }}
                        >
                          {TYPES.map((t) => (
                            <button
                              key={t}
                              onClick={() => {
                                setSelectedType(t);
                                setTypeOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs transition-colors"
                              style={{
                                color:
                                  selectedType === t ? "#22D3EE" : "#94A3B8",
                                background:
                                  selectedType === t
                                    ? "rgba(34,211,238,0.08)"
                                    : "transparent",
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <ChevronDown
                      className="w-3 h-3"
                      style={{ color: "#3B82F6" }}
                    />
                    <label
                      className="text-xs font-semibold"
                      style={{ color: "#F8FAFC" }}
                    >
                      Price Range
                    </label>
                  </div>
                  <input
                    type="range"
                    min={2_000_000}
                    max={200_000_000}
                    step={2_000_000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(+e.target.value)}
                    className="w-full mb-2"
                    style={{ accentColor: "#3B82F6" }}
                  />
                  <div
                    className="flex items-center justify-between text-[10px]"
                    style={{ color: "#94A3B8" }}
                  >
                    <span>₹ 20 Lakhs</span>
                    <span style={{ color: "#F8FAFC", fontWeight: 700 }}>
                      {formatPrice(maxPrice)}
                    </span>
                    <span>₹ 5 Crores+</span>
                  </div>
                </div>

                {/* BHK */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <ChevronDown
                      className="w-3 h-3"
                      style={{ color: "#3B82F6" }}
                    />
                    <label
                      className="text-xs font-semibold"
                      style={{ color: "#F8FAFC" }}
                    >
                      BHK
                    </label>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {BHK_OPTIONS.map((b) => (
                      <button
                        key={b}
                        onClick={() => toggleBHK(b)}
                        className="w-9 h-9 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background: selectedBHK.includes(b)
                            ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                            : "rgba(255,255,255,0.05)",
                          border: `1px solid ${selectedBHK.includes(b) ? "#3B82F6" : "rgba(255,255,255,0.1)"}`,
                          color: selectedBHK.includes(b) ? "white" : "#94A3B8",
                          boxShadow: selectedBHK.includes(b)
                            ? "0 4px 12px rgba(59,130,246,0.4)"
                            : "none",
                        }}
                      >
                        {b}
                      </button>
                    ))}
                    <button
                      onClick={() => toggleBHK(5)}
                      className="h-9 px-2.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: selectedBHK.includes(5)
                          ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                          : "rgba(255,255,255,0.05)",
                        border: `1px solid ${selectedBHK.includes(5) ? "#3B82F6" : "rgba(255,255,255,0.1)"}`,
                        color: selectedBHK.includes(5) ? "white" : "#94A3B8",
                      }}
                    >
                      4+
                    </button>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <ChevronDown
                      className="w-3 h-3"
                      style={{ color: "#3B82F6" }}
                    />
                    <label
                      className="text-xs font-semibold"
                      style={{ color: "#F8FAFC" }}
                    >
                      Amenities
                    </label>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {AMENITY_LIST.map((a) => (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl text-[9px] font-semibold transition-all"
                        style={{
                          background: selectedAmenities.includes(a)
                            ? "rgba(59,130,246,0.15)"
                            : "rgba(255,255,255,0.04)",
                          border: `1px solid ${selectedAmenities.includes(a) ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.07)"}`,
                          color: selectedAmenities.includes(a)
                            ? "#3B82F6"
                            : "#94A3B8",
                        }}
                      >
                        {AMENITY_ICONS[a]}
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply button */}
                <button
                  className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                    color: "white",
                    boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
                  }}
                  id="apply-filters-btn"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Apply Filters
                </button>
              </div>
            </motion.aside>

            {/* ── RIGHT: GRID ── */}
            <div className="flex-1 min-w-0">
              {/* Results count */}
              {!loading && (
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm" style={{ color: "#94A3B8" }}>
                    <span className="font-bold" style={{ color: "#F8FAFC" }}>
                      {filtered.length}
                    </span>{" "}
                    {filtered.length === 1 ? "property" : "properties"} found
                    {activeFilters > 0 && (
                      <button
                        onClick={clearAll}
                        className="ml-3 text-xs inline-flex items-center gap-1"
                        style={{ color: "#3B82F6" }}
                      >
                        <X className="w-3 h-3" /> Clear filters
                      </button>
                    )}
                  </p>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.15)",
                    }}
                  >
                    <Building2
                      className="w-7 h-7 animate-pulse"
                      style={{ color: "#3B82F6" }}
                    />
                  </div>
                  <p className="text-sm" style={{ color: "#475569" }}>
                    Loading properties…
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.15)",
                    }}
                  >
                    <Building2
                      className="w-8 h-8 opacity-40"
                      style={{ color: "#3B82F6" }}
                    />
                  </div>
                  <p className="text-sm" style={{ color: "#475569" }}>
                    No properties match your filters.
                  </p>
                  <button onClick={clearAll} className="btn-secondary text-xs">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((p, i) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      index={i}
                      liked={likedIds.has(p.id)}
                      onLike={() => toggleLike(p.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════
              BOTTOM CTA BANNER
          ══════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
            style={{
              background: "rgba(11,18,32,0.9)",
              border: "1px solid rgba(59,130,246,0.2)",
              backdropFilter: "blur(30px)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute top-0 left-1/4 w-64 h-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(59,130,246,0.12), transparent)",
                filter: "blur(20px)",
              }}
            />

            {/* Left */}
            <div className="flex items-center gap-5 relative z-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(124,58,237,0.3))",
                  border: "1px solid rgba(59,130,246,0.3)",
                }}
              >
                <Sparkles className="w-7 h-7" style={{ color: "#22D3EE" }} />
              </div>
              <div>
                <h3
                  className="font-display font-bold text-lg mb-1"
                  style={{ color: "#F8FAFC" }}
                >
                  Let AI find the perfect property for you
                </h3>
                <p className="text-sm" style={{ color: "#94A3B8" }}>
                  Tell us what you're looking for and our AI will match the best
                  properties.
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6 relative z-10 shrink-0">
              <Link
                href="/voice-agent"
                id="cta-voice-btn"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                  color: "white",
                  boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
                }}
              >
                <div className="flex items-end gap-0.5" style={{ height: 14 }}>
                  {[5, 9, 13, 9, 5].map((h, i) => (
                    <motion.div
                      key={i}
                      style={{
                        width: 3,
                        height: h,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.8)",
                      }}
                      animate={{ scaleY: [1, 1.6, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                Speak with Voice AI
              </Link>

              <div className="hidden sm:flex flex-col items-start gap-1">
                <div className="flex -space-x-2"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
