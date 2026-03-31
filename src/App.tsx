import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { 
  LayoutDashboard, 
  Search, 
  Zap, 
  Calendar as CalendarIcon, 
  BookOpen, 
  BarChart3, 
  BrainCircuit, 
  Settings as SettingsIcon,
  Bell,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
  Menu,
  X,
  Globe,
  RefreshCw,
  ArrowRight,
  LogOut,
  User,
  Layers,
  History,
  Newspaper,
  Columns
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSETS, SESSIONS, KILLZONES, SILVER_BULLETS } from './constants';
import { PriceData, MarketAnalysis, Signal, JournalEntry, TelegramConfig } from './types';
import { fetchPrices, setupPriceWebSocket } from './services/priceService';
import { generateAnalysis, generateSignals } from './services/analysisService';
import { cn, formatPrice, getChangeColor } from './lib/utils';
import { Card, Badge, Button, Modal } from './components/UI';
import TradingViewChart from './components/TradingViewChart';
import SignalsTab from './components/SignalsTab';
import AIAnalysisTab from './components/AIAnalysisTab';
import JournalTab from './components/JournalTab';
import CalendarTab from './components/CalendarTab';
import SettingsTab from './components/SettingsTab';
import LandingPage from './components/LandingPage';
import ScreenerTab from './components/ScreenerTab';
import AnalyticsTab from './components/AnalyticsTab';
import ProfileTab from './components/ProfileTab';
import OrderFlowTab from './components/OrderFlowTab';
import BacktestingTab from './components/BacktestingTab';
import NewsTab from './components/NewsTab';
import ComparisonTab from './components/ComparisonTab';
import SplineBackground from './components/SplineBackground';
import BrandLabel from './components/BrandLabel';

