import React, { useState, useEffect } from 'react';
import { EconomicEvent } from '../types';
import { Card, Badge } from './UI';
import { Calendar as CalendarIcon, Clock, Globe, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const CalendarTab: React.FC = () => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);

  useEffect(() => {
    // Simulated economic calendar data
    const mockEvents: EconomicEvent[] = [
      { id: '1', time: '12:30', currency: 'USD', event: 'Core Durable Goods Orders m/m', impact: 'High', forecast: '0.4%', previous: '0.3%' },
      { id: '2', time: '14:00', currency: 'USD', event: 'CB Consumer Confidence', impact: 'High', forecast: '106.9', previous: '106.7' },
      { id: '3', time: '14:00', currency: 'USD', event: 'Richmond Manufacturing Index', impact: 'Medium', forecast: '-4', previous: '-5' },
      { id: '4', time: '20:30', currency: 'AUD', event: 'CPI q/q', impact: 'High', forecast: '0.8%', previous: '0.6%' },
      { id: '5', time: '07:00', currency: 'GBP', event: 'CPI y/y', impact: 'High', forecast: '3.5%', previous: '4.0%' },
      { id: '6', time: '09:00', currency: 'EUR', event: 'German Flash Manufacturing PMI', impact: 'Medium', forecast: '43.1', previous: '42.5' },
    ];
    setEvents(mockEvents);
  }, []);

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
          <Badge variant="info">Institutional Calendar</Badge>
          <h2 className="text-8xl font-display font-black tracking-tighter leading-none">Market Catalysts</h2>
          <p className="text-text-secondary text-3xl font-light max-w-2xl leading-relaxed">
            High-impact news and market-moving events curated for institutional precision.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-text-secondary bg-white/5 px-6 py-3 rounded-full border border-border backdrop-blur-md">
          <Globe size={18} />
          <span className="tracking-widest uppercase">All times in UTC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
          >
            <Card className="group hover:bg-white/5 p-10 terminal-glass rounded-[3rem]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="flex items-center gap-12">
                  <div className="flex flex-col items-center justify-center min-w-[120px] py-6 bg-white/5 rounded-[2rem] border border-border group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <Clock size={20} className="mb-3 opacity-50" />
                    <span className="text-3xl font-display font-black tracking-tighter">{event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center font-black text-lg border border-border text-text-secondary">
                      {event.currency}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-4xl font-display font-bold text-white tracking-tight group-hover:translate-x-2 transition-transform">{event.event}</h4>
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={event.impact === 'High' ? 'danger' : (event.impact === 'Medium' ? 'warning' : 'default')}
                          className="px-5 py-2 text-xs"
                        >
                          {event.impact} Impact
                        </Badge>
                        {event.impact === 'High' && (
                          <div className="flex items-center gap-2 text-rose-500">
                            <AlertTriangle size={18} className="animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">High Volatility Risk</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-16 lg:pr-12">
                  <div className="text-center space-y-2">
                    <p className="text-xs text-text-secondary uppercase font-black tracking-[0.3em]">Forecast</p>
                    <p className="text-3xl font-mono font-bold text-white">{event.forecast}</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-center space-y-2">
                    <p className="text-xs text-text-secondary uppercase font-black tracking-[0.3em]">Previous</p>
                    <p className="text-3xl font-mono font-bold text-text-secondary">{event.previous}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="terminal-glass border-rose-500/20 rounded-[3.5rem] p-12 flex items-start gap-8"
      >
        <div className="w-16 h-16 rounded-[1.5rem] bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-4">
          <p className="text-3xl font-display font-bold text-rose-500 tracking-tight">Institutional Risk Protocol</p>
          <p className="text-text-secondary text-xl leading-relaxed max-w-5xl font-medium">
            Trading during high-impact news events can result in significant slippage and extreme volatility. 
            A3-Elite recommends reducing risk or moving to break-even before major releases. 
            Institutional liquidity often dries up seconds before the release, leading to unpredictable price action.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarTab;
