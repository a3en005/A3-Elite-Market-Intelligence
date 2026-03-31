export interface Asset {
  symbol: string;
  name: string;
  category: 'Forex' | 'Metals' | 'Indices' | 'Crypto' | 'Commodities' | 'Currency Indexes';
  tvSymbol: string;
  icon?: string;
}

export const ASSETS: Asset[] = [
  // Forex Majors
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'Forex', tvSymbol: 'FX:EURUSD', icon: '🇪🇺' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'Forex', tvSymbol: 'FX:GBPUSD', icon: '🇬🇧' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'Forex', tvSymbol: 'FX:USDJPY', icon: '🇯🇵' },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', category: 'Forex', tvSymbol: 'FX:USDCHF', icon: '🇨🇭' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', category: 'Forex', tvSymbol: 'FX:AUDUSD', icon: '🇦🇺' },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', category: 'Forex', tvSymbol: 'FX:USDCAD', icon: '🇨🇦' },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', category: 'Forex', tvSymbol: 'FX:NZDUSD', icon: '🇳🇿' },
  
  // Forex Crosses
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', category: 'Forex', tvSymbol: 'FX:EURJPY', icon: '🇪🇺' },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', category: 'Forex', tvSymbol: 'FX:GBPJPY', icon: '🇬🇧' },
  { symbol: 'EURGBP', name: 'Euro / British Pound', category: 'Forex', tvSymbol: 'FX:EURGBP', icon: '🇪🇺' },
  { symbol: 'EURAUD', name: 'Euro / Australian Dollar', category: 'Forex', tvSymbol: 'FX:EURAUD', icon: '🇪🇺' },
  { symbol: 'EURCHF', name: 'Euro / Swiss Franc', category: 'Forex', tvSymbol: 'FX:EURCHF', icon: '🇪🇺' },
  { symbol: 'GBPCHF', name: 'British Pound / Swiss Franc', category: 'Forex', tvSymbol: 'FX:GBPCHF', icon: '🇬🇧' },
  { symbol: 'GBPAUD', name: 'British Pound / Australian Dollar', category: 'Forex', tvSymbol: 'FX:GBPAUD', icon: '🇬🇧' },
  { symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', category: 'Forex', tvSymbol: 'FX:AUDJPY', icon: '🇦🇺' },
  { symbol: 'CHFJPY', name: 'Swiss Franc / Japanese Yen', category: 'Forex', tvSymbol: 'FX:CHFJPY', icon: '🇨🇭' },
  { symbol: 'CADJPY', name: 'Canadian Dollar / Japanese Yen', category: 'Forex', tvSymbol: 'FX:CADJPY', icon: '🇨🇦' },
  { symbol: 'AUDNZD', name: 'Australian Dollar / New Zealand Dollar', category: 'Forex', tvSymbol: 'FX:AUDNZD', icon: '🇦🇺' },
  { symbol: 'NZDJPY', name: 'New Zealand Dollar / Japanese Yen', category: 'Forex', tvSymbol: 'FX:NZDJPY', icon: '🇳🇿' },

  // Metals
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', category: 'Metals', tvSymbol: 'OANDA:XAUUSD', icon: '✨' },
  { symbol: 'XAGUSD', name: 'Silver / US Dollar', category: 'Metals', tvSymbol: 'OANDA:XAGUSD', icon: '🥈' },
  { symbol: 'XPTUSD', name: 'Platinum / US Dollar', category: 'Metals', tvSymbol: 'OANDA:XPTUSD', icon: '💎' },
  { symbol: 'XPDUSD', name: 'Palladium / US Dollar', category: 'Metals', tvSymbol: 'OANDA:XPDUSD', icon: '⚙️' },

  // Indices
  { symbol: 'US30', name: 'Dow Jones 30', category: 'Indices', tvSymbol: 'CURRENCYCOM:US30', icon: '🇺🇸' },
  { symbol: 'NAS100', name: 'Nasdaq 100', category: 'Indices', tvSymbol: 'CURRENCYCOM:NAS100', icon: '💻' },
  { symbol: 'SPX500', name: 'S&P 500', category: 'Indices', tvSymbol: 'CURRENCYCOM:SPX500', icon: '📈' },
  { symbol: 'UK100', name: 'FTSE 100', category: 'Indices', tvSymbol: 'CURRENCYCOM:UK100', icon: '🇬🇧' },
  { symbol: 'GER40', name: 'DAX 40', category: 'Indices', tvSymbol: 'CURRENCYCOM:GER40', icon: '🇩🇪' },
  { symbol: 'FRA40', name: 'CAC 40', category: 'Indices', tvSymbol: 'CURRENCYCOM:FRA40', icon: '🇫🇷' },
  { symbol: 'JPN225', name: 'Nikkei 225', category: 'Indices', tvSymbol: 'CURRENCYCOM:JPN225', icon: '🇯🇵' },
  { symbol: 'AUS200', name: 'ASX 200', category: 'Indices', tvSymbol: 'CURRENCYCOM:AUS200', icon: '🇦🇺' },
  { symbol: 'HK50', name: 'Hang Seng Index', category: 'Indices', tvSymbol: 'CURRENCYCOM:HK50', icon: '🇭🇰' },

  // Crypto
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', category: 'Crypto', tvSymbol: 'BINANCE:BTCUSDT', icon: '₿' },
  { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', category: 'Crypto', tvSymbol: 'BINANCE:ETHUSDT', icon: 'Ξ' },
  { symbol: 'BNBUSD', name: 'Binance Coin / US Dollar', category: 'Crypto', tvSymbol: 'BINANCE:BNBUSDT', icon: '🔶' },
  { symbol: 'XRPUSD', name: 'XRP / US Dollar', category: 'Crypto', tvSymbol: 'BINANCE:XRPUSDT', icon: '✕' },
  { symbol: 'SOLUSD', name: 'Solana / US Dollar', category: 'Crypto', tvSymbol: 'BINANCE:SOLUSDT', icon: '◎' },
  { symbol: 'ADAUSD', name: 'Cardano / US Dollar', category: 'Crypto', tvSymbol: 'BINANCE:ADAUSDT', icon: '₳' },
  { symbol: 'DOTUSD', name: 'Polkadot / US Dollar', category: 'Crypto', tvSymbol: 'BINANCE:DOTUSDT', icon: '●' },
  { symbol: 'MATICUSD', name: 'Polygon / US Dollar', category: 'Crypto', tvSymbol: 'BINANCE:MATICUSDT', icon: '💜' },
  { symbol: 'LINKUSD', name: 'Chainlink / US Dollar', category: 'Crypto', tvSymbol: 'BINANCE:LINKUSDT', icon: '🔗' },
  { symbol: 'AVAXUSD', name: 'Avalanche / US Dollar', category: 'Crypto', tvSymbol: 'BINANCE:AVAXUSDT', icon: '🔺' },

  // Commodities
  { symbol: 'USOIL', name: 'WTI Crude Oil', category: 'Commodities', tvSymbol: 'OANDA:WTICOUSD', icon: '🛢️' },
  { symbol: 'UKOIL', name: 'Brent Crude Oil', category: 'Commodities', tvSymbol: 'OANDA:BCOUSD', icon: '🌊' },
  { symbol: 'NATGAS', name: 'Natural Gas', category: 'Commodities', tvSymbol: 'OANDA:NATGASUSD', icon: '🔥' },

  // Currency Indexes
  { symbol: 'DXY', name: 'US Dollar Index', category: 'Currency Indexes', tvSymbol: 'CAPITALCOM:DXY', icon: '💵' },
  { symbol: 'EXY', name: 'Euro Index', category: 'Currency Indexes', tvSymbol: 'TVC:EXY', icon: '💶' },
  { symbol: 'BXY', name: 'British Pound Index', category: 'Currency Indexes', tvSymbol: 'TVC:BXY', icon: '💷' },
  { symbol: 'JXY', name: 'Japanese Yen Index', category: 'Currency Indexes', tvSymbol: 'TVC:JXY', icon: '💴' },
  { symbol: 'AXY', name: 'Australian Dollar Index', category: 'Currency Indexes', tvSymbol: 'TVC:AXY', icon: '🇦🇺' },
  { symbol: 'CXY', name: 'Canadian Dollar Index', category: 'Currency Indexes', tvSymbol: 'TVC:CXY', icon: '🇨🇦' },
  { symbol: 'SXY', name: 'Swiss Franc Index', category: 'Currency Indexes', tvSymbol: 'TVC:SXY', icon: '🇨🇭' },
  { symbol: 'ZXY', name: 'New Zealand Dollar Index', category: 'Currency Indexes', tvSymbol: 'TVC:ZXY', icon: '🇳🇿' },
];

export interface Session {
  name: string;
  start: number; // UTC hour
  end: number;   // UTC hour
  color: string;
}

export const SESSIONS: Session[] = [
  { name: 'Sydney', start: 0, end: 6, color: 'bg-blue-500' },
  { name: 'Tokyo', start: 6, end: 9, color: 'bg-red-500' },
  { name: 'London', start: 9, end: 16, color: 'bg-amber-500' },
  { name: 'New York', start: 16, end: 21, color: 'bg-emerald-500' },
];

export const KILLZONES = [
  { name: 'London Open', start: 8, end: 10, color: 'text-amber-400' },
  { name: 'London KZ', start: 2, end: 5, color: 'text-amber-500' },
  { name: 'NY Open', start: 14, end: 16, color: 'text-emerald-400' },
  { name: 'NY KZ', start: 7, end: 10, color: 'text-emerald-500' },
  { name: 'Asian KZ', start: 20, end: 1, color: 'text-blue-400' },
  { name: 'Lunch KZ', start: 11, end: 13, color: 'text-zinc-400' },
];

export const SILVER_BULLETS = [
  { name: 'London SB', start: 3, end: 4 },
  { name: 'NY AM SB', start: 8.5, end: 9.5 },
  { name: 'NY PM SB', start: 14.5, end: 15.5 },
];
