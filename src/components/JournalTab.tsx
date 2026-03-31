import React from 'react';
import { JournalEntry } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { Card, Badge, Button } from './UI';
import { Trash2, Download, Plus, TrendingUp, TrendingDown, BookOpen, Target, Activity, BarChart3, Clock, Zap, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface JournalTabProps {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
  onExport: () => void;
  onAddManual: () => void;
}

const JournalTab: React.FC<JournalTabProps> = ({ entries, onDelete, onExport, onAddManual }) => {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const calculateStats = () => {
    const total = entries.length;
    const wins = entries.filter(e => e.status === 'WIN').length;
    const losses = entries.filter(e => e.status === 'LOSS').length;
    const winRate = total > 0 ? (wins / total * 100).toFixed(1) : '0';
    const totalPnl = entries.reduce((acc, curr) => acc + (curr.pnl || 0), 0).toFixed(2);

    // Consecutive Wins/Losses
    let maxConsecWins = 0;
    let maxConsecLosses = 0;
    let currentWins = 0;
    let currentLosses = 0;

    // Sort by date ascending for consecutive calculation
    const chronologicalEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    chronologicalEntries.forEach(e => {
      if (e.status === 'WIN') {
        currentWins++;
        currentLosses = 0;
        maxConsecWins = Math.max(maxConsecWins, currentWins);
      } else if (e.status === 'LOSS') {
        currentLosses++;
        currentWins = 0;
        maxConsecLosses = Math.max(maxConsecLosses, currentLosses);
      }
    });

    // Average Trade Duration
    const completedTrades = entries.filter(e => e.date && e.closeDate);
    let avgDuration = '---';
    if (completedTrades.length > 0) {
      const totalDuration = completedTrades.reduce((acc, curr) => {
        const start = new Date(curr.date).getTime();
        const end = new Date(curr.closeDate!).getTime();
        return acc + (end - start);
      }, 0);
      const avgMs = totalDuration / completedTrades.length;
      const hours = Math.floor(avgMs / (1000 * 60 * 60));
      const minutes = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));
      avgDuration = `${hours}h ${minutes}m`;
    }

    return {
      total, wins, losses, winRate, totalPnl, maxConsecWins, maxConsecLosses, avgDuration
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
          <Badge variant="info">Institutional Journal</Badge>
          <h2 className="text-8xl font-display font-black tracking-tighter leading-none uppercase">Trade Archive</h2>
          <p className="text-text-secondary text-3xl font-light max-w-2xl leading-relaxed">
            A high-fidelity record of your market execution and psychological edge.
          </p>
        </div>
        <div className="flex gap-6">
          <Button variant="secondary" onClick={onExport} className="px-8 py-6 text-lg">
            <Download size={24} /> Export
          </Button>
          <Button variant="primary" onClick={onAddManual} className="px-8 py-6 text-lg">
            <Plus size={24} /> New Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="p-10 terminal-glass rounded-[3rem]" title="Total Execution" icon={<Activity size={24} className="text-accent" />}>
          <div className="mt-6">
            <p className="text-6xl font-display font-bold tracking-tighter text-white">{stats.total}</p>
            <p className="text-sm text-text-secondary font-black mt-3 uppercase tracking-[0.3em]">Logged Trades</p>
          </div>
        </Card>
        <Card className="p-10 terminal-glass rounded-[3rem]" title="Win Probability" icon={<Target size={24} className="text-accent" />}>
          <div className="mt-6">
            <p className="text-6xl font-display font-bold tracking-tighter text-emerald-500">{stats.winRate}%</p>
            <p className="text-sm text-text-secondary font-black mt-3 uppercase tracking-[0.3em]">Success Rate</p>
          </div>
        </Card>
        <Card className="p-10 terminal-glass rounded-[3rem]" title="Avg Duration" icon={<Clock size={24} className="text-accent" />}>
          <div className="mt-6">
            <p className="text-6xl font-display font-bold tracking-tighter text-white">{stats.avgDuration}</p>
            <p className="text-sm text-text-secondary font-black mt-3 uppercase tracking-[0.3em]">Trade Hold Time</p>
          </div>
        </Card>
        <Card className="p-10 terminal-glass rounded-[3rem]" title="Net Performance" icon={<TrendingUp size={24} className="text-accent" />}>
          <div className="mt-6">
            <p className={cn("text-6xl font-display font-bold tracking-tighter", Number(stats.totalPnl) >= 0 ? "text-emerald-500" : "text-rose-500")}>
              ${stats.totalPnl}
            </p>
            <p className="text-sm text-text-secondary font-black mt-3 uppercase tracking-[0.3em]">Total P/L</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-10 terminal-glass rounded-[3rem]" title="Max Consecutive Wins" icon={<Zap size={24} className="text-emerald-500" />}>
          <div className="mt-6">
            <p className="text-6xl font-display font-bold tracking-tighter text-emerald-500">{stats.maxConsecWins}</p>
            <p className="text-sm text-text-secondary font-black mt-3 uppercase tracking-[0.3em]">Winning Streak</p>
          </div>
        </Card>
        <Card className="p-10 terminal-glass rounded-[3rem]" title="Max Consecutive Losses" icon={<ShieldAlert size={24} className="text-rose-500" />}>
          <div className="mt-6">
            <p className="text-6xl font-display font-bold tracking-tighter text-rose-500">{stats.maxConsecLosses}</p>
            <p className="text-sm text-text-secondary font-black mt-3 uppercase tracking-[0.3em]">Losing Streak</p>
          </div>
        </Card>
      </div>

      <div className="terminal-glass rounded-[3.5rem] overflow-hidden border border-border shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-white/5">
                <th className="p-8 text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Date</th>
                <th className="p-8 text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Asset</th>
                <th className="p-8 text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Direction</th>
                <th className="p-8 text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Entry</th>
                <th className="p-8 text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Exit</th>
                <th className="p-8 text-xs font-black text-text-secondary uppercase tracking-[0.3em]">P/L</th>
                <th className="p-8 text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Status</th>
                <th className="p-8 text-xs font-black text-text-secondary uppercase tracking-[0.3em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedEntries.map((entry, index) => (
                <motion.tr 
                  key={entry.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.8 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-8 text-lg text-text-secondary font-medium">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="p-8">
                    <span className="text-2xl font-display font-bold text-white tracking-tight">{entry.symbol}</span>
                  </td>
                  <td className="p-8">
                    <div className={cn(
                      "flex items-center gap-3 text-xs font-black tracking-[0.2em]",
                      entry.direction === 'LONG' ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {entry.direction === 'LONG' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      {entry.direction}
                    </div>
                  </td>
                  <td className="p-8 text-lg font-mono font-bold text-white/70">{formatPrice(entry.entry, entry.symbol)}</td>
                  <td className="p-8 text-lg font-mono font-bold text-white/70">{entry.exit ? formatPrice(entry.exit, entry.symbol) : '---'}</td>
                  <td className={cn(
                    "p-8 text-lg font-mono font-bold",
                    (entry.pnl || 0) >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {entry.pnl ? `$${entry.pnl.toFixed(2)}` : '---'}
                  </td>
                  <td className="p-8">
                    <Badge variant={entry.status === 'WIN' ? 'success' : (entry.status === 'LOSS' ? 'danger' : 'default')} className="text-[10px]">
                      {entry.status}
                    </Badge>
                  </td>
                  <td className="p-8 text-right">
                    <button 
                      onClick={() => onDelete(entry.id)}
                      className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-text-secondary hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 size={24} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-8 text-text-secondary/20">
                      <BookOpen size={80} strokeWidth={1} />
                      <p className="italic font-medium text-3xl uppercase tracking-widest">No execution records found. Begin your legacy.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JournalTab;