const SidebarItem = ({ active, icon: Icon, label, onClick }: any) => {
  const itemRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (!active && itemRef.current) {
      gsap.to(itemRef.current, {
        x: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#ffffff',
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (!active && itemRef.current) {
      gsap.to(itemRef.current, {
        x: 0,
        backgroundColor: 'transparent',
        color: '#94a3b8',
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <button
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
        active 
          ? "bg-accent text-white shadow-lg shadow-accent/20" 
          : "text-text-secondary"
      )}
    >
      <Icon size={20} className={active ? "text-white" : "text-text-secondary group-hover:text-white transition-colors"} />
      <span>{label}</span>
      {active && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
    </button>
  );
};

const MarketTicker = ({ prices }: { prices: Record<string, PriceData> }) => (
  <div className="h-8 bg-card/80 border-b border-border flex items-center overflow-hidden whitespace-nowrap select-none">
    <div className="flex animate-marquee hover:pause gap-8 px-4">
      {ASSETS.map(asset => (
        <div key={asset.symbol} className="flex items-center gap-2 text-[10px] font-bold">
          <span className="text-text-secondary">{asset.symbol}</span>
          <span className="font-mono">
            {prices[asset.symbol] ? formatPrice(prices[asset.symbol].price, asset.symbol) : '---'}
          </span>
          <span className={cn(
            "font-mono",
            getChangeColor(prices[asset.symbol]?.change24h || 0)
          )}>
            {prices[asset.symbol]?.change24h > 0 ? '+' : ''}{prices[asset.symbol]?.change24h?.toFixed(2) || '0.00'}%
          </span>
        </div>
      ))}
      {/* Duplicate for seamless loop */}
      {ASSETS.map(asset => (
        <div key={`${asset.symbol}-dup`} className="flex items-center gap-2 text-[10px] font-bold">
          <span className="text-text-secondary">{asset.symbol}</span>
          <span className="font-mono">
            {prices[asset.symbol] ? formatPrice(prices[asset.symbol].price, asset.symbol) : '---'}
          </span>
          <span className={cn(
            "font-mono",
            getChangeColor(prices[asset.symbol]?.change24h || 0)
          )}>
            {prices[asset.symbol]?.change24h > 0 ? '+' : ''}{prices[asset.symbol]?.change24h?.toFixed(2) || '0.00'}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [telegram, setTelegram] = useState<TelegramConfig>({ botToken: '', chatId: '', enabled: false });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedJournal = localStorage.getItem('a3_journal');
    if (savedJournal) setJournal(JSON.parse(savedJournal));
    
    const savedSettings = localStorage.getItem('a3_settings');
    if (savedSettings) setTelegram(JSON.parse(savedSettings));

    const savedName = localStorage.getItem('a3_user_name');
    if (savedName) setUserName(savedName);

    const savedSignals = localStorage.getItem('a3_signals');
    if (savedSignals) setSignals(JSON.parse(savedSignals));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('a3_journal', JSON.stringify(journal));
  }, [journal]);

  useEffect(() => {
    localStorage.setItem('a3_signals', JSON.stringify(signals));
  }, [signals]);

  useEffect(() => {
    localStorage.setItem('a3_settings', JSON.stringify(telegram));
  }, [telegram]);

  // Seed initial signals if none exist
  useEffect(() => {
    if (signals.length === 0 && Object.keys(prices).length > 0) {
      const initialSignals: Signal[] = [];
      ASSETS.slice(0, 10).forEach(asset => {
        const priceData = prices[asset.symbol];
        if (priceData && priceData.price > 0) {
          const analysis = generateAnalysis(asset.symbol, priceData.price, priceData.change24h);
          const assetSignals = generateSignals(asset.symbol, priceData.price, analysis);
          initialSignals.push(...assetSignals);
        }
      });
      if (initialSignals.length > 0) {
        setSignals(initialSignals);
      }
    }
  }, [prices, signals.length]);

  const handleEnterTerminal = (name: string) => {
    setUserName(name);
    setShowLanding(false);
  };

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // WebSocket for real-time prices
  useEffect(() => {
    const ws = setupPriceWebSocket((updates) => {
      setPrices(prev => {
        const next = { ...prev };
        updates.forEach(update => {
          if (next[update.symbol]) {
            next[update.symbol] = {
              ...next[update.symbol],
              price: update.price,
              change24h: update.change !== undefined ? update.change : next[update.symbol].change24h,
              isLive: true
            };
          } else {
            // If asset not in state yet, add it
            next[update.symbol] = {
              symbol: update.symbol,
              price: update.price,
              change24h: update.change || 0,
              isLive: true
            };
          }
        });
        return next;
      });
    });
    return () => ws.close();
  }, []);

  // Fetch prices and generate analysis
  const updateMarket = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const newPrices = await fetchPrices();
      setPrices(newPrices);

      // Generate analysis for selected asset
      const currentPrice = newPrices[selectedAsset.symbol]?.price || 0;
      const change24h = newPrices[selectedAsset.symbol]?.change24h || 0;
      if (currentPrice > 0) {
        const newAnalysis = generateAnalysis(selectedAsset.symbol, currentPrice, change24h);
        setAnalysis(newAnalysis);
      }

      // Generate signals for ALL assets to keep the Signals tab populated
      const allNewSignals: Signal[] = [];
      ASSETS.forEach(asset => {
        const priceData = newPrices[asset.symbol];
        if (priceData && priceData.price > 0) {
          const assetAnalysis = generateAnalysis(asset.symbol, priceData.price, priceData.change24h);
          const assetSignals = generateSignals(asset.symbol, priceData.price, assetAnalysis);
          allNewSignals.push(...assetSignals);
        }
      });

      if (allNewSignals.length > 0) {
        setSignals(prev => {
          // Filter out duplicates if any (though unlikely with random IDs)
          const combined = [...allNewSignals, ...prev].slice(0, 100);
          return combined;
        });
        
        // Telegram Notification for high tier signals
        if (telegram.enabled && telegram.botToken && telegram.chatId) {
          allNewSignals.forEach(sig => {
            if (sig.tier <= 1) { // Only Unicorn and Elite
              sendTelegramAlert(sig, telegram);
            }
          });
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedAsset, telegram]);

  useEffect(() => {
    updateMarket();
    const interval = setInterval(updateMarket, 30000); // Update every 30 seconds for more "live" signals
    return () => clearInterval(interval);
  }, [updateMarket]);

  const sendTelegramAlert = async (signal: Signal, config: TelegramConfig) => {
    const message = `
🚀 ${signal.tier === 0 ? 'UNICORN' : 'ELITE'} SIGNAL

📊 Pair: ${signal.symbol}
🎯 Direction: ${signal.direction}
⭐ Confidence: ${signal.confidence}/5
💰 Entry: ${formatPrice(signal.entry, signal.symbol)}
🛑 Stop: ${formatPrice(signal.stop, signal.symbol)}
🎯 Target: ${formatPrice(signal.target, signal.symbol)}

⏰ ${new Date(signal.timestamp).toLocaleTimeString()} UTC
    `;

    try {
      await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: config.chatId, text: message })
      });
    } catch (e) {
      console.error('Telegram error:', e);
    }
  };

  const handleAddToJournal = (signal: Signal) => {
    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      symbol: signal.symbol,
      direction: signal.direction,
      entry: signal.entry,
      stop: signal.stop,
      target: signal.target,
      lots: 0.1,
      status: 'OPEN',
      notes: `Signal Tier: ${signal.tier === 0 ? 'Unicorn' : 'Elite'}`,
      tier: signal.tier
    };
    setJournal(prev => [newEntry, ...prev]);
    setActiveTab('journal');
  };

  const currentUTC = currentTime.getUTCHours() + (currentTime.getUTCMinutes() / 60);

  const activeSessions = SESSIONS.filter(s => {
    if (s.start < s.end) return currentUTC >= s.start && currentUTC < s.end;
    return currentUTC >= s.start || currentUTC < s.end;
  });

  const activeKillzones = KILLZONES.filter(k => {
    if (k.start < k.end) return currentUTC >= k.start && currentUTC < k.end;
    return currentUTC >= k.start || currentUTC < k.end;
  });

  if (showLanding) {
    return <LandingPage onEnter={handleEnterTerminal} />;
  }

  return (
    <div className="flex h-screen bg-bg text-text-primary overflow-hidden relative">
      <SplineBackground />
      
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[70] lg:relative bg-card border-r border-border transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-white" />
          </div>
          {isSidebarOpen && <BrandLabel text="A3 ELITE" className="text-xl" />}
        </div>

        <nav className="flex-grow px-3 space-y-1 overflow-y-auto no-scrollbar">
          <SidebarItem active={activeTab === 'dashboard'} icon={LayoutDashboard} label={isSidebarOpen ? "Dashboard" : ""} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem active={activeTab === 'news'} icon={Newspaper} label={isSidebarOpen ? "Market Pulse" : ""} onClick={() => setActiveTab('news')} />
          <SidebarItem active={activeTab === 'screener'} icon={Search} label={isSidebarOpen ? "Screener" : ""} onClick={() => setActiveTab('screener')} />
          <SidebarItem active={activeTab === 'comparison'} icon={Columns} label={isSidebarOpen ? "Comparison" : ""} onClick={() => setActiveTab('comparison')} />
          <SidebarItem active={activeTab === 'signals'} icon={Zap} label={isSidebarOpen ? "Signals" : ""} onClick={() => setActiveTab('signals')} />
          <SidebarItem active={activeTab === 'orderflow'} icon={Layers} label={isSidebarOpen ? "Order Flow" : ""} onClick={() => setActiveTab('orderflow')} />
          <SidebarItem active={activeTab === 'backtesting'} icon={History} label={isSidebarOpen ? "Backtesting" : ""} onClick={() => setActiveTab('backtesting')} />
          <SidebarItem active={activeTab === 'ai'} icon={BrainCircuit} label={isSidebarOpen ? "AI Intelligence" : ""} onClick={() => setActiveTab('ai')} />
          <SidebarItem active={activeTab === 'analytics'} icon={BarChart3} label={isSidebarOpen ? "Analytics" : ""} onClick={() => setActiveTab('analytics')} />
          <SidebarItem active={activeTab === 'journal'} icon={BookOpen} label={isSidebarOpen ? "Journal" : ""} onClick={() => setActiveTab('journal')} />
          <SidebarItem active={activeTab === 'calendar'} icon={CalendarIcon} label={isSidebarOpen ? "Calendar" : ""} onClick={() => setActiveTab('calendar')} />
          <SidebarItem active={activeTab === 'settings'} icon={SettingsIcon} label={isSidebarOpen ? "Settings" : ""} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              activeTab === 'profile' ? "bg-accent text-white" : "text-text-secondary hover:text-white hover:bg-white/5"
            )}
          >
            <User size={20} />
            {isSidebarOpen && <span>Profile</span>}
          </button>
          <button 
            onClick={() => setShowLanding(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <MarketTicker prices={prices} />
        
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-4 md:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-text-secondary transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:flex items-center gap-4 md:gap-6 border-l border-border pl-4 md:pl-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">DXY</span>
                <span className={cn(
                  "text-xs font-mono font-bold",
                  getChangeColor(prices['DXY']?.change24h || 0)
                )}>
                  {prices['DXY']?.price?.toFixed(2) || '---'}
                </span>
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">SPX</span>
                <span className={cn(
                  "text-xs font-mono font-bold",
                  getChangeColor(prices['SPX500']?.change24h || 0)
                )}>
                  {prices['SPX500']?.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
                </span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3 text-xs font-medium text-text-secondary border-l border-border pl-6">
              <Globe size={14} />
              <span className="font-mono tracking-widest">{currentTime.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })} UTC</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={updateMarket}
              className={cn(
                "p-2 hover:bg-white/5 rounded-lg text-text-secondary transition-all",
                isRefreshing && "animate-spin text-accent"
              )}
            >
              <RefreshCw size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-border">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-card" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="info" className="bg-accent/10 text-accent border-accent/20">Terminal Active</Badge>
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Welcome {userName || 'Trader'}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-display uppercase tracking-tight">{selectedAsset.name}</h2>
                      <p className="text-xs md:text-sm text-text-secondary font-mono">{selectedAsset.tvSymbol}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1 bg-card p-1 rounded-xl border border-border">
                      {['FOREX', 'METALS', 'INDICES', 'CRYPTO', 'COMMODITIES', 'CURRENCY INDEXES'].map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            const firstInCategory = ASSETS.find(a => a.category.toUpperCase() === category.toUpperCase());
                            if (firstInCategory) setSelectedAsset(firstInCategory);
                          }}
                          className={cn(
                            "px-3 md:px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                            selectedAsset.category.toUpperCase() === category.toUpperCase() 
                              ? "bg-accent text-white" 
                              : "text-text-secondary hover:text-white"
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Chart Section */}
                    <div className="lg:col-span-9 space-y-6">
                      <TradingViewChart 
                        symbol={selectedAsset.tvSymbol} 
                        interval="15"
                        allowSymbolChange={true}
                        hideSideToolbar={false}
                        enablePublishing={false}
                        className="h-[650px] terminal-glass rounded-[2.5rem] overflow-hidden shadow-2xl"
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card title="Market Bias" icon={<Activity size={16} />} index={0}>
                          <div className="flex flex-col">
                            <span className={cn(
                              "text-2xl font-display uppercase tracking-tight",
                              analysis?.bias === 'Bullish' ? "text-emerald-500" : "text-rose-500"
                            )}>
                              {analysis?.bias || 'Neutral'}
                            </span>
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">
                              {analysis?.structure} Structure
                            </span>
                          </div>
                        </Card>

                        <Card title="P/D Array" icon={<TrendingUp size={16} />} index={1}>
                          <div className="flex flex-col">
                            <span className="text-2xl font-display uppercase tracking-tight">
                              {analysis?.premiumDiscount || '---'}
                            </span>
                            <div className="flex gap-1 mt-2">
                              <div className={cn("flex-grow h-1 rounded-full", analysis?.premiumDiscount === 'Premium' ? "bg-accent" : "bg-white/10")} />
                              <div className={cn("flex-grow h-1 rounded-full", analysis?.premiumDiscount === 'Equilibrium' ? "bg-white/50" : "bg-white/10")} />
                              <div className={cn("flex-grow h-1 rounded-full", analysis?.premiumDiscount === 'Discount' ? "bg-emerald-500" : "bg-white/10")} />
                            </div>
                          </div>
                        </Card>

                        <Card title="AMD Phase" icon={<RefreshCw size={16} />} index={2}>
                          <div className="flex flex-col">
                            <span className="text-2xl font-display uppercase tracking-tight">
                              {analysis?.amd || '---'}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Active Phase</span>
                            </div>
                          </div>
                        </Card>

                        <Card title="Volatility" icon={<Zap size={16} />} index={3}>
                          <div className="flex flex-col">
                            <span className="text-2xl font-display uppercase tracking-tight text-emerald-500">
                              High
                            </span>
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">
                              ATR: 14.2 pips
                            </span>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Sidebar Widgets */}
                    <div className="lg:col-span-3 space-y-6">
                      <Card 
                        title="Watchlist" 
                        icon={<Search size={18} />}
                        index={4}
                        extra={
                          <div className="flex gap-2">
                            <select 
                              className="bg-white/5 border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest px-2 py-1 focus:outline-none focus:border-accent transition-all cursor-pointer max-w-[80px]"
                              value={selectedAsset.category}
                              onChange={(e) => {
                                const firstInCategory = ASSETS.find(a => a.category.toUpperCase() === e.target.value.toUpperCase());
                                if (firstInCategory) setSelectedAsset(firstInCategory);
                              }}
                            >
                              {['Forex', 'Metals', 'Indices', 'Crypto', 'Commodities', 'Currency Indexes'].map(cat => (
                                <option key={cat} value={cat} className="bg-card text-white">{cat}</option>
                              ))}
                            </select>
                            <select 
                              className="bg-white/5 border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest px-2 py-1 focus:outline-none focus:border-accent transition-all cursor-pointer max-w-[100px]"
                              value={selectedAsset.symbol}
                              onChange={(e) => {
                                const asset = ASSETS.find(a => a.symbol === e.target.value);
                                if (asset) setSelectedAsset(asset);
                              }}
                            >
                              <option value="" disabled className="bg-card text-white">Quick Select</option>
                              {ASSETS.map(asset => (
                                <option key={asset.symbol} value={asset.symbol} className="bg-card text-white">{asset.symbol}</option>
                              ))}
                            </select>
                          </div>
                        }
                      >
                        <div className="space-y-1 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                          {ASSETS.filter(a => a.category.toUpperCase() === selectedAsset.category.toUpperCase()).map(asset => (
                            <button
                              key={asset.symbol}
                              onClick={() => setSelectedAsset(asset)}
                              className={cn(
                                "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                                selectedAsset.symbol === asset.symbol ? "bg-accent/10 border border-accent/20" : "hover:bg-white/5 border border-transparent"
                              )}
                            >
                              <div className="flex flex-col items-start">
                                <span className={cn(
                                  "text-sm font-bold",
                                  selectedAsset.symbol === asset.symbol ? "text-accent" : "text-text-secondary group-hover:text-white"
                                )}>{asset.symbol}</span>
                                <span className="text-[8px] font-bold text-text-secondary/40 uppercase tracking-widest">{asset.category}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-mono font-bold">
                                  {prices[asset.symbol] ? formatPrice(prices[asset.symbol].price, asset.symbol) : '---'}
                                </p>
                                <p className={cn("text-[10px] font-mono font-bold", getChangeColor(prices[asset.symbol]?.change24h || 0))}>
                                  {prices[asset.symbol]?.change24h > 0 ? '+' : ''}{prices[asset.symbol]?.change24h?.toFixed(2) || '0.00'}%
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </Card>

                      <Card title="Market Status" icon={<Clock size={18} />} index={5}>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Active Sessions</p>
                            <div className="grid grid-cols-2 gap-2">
                              {SESSIONS.map(s => {
                                const isActive = activeSessions.some(active => active.name === s.name);
                                return (
                                  <div 
                                    key={s.name} 
                                    className={cn(
                                      "p-3 rounded-xl border transition-all flex flex-col gap-1",
                                      isActive ? "bg-accent/10 border-accent/30" : "bg-white/5 border-border opacity-50"
                                    )}
                                  >
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", isActive ? "text-accent" : "text-text-secondary")}>{s.name}</span>
                                    <span className="text-xs font-bold">{isActive ? 'OPEN' : 'CLOSED'}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Killzones</p>
                            <div className="space-y-2">
                              {activeKillzones.map(k => (
                                <div key={k.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-border">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                    <span className="text-xs font-bold">{k.name}</span>
                                  </div>
                                  <ArrowRight size={14} className="text-text-secondary/40" />
                                </div>
                              ))}
                              {activeKillzones.length === 0 && <span className="text-xs text-text-secondary italic">No active killzones</span>}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'screener' && (
                <ScreenerTab 
                  prices={prices}
                  onSelectAsset={(asset) => {
                    setSelectedAsset(asset);
                    setActiveTab('dashboard');
                  }} 
                />
              )}
              {activeTab === 'signals' && (
                <SignalsTab 
                  signals={signals} 
                  onAddToJournal={handleAddToJournal}
                  onSelectAsset={(asset) => {
                    setSelectedAsset(asset);
                    setActiveTab('dashboard');
                  }}
                />
              )}
              {activeTab === 'orderflow' && <OrderFlowTab symbol={selectedAsset.symbol} currentPrice={prices[selectedAsset.symbol]?.price || 0} />}
              {activeTab === 'backtesting' && <BacktestingTab />}
              {activeTab === 'news' && <NewsTab />}
              {activeTab === 'comparison' && (
                <ComparisonTab 
                  prices={prices} 
                  onViewAnalysis={(symbol) => {
                    const asset = ASSETS.find(a => a.symbol === symbol);
                    if (asset) setSelectedAsset(asset);
                    setActiveTab('dashboard');
                  }}
                />
              )}
              {activeTab === 'ai' && <AIAnalysisTab />}
              {activeTab === 'analytics' && <AnalyticsTab />}
              {activeTab === 'journal' && (
                <JournalTab 
                  entries={journal} 
                  onDelete={(id) => setJournal(prev => prev.filter(e => e.id !== id))}
                  onExport={() => {
                    const headers = ['Date', 'Symbol', 'Direction', 'Entry', 'Exit', 'P/L', 'Status', 'Notes'];
                    const rows = journal.map(e => [e.date, e.symbol, e.direction, e.entry, e.exit || '', e.pnl || '', e.status, e.notes]);
                    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `a3_journal_${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }}
                  onAddManual={() => {
                    const newEntry: JournalEntry = {
                      id: Math.random().toString(36).substring(7),
                      date: new Date().toISOString(),
                      symbol: 'EURUSD',
                      direction: 'LONG',
                      entry: 1.08500,
                      stop: 1.08300,
                      target: 1.09000,
                      lots: 0.1,
                      status: 'OPEN',
                      notes: 'Manual entry'
                    };
                    setJournal(prev => [newEntry, ...prev]);
                  }}
                />
              )}
              {activeTab === 'calendar' && <CalendarTab />}
              {activeTab === 'settings' && (
                <SettingsTab 
                  telegram={telegram} 
                  onUpdateTelegram={setTelegram}
                  onClearData={() => setIsClearingData(true)}
                />
              )}
              {activeTab === 'profile' && <ProfileTab telegram={telegram} onUpdateTelegram={setTelegram} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Modal
        isOpen={isClearingData}
        onClose={() => setIsClearingData(false)}
        title="Purge Local Archive"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsClearingData(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => {
              setJournal([]);
              localStorage.removeItem('a3_journal');
              setIsClearingData(false);
            }}>Confirm Purge</Button>
          </>
        }
      >
        <p className="text-text-secondary text-lg leading-relaxed">
          This action will permanently delete all journal entries and local platform settings. 
          This process is irreversible and will reset your institutional environment.
        </p>
      </Modal>
    </div>
  );
}
