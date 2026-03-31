import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { 
  Eye, 
  EyeOff, 
  Activity, 
  TrendingUp, 
  Layers, 
  MousePointer2, 
  Maximize2, 
  Minimize2,
  PenTool,
  Settings2,
  BarChart3
} from 'lucide-react';

interface TradingViewChartProps {
  symbol: string;
  theme?: 'light' | 'dark';
  autosize?: boolean;
  interval?: string;
  timezone?: string;
  hideSideToolbar?: boolean;
  allowSymbolChange?: boolean;
  enablePublishing?: boolean;
  className?: string;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const INDICATORS = [
  { id: 'RSI@tv-basicstudies', name: 'RSI', icon: <Activity size={14} /> },
  { id: 'MASimple@tv-basicstudies', name: 'MA', icon: <TrendingUp size={14} /> },
  { id: 'StochasticRSI@tv-basicstudies', name: 'Stoch', icon: <Layers size={14} /> },
  { id: 'MACD@tv-basicstudies', name: 'MACD', icon: <Activity size={14} /> },
  { id: 'BollingerBands@tv-basicstudies', name: 'BB', icon: <Layers size={14} /> },
  { id: 'Volume@tv-basicstudies', name: 'Vol', icon: <BarChart3 size={14} /> },
];

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol, 
  theme = 'dark',
  autosize = true,
  interval = "15",
  timezone = "Etc/UTC",
  hideSideToolbar: initialHideSideToolbar = false,
  allowSymbolChange = true,
  enablePublishing = false,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['RSI@tv-basicstudies', 'MASimple@tv-basicstudies']);
  const [hideSideToolbar, setHideSideToolbar] = useState(initialHideSideToolbar);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleIndicator = (id: string) => {
    setActiveIndicators(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      if (containerRef.current && window.TradingView) {
        // Clear container before re-initializing
        containerRef.current.innerHTML = '';
        const widgetContainer = document.createElement('div');
        widgetContainer.id = `tv-chart-container-${symbol}-${Date.now()}`;
        widgetContainer.className = "w-full h-full";
        containerRef.current.appendChild(widgetContainer);

        new window.TradingView.widget({
          autosize: autosize,
          symbol: symbol,
          interval: interval,
          timezone: timezone,
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#020617",
          enable_publishing: enablePublishing,
          allow_symbol_change: allowSymbolChange,
          container_id: widgetContainer.id,
          hide_side_toolbar: hideSideToolbar,
          withdateranges: true,
          details: false,
          hotlist: false,
          calendar: false,
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          studies: activeIndicators,
          loading_screen: { backgroundColor: "#020617" },
          overrides: {
            "paneProperties.background": "#020617",
            "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.03)",
            "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.03)",
            "symbolWatermarkProperties.transparency": 90,
            "scalesProperties.textColor": "#94a3b8",
            "mainSeriesProperties.candleStyle.upColor": "#10b981",
            "mainSeriesProperties.candleStyle.downColor": "#f43f5e",
            "mainSeriesProperties.candleStyle.drawWick": true,
            "mainSeriesProperties.candleStyle.drawBorder": true,
            "mainSeriesProperties.candleStyle.borderColor": "#10b981",
            "mainSeriesProperties.candleStyle.borderUpColor": "#10b981",
            "mainSeriesProperties.candleStyle.borderDownColor": "#f43f5e",
            "mainSeriesProperties.candleStyle.wickUpColor": "#10b981",
            "mainSeriesProperties.candleStyle.wickDownColor": "#f43f5e",
          },
        });
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }

    return () => {
      // Cleanup if needed
    };
  }, [symbol, theme, autosize, activeIndicators, hideSideToolbar]);

  return (
    <div ref={wrapperRef} className={cn("w-full h-full min-h-[500px] flex flex-col relative group/chart", className)}>
      {/* Custom Chart Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 p-1.5 bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl transition-all hover:border-accent/30">
            <button
              onClick={() => setHideSideToolbar(!hideSideToolbar)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                !hideSideToolbar
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
              title={hideSideToolbar ? "Enable Drawing Tools" : "Disable Drawing Tools"}
            >
              <PenTool size={14} />
              <span className="hidden lg:inline">Draw</span>
            </button>
            
            <div className="w-px h-4 bg-border mx-1" />

            {INDICATORS.map(indicator => (
              <button
                key={indicator.id}
                onClick={() => toggleIndicator(indicator.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeIndicators.includes(indicator.id)
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : "text-text-secondary hover:text-white hover:bg-white/5"
                )}
              >
                {indicator.icon}
                <span className="hidden xl:inline">{indicator.name}</span>
                {activeIndicators.includes(indicator.id) ? <Eye size={12} className="ml-1" /> : <EyeOff size={12} className="ml-1" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 p-1.5 bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl transition-all hover:border-accent/30">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all">
              <Settings2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex-grow w-full h-full rounded-2xl overflow-hidden border border-border bg-[#020617]" />
      
      {/* Watermark/Brand Overlay */}
      <div className="absolute bottom-6 right-6 pointer-events-none opacity-20 group-hover/chart:opacity-40 transition-opacity">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">A3-Elite Neural Engine</span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">Institutional Grade Execution</span>
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart;
