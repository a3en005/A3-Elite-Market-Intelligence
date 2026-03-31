import { MarketAnalysis, Signal, PriceData } from '../types';

export function generateAnalysis(symbol: string, currentPrice: number, change24h: number = 0): MarketAnalysis {
  // Use the 24h change to determine bias for more "accurate" output
  const isBullish = change24h >= 0;
  
  return {
    bias: isBullish ? 'Bullish' : 'Bearish',
    structure: isBullish ? 'HH/HL' : 'LH/LL',
    orderBlocks: [
      { type: 'Demand', price: currentPrice * (1 - (Math.random() * 0.01 + 0.005)), active: true },
      { type: 'Supply', price: currentPrice * (1 + (Math.random() * 0.01 + 0.005)), active: true }
    ],
    fvgs: [
      { type: isBullish ? 'Bullish' : 'Bearish', price: currentPrice * (isBullish ? 0.998 : 1.002), filled: false }
    ],
    premiumDiscount: isBullish ? 'Discount' : 'Premium',
    amd: isBullish ? 'Accumulation' : 'Distribution',
    unicorn: Math.abs(change24h) > 1.5
  };
}

export function generateSignals(symbol: string, price: number, analysis: MarketAnalysis): Signal[] {
  const signals: Signal[] = [];
  
  // Logic for signal generation:
  // 1. Unicorn signals (High confidence)
  // 2. Elite signals (Medium-High confidence)
  // 3. Regular signals (Standard)
  
  const shouldGenerate = analysis.unicorn || Math.random() > 0.85;
  
  if (shouldGenerate) {
    const direction = analysis.bias === 'Bullish' ? 'LONG' : 'SHORT';
    const multiplier = direction === 'LONG' ? 1 : -1;
    
    // Calculate levels based on current price and bias
    const entry = price;
    // Stop loss usually below/above recent structure
    const stop = price - (price * (0.003 + Math.random() * 0.004) * multiplier);
    // Target based on risk/reward (at least 1:2 or 1:3)
    const rr = 2 + Math.random() * 2;
    const target = price + (Math.abs(price - stop) * rr * multiplier);
    
    const confidence = analysis.unicorn ? 5 : Math.floor(Math.random() * 2) + 3;
    
    signals.push({
      id: Math.random().toString(36).substring(7),
      symbol,
      direction,
      entry,
      stop,
      target,
      confidence,
      tier: analysis.unicorn ? 0 : (confidence >= 4 ? 1 : 2),
      timestamp: Date.now(),
      status: 'Active'
    });
  }
  
  return signals;
}
