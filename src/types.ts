export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  isLive: boolean;
}

export interface MarketAnalysis {
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  structure: 'HH/HL' | 'LH/LL' | 'Ranging';
  orderBlocks: { type: 'Supply' | 'Demand'; price: number; active: boolean }[];
  fvgs: { type: 'Bullish' | 'Bearish'; price: number; filled: boolean }[];
  premiumDiscount: 'Premium' | 'Discount' | 'Equilibrium';
  amd: 'Accumulation' | 'Manipulation' | 'Distribution';
  unicorn: boolean;
}

export interface Signal {
  id: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entry: number;
  stop: number;
  target: number;
  confidence: number; // 1-5
  tier: 0 | 1 | 2; // 0: Unicorn, 1: A3-Elite, 2: Alternative
  timestamp: number;
  status: 'Active' | 'Hit' | 'Stopped';
}

export interface JournalEntry {
  id: string;
  date: string;
  closeDate?: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entry: number;
  exit?: number;
  stop: number;
  target: number;
  lots: number;
  pnl?: number;
  status: 'OPEN' | 'WIN' | 'LOSS';
  notes: string;
  tier?: number;
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low';
  forecast: string;
  previous: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}
