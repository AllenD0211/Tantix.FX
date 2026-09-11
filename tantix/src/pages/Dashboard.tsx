import React, { useState, useMemo } from 'react';
import {
  Calculator,
  LogOut,
  SlidersHorizontal,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import type { UserSession } from '../types/auth';
import type { ForexInputs, InstrumentType } from '../types/calculator';
import { TickerBar } from '../components/layout/TickerBar';
import { InstrumentSelector } from '../components/calculator/InstrumentSelector';
import { TradeAnalysisChart } from '../components/charts/TradeAnalysisChart';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { ResultSummary } from '../components/calculator/ResultSummary';
import { InstrumentInfo } from '../components/calculator/InstrumentInfo';
import { forexCalculator } from '../services/calculator/forexCalculator';
import { validateForexInputs } from '../utils/validation';

export interface DashboardProps {
  session: UserSession;
  onSignOut: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  session,
  onSignOut,
  theme,
  onToggleTheme,
}) => {
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('forex');

  // Initialize inputs from session balance
  const initialInputs = useMemo<ForexInputs>(() => {
    return forexCalculator.getDefaults(session.balance || 10000);
  }, [session.balance]);

  const [inputs, setInputs] = useState<ForexInputs>(initialInputs);

  // Real-time input validation
  const validation = useMemo(() => {
    return validateForexInputs(inputs);
  }, [inputs]);

  // Real-time deterministic calculation
  const calculationResult = useMemo(() => {
    return forexCalculator.calculate(inputs);
  }, [inputs]);

  const handleReset = () => {
    setInputs(forexCalculator.getDefaults(session.balance || 10000));
  };

  return (
    <div className="flex-1 flex flex-col justify-between relative pb-8">
      {/* Top Live Rates Ticker */}
      <TickerBar theme={theme} onToggleTheme={onToggleTheme} />

      {/* Main Workspace Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
        {/* Workspace Top Header Card */}
        <div className="neu-raised-card p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border border-[var(--neu-border-subtle)]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl neu-convex flex items-center justify-center text-[var(--accent-cyan)] shrink-0 shadow-[0_0_15px_var(--accent-cyan-glow)]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-[var(--neu-text-primary)]">
                  TANTIX Trade Outcome Calculator
                </h1>
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full neu-inset text-[var(--accent-emerald)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)] animate-pulse" />
                  REAL-TIME MATH
                </span>
                {session.isDemo && (
                  <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full neu-inset text-[var(--accent-amber)]">
                    DEMO SIMULATOR
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--neu-text-secondary)] font-mono-numbers mt-0.5">
                Model margin, profit/loss, and risk/reward before entering real market positions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="neu-btn p-2 rounded-xl text-xs text-[var(--neu-text-secondary)] hover:text-[var(--accent-cyan)] cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Disconnect Button */}
            <button
              type="button"
              onClick={onSignOut}
              className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--neu-text-muted)] hover:text-[var(--accent-rose)] flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Return to Login"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* 1. Instrument Asset Class Selector */}
        <InstrumentSelector
          selected={selectedInstrument}
          onSelect={setSelectedInstrument}
        />

        {/* 2. TOP-SIDE: Trade Analysis Chart & Outcome Overview (As requested) */}
        <section aria-label="Trade Outcome Analysis">
          <TradeAnalysisChart result={calculationResult} inputs={inputs} />
        </section>

        {/* 3. Calculator Form & Detailed Summary Side-by-Side or Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Primary: Calculator Form (7 cols on lg) */}
          <div className="lg:col-span-7">
            <CalculatorForm
              inputs={inputs}
              errors={validation.errors}
              onChange={setInputs}
              onReset={handleReset}
            />
          </div>

          {/* Right: Detailed Result Summary (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <ResultSummary result={calculationResult} inputs={inputs} />
          </div>
        </div>

        {/* 4. Educational Guide & Formula Documentation */}
        <InstrumentInfo inputs={inputs} />
      </div>
    </div>
  );
};

export default Dashboard;
