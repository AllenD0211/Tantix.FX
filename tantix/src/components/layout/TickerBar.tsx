import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Sun, Moon, Shield, Wifi } from 'lucide-react';

interface TickerItem {
  symbol: string;
  bid: number;
  ask: number;
  change: number;
  isPositive: boolean;
  spread: number;
  digits: number;
}

const INITIAL_PAIRS: TickerItem[] = [
  { symbol: 'EUR/USD', bid: 1.08420, ask: 1.08432, change: 0.24, isPositive: true, spread: 1.2, digits: 5 },
  { symbol: 'GBP/USD', bid: 1.29150, ask: 1.29165, change: 0.18, isPositive: true, spread: 1.5, digits: 5 },
  { symbol: 'USD/JPY', bid: 154.210, ask: 154.225, change: -0.15, isPositive: false, spread: 1.5, digits: 3 },
  { symbol: 'AUD/USD', bid: 0.65840, ask: 0.65853, change: -0.32, isPositive: false, spread: 1.3, digits: 5 },
  { symbol: 'XAU/USD', bid: 2748.80, ask: 2749.15, change: 0.88, isPositive: true, spread: 35, digits: 2 },
  { symbol: 'USD/CAD', bid: 1.38210, ask: 1.38224, change: 0.05, isPositive: true, spread: 1.4, digits: 5 },
];

interface TickerBarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({ theme, onToggleTheme }) => {
  const [pairs, setPairs] = useState<TickerItem[]>(INITIAL_PAIRS);

  // Subtle live tick simulation to give the realistic institutional Forex feel
  useEffect(() => {
    const interval = setInterval(() => {
      setPairs((prev) =>
        prev.map((item) => {
          // 40% chance of a tick per interval
          if (Math.random() > 0.4) return item;
          const delta = (Math.random() - 0.49) * (item.symbol === 'XAU/USD' ? 0.35 : 0.00008);
          const newBid = Math.max(0.0001, item.bid + delta);
          const newAsk = newBid + item.spread * (item.digits === 3 ? 0.01 : item.digits === 2 ? 0.01 : 0.0001);
          const isUp = delta >= 0;
          return {
            ...item,
            bid: newBid,
            ask: newAsk,
            isPositive: isUp,
          };
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b border-[var(--neu-border-subtle)] bg-[var(--neu-bg)] px-4 py-2.5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand Identity & Terminal Status */}
        <div className="flex items-center gap-3">
          <div className="neu-inset-pill px-3 py-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-emerald)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-emerald)]"></span>
            </span>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--neu-text-secondary)] font-mono-numbers">
              LD4 ECN FEED
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--neu-text-muted)] font-mono-numbers">
            <Wifi className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span>1.2ms</span>
          </div>
        </div>

        {/* Center: Live Forex Quotes Marquee */}
        <div className="flex items-center gap-4 overflow-x-auto py-1 scrollbar-none text-xs">
          {pairs.map((pair) => (
            <div
              key={pair.symbol}
              className="neu-inset px-2.5 py-1 flex items-center gap-2 shrink-0 transition-all"
            >
              <span className="font-semibold text-[var(--neu-text-primary)] tracking-tight">
                {pair.symbol}
              </span>
              <span className="font-mono-numbers font-medium text-[var(--neu-text-secondary)]">
                {pair.bid.toFixed(pair.digits)}
              </span>
              <span
                className={`flex items-center text-[10px] font-mono-numbers font-semibold ${
                  pair.isPositive ? 'text-[var(--accent-emerald)]' : 'text-[var(--accent-rose)]'
                }`}
              >
                {pair.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {pair.isPositive ? '+' : ''}
                {pair.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* Right: Tactile Theme Switcher & Institutional Security Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[var(--neu-text-muted)]">
            <Shield className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span>256-bit AES</span>
          </div>

          {/* Tactile Neumorphic Sun/Moon Pill Switch */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Dark / Light Neumorphism"
            className="neu-btn px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-[var(--neu-text-secondary)] hover:text-[var(--accent-cyan)] cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Neumorphic theme`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                <span className="text-[11px] tracking-wide">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                <span className="text-[11px] tracking-wide">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
