import React, { useState, useEffect } from 'react';
import { Newspaper, Search, Filter, ExternalLink, Clock, TrendingUp, TrendingDown, Globe, Zap, X, Share2, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, Button } from './UI';
import { cn } from '../lib/utils';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  category: 'Crypto' | 'Forex' | 'Stocks' | 'Macro';
  impact: 'High' | 'Medium' | 'Low';
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  url: string;
  relatedSymbols: string[];
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'SEC Approves Spot Ethereum ETF for Trading',
    summary: 'The Securities and Exchange Commission has officially authorized several spot Ethereum exchange-traded funds to begin trading on major exchanges, marking a significant milestone for the second-largest cryptocurrency.',
    source: 'Financial Times',
    time: '10m ago',
    category: 'Crypto',
    impact: 'High',
    sentiment: 'Positive',
    url: '#',
    relatedSymbols: ['ETH', 'BTC']
  },
  {
    id: '2',
    title: 'Federal Reserve Maintains Interest Rates, Signals One Cut in 2024',
    summary: 'The Federal Open Market Committee voted unanimously to keep the benchmark interest rate target range at 5.25% to 5.50%, while updating their economic projections to suggest a single rate reduction later this year.',
    source: 'Reuters',
    time: '45m ago',
    category: 'Macro',
    impact: 'High',
    sentiment: 'Neutral',
    url: '#',
    relatedSymbols: ['DXY', 'SPX']
  },
  {
    id: '3',
    title: 'NVIDIA Reaches Record High as AI Demand Surges',
    summary: 'Shares of NVIDIA (NVDA) surged over 5% in pre-market trading following reports of massive new orders for its H100 AI chips from major cloud service providers.',
    source: 'Bloomberg',
    time: '1h ago',
    category: 'Stocks',
    impact: 'Medium',
    sentiment: 'Positive',
    url: '#',
    relatedSymbols: ['NVDA', 'QQQ']
  },
  {
    id: '4',
    title: 'ECB President Lagarde Hints at Potential July Rate Cut',
    summary: 'Christine Lagarde suggested that the European Central Bank is closely monitoring inflation trends and could be in a position to lower borrowing costs as early as July if data remains consistent.',
    source: 'Wall Street Journal',
    time: '2h ago',
    category: 'Forex',
    impact: 'Medium',
    sentiment: 'Negative',
    url: '#',
    relatedSymbols: ['EUR', 'USD']
  },
  {
    id: '5',
    title: 'Bitcoin Hashrate Hits All-Time High Amid Network Upgrades',
    summary: 'The total computational power securing the Bitcoin network has reached a new peak, indicating strong miner confidence despite recent price volatility and the upcoming halving event.',
    source: 'CoinDesk',
    time: '3h ago',
    category: 'Crypto',
    impact: 'Low',
    sentiment: 'Positive',
    url: '#',
    relatedSymbols: ['BTC']
  }
];

