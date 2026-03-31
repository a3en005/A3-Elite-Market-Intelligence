import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Zap, BarChart3, ArrowRight, Info } from 'lucide-react';
import { Card, Badge } from './UI';
import { motion } from 'framer-motion';
import { cn, formatPrice } from '../lib/utils';
import { ASSETS } from '../constants';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OrderFlowTabProps {
  symbol: string;
  currentPrice: number;
}

const OrderFlowTab: React.FC<OrderFlowTabProps> = ({ symbol, currentPrice }) => {
  const [orderFlow, setOrderFlow] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const asset = ASSETS.find(a => a.symbol === symbol);

  useEffect(() => {
    // Initialize volume data
    const initialData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      buy: Math.random() * 500 + 100,
      sell: Math.random() * 500 + 100,
    }));
    setVolumeData(initialData);

    // Simulate real-time order flow
    const interval = setInterval(() => {
      const isBuy = Math.random() > 0.5;
      const size = Math.random() * 50 + 1;
      const newOrder = {
        id: Math.random().toString(36).substring(7),
        time: new Date().toLocaleTimeString(),
        price: currentPrice + (Math.random() * 0.1 - 0.05),
        size: size.toFixed(2),
        side: isBuy ? 'BUY' : 'SELL',
        type: Math.random() > 0.8 ? 'INSTITUTIONAL' : 'RETAIL'
      };
      setOrderFlow(prev => [newOrder, ...prev].slice(0, 20));

      // Update volume data for the current hour
      const currentHour = new Date().getHours();
      setVolumeData(prev => prev.map((d, i) => {
        if (i === currentHour) {
          return {
            ...d,
            buy: isBuy ? d.buy + size : d.buy,
            sell: !isBuy ? d.sell + size : d.sell,
          };
        }
        return d;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card/50 backdrop-blur-md border border-border p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
            <Info size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display uppercase tracking-tight">{symbol} Order Flow</h3>
            <p className="text-xs text-text-secondary font-mono uppercase tracking-widest">Asset Class: {asset?.category || 'Unknown'}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Badge variant="info">Real-time Feed</Badge>
          <Badge variant="success">Institutional Grade</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <Card title="Volume Concentration (Buy vs Sell)" icon={<Activity size={18} />}>
          <div className="h-[400px] w-full bg-zinc-950/50 rounded-2xl p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="buy" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sell" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Buy Volume" icon={<TrendingUp size={16} />}>
            <div className="space-y-2">
              <p className="text-3xl font-display text-emerald-500">1,245.5M</p>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Last 24 Hours</p>
            </div>
          </Card>
          <Card title="Sell Volume" icon={<TrendingDown size={16} />}>
            <div className="space-y-2">
              <p className="text-3xl font-display text-rose-500">982.1M</p>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Last 24 Hours</p>
            </div>
          </Card>
          <Card title="Net Flow" icon={<Zap size={16} />}>
            <div className="space-y-2">
              <p className="text-3xl font-display text-accent">+263.4M</p>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Bullish Imbalance</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="lg:col-span-4">
        <Card title="Real-time Tape" icon={<BarChart3 size={18} />}>
          <div className="space-y-2 max-h-[600px] overflow-y-auto no-scrollbar">
            {orderFlow.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border border-border transition-all",
                  order.type === 'INSTITUTIONAL' ? "bg-accent/5 border-accent/20" : "bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-1.5 h-8 rounded-full",
                    order.side === 'BUY' ? "bg-emerald-500" : "bg-rose-500"
                  )} />
                  <div>
                    <p className="text-xs font-bold font-mono">{formatPrice(order.price, symbol)}</p>
                    <p className="text-[10px] text-text-secondary font-mono">{order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-xs font-bold font-mono",
                    order.side === 'BUY' ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {order.side === 'BUY' ? '+' : '-'}{order.size}
                  </p>
                  {order.type === 'INSTITUTIONAL' && (
                    <Badge variant="info" className="text-[8px] px-1 py-0 h-auto">INSTITUTIONAL</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
);
};

export default OrderFlowTab;
