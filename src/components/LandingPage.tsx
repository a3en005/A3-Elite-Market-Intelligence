import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { cn } from '../lib/utils';
import { 
  ArrowRight, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe, 
  Cpu, 
  TrendingUp,
  CheckCircle2,
  Play,
  Layers,
  Activity,
  Lock,
  TrendingDown
} from 'lucide-react';
import SineWaveBackground from './SineWaveBackground';
import BrandLabel from './BrandLabel';

const CandlestickAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const bars = containerRef.current.querySelectorAll('.candle-bar');
    const wicks = containerRef.current.querySelectorAll('.candle-wick');

    // Initial animation
    gsap.fromTo(bars, 
      { scaleY: 0, opacity: 0 },
      { 
        scaleY: 1, 
        opacity: 1, 
        duration: 1, 
        stagger: 0.05, 
        ease: "power4.out",
        transformOrigin: "bottom"
      }
    );

    // Idle animation
    const idleTweens = Array.from(bars).map((bar, i) => {
      return gsap.to(bar, {
        scaleY: "+=0.2",
        duration: 1.5 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1
      });
    });

    return () => {
      idleTweens.forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const bars = containerRef.current.querySelectorAll('.candle-bar');

    if (isHovered) {
      gsap.to(bars, {
        scaleY: (i) => 1.5 + Math.sin(i) * 0.5,
        duration: 0.4,
        stagger: 0.02,
        ease: "back.out(1.7)"
      });
    } else {
      gsap.to(bars, {
        scaleY: 1,
        duration: 0.6,
        stagger: 0.02,
        ease: "power2.out"
      });
    }
  }, [isHovered]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center gap-2 md:gap-4 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {[...Array(12)].map((_, i) => {
        const isBullish = i % 3 !== 0;
        const height = 40 + Math.random() * 60;
        const offset = Math.random() * 20;
        
        return (
          <div 
            key={i} 
            className="relative flex flex-col items-center group cursor-pointer"
            onClick={(e) => {
              const bar = e.currentTarget.querySelector('.candle-bar');
              gsap.to(bar, {
                y: -50,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
              });
              gsap.to(bar, {
                rotate: 360,
                duration: 0.6,
                ease: "none"
              });
            }}
          >
            {/* Wick */}
            <div 
              className={`candle-wick w-[2px] h-32 absolute top-1/2 -translate-y-1/2 transition-colors duration-500 ${isBullish ? 'bg-accent/30' : 'bg-bearish/30'}`}
            />
            {/* Body */}
            <div 
              className={`candle-bar w-4 md:w-8 rounded-sm relative z-10 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:brightness-125 ${isBullish ? 'bg-accent shadow-accent/20 group-hover:shadow-accent/50' : 'bg-bearish shadow-bearish/20 group-hover:shadow-bearish/50'}`}
              style={{ 
                height: `${height}px`,
                marginTop: `${offset}px`
              }}
            />
            
            {/* Hover Glow */}
            <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${isBullish ? 'bg-accent' : 'bg-bearish'}`} />
          </div>
        );
      })}
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
};

const BentoCard = ({ icon: Icon, title, description, className, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    onMouseEnter={(e) => {
      gsap.to(e.currentTarget, {
        scale: 1.02,
        y: -10,
        borderColor: 'rgba(16, 185, 129, 0.3)',
        duration: 0.4,
        ease: "back.out(1.7)"
      });
    }}
    onMouseLeave={(e) => {
      gsap.to(e.currentTarget, {
        scale: 1,
        y: 0,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        duration: 0.4,
        ease: "power2.out"
      });
    }}
    className={`bg-card/40 backdrop-blur-xl border border-border p-8 rounded-[2rem] transition-all group overflow-hidden relative ${className}`}
  >
    <div className={`absolute -right-4 -bottom-4 w-32 h-32 ${index % 2 === 0 ? 'bg-accent/5 group-hover:bg-accent/15' : 'bg-bearish/5 group-hover:bg-bearish/15'} rounded-full blur-3xl transition-all duration-700`} />
    <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? 'from-accent/5' : 'from-bearish/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl ${index % 2 === 0 ? 'bg-accent/10 text-accent border-accent/20' : 'bg-bearish/10 text-bearish border-bearish/20'} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border`}>
        <Icon size={28} />
      </div>
      <h3 className={`text-3xl font-display uppercase tracking-tight mb-4 group-hover:${index % 2 === 0 ? 'text-accent' : 'text-bearish'} transition-colors`}>{title}</h3>
      <p className="text-text-secondary leading-relaxed text-base font-light">{description}</p>
    </div>

    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
      <ArrowRight size={20} className={index % 2 === 0 ? 'text-accent' : 'text-bearish'} />
    </div>
  </motion.div>
);

const PricingCard = ({ tier, price, features, highlighted, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    onMouseEnter={(e) => {
      gsap.to(e.currentTarget, {
        scale: 1.05,
        y: -15,
        borderColor: '#10b981',
        boxShadow: '0 30px 60px -15px rgba(16, 185, 129, 0.25)',
        duration: 0.4,
        ease: "back.out(1.7)"
      });
    }}
    onMouseLeave={(e) => {
      gsap.to(e.currentTarget, {
        scale: 1,
        y: 0,
        borderColor: highlighted ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: 'none',
        duration: 0.4,
        ease: "power2.out"
      });
    }}
    className={`p-10 rounded-[2.5rem] border ${highlighted ? 'border-accent bg-accent/5' : 'border-border bg-card/40 backdrop-blur-xl'} flex flex-col gap-8 relative overflow-hidden h-full`}
  >
    {highlighted && (
      <div className="absolute top-0 right-0 bg-accent text-white px-6 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest">
        Most Popular
      </div>
    )}
    <div className="space-y-2">
      <h3 className="text-3xl font-display uppercase tracking-wider">{tier}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-display text-accent">{price}</span>
        {price !== 'Free' && <span className="text-text-secondary font-mono text-sm">/MO</span>}
      </div>
    </div>
    <div className="h-px bg-border w-full" />
    <ul className="space-y-5 flex-grow">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center gap-4 text-sm text-text-secondary">
          <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <CheckCircle2 size={12} className="text-accent" />
          </div>
          {f}
        </li>
      ))}
    </ul>
    <button className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${highlighted ? 'bg-accent text-white hover:shadow-2xl hover:shadow-accent/40' : 'bg-white/5 hover:bg-white/10 border border-border'}`}>
      Choose {tier}
    </button>
  </motion.div>
);

const FallingTowerText = () => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const lines = [
    { text: "Elite", color: "text-white" },
    { text: "Intelligence", color: "text-accent" },
    { text: "for Traders", color: "text-white" }
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll('span');
    
    gsap.set(spans, { y: -1000, opacity: 0, rotateX: -45, scale: 1.2 });

    spans.forEach((span, i) => {
      gsap.to(span, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        duration: 0.8,
        delay: i * 0.4,
        ease: "bounce.out",
        onComplete: () => {
          // Shake the whole container on impact
          gsap.to(containerRef.current, {
            y: "+=10",
            duration: 0.05,
            yoyo: true,
            repeat: 3,
            ease: "power2.inOut"
          });
          
          // Flash the impact line
          if (containerRef.current) {
            const impactLine = containerRef.current.querySelector('.impact-line');
            if (impactLine) {
              gsap.fromTo(impactLine, 
                { opacity: 0, scaleX: 0 },
                { opacity: 1, scaleX: 1, duration: 0.3, ease: "power4.out" }
              );
            }
          }
        }
      });
    });
  }, []);

  return (
    <h1 ref={containerRef} className="text-5xl md:text-7xl lg:text-9xl font-display uppercase tracking-tighter leading-[0.85] mb-10 flex flex-col relative perspective-1000">
      {lines.map((line, i) => (
        <span
          key={i}
          className={cn("block", line.color)}
          style={{ transformOrigin: "bottom" }}
        >
          {line.text}
        </span>
      ))}
      
      {/* Visual impact effect on landing */}
      <div className="impact-line absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent blur-sm opacity-0" />
    </h1>
  );
};

export default function LandingPage({ onEnter }: { onEnter: (name: string) => void }) {
  const [showAccessForm, setShowAccessForm] = useState(false);
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (accessCode !== 'A3EN85') {
      setError('Invalid access code');
      return;
    }
    onEnter(name);
  };

  return (
    <div className="bg-bg text-text-primary min-h-screen selection:bg-accent selection:text-white overflow-x-hidden relative">
      <SineWaveBackground />
      <AnimatePresence>
        {showAccessForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-bg/90 backdrop-blur-2xl" onClick={() => setShowAccessForm(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-md bg-card border border-border p-10 rounded-[2.5rem] shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
                  <Lock size={32} />
                </div>
                <h2 className="text-3xl font-display uppercase tracking-tight mb-2">Terminal Access</h2>
                <p className="text-text-secondary text-sm">Enter your credentials to initialize the terminal</p>
              </div>

              <form onSubmit={handleLaunch} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Your Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Access Code</label>
                  <input 
                    type="password" 
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button 
                  type="submit"
                  className="w-full py-5 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-accent/40 transition-all active:scale-95"
                >
                  Initialize Terminal
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-white/[0.02] rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/60 backdrop-blur-xl px-4 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <TrendingUp size={20} className="text-white" />
            </div>
            <BrandLabel text="A3 ELITE" className="text-xl md:text-2xl" />
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            {/* Navigation tabs removed as requested */}
          </div>
          <button 
            onClick={() => setShowAccessForm(true)}
            className="px-6 md:px-8 py-3 bg-accent text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-accent/20 transition-all active:scale-95"
          >
            Launch Terminal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[110vh] pt-32 pb-20 px-4 md:px-8 flex flex-col relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center flex-grow relative">
          
          {/* Angled Candlestick Animation Background Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-0 hidden lg:block opacity-40">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rotate-[-15deg] scale-125">
              <CandlestickAnimation />
            </div>
          </div>

          <div className="relative z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest mb-10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Institutional Market Intelligence
              <div className="w-px h-3 bg-accent/30 mx-2" />
              <span className="text-bearish">Live Analysis</span>
            </motion.div>
            <FallingTowerText />
            <p className="text-base md:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 mb-12 font-light leading-relaxed">
              Navigate the financial markets with institutional-grade tools. Simplicity meets performance in the most advanced trading ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <button 
                onClick={() => setShowAccessForm(true)}
                className="w-full sm:w-auto px-12 py-6 bg-accent text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-accent/40 transition-all active:scale-95"
              >
                Start Trading <ArrowRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="relative h-[600px] hidden lg:flex items-center justify-center z-10">
            <div className="absolute inset-0 bg-accent/5 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-bearish/5 rounded-full blur-[100px] animate-pulse delay-700" />
            <div className="scale-110 rotate-[-10deg]">
              <CandlestickAnimation />
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary/40 mb-10 text-center">Trusted by institutional liquidity providers</p>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {['Binance', 'Coinbase', 'Kraken', 'Bybit', 'OKX'].map((partner) => (
              <div key={partner} className="text-2xl font-display uppercase tracking-tighter hover:text-accent transition-colors cursor-default">
                {partner}
              </div>
            ))}
          </div>
        </div>

        {/* Market Stats Bar */}
        <div className="w-full max-w-7xl mx-auto mt-20 border-t border-border pt-20 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Total Volume', value: '$4.2B+' },
              { label: 'Active Traders', value: '120K+' },
              { label: 'Execution Speed', value: '< 1ms' },
              { label: 'Uptime', value: '99.99%' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">{stat.label}</p>
                <p className="text-4xl font-display text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-40 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tight leading-none">The Future of <br />Market Analysis</h2>
            <p className="text-text-secondary text-lg max-w-xl">
              Our ecosystem is built on the pillars of speed, accuracy, and institutional logic.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="p-6 rounded-3xl bg-card border border-border text-center min-w-[140px]">
              <p className="text-3xl font-display text-accent">99.9%</p>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">Uptime</p>
            </div>
            <div className="p-6 rounded-3xl bg-card border border-border text-center min-w-[140px]">
              <p className="text-3xl font-display text-accent">10ms</p>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">Latency</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <BentoCard 
            index={0}
            icon={BarChart3}
            title="Smart Charts"
            description="Advanced TradingView integration with institutional order flow overlays and real-time liquidity maps."
            className="md:col-span-8 h-[400px]"
          />
          <BentoCard 
            index={1}
            icon={Zap}
            title="Real-time Bias"
            description="Proprietary algorithms calculating market bias across multiple timeframes instantly."
            className="md:col-span-4 h-[400px]"
          />
          <BentoCard 
            index={2}
            icon={Activity}
            title="Neural Signals"
            description="AI-powered pattern recognition identifying high-probability setups before they happen."
            className="md:col-span-4 h-[400px]"
          />
          <BentoCard 
            index={3}
            icon={Lock}
            title="Secure Vault"
            description="Institutional-grade security for your trading data and journal entries."
            className="md:col-span-8 h-[400px]"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-accent p-16 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-display uppercase tracking-tighter text-white mb-10">Ready to Take <br />Control?</h2>
            <p className="text-white/80 text-xl max-w-2xl mx-auto mb-12 font-light">
              Join thousands of traders who have elevated their performance with A3 Elite Intelligence.
            </p>
            <button 
              onClick={() => setShowAccessForm(true)}
              className="px-16 py-8 bg-white text-accent rounded-2xl text-sm font-bold uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <span className="font-display text-2xl tracking-tighter uppercase">A3 ELITE</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Empowering traders with institutional-grade market intelligence and elite performance tools.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-10">Intelligence</h4>
            <ul className="space-y-5 text-sm text-text-secondary font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Terminal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Screener</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Signals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-10">Ecosystem</h4>
            <ul className="space-y-5 text-sm text-text-secondary font-medium">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Journal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-10">Connect</h4>
            <div className="flex gap-6">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all">𝕏</a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all">IG</a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all">LI</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
          <span>&copy; 2026 A3 ELITE MARKET INTELLIGENCE</span>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Status: Operational</a>
            <a href="#" className="hover:text-white transition-colors">v2.4.0-ELITE</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
