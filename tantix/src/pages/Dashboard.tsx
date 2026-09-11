import React, { useState, useMemo } from 'react';
import type { UserSession } from '../types/auth';
import type { ForexInputs, InstrumentType } from '../types/calculator';
import { DashboardHeader } from '../components/layout/DashboardHeader';
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
      <DashboardHeader
        session={session}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSignOut={onSignOut}
      />

      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
        <TickerBar />

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
