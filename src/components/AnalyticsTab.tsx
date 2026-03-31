import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Card, Badge } from './UI';
import { Activity, TrendingUp, BarChart3, Zap, Globe, Clock, ChevronDown } from 'lucide-react';
import { ASSETS } from '../constants';
import { cn } from '../lib/utils';

const data = [
  { time: '00:00', volume: 4000, volatility: 2400 },
  { time: '04:00', volume: 3000, volatility: 1398 },
  { time: '08:00', volume: 9800, volatility: 9800 },
  { time: '12:00', volume: 3908, volatility: 3908 },
  { time: '16:00', volume: 4800, volatility: 4800 },
  { time: '20:00', volume: 3800, volatility: 3800 },
  { time: '23:59', volume: 4300, volatility: 4300 },
];

const sessionData = [
  { name: 'London', value: 45, color: '#10b981' },
  { name: 'New York', value: 35, color: '#059669' },
  { name: 'Tokyo', value: 15, color: '#065f46' },
  { name: 'Sydney', value: 5, color: '#064e3b' },
];

export default function AnalyticsTab() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
          <Badge variant="info">Institutional Analytics</Badge>
          <h2 className="text-8xl font-display font-black tracking-tighter leading-none uppercase">Market Intelligence</h2>
          <p className="text-text-secondary text-3xl font-light max-w-3xl leading-relaxed">
            Deep-dive into market dynamics, liquidity flows, and institutional positioning for <span className="text-white font-bold">{selectedAsset.name}</span>.
          </p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex items-center gap-4 px-8 py-4 terminal-glass rounded-2xl hover:bg-white/5 transition-all min-w-[240px] justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedAsset.icon}</span>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest text-text-secondary">Selected Asset</p>
                <p className="text-lg font-display font-bold text-white uppercase">{selectedAsset.symbol}</p>
              </div>
            </div>
            <ChevronDown size={20} className={cn("text-text-secondary transition-transform", isSelectorOpen && "rotate-180")} />
          </button>

          {isSelectorOpen && (
            <div className="absolute top-full right-0 mt-4 w-full terminal-glass rounded-2xl p-4 z-50 max-h-[400px] overflow-y-auto no-scrollbar shadow-2xl">
              {ASSETS.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => {
                    setSelectedAsset(asset);
                    setIsSelectorOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5",
                    selectedAsset.symbol === asset.symbol ? "bg-accent/10 text-accent" : "text-text-secondary"
                  )}
                >
                  <span className="text-xl">{asset.icon}</span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white uppercase">{asset.symbol}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">{asset.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Chart */}
        <Card className="lg:col-span-8 p-12 terminal-glass rounded-[3.5rem]" title="Volatility & Volume" icon={<Activity size={24} className="text-accent" />}>
          <div className="h-[500px] w-full mt-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#ffffff20" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={15}
                  fontFamily="JetBrains Mono"
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '2rem',
                    fontSize: '14px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    color: '#f8fafc'
                  }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volatility" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVol)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#ffffff20" 
                  strokeWidth={2}
                  strokeDasharray="8 8"
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Session Distribution */}
        <Card className="lg:col-span-4 p-12 terminal-glass rounded-[3.5rem]" title="Liquidity Concentration" icon={<Globe size={24} className="text-accent" />}>
          <div className="h-[500px] w-full mt-12 flex flex-col justify-between">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionData} layout="vertical" margin={{ left: 0, right: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#ffffff20" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    width={100}
                    fontFamily="Inter"
                    fontWeight={600}
                  />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(255,255,255,0.05)', 
                      borderRadius: '1.5rem',
                      fontSize: '14px',
                      color: '#f8fafc'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                    {sessionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-6 pt-12">
              {sessionData.map((session) => (
                <div key={session.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: session.color }} />
                    <span className="text-sm font-bold text-text-secondary uppercase tracking-widest">{session.name} Session</span>
                  </div>
                  <span className="text-lg font-display font-black text-white">{session.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <Card className="p-12 terminal-glass rounded-[3.5rem]" title="Average Daily Range" icon={<TrendingUp size={24} className="text-accent" />}>
          <div className="mt-6">
            <p className="text-6xl font-display font-bold tracking-tighter text-white">142.5 Pips</p>
            <p className="text-sm text-accent font-black mt-3 uppercase tracking-[0.3em]">+12% from last week</p>
          </div>
        </Card>
        
        <Card className="p-12 terminal-glass rounded-[3.5rem]" title="Institutional Flow" icon={<Zap size={24} className="text-accent" />}>
          <div className="mt-6">
            <p className="text-6xl font-display font-bold tracking-tighter text-white">Net Long</p>
            <p className="text-sm text-text-secondary font-black mt-3 uppercase tracking-[0.3em]">COT Data Confidence: High</p>
          </div>
        </Card>

        <Card className="p-12 terminal-glass rounded-[3.5rem]" title="Market Efficiency" icon={<Clock size={24} className="text-accent" />}>
          <div className="mt-6">
            <p className="text-6xl font-display font-bold tracking-tighter text-white">84.2%</p>
            <p className="text-sm text-text-secondary font-black mt-3 uppercase tracking-[0.3em]">FVG Rebalance Rate</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

