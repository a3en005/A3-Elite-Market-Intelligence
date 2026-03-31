import React, { useState } from 'react';
import { Play, RotateCcw, Settings, BarChart3, TrendingUp, History, Download, Info } from 'lucide-react';
import { Card, Button, Badge } from './UI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '../lib/utils';

interface BacktestResult {
  equityCurve: { date: string; balance: number }[];
  trades: { id: string; symbol: string; side: 'BUY' | 'SELL'; entry: number; exit: number; pnl: number; date: string }[];
  metrics: {
    totalProfit: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    totalTrades: number;
  };
}

const BacktestingTab: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [params, setParams] = useState({
    strategy: 'EMA Crossover',
    symbol: 'BTC/USDT',
    timeframe: '1H',
    period: 'Last 30 Days',
    riskPerTrade: 1, // %
    initialBalance: 10000
  });

  const runBacktest = () => {
    setIsTesting(true);
    // Simulate backtest processing
    setTimeout(() => {
      const mockEquityCurve = Array.from({ length: 30 }, (_, i) => ({
        date: `Day ${i + 1}`,
        balance: 10000 + Math.random() * 2000 * (i / 10) - (Math.random() * 500)
      }));

      const mockTrades = Array.from({ length: 15 }, (_, i) => ({
        id: `T-${i}`,
        symbol: params.symbol,
        side: Math.random() > 0.5 ? 'BUY' : 'SELL' as 'BUY' | 'SELL',
        entry: 50000 + Math.random() * 1000,
        exit: 51000 + Math.random() * 1000,
        pnl: Math.random() * 400 - 100,
        date: `2024-03-${(i + 1).toString().padStart(2, '0')}`
      }));

      setResults({
        equityCurve: mockEquityCurve,
        trades: mockTrades,
        metrics: {
          totalProfit: 1245.50,
          winRate: 64.5,
          profitFactor: 1.85,
          maxDrawdown: 4.2,
          totalTrades: 15
        }
      });
      setIsTesting(false);
    }, 2000);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Badge variant="info">Strategy Engine v2.0</Badge>
          <h2 className="text-7xl font-display font-black tracking-tighter uppercase">Backtesting</h2>
          <p className="text-text-secondary text-2xl font-light max-w-2xl">
            Validate your edge against historical market dynamics with institutional precision.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setResults(null)} className="px-6 py-4">
            <RotateCcw size={20} /> Reset
          </Button>
          <Button 
            variant="primary" 
            onClick={runBacktest} 
            disabled={isTesting}
            className="px-10 py-4 text-lg font-bold"
          >
            {isTesting ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Play size={20} fill="currentColor" /> Run Simulation
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-8">
          <Card title="Strategy Parameters" icon={<Settings size={18} />}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Strategy Model</label>
                <select 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 ring-accent/50"
                  value={params.strategy}
                  onChange={(e) => setParams({...params, strategy: e.target.value})}
                >
                  <option>EMA Crossover</option>
                  <option>Mean Reversion</option>
                  <option>Breakout Momentum</option>
                  <option>Order Block Rejection</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Asset</label>
                  <select 
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 ring-accent/50"
                    value={params.symbol}
                    onChange={(e) => setParams({...params, symbol: e.target.value})}
                  >
                    <option>BTC/USDT</option>
                    <option>ETH/USDT</option>
                    <option>EUR/USD</option>
                    <option>XAU/USD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Timeframe</label>
                  <select 
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 ring-accent/50"
                    value={params.timeframe}
                    onChange={(e) => setParams({...params, timeframe: e.target.value})}
                  >
                    <option>15M</option>
                    <option>1H</option>
                    <option>4H</option>
                    <option>1D</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Initial Balance ($)</label>
                <input 
                  type="number"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 ring-accent/50"
                  value={params.initialBalance}
                  onChange={(e) => setParams({...params, initialBalance: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Risk Per Trade (%)</label>
                <input 
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  className="w-full accent-accent"
                  value={params.riskPerTrade}
                  onChange={(e) => setParams({...params, riskPerTrade: Number(e.target.value)})}
                />
                <div className="flex justify-between text-[10px] font-bold text-text-secondary">
                  <span>0.1%</span>
                  <span className="text-accent">{params.riskPerTrade}%</span>
                  <span>5.0%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Simulation Info" icon={<Info size={18} />}>
            <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
              <p>Historical data is sourced from institutional feeds with 99.9% modeling quality.</p>
              <p>Trading fees and slippage are simulated based on average market conditions.</p>
            </div>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          {!results ? (
            <div className="h-full min-h-[600px] terminal-glass rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                <History size={48} className="text-white/20" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">No Active Simulation</h3>
              <p className="text-text-secondary max-w-md">Configure your strategy parameters and run a backtest to visualize historical performance metrics.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="terminal-glass p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Net Profit</p>
                  <p className="text-2xl font-display font-bold text-emerald-500">+${results.metrics.totalProfit}</p>
                </div>
                <div className="terminal-glass p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Win Rate</p>
                  <p className="text-2xl font-display font-bold text-white">{results.metrics.winRate}%</p>
                </div>
                <div className="terminal-glass p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Profit Factor</p>
                  <p className="text-2xl font-display font-bold text-accent">{results.metrics.profitFactor}</p>
                </div>
                <div className="terminal-glass p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Max Drawdown</p>
                  <p className="text-2xl font-display font-bold text-rose-500">{results.metrics.maxDrawdown}%</p>
                </div>
              </div>

              {/* Equity Curve */}
              <Card title="Equity Curve" icon={<TrendingUp size={18} />}>
                <div className="h-[350px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={results.equityCurve}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="date" hide />
                      <YAxis 
                        domain={['dataMin - 500', 'dataMax + 500']} 
                        stroke="#475569" 
                        fontSize={10} 
                        tickFormatter={(val) => `$${val}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorBalance)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Trade Logs */}
              <Card title="Trade Logs" icon={<BarChart3 size={18} />}>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">Date</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">Side</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">Entry</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">Exit</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">P/L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.trades.map((trade) => (
                        <tr key={trade.id} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                          <td className="py-4 text-sm font-mono text-text-secondary">{trade.date}</td>
                          <td className="py-4">
                            <span className={cn(
                              "px-2 py-1 rounded text-[10px] font-bold",
                              trade.side === 'BUY' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                            )}>
                              {trade.side}
                            </span>
                          </td>
                          <td className="py-4 text-sm font-mono">${trade.entry.toFixed(2)}</td>
                          <td className="py-4 text-sm font-mono">${trade.exit.toFixed(2)}</td>
                          <td className={cn(
                            "py-4 text-sm font-mono font-bold",
                            trade.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                          )}>
                            {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacktestingTab;
