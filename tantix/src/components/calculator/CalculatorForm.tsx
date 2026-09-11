import React from 'react';
import {
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { ForexInputs, TradeDirection } from '../../types/calculator';
import { POPULAR_FOREX_PAIRS, findPairInfo } from '../../services/calculator/forexCalculator';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface CalculatorFormProps {
  inputs: ForexInputs;
  errors: Record<string, string>;
  onChange: (inputs: ForexInputs) => void;
  onReset: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  inputs,
  errors,
  onChange,
  onReset,
}) => {
  const currentPairInfo = findPairInfo(inputs.pair);

  const handlePairChange = (symbol: string) => {
    const pair = findPairInfo(symbol);
    const isBuy = inputs.direction === 'BUY';
    const entry = pair.defaultPrice;
    const pipDiff = pair.pipSize * 50; // 50 pips default SL
    const tpDiff = pair.pipSize * 100; // 100 pips default TP

    onChange({
      ...inputs,
      pair: symbol,
      entryPrice: entry,
      stopLossPrice: isBuy ? Number((entry - pipDiff).toFixed(pair.digits)) : Number((entry + pipDiff).toFixed(pair.digits)),
      takeProfitPrice: isBuy ? Number((entry + tpDiff).toFixed(pair.digits)) : Number((entry - tpDiff).toFixed(pair.digits)),
    });
  };

  const handleDirectionChange = (direction: TradeDirection) => {
    if (direction === inputs.direction) return;

    // Swap SL and TP offsets when flipping direction to keep logic valid
    const entry = inputs.entryPrice;
    const pip = currentPairInfo.pipSize;
    const digits = currentPairInfo.digits;

    const currentSlDist = inputs.stopLossPrice ? Math.abs(entry - inputs.stopLossPrice) : pip * 50;
    const currentTpDist = inputs.takeProfitPrice ? Math.abs(entry - inputs.takeProfitPrice) : pip * 100;

    const newSl = direction === 'BUY' ? entry - currentSlDist : entry + currentSlDist;
    const newTp = direction === 'BUY' ? entry + currentTpDist : entry - currentTpDist;

    onChange({
      ...inputs,
      direction,
      stopLossPrice: Number(newSl.toFixed(digits)),
      takeProfitPrice: Number(newTp.toFixed(digits)),
    });
  };

  const applyPipsToStopLoss = (pips: number) => {
    const isBuy = inputs.direction === 'BUY';
    const pipSize = currentPairInfo.pipSize;
    const delta = pips * pipSize;
    const newSl = isBuy ? inputs.entryPrice - delta : inputs.entryPrice + delta;
    onChange({
      ...inputs,
      stopLossPrice: Number(newSl.toFixed(currentPairInfo.digits)),
    });
  };

  const applyPipsToTakeProfit = (pips: number) => {
    const isBuy = inputs.direction === 'BUY';
    const pipSize = currentPairInfo.pipSize;
    const delta = pips * pipSize;
    const newTp = isBuy ? inputs.entryPrice + delta : inputs.entryPrice - delta;
    onChange({
      ...inputs,
      takeProfitPrice: Number(newTp.toFixed(currentPairInfo.digits)),
    });
  };

  return (
    <div className="neu-raised-card p-5 sm:p-6 space-y-5 border border-[var(--neu-border-subtle)]">
      {/* Form Title & Actions */}
      <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)] pb-4">
        <div>
          <h3 className="text-sm font-bold text-[var(--neu-text-primary)]">
            Manual Trade Input Parameters
          </h3>
          <p className="text-xs text-[var(--neu-text-muted)] mt-0.5">
            Enter your trade parameters to compute real-time margins and P/L.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-[var(--neu-text-muted)] hover:text-[var(--accent-cyan)] flex items-center gap-1.5 cursor-pointer transition-colors"
          title="Reset to default values"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Row 1: Direction Toggle & Pair Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Direction Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--neu-text-secondary)]">
            Trade Direction (Order Type)
          </label>
          <div className="grid grid-cols-2 gap-2 neu-inset p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleDirectionChange('BUY')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                inputs.direction === 'BUY'
                  ? 'bg-[var(--accent-emerald)] text-[#0c0f17] shadow-[0_2px_10px_var(--accent-emerald-glow)]'
                  : 'text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)]'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>BUY (LONG)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDirectionChange('SELL')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                inputs.direction === 'SELL'
                  ? 'bg-[var(--accent-rose)] text-[#ffffff] shadow-[0_2px_10px_var(--accent-rose-glow)]'
                  : 'text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)]'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>SELL (SHORT)</span>
            </button>
          </div>
        </div>

        {/* Currency Pair Selector */}
        <Select
          label="Currency Pair"
          value={inputs.pair}
          onChange={(e) => handlePairChange(e.target.value)}
          options={POPULAR_FOREX_PAIRS.map((p) => ({
            value: p.symbol,
            label: p.symbol,
            subLabel: `Ref: ${p.defaultPrice.toFixed(p.digits)}`,
          }))}
          error={errors.pair}
        />
      </div>

      {/* Row 2: Account Balance & Leverage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Account Balance"
          type="number"
          prefix="$"
          suffix="USD"
          min="1"
          step="100"
          value={inputs.accountBalance || ''}
          onChange={(e) =>
            onChange({ ...inputs, accountBalance: parseFloat(e.target.value) || 0 })
          }
          error={errors.accountBalance}
        />

        <Select
          label="Account Leverage"
          value={inputs.leverage}
          onChange={(e) =>
            onChange({ ...inputs, leverage: parseInt(e.target.value, 10) || 100 })
          }
          options={[
            { value: 30, label: '1:30 (Retail Standard EU/UK)' },
            { value: 50, label: '1:50 (US Regulated Cap)' },
            { value: 100, label: '1:100 (Standard ECN)' },
            { value: 200, label: '1:200 (Professional)' },
            { value: 500, label: '1:500 (High Leverage)' },
          ]}
          error={errors.leverage}
        />
      </div>

      {/* Row 3: Position Size (Lots) with Quick Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--neu-text-secondary)]">
            Position Size (Lot Size)
          </label>
          <span className="text-[10px] text-[var(--neu-text-muted)] font-mono-numbers">
            1 Lot = 100,000 units
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[140px]">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max="100"
              suffix="Lots"
              value={inputs.lotSize || ''}
              onChange={(e) =>
                onChange({ ...inputs, lotSize: parseFloat(e.target.value) || 0 })
              }
              error={errors.lotSize}
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {[0.01, 0.1, 0.5, 1.0, 2.0].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange({ ...inputs, lotSize: preset })}
                className={`neu-btn px-2.5 py-2 rounded-lg text-xs font-mono-numbers cursor-pointer transition-colors ${
                  inputs.lotSize === preset
                    ? 'text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 font-bold'
                    : 'text-[var(--neu-text-secondary)] hover:text-[var(--neu-text-primary)]'
                }`}
              >
                {preset.toFixed(2)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Entry Price */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--neu-text-secondary)]">
            Entry Price
          </label>
          <button
            type="button"
            onClick={() =>
              onChange({ ...inputs, entryPrice: currentPairInfo.defaultPrice })
            }
            className="text-[10px] text-[var(--accent-cyan)] hover:underline cursor-pointer flex items-center gap-1 font-mono-numbers"
          >
            <Sparkles className="w-3 h-3" />
            Set to {currentPairInfo.defaultPrice}
          </button>
        </div>

        <Input
          type="number"
          step={currentPairInfo.pipSize}
          value={inputs.entryPrice || ''}
          onChange={(e) =>
            onChange({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })
          }
          error={errors.entryPrice}
        />
      </div>

      {/* Row 5: Stop Loss & Take Profit with Quick Pip Helpers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stop Loss Input & Helpers */}
        <div className="space-y-2">
          <Input
            label="Stop Loss Price"
            type="number"
            step={currentPairInfo.pipSize}
            hint={inputs.direction === 'BUY' ? 'Must be below Entry' : 'Must be above Entry'}
            value={inputs.stopLossPrice ?? ''}
            onChange={(e) =>
              onChange({
                ...inputs,
                stopLossPrice: e.target.value === '' ? undefined : parseFloat(e.target.value),
              })
            }
            error={errors.stopLossPrice}
          />

          <div className="flex items-center gap-1 text-[10px] text-[var(--neu-text-muted)]">
            <span className="font-semibold">Quick SL:</span>
            {[20, 30, 50, 100].map((pips) => (
              <button
                key={pips}
                type="button"
                onClick={() => applyPipsToStopLoss(pips)}
                className="neu-btn px-2 py-0.5 rounded text-[10px] font-mono-numbers text-[var(--accent-rose)] hover:bg-[var(--accent-rose)]/10 cursor-pointer"
              >
                -{pips} pips
              </button>
            ))}
          </div>
        </div>

        {/* Take Profit Input & Helpers */}
        <div className="space-y-2">
          <Input
            label="Take Profit Price"
            type="number"
            step={currentPairInfo.pipSize}
            hint={inputs.direction === 'BUY' ? 'Must be above Entry' : 'Must be below Entry'}
            value={inputs.takeProfitPrice ?? ''}
            onChange={(e) =>
              onChange({
                ...inputs,
                takeProfitPrice: e.target.value === '' ? undefined : parseFloat(e.target.value),
              })
            }
            error={errors.takeProfitPrice}
          />

          <div className="flex items-center gap-1 text-[10px] text-[var(--neu-text-muted)]">
            <span className="font-semibold">Quick TP:</span>
            {[30, 50, 100, 150].map((pips) => (
              <button
                key={pips}
                type="button"
                onClick={() => applyPipsToTakeProfit(pips)}
                className="neu-btn px-2 py-0.5 rounded text-[10px] font-mono-numbers text-[var(--accent-emerald)] hover:bg-[var(--accent-emerald)]/10 cursor-pointer"
              >
                +{pips} pips
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
