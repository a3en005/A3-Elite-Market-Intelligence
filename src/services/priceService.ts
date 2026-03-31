import { PriceData } from '../types';
import { ASSETS } from '../constants';

const FX_API = '/api/mkt/fx';
const CRYPTO_API = '/api/mkt/crypto';

async function fetchWithRetry(url: string, retries = 2, delay = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      if (response.status === 429) { // Rate limited
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

export async function fetchPrices(): Promise<Record<string, PriceData>> {
  const prices: Record<string, PriceData> = {};
  let rates: any = null;
  let cryptoData: any = null;

  // Fetch Forex independently
  try {
    const fxRes = await fetchWithRetry(FX_API);
    if (fxRes.ok) {
      const fxJson = await fxRes.json();
      rates = fxJson.rates || fxJson;
    } else {
      console.warn('Forex API returned non-OK status:', fxRes.status);
    }
  } catch (error) {
    console.error('Error fetching Forex prices:', error);
  }

  // Fetch Crypto independently
  try {
    const cryptoRes = await fetchWithRetry(CRYPTO_API);
    if (cryptoRes.ok) {
      cryptoData = await cryptoRes.json();
    } else {
      console.warn('Crypto API returned non-OK status:', cryptoRes.status);
    }
  } catch (error) {
    console.error('Error fetching Crypto prices:', error);
  }

  ASSETS.forEach(asset => {
    let price = 0;
    let change = 0;
    let isLive = false;

    if (asset.category === 'Forex' && rates) {
      if (rates[asset.symbol]) {
        price = rates[asset.symbol];
        isLive = true;
      } else if (asset.symbol === 'EURUSD') {
        price = 1 / (rates.EUR || 1);
        isLive = !!rates.EUR;
      } else if (asset.symbol === 'GBPUSD') {
        price = 1 / (rates.GBP || 1);
        isLive = !!rates.GBP;
      } else if (asset.symbol.startsWith('USD')) {
        const target = asset.symbol.substring(3);
        price = rates[target] || 0;
        isLive = !!rates[target];
      } else {
        const from = asset.symbol.substring(0, 3);
        const to = asset.symbol.substring(3);
        if (rates[from] && rates[to]) {
          price = rates[to] / rates[from];
          isLive = true;
        }
      }
    } else if (asset.category === 'Crypto' && cryptoData) {
      if (cryptoData[asset.symbol]) {
        price = cryptoData[asset.symbol].usd;
        change = cryptoData[asset.symbol].usd_24h_change;
        isLive = true;
      }
    } else if (asset.category === 'Currency Indexes' && rates) {
      if (asset.symbol === 'DXY') {
        const eur = 1 / (rates.EUR || 1);
        const jpy = rates.JPY || 110;
        const gbp = 1 / (rates.GBP || 0.8);
        const cad = rates.CAD || 1.3;
        const sek = rates.SEK || 10;
        const chf = rates.CHF || 0.9;
        
        price = 50.14348112 * 
                Math.pow(eur, -0.576) * 
                Math.pow(jpy, 0.136) * 
                Math.pow(gbp, -0.119) * 
                Math.pow(cad, 0.091) * 
                Math.pow(sek, 0.042) * 
                Math.pow(chf, 0.036);
        isLive = true;
      } else if (asset.symbol === 'EXY') {
        price = (1 / (rates.EUR || 1)) * 100;
        isLive = true;
      } else if (asset.symbol === 'BXY') {
        price = (1 / (rates.GBP || 1)) * 100;
        isLive = true;
      } else if (asset.symbol === 'JXY') {
        price = (1 / (rates.JPY || 110)) * 10000;
        isLive = true;
      } else {
        const rate = rates[asset.symbol.substring(0, 3)];
        if (rate) {
          price = (1 / rate) * 100;
          isLive = true;
        }
      }
    } else if (rates && (asset.category === 'Metals' || asset.category === 'Indices' || asset.category === 'Commodities') && rates[asset.symbol]) {
      price = rates[asset.symbol];
      isLive = true;
    }

    // No fallback to demo prices if we want strict API usage
    // But we should keep the PriceData structure
    prices[asset.symbol] = {
      symbol: asset.symbol,
      price,
      change24h: change,
      isLive
    };
  });

  return prices;
}

function getDemoPrice(symbol: string): number {
  const bases: Record<string, number> = {
    'XAUUSD': 2150.50,
    'XAGUSD': 24.20,
    'US30': 39120,
    'NAS100': 18250,
    'SPX500': 5180,
    'USOIL': 81.50,
    'UKOIL': 85.20,
    'NATGAS': 1.75,
    'GER40': 18000,
    'JPN225': 40000
  };
  return bases[symbol] || 1.0;
}

export function setupPriceWebSocket(onUpdate: (updates: any[]) => void) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}`;
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'PRICE_UPDATE') {
        onUpdate(message.data);
      }
    } catch (e) {
      console.error('WS Message Error:', e);
    }
  };

  ws.onclose = () => {
    setTimeout(() => setupPriceWebSocket(onUpdate), 5000);
  };

  return ws;
}
