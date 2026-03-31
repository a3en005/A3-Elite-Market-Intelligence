import React, { useState } from 'react';
import { Columns, Plus, Trash2, TrendingUp, TrendingDown, Activity, Zap, Info, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from './UI';
import { ASSETS } from '../constants';
import { cn, formatPrice } from '../lib/utils';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

import { PriceData } from '../types';

interface ComparisonTabProps {
  prices: Record<string, PriceData>;
  onViewAnalysis: (symbol: string) => void;
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({ prices, onViewAnalysis }) => {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['BTCUSD', 'ETHUSD', 'XAUUSD']);

  const addAsset = (symbol: string) => {
    if (selectedSymbols.length < 5 && !selectedSymbols.includes(symbol)) {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const removeAsset = (symbol: string) => {
    if (selectedSymbols.length > 1) {
      setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
    }
  };

  const getAssetData = (symbol: string) => {
    const asset = ASSETS.find(a => a.symbol === symbol);
    const priceData = prices[symbol];
    const price = priceData?.price || 0;
    const change = priceData?.change24h?.toFixed(2) || '0.00';
    const volatility = (Math.random() * 5 + 1).toFixed(2);
    const volume = (Math.random() * 1000 + 500).toFixed(1) + 'M';
    
    // Mock sparkline data based on current price
    const sparkline = Array.from({ length: 20 }, (_, i) => ({
      value: price + (Math.random() * (price * 0.01) - (price * 0.005))
    }));

    return { ...asset, price, change, volatility, volume, sparkline };
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Badge variant="success">Multi-Asset Correlation Engine</Badge>
          <h2 className="text-7xl font-display font-black tracking-tighter uppercase">Asset Comparison</h2>
          <p className="text-text-secondary text-2xl font-light max-w-2xl">
            Analyze relative performance and cross-asset correlations with institutional-grade metrics.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <select 
              className="bg-zinc-900 border border-white/10 rounded-xl px-6 py-3 text-sm font-bold focus:outline-none focus:ring-2 ring-accent/50 appearance-none pr-12"
              onChange={(e) => addAsset(e.target.value)}
              value=""
            >
              <option value="" disabled>Add Asset to Compare</option>
              {ASSETS.filter(a => !selectedSymbols.includes(a.symbol)).map(a => (
                <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
              <Plus size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {selectedSymbols.map((symbol, index) => {
          const data = getAssetData(symbol);
          const isPositive = Number(data.change) >= 0;

          return (
            <motion.div
              key={symbol}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative terminal-glass p-8 rounded-[3rem] border border-white/5 hover:border-accent/30 transition-all"
            >
              <button 
                onClick={() => removeAsset(symbol)}
                className="absolute top-6 right-6 w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-text-secondary hover:bg-rose-500/20 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center font-black text-accent text-xl">
                    {symbol[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold tracking-tight">{symbol}</h3>
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">{data.category}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-4xl font-display font-bold tracking-tighter">${formatPrice(data.price, symbol)}</p>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-bold",
                    isPositive ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {isPositive ? '+' : ''}{data.change}%
                  </div>
                </div>

                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.sparkline}>
                      <defs>
                        <linearGradient id={`color-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={isPositive ? "#10b981" : "#f43f5e"} 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill={`url(#color-${symbol})`} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Volatility</p>
                    <p className="text-sm font-mono font-bold text-white">{data.volatility}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Volume (24h)</p>
                    <p className="text-sm font-mono font-bold text-white">{data.volume}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-secondary">
                    <span>Market Strength</span>
                    <span className={isPositive ? "text-emerald-500" : "text-rose-500"}>{isPositive ? 'Strong' : 'Weak'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", isPositive ? "bg-emerald-500" : "bg-rose-500")} 
                      style={{ width: `${Math.random() * 60 + 40}%` }} 
                    />
                  </div>
                </div>

                <Button 
                  variant="secondary" 
                  className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest"
                  onClick={() => onViewAnalysis(symbol)}
                >
                  View Analysis
                </Button>
              </div>
            </motion.div>
          );
        })}

        {selectedSymbols.length < 5 && (
          <div className="h-full min-h-[400px] terminal-glass rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8 hover:bg-white/5 transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Plus size={32} className="text-white/20 group-hover:text-accent transition-colors" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Add Asset</h3>
            <p className="text-text-secondary text-xs">Compare up to 5 assets simultaneously.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Correlation Matrix" icon={<Columns size={18} />}>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <Zap size={16} className="text-accent" />
                <span className="text-sm font-bold">BTC / ETH Correlation</span>
              </div>
              <span className="text-emerald-500 font-mono font-bold">0.92</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <Zap size={16} className="text-accent" />
                <span className="text-sm font-bold">BTC / XAU Correlation</span>
              </div>
              <span className="text-rose-500 font-mono font-bold">-0.15</span>
            </div>
          </div>
        </Card>

        <Card title="Relative Strength Index" icon={<Activity size={18} />}>
          <div className="space-y-6 mt-4">
            {selectedSymbols.slice(0, 3).map(s => (
              <div key={s} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>{s} RSI</span>
                  <span className="text-accent">62.4</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '62.4%' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Market Volatility Index" icon={<BarChart3 size={18} />}>
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <div className="text-5xl font-display font-black text-white mb-2">24.5</div>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Average VIX across selected assets</p>
            <div className="mt-6 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">
              Stable Regime
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonTab;