const NewsTab: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const filteredNews = news.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.relatedSymbols.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Badge variant="info">Global Intelligence Feed</Badge>
          <h2 className="text-7xl font-display font-black tracking-tighter uppercase">Market Pulse</h2>
          <p className="text-text-secondary text-2xl font-light max-w-2xl">
            Real-time institutional news aggregation with sentiment analysis and impact scoring.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 p-2 rounded-2xl">
          {['All', 'Crypto', 'Forex', 'Stocks', 'Macro'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                filter === cat ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* News List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search news by symbol or keyword..."
              className="w-full bg-zinc-900/50 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-xl font-light focus:outline-none focus:ring-2 ring-accent/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            {filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative terminal-glass p-8 rounded-[2.5rem] border border-white/5 hover:border-accent/30 transition-all cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        item.category === 'Crypto' ? "bg-orange-500/10 text-orange-500" :
                        item.category === 'Forex' ? "bg-blue-500/10 text-blue-500" :
                        item.category === 'Stocks' ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                      )}>
                        {item.category}
                      </span>
                      <div className="flex items-center gap-2 text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                        <Clock size={12} /> {item.time}
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                        <Globe size={12} /> {item.source}
                      </div>
                    </div>

                    <h3 className="text-3xl font-display font-bold leading-tight group-hover:text-accent transition-colors">{item.title}</h3>
                    <p className="text-text-secondary text-lg font-light leading-relaxed line-clamp-2">{item.summary}</p>

                    <div className="flex items-center gap-3 pt-2">
                      {item.relatedSymbols.map(s => (
                        <span key={s} className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono font-bold text-white/60">#{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="md:w-48 flex flex-col justify-between items-end gap-6">
                    <div className="flex flex-col items-end gap-3">
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                        item.impact === 'High' ? "bg-rose-500/10 text-rose-500" :
                        item.impact === 'Medium' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        <Zap size={12} fill="currentColor" /> {item.impact} Impact
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                        item.sentiment === 'Positive' ? "bg-emerald-500/10 text-emerald-500" :
                        item.sentiment === 'Negative' ? "bg-rose-500/10 text-rose-500" : "bg-white/5 text-text-secondary"
                      )}>
                        {item.sentiment === 'Positive' ? <TrendingUp size={12} /> : item.sentiment === 'Negative' ? <TrendingDown size={12} /> : null}
                        {item.sentiment}
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      className="w-full py-3 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNews(item);
                      }}
                    >
                      Read Full <ExternalLink size={14} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
          <Card title="Trending Symbols" icon={<TrendingUp size={18} />}>
            <div className="space-y-4 mt-4">
              {['BTC', 'ETH', 'NVDA', 'EUR', 'XAU'].map((s, i) => (
                <div key={s} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center font-black text-accent">{s[0]}</div>
                    <div>
                      <p className="font-bold">{s}</p>
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest">Mentions: {24 - i * 3}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-500 font-mono font-bold">+{Math.random().toFixed(2)}%</p>
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest">Sentiment: Bullish</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Market Sentiment" icon={<Globe size={18} />}>
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Bullish</span>
                  <span className="text-emerald-500">68%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '68%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Bearish</span>
                  <span className="text-rose-500">32%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: '32%' }} />
                </div>
              </div>
              <p className="text-[10px] text-text-secondary leading-relaxed italic">
                * Sentiment is calculated using AI analysis of over 500 institutional news sources and social signals.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar terminal-glass rounded-[3rem] border border-white/10 shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 p-8 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                  <Badge variant="info">{selectedNews.category}</Badge>
                  <div className="flex items-center gap-2 text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                    <Clock size={12} /> {selectedNews.time}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="p-3 hover:bg-white/10 rounded-2xl text-text-secondary hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 md:p-12 space-y-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                      selectedNews.impact === 'High' ? "bg-rose-500/10 text-rose-500" :
                      selectedNews.impact === 'Medium' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                    )}>
                      <Zap size={12} fill="currentColor" /> {selectedNews.impact} Impact
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                      selectedNews.sentiment === 'Positive' ? "bg-emerald-500/10 text-emerald-500" :
                      selectedNews.sentiment === 'Negative' ? "bg-rose-500/10 text-rose-500" : "bg-white/5 text-text-secondary"
                    )}>
                      {selectedNews.sentiment === 'Positive' ? <TrendingUp size={12} /> : selectedNews.sentiment === 'Negative' ? <TrendingDown size={12} /> : null}
                      {selectedNews.sentiment} Sentiment
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                      <Globe size={12} /> {selectedNews.source}
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-display font-black leading-tight tracking-tight">
                    {selectedNews.title}
                  </h2>

                  <div className="flex flex-wrap gap-3">
                    {selectedNews.relatedSymbols.map(s => (
                      <span key={s} className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl text-sm font-mono font-bold text-accent">
                        #{s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="space-y-6 text-text-secondary text-xl font-light leading-relaxed">
                  <p>{selectedNews.summary}</p>
                  <p>
                    Market analysts suggest that this development could lead to increased volatility in the short term, 
                    with institutional investors closely monitoring the situation for potential entry points. 
                    The broader market sentiment remains cautiously optimistic as participants digest the implications 
                    of this latest intelligence.
                  </p>
                  <p>
                    For professional traders, this event underscores the importance of real-time data and 
                    sentiment analysis in navigating today's complex financial landscape. A3 Elite continues to 
                    monitor these developments to provide the most accurate and timely insights.
                  </p>
                </div>

                <div className="pt-8 flex flex-wrap items-center gap-4">
                  <Button className="px-8 py-4 rounded-2xl bg-accent text-white font-bold uppercase tracking-widest flex items-center gap-2">
                    View Source Document <ExternalLink size={18} />
                  </Button>
                  <div className="flex items-center gap-2">
                    <button className="p-4 hover:bg-white/5 rounded-2xl text-text-secondary hover:text-white border border-white/5 transition-all">
                      <Share2 size={20} />
                    </button>
                    <button className="p-4 hover:bg-white/5 rounded-2xl text-text-secondary hover:text-white border border-white/5 transition-all">
                      <Bookmark size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                  A3 Elite Intelligence • {new Date().getFullYear()}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                  <Zap size={10} className="text-accent" fill="currentColor" /> Verified Institutional Feed
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsTab;
