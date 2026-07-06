'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Building2, Search, Brain, MapPin, TrendingUp, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { UIProperty } from '@/lib/mappers';
import { demoProperties } from '@/lib/utils';

const PROPERTY_TYPES = ['All', 'Apartment', 'Villa', 'Penthouse', 'Townhouse', '1BHK', '2BHK', '3BHK'];
const CITIES = ['All', 'Bangalore', 'Whitefield', 'Dubai', 'Abu Dhabi'];

export default function MarketplacePage() {
  const [properties, setProperties] = useState<UIProperty[]>([]);
  const [filtered, setFiltered] = useState<UIProperty[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [maxPrice, setMaxPrice] = useState(200_000_000);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: UIProperty[]) => {
        if (Array.isArray(d) && d.length) {
          setProperties(d);
        } else {
          setProperties(
            demoProperties.map(p => ({
              id: p.id,
              title: p.title,
              description: p.description,
              location: `${p.area}, ${p.city}`,
              area: p.area ?? '',
              city: p.city,
              property_type: p.property_type,
              price: p.price,
              currency: p.currency,
              amenities: [],
              featured: p.featured ?? false,
              status: p.status ?? 'available',
              investment_score: p.investment_score ?? 80,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...properties];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.area?.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.property_type.toLowerCase().includes(q)
      );
    }
    if (selectedType !== 'All') {
      result = result.filter(p =>
        p.property_type.toLowerCase().includes(selectedType.toLowerCase())
      );
    }
    if (selectedCity !== 'All') {
      result = result.filter(
        p =>
          p.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
          p.location.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }
    result = result.filter(p => p.price <= maxPrice);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'score') result.sort((a, b) => b.investment_score - a.investment_score);
    setFiltered(result);
  }, [properties, search, selectedType, selectedCity, maxPrice, sortBy]);

  const colors = ['from-amber-900/40', 'from-blue-900/40', 'from-emerald-900/40', 'from-violet-900/40', 'from-rose-900/40', 'from-cyan-900/40'];

  return (
    <div className="min-h-screen pt-20 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-champagne-400 text-sm font-medium uppercase tracking-widest">Live from Supabase</span>
          <h1 className="text-4xl font-bold text-ivory-100 mt-2 mb-2">Property Marketplace</h1>
          <p className="text-gray-400">Same inventory indexed in Qdrant and served by your n8n voice agent.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search properties, areas, types..."
              className="w-full glass border border-champagne-500/10 focus:border-champagne-500/30 rounded-xl pl-10 pr-4 py-3 text-ivory-100 placeholder-gray-500 outline-none text-sm" />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="glass border border-champagne-500/10 rounded-xl px-4 py-3 text-sm text-ivory-100 outline-none bg-transparent">
            <option value="featured" className="bg-obsidian-800">Featured First</option>
            <option value="price-asc" className="bg-obsidian-800">Price: Low → High</option>
            <option value="price-desc" className="bg-obsidian-800">Price: High → Low</option>
            <option value="score" className="bg-obsidian-800">AI Score</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 glass border border-champagne-500/20 rounded-xl px-4 py-3 text-sm text-champagne-400 hover:border-champagne-500/40 transition-all">
            <Filter className="w-4 h-4" />Filters
          </button>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="glass rounded-2xl p-6 mb-6 border border-champagne-500/10">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider">Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map(t => (
                      <button key={t} onClick={() => setSelectedType(t)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${selectedType === t ? 'border-champagne-500 text-champagne-400 bg-champagne-500/10' : 'border-white/10 text-gray-400 hover:border-champagne-500/30'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider">Location</label>
                  <div className="flex flex-wrap gap-2">
                    {CITIES.map(c => (
                      <button key={c} onClick={() => setSelectedCity(c)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${selectedCity === c ? 'border-champagne-500 text-champagne-400 bg-champagne-500/10' : 'border-white/10 text-gray-400 hover:border-champagne-500/30'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider">Max Price: {formatPrice(maxPrice)}</label>
                  <input type="range" min={5000000} max={200000000} step={5000000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
                    className="w-full accent-yellow-500" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading properties from Supabase…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property, i) => (
              <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }} className="glass rounded-2xl overflow-hidden border border-champagne-500/10 hover:border-champagne-500/30 transition-all duration-300 group">
                <div className={`relative h-52 bg-gradient-to-br ${colors[i % colors.length]} to-obsidian-800`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-champagne-500/15" />
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    {property.featured && <span className="bg-champagne-500 text-obsidian-900 text-xs font-bold px-2 py-0.5 rounded-full">★ Featured</span>}
                    {property.status === 'off-plan' && <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Off-Plan</span>}
                  </div>
                  <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 flex items-center gap-1.5">
                    <Brain className="w-3 h-3 text-champagne-400" />
                    <span className="text-xs font-bold text-champagne-400">{property.investment_score}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/70 text-xs">
                    <MapPin className="w-3 h-3" />{property.location}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-semibold text-ivory-100">{property.title}</h3>
                    <span className="text-xs text-champagne-400 ml-2 shrink-0 glass px-2 py-0.5 rounded-md">{property.property_type}</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-4 line-clamp-2">{property.description}</p>
                  {property.amenities.length > 0 && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">{property.amenities.slice(0, 3).join(' · ')}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-champagne-400 font-bold text-lg">{formatPrice(property.price, property.currency)}</p>
                      {property.minimum_price && (
                        <p className="text-xs text-gray-500">Floor: {formatPrice(property.minimum_price)}</p>
                      )}
                    </div>
                    <Link href={`/property/${property.id}`}
                      className="bg-gradient-to-r from-champagne-600 to-champagne-500 text-obsidian-900 text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No properties match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
