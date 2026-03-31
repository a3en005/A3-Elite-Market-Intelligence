import React, { useState } from 'react';
import { ASSETS } from '../constants';
import { Signal } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { Badge } from './UI';
import { TrendingUp, TrendingDown, Star, Zap, ArrowUpRight, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

interface SignalsTabProps {
  signals: Signal[];
  onAddToJournal: (signal: Signal) => void;
  onSelectAsset?: (asset: typeof ASSETS[0]) => void;
}

const SignalsTab: React.FC<SignalsTabProps> = ({ signals, onAddToJournal, onSelectAsset }) => {
  const [filterTier, setFilterTier] = useState<number | 'all'>('all');
  const [filterDirection, setFilterDirection] = useState<'LONG' | 'SHORT' | 'all'>('all');
  const [filterConfidence, setFilterConfidence] = useState<number | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredSignals = signals.filter(s => {
    if (filterTier !== 'all' && s.tier !== filterTier) return false;
    if (filterDirection !== 'all' && s.direction !== filterDirection) return false;
    if (filterConfidence !== 'all' && s.confidence < (filterConfidence as number)) return false;
    if (filterCategory !== 'all') {
      const asset = ASSETS.find(a => a.symbol === s.symbol);
      if (asset?.category.toUpperCase() !== filterCategory.toUpperCase()) return false;
    }
    return true;
  });

  const sortedSignals = [...filteredSignals].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
          <Badge variant="info">Institutional Signals</Badge>
          <h2 className="text-8xl font-display font-black tracking-tighter leading-none">Market Signals</h2>
          <p className="text-text-secondary text-3xl font-light max-w-2xl leading-relaxed">
            Real-time institutional-grade trading setups, precision engineered for the modern trader.
          </p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-4">
            <Badge variant="info" className="bg-accent/10 text-accent border-accent/20 px-6 py-3 text-xs">Unicorn: {signals.filter(s => s.tier === 0).length}</Badge>
            <Badge variant="success" className="bg-accent text-white border-none px-6 py-3 text-xs">Elite: {signals.filter(s => s.tier === 1).length}</Badge>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-border"
          >
            <Filter size={14} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 terminal-glass rounded-[2rem] grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Tier</p>
                <div className="flex flex-wrap gap-2">
                  {['all', 0, 1].map(tier => (
                    <button
                      key={tier}
                      onClick={() => setFilterTier(tier as any)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        filterTier === tier ? "bg-accent text-white" : "bg-white/5 text-text-secondary hover:bg-white/10"
                      )}
                    >
                      {tier === 'all' ? 'All' : tier === 0 ? 'Unicorn' : 'Elite'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Direction</p>
                <div className="flex flex-wrap gap-2">
                  {['all', 'LONG', 'SHORT'].map(dir => (
                    <button
                      key={dir}
                      onClick={() => setFilterDirection(dir as any)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        filterDirection === dir ? "bg-accent text-white" : "bg-white/5 text-text-secondary hover:bg-white/10"
                      )}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Category</p>
                <div className="flex flex-wrap gap-2">
                  {['all', 'FOREX', 'METALS', 'INDICES', 'CRYPTO', 'COMMODITIES'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        filterCategory === cat ? "bg-accent text-white" : "bg-white/5 text-text-secondary hover:bg-white/10"
                      )}
                    >
                      {cat === 'all' ? 'All' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Min Confidence</p>
                <div className="flex flex-wrap gap-2">
                  {['all', 3, 4, 5].map(conf => (
                    <button
                      key={conf}
                      onClick={() => setFilterConfidence(conf as any)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        filterConfidence === conf ? "bg-accent text-white" : "bg-white/5 text-text-secondary hover:bg-white/10"
                      )}
                    >
                      {conf === 'all' ? 'All' : `${conf}+ Stars`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {sortedSignals.map((signal, index) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.8 }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.02,
                y: -10,
                borderColor: 'rgba(16, 185, 129, 0.4)',
                boxShadow: '0 30px 60px -12px rgba(16, 185, 129, 0.25)',
                duration: 0.4,
                ease: "back.out(1.7)"
              });
              
              // Pulse confidence stars
              const stars = e.currentTarget.querySelectorAll('.confidence-star');
              gsap.to(stars, {
                scale: 1.3,
                opacity: 1,
                duration: 0.3,
                stagger: 0.05,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
              });

              // Scale asset symbol
              const symbol = e.currentTarget.querySelector('.asset-symbol');
              gsap.to(symbol, {
                scale: 1.15,
                duration: 0.4,
                ease: "power2.out"
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                y: 0,
                borderColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: 'none',
                duration: 0.4,
                ease: "power2.out"
              });

              // Reset stars
              const stars = e.currentTarget.querySelectorAll('.confidence-star');
              gsap.killTweensOf(stars);
              gsap.to(stars, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
              });

              // Reset symbol
              const symbol = e.currentTarget.querySelector('.asset-symbol');
              gsap.to(symbol, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
              });
            }}
          >
            <div 
              className={cn(
                "relative overflow-hidden group terminal-glass p-12 rounded-[3.5rem] transition-all",
                signal.tier === 0 ? "ring-2 ring-accent/20" : ""
              )}
            >
              {signal.tier === 0 && (
                <div className="absolute top-0 right-0 bg-accent text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-bl-[2rem] flex items-center gap-2 shadow-2xl">
                  <Zap size={12} fill="currentColor" /> Unicorn Model
                </div>
              )}
              
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-3">
                  <h3 className="asset-symbol text-4xl font-display font-bold tracking-tighter text-white origin-left">{signal.symbol}</h3>
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={cn(
                          "confidence-star transition-colors",
                          i < signal.confidence ? "text-accent fill-accent" : "text-white/10"
                        )} 
                      />
                    ))}
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-2 font-black px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase transition-all",
                  signal.direction === 'LONG' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                )}>
                  {signal.direction === 'LONG' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {signal.direction}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="space-y-2">
                  <p className="text-[10px] text-text-secondary uppercase font-black tracking-[0.3em]">Entry</p>
                  <p className="text-xl font-mono font-bold text-white tracking-tighter">{formatPrice(signal.entry, signal.symbol)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-text-secondary uppercase font-black tracking-[0.3em]">Stop</p>
                  <p className="text-xl font-mono font-bold text-text-secondary/40 tracking-tighter">{formatPrice(signal.stop, signal.symbol)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-text-secondary uppercase font-black tracking-[0.3em]">Target</p>
                  <p className="text-xl font-mono font-bold text-white tracking-tighter">{formatPrice(signal.target, signal.symbol)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-border">
                <div className="text-[10px] text-text-secondary/40 font-mono tracking-[0.3em] uppercase">
                  {new Date(signal.timestamp).toLocaleTimeString()} UTC
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onAddToJournal(signal)}
                    className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white hover:text-accent transition-all group"
                  >
                    Journal <ArrowUpRight size={18} className="text-white/20 group-hover:text-accent transition-colors" />
                  </button>
                  <button 
                    onClick={() => {
                      const asset = ASSETS.find(a => a.symbol === signal.symbol);
                      if (asset) onSelectAsset?.(asset);
                    }}
                    className="p-2 bg-white/5 rounded-lg hover:bg-accent transition-all group"
                  >
                    <ArrowUpRight size={16} className="text-text-secondary group-hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {sortedSignals.length === 0 && (
          <div className="col-span-full py-48 text-center bg-card rounded-[4rem] border-2 border-dashed border-border">
            <Zap size={64} className="mx-auto text-white/5 mb-8" />
            <p className="text-text-secondary text-2xl font-light italic">
              {signals.length === 0 
                ? "Scanning markets for institutional setups..." 
                : "No signals matching your current filters..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalsTab;
