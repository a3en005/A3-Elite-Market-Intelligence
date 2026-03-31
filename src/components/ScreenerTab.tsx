import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowUpRight, Activity, X, TrendingUp, History as HistoryIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ASSETS } from '../constants';
import { Card, Badge, Button, Modal } from './UI';
import { cn, formatPrice, getChangeColor } from '../lib/utils';
import { PriceData } from '../types';

interface ScreenerTabProps {
  prices: Record<string, PriceData>;
  onSelectAsset?: (asset: typeof ASSETS[0]) => void;
}

export default function ScreenerTab({ prices, onSelectAsset }: ScreenerTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHistoryAsset, setSelectedHistoryAsset] = useState<typeof ASSETS[0] | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const filteredAssets = ASSETS.filter(asset => 
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedHistoryAsset) {
      fetchHistory(selectedHistoryAsset.symbol);
    }
  }, [selectedHistoryAsset]);

  const fetchHistory = async (symbol: string) => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`/api/mkt/history/${symbol}`);
      if (response.ok) {
        const data = await response.json();
        setHistoryData(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
          <Badge variant="info">Institutional Screener</Badge>
          <h2 className="text-8xl font-display font-black tracking-tighter leading-none">Market Pulse</h2>
          <p className="text-text-secondary text-3xl font-light max-w-2xl leading-relaxed">
            Real-time institutional bias and liquidity tracking across global markets.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-text-secondary/50 group-focus-within:text-accent transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-border rounded-[2rem] py-6 pl-20 pr-10 text-lg focus:outline-none focus:border-accent transition-all w-96 font-bold"
            />
          </div>
          <Button variant="secondary" className="px-10 py-6 rounded-[2rem] border border-border bg-white/5">
            <Filter size={24} />
            <span className="text-lg">Filters</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredAssets.map((asset, index) => {
          const priceData = prices[asset.symbol];
          const price = priceData?.price || 0;
          const change = priceData?.change24h || 0;
          const isBullish = change >= 0;

          return (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.8 }}
            >
              <Card className="group cursor-pointer hover:bg-white/5 border-border bg-card p-12 rounded-[3.5rem] transition-all relative overflow-hidden">
                <div className="flex items-start justify-between mb-12">
                  <div className="space-y-3">
                    <h3 className="text-5xl font-display font-bold tracking-tighter text-white">{asset.symbol}</h3>
                    <p className="text-xs text-text-secondary font-black uppercase tracking-[0.4em]">{asset.name}</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHistoryAsset(asset);
                      }}
                      className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-text-secondary hover:bg-white/10 transition-all duration-300"
                      title="View History"
                    >
                      <HistoryIcon size={24} />
                    </button>
                    <button 
                      onClick={() => onSelectAsset?.(asset)}
                      className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-text-secondary group-hover:bg-accent group-hover:text-white transition-all duration-500"
                    >
                      <ArrowUpRight size={32} />
                    </button>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="flex items-end justify-between">
                    <div className="space-y-3">
                      <p className="text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Current Price</p>
                      <p className="text-4xl font-mono font-bold tracking-tighter text-white">
                        {price > 0 ? formatPrice(price, asset.symbol) : '---'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-xl font-bold", getChangeColor(change))}>
                        {change > 0 ? '+' : ''}{change.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-border w-full" />

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <p className="text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Bias</p>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-full", isBullish ? "bg-emerald-500" : "bg-rose-500")} />
                        <span className="text-base font-bold text-white">{isBullish ? 'Bullish' : 'Bearish'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Volatility</p>
                      <div className="flex items-center gap-3">
                        <Activity size={20} className="text-text-secondary" />
                        <span className="text-base font-bold text-white">
                          {Math.abs(change) > 1.5 ? 'High' : Math.abs(change) > 0.5 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <Badge variant="info" className="bg-accent/10 text-accent border-accent/20 text-[10px] px-4 py-2">H4 Structure</Badge>
                    <Badge variant="info" className="bg-white/5 text-text-secondary border-border text-[10px] px-4 py-2">{asset.category}</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Modal
        isOpen={!!selectedHistoryAsset}
        onClose={() => setSelectedHistoryAsset(null)}
        title={`${selectedHistoryAsset?.symbol} Performance History`}
        className="max-w-6xl"
      >
        <div className="p-12 space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-black text-text-secondary uppercase tracking-[0.4em]">Historical Analysis</p>
              <h4 className="text-5xl font-display font-bold tracking-tighter">{selectedHistoryAsset?.name}</h4>
            </div>
            <div className="text-right space-y-2">
              <p className="text-xs font-black text-text-secondary uppercase tracking-[0.4em]">Current Price</p>
              <p className="text-4xl font-mono font-bold tracking-tighter">
                {selectedHistoryAsset && prices[selectedHistoryAsset.symbol] 
                  ? formatPrice(prices[selectedHistoryAsset.symbol].price, selectedHistoryAsset.symbol) 
                  : '---'}
              </p>
            </div>
          </div>

          <div className="h-[500px] w-full bg-white/5 rounded-[3rem] p-10 border border-border">
            {isLoadingHistory ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                  <Activity size={48} className="text-accent animate-pulse" />
                  <p className="text-text-secondary font-bold uppercase tracking-widest">Retrieving Institutional Data...</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F27D26" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#ffffff40" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#ffffff40', fontWeight: 'bold' }}
                  />
                  <YAxis 
                    stroke="#ffffff40" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    domain={['auto', 'auto']}
                    tick={{ fill: '#ffffff40', fontWeight: 'bold' }}
                    tickFormatter={(val) => val.toLocaleString()}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#151619', 
                      border: '1px solid #ffffff10',
                      borderRadius: '1.5rem',
                      padding: '1.5rem'
                    }}
                    itemStyle={{ color: '#F27D26', fontWeight: 'bold' }}
                    labelStyle={{ color: '#ffffff40', marginBottom: '0.5rem', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#F27D26" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="p-8 rounded-[2rem] bg-white/5 border border-border space-y-2">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">24h High</p>
              <p className="text-2xl font-mono font-bold">
                {historyData.length > 0 ? Math.max(...historyData.map(d => d.price)).toLocaleString() : '---'}
              </p>
            </div>
            <div className="p-8 rounded-[2rem] bg-white/5 border border-border space-y-2">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">24h Low</p>
              <p className="text-2xl font-mono font-bold">
                {historyData.length > 0 ? Math.min(...historyData.map(d => d.price)).toLocaleString() : '---'}
              </p>
            </div>
            <div className="p-8 rounded-[2rem] bg-white/5 border border-border space-y-2">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Avg Price</p>
              <p className="text-2xl font-mono font-bold">
                {historyData.length > 0 ? (historyData.reduce((acc, d) => acc + d.price, 0) / historyData.length).toLocaleString() : '---'}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

