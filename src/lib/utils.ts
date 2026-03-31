import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, symbol: string): string {
  if (price === undefined || price === null) return '---';
  
  if (symbol.includes('JPY') || symbol.includes('XAU') || symbol.includes('OIL') || symbol.includes('GAS')) {
    return price.toFixed(3);
  }
  if (symbol.includes('BTC') || symbol.includes('ETH')) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (price < 1) {
    return price.toFixed(5);
  }
  return price.toFixed(5);
}

export function getChangeColor(change: number): string {
  if (change > 0) return 'text-emerald-400';
  if (change < 0) return 'text-rose-400';
  return 'text-zinc-400';
}
