# Tantix - Forex Trading Calculator & Risk Management Platform

Tantix is a modern, high-precision Forex Trading Calculator and Risk Management platform designed to help traders calculate position size, risk-to-reward ratio, margin requirements, potential profit/loss, and pip values with mathematical accuracy before entering trades. The platform also includes an institutional-grade Trade Journal, Performance Analytics with dynamic charts, live market rate caching, and educational modules.

## User Review Required

> [!IMPORTANT]
> **Dual Backend Architecture (Supabase + Local Demo Fallback)**:
> Tantix will be configured to connect directly to Supabase (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`). To ensure the app is immediately runnable and verifiable without mandatory manual cloud database provisioning first, we will provide:
> 1. A full PostgreSQL schema with Row Level Security (RLS) policies and triggers in `supabase/schema.sql`.
> 2. A fallback data adapter in `src/lib/storage.ts` that automatically falls back to an encrypted/structured `localStorage` adapter if Supabase credentials are not yet configured or in offline demo mode.
> 3. Seamless switching: Once credentials are added to `.env`, it automatically synchronizes with Supabase.

> [!NOTE]
> **Live Market Data Service**:
> We will integrate a public, free exchange rate feed (with automatic in-memory & `localStorage` caching and a 5-minute TTL) with an indicator showing "Last updated: [timestamp]". If the API is offline or rate-limited, it gracefully falls back to reliable default Forex reference rates and allows traders to enter/adjust prices manually with a "Market data unavailable / Manual mode" badge.

---

## Proposed Architecture & File Structure

```
Tantix.FX/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── supabase/
│   └── schema.sql                  # Complete Supabase PostgreSQL schema, RLS policies, & triggers
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                   # Custom financial dashboard styling, Tailwind utilities & tokens
│   ├── types/
│   │   ├── calculator.ts           # Types for pairs, directions, calculation inputs & outputs
│   │   ├── trade.ts                # Types for journal trades, status, filters, sorting
│   │   ├── market.ts               # Types for currency rates, quotes, pair metadata
│   │   └── user.ts                 # Auth and profile types
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client singleton & auth helpers
│   │   ├── storage.ts              # Unified repository interface (Supabase with LocalStorage fallback)
│   │   ├── validations.ts          # Zod or pure TypeScript validation rules with user-friendly error messages
│   │   └── utils.ts                # Formatting utilities (currency, pips, dates, percentages)
│   ├── services/
│   │   ├── calculatorService.ts    # Pure, independently testable calculation engine
│   │   ├── marketDataService.ts    # Isolated exchange rate fetcher with caching & offline fallback
│   │   └── tradeService.ts         # Trade journal CRUD, CSV export, and filtering
│   ├── hooks/
│   │   ├── useAuth.ts              # Authentication state management
│   │   ├── useCalculator.ts        # Calculator state, live validation, and result evaluation
│   │   ├── useTrades.ts            # Journal trades query, mutations, and analytics aggregation
│   │   └── useMarketData.ts        # Market rates lifecycle, auto-refresh, and manual override
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Top navigation bar with market status & quick profile
│   │   │   ├── Sidebar.tsx         # Sleek desktop sidebar navigation
│   │   │   ├── MobileNav.tsx       # Bottom navigation bar for mobile devices
│   │   │   ├── Footer.tsx          # Disclaimer & copyright footer
│   │   │   └── AppLayout.tsx       # Standard dashboard shell
│   │   ├── ui/
│   │   │   ├── Card.tsx            # Premium glass/slate card components
│   │   │   ├── Button.tsx          # Accessible buttons with variants (primary, secondary, danger, outline)
│   │   │   ├── Input.tsx           # Form inputs with currency symbols and validation states
│   │   │   ├── Select.tsx          # Accessible custom select dropdown
│   │   │   ├── Badge.tsx           # Status tags (BUY, SELL, Win, Loss, Breakeven, Open)
│   │   │   ├── Modal.tsx           # Accessible modal dialogs for trade add/edit/delete
│   │   │   └── Skeleton.tsx        # Loading skeleton loaders
│   │   ├── calculator/
│   │   │   ├── CalculatorForm.tsx   # Core trade input form
│   │   │   ├── CalculatorResult.tsx # Prominent metrics display (lots, risk, pip value, margin, R:R)
│   │   │   └── PairQuickSelector.tsx# Fast picker for major/minor Forex pairs
│   │   ├── dashboard/
│   │   │   ├── MetricCard.tsx      # KPI cards (Balance, Today's Risk, Win Rate, Net P/L)
│   │   │   ├── MiniPerformanceChart.tsx # Lightweight equity curve preview
│   │   │   └── RecentTradesTable.tsx# Quick list of latest journal entries
│   │   ├── journal/
│   │   │   ├── TradeTable.tsx      # Comprehensive responsive data table
│   │   │   ├── TradeFilterBar.tsx  # Pair, Direction, Result filters, Search, and Sort
│   │   │   ├── TradeModal.tsx      # Create/Edit trade modal
│   │   │   └── DeleteConfirmModal.tsx # Safe deletion prompt
│   │   └── analytics/
│   │   │   ├── AnalyticsSummary.tsx# Institutional analytics breakdown
│   │   │   ├── EquityChart.tsx     # Cumulative P/L equity curve over time (Recharts)
│   │   │   ├── WinRateChart.tsx    # Win/Loss/Breakeven donut chart (Recharts)
│   │   │   ├── PairPerformanceChart.tsx # P/L by currency pair bar chart (Recharts)
│   │   │   └── MonthlyPerformanceChart.tsx # Monthly P/L distribution bar chart (Recharts)
│   └── pages/
│       ├── Landing.tsx             # Marketing landing page with hero, features, and disclaimer
│       ├── Login.tsx               # Sign in page
│       ├── Register.tsx            # Sign up page
│       ├── Dashboard.tsx           # Overview dashboard
│       ├── CalculatorPage.tsx      # Full Forex calculation workspace
│       ├── JournalPage.tsx         # Trade journal with filters, CRUD, and CSV export
│       ├── AnalyticsPage.tsx       # Deep-dive analytics with charts
│       ├── LearnPage.tsx           # Educational Forex guide & formulas
│       ├── SettingsPage.tsx        # Account currency, default risk %, leverage settings
│       └── ProfilePage.tsx         # User profile and stats
├── tests/
│   └── calculatorService.test.ts   # Vitest unit test suite covering all calculation edge cases
```

---

## Key Calculation Engine Specification

The `calculatorService.ts` will strictly implement standard institutional Forex formulas:

1. **Pip Size Detection**:
   - JPY pairs (e.g. `USD/JPY`, `EUR/JPY`, `GBP/JPY`): `0.01` pip size (1 pip = 0.01 price change).
   - Standard pairs (e.g. `EUR/USD`, `GBP/USD`, `AUD/USD`): `0.0001` pip size (1 pip = 0.0001 price change).

2. **Pip Distance**:
   - `BUY`: `(Entry Price - Stop Loss) / pipSize`
   - `SELL`: `(Stop Loss - Entry Price) / pipSize`
   - Target Distance:
     - `BUY`: `(Take Profit - Entry Price) / pipSize`
     - `SELL`: `(Entry Price - Take Profit) / pipSize`

3. **Pip Value Calculation (Per Standard Lot = 100,000 units)**:
   - For a trade of 1 standard lot:
     - When Quote Currency matches Account Currency (e.g., `EUR/USD` with USD account):
       `Pip Value = 100,000 * pipSize = 10.00 USD/lot`
     - When Base Currency matches Account Currency (e.g., `USD/JPY` with USD account):
       `Pip Value = (100,000 * pipSize) / CurrentPrice = 1,000 / USDJPY`
     - Cross Currency pairs (e.g., `EUR/GBP` with USD account):
       `Pip Value = (100,000 * pipSize) * (GBP/USD rate)`
   - Full currency cross-rate conversion matrix supported.

4. **Position Size (Lots)**:
   - `Risk Amount = Account Balance * (Risk Percentage / 100)`
   - `Position Size (Lots) = Risk Amount / (Stop Loss Distance in Pips * Pip Value per 1 Lot in Account Currency)`

5. **Risk-to-Reward Ratio**:
   - `RiskRewardRatio = Reward Pips / Risk Pips`
   - Displayed as `1 : X.XX` (e.g. `1 : 2.50`)

6. **Margin Required**:
   - `Margin = (Position Size in Lots * 100,000 * Base Currency to Account Currency Rate) / Leverage`

7. **Directional Validations**:
   - `BUY`: `Stop Loss` MUST be strictly less than `Entry Price`; `Take Profit` MUST be strictly greater than `Entry Price`.
   - `SELL`: `Stop Loss` MUST be strictly greater than `Entry Price`; `Take Profit` MUST be strictly less than `Entry Price`.
   - Clear and friendly validation errors returned when invalid.

---

## Database & Security (Supabase PostgreSQL + RLS)

- `profiles` table:
  - `id` (UUID, references `auth.users.id` on delete cascade)
  - `name` (TEXT)
  - `email` (TEXT)
  - `account_currency` (TEXT, default 'USD')
  - `default_risk_percent` (NUMERIC, default 1.0)
  - `default_leverage` (INTEGER, default 100)
  - `created_at` (TIMESTAMPTZ)
- `trades` table:
  - `id` (UUID default gen_random_uuid())
  - `user_id` (UUID references `auth.users.id`)
  - `pair` (VARCHAR(10))
  - `direction` (VARCHAR(4) - 'BUY' | 'SELL')
  - `account_balance` (NUMERIC)
  - `account_currency` (VARCHAR(3))
  - `risk_percent` (NUMERIC)
  - `risk_amount` (NUMERIC)
  - `entry_price` (NUMERIC)
  - `stop_loss` (NUMERIC)
  - `take_profit` (NUMERIC)
  - `pip_distance` (NUMERIC)
  - `pip_value` (NUMERIC)
  - `position_size` (NUMERIC)
  - `potential_profit` (NUMERIC)
  - `potential_loss` (NUMERIC)
  - `risk_reward` (NUMERIC)
  - `leverage` (NUMERIC)
  - `margin` (NUMERIC)
  - `result` (VARCHAR(10) - 'OPEN' | 'WIN' | 'LOSS' | 'BREAKEVEN')
  - `actual_pnl` (NUMERIC nullable)
  - `notes` (TEXT nullable)
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)
- Strict Row Level Security policies:
  - `profiles`: Users can select and update only `where id = auth.uid()`
  - `trades`: Users can select, insert, update, and delete only `where user_id = auth.uid()`

---

## Verification Plan

### Automated Tests
1. Vitest calculation test suite:
   ```bash
   npm run test
   ```
   Testing:
   - EUR/USD standard BUY & SELL trades (verifying exact lot size, pip values, P/L, R:R).
   - USD/JPY JPY-pip BUY & SELL trades (verifying 0.01 pip scaling and USD conversion).
   - Cross pairs (e.g. EUR/GBP).
   - Validation edge cases (zero balance, negative values, BUY stop loss above entry, SELL stop loss below entry).
2. TypeScript & Build verification:
   ```bash
   npm run build
   ```

### Manual & Interactive Verification
- Use `browser_subagent` to test:
  1. Landing page display, navigation, and disclaimer visibility.
  2. The Forex Calculator: inputting balance $10,000, 1% risk, EUR/USD @ 1.08500, SL @ 1.08000 (50 pips), TP @ 1.09500 (100 pips), verifying 1:2 R:R, $100 risk, 0.20 lots.
  3. Saving trade into Trade Journal and verifying it appears in Journal and Dashboard.
  4. Marking a trade as WIN/LOSS and verifying the Analytics dashboard charts and metrics update.
  5. Filtering and sorting the journal.
  6. CSV export download verification.
