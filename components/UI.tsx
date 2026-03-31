import React, { useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import gsap from 'gsap';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  index?: number;
}

export const Card: React.FC<CardProps> = ({ children, className, title, subtitle, icon, extra, index = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 20, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          delay: index * 0.1,
          ease: "power4.out"
        }
      );
    }
  }, []);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.02,
        y: -5,
        borderColor: 'rgba(16, 185, 129, 0.3)',
        boxShadow: '0 20px 40px -20px rgba(16, 185, 129, 0.15)',
        duration: 0.4,
        ease: "back.out(1.7)"
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        y: 0,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        boxShadow: 'none',
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("terminal-glass rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group", className)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {(title || icon || extra) && (
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            {icon && <div className="text-accent group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{icon}</div>}
            <div>
              {title && <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary group-hover:text-accent transition-colors">{title}</h3>}
              {subtitle && <p className="text-[10px] text-text-secondary/60 mt-1">{subtitle}</p>}
            </div>
          </div>
          {extra && <div className="relative z-10">{extra}</div>}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full max-w-lg terminal-glass rounded-[2rem] p-8 border border-border shadow-2xl animate-in fade-in zoom-in duration-300", className)}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-display font-bold text-white tracking-tight uppercase">{title}</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="mb-8">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'default' | 'success' | 'danger' | 'warning' | 'info', className?: string }> = ({ 
  children, 
  variant = 'default',
  className
}) => {
  const variants = {
    default: 'bg-white/5 text-text-secondary border-border',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    danger: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    info: 'bg-accent/10 text-accent border-accent/20',
  };

  return (
    <span className={cn("px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md", variants[variant], className)}>
      {children}
    </span>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }> = ({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}) => {
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-border',
    ghost: 'bg-transparent text-text-secondary hover:text-white hover:bg-white/5',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
  };

  return (
    <button 
      className={cn(
        "px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none", 
        variants[variant], 
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
