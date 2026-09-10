import { useState, useEffect } from 'react';
import { TickerBar } from './components/layout/TickerBar';
import { NeumorphicLogin } from './components/auth/NeumorphicLogin';
import {
  ShieldAlert,
  LogOut,
  CheckCircle,
  Terminal,
} from 'lucide-react';
import './App.css';

interface UserSession {
  email: string;
  server: string;
  isDemo: boolean;
}

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('tantix_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tantix_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginSuccess = (userData: UserSession) => {
    setSession(userData);
  };

  const handleSignOut = () => {
    setSession(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--neu-bg)] text-[var(--neu-text-primary)] forex-bg-grid transition-colors duration-300">
      {/* Top Forex Rates & ECN Status Bar */}
      <TickerBar theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative">
        {/* Subtle Ambient Decorative FX Candlesticks in Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-around opacity-[0.035]">
          <div className="w-16 h-72 border border-current rounded animate-float-slow"></div>
          <div className="w-20 h-96 border border-current rounded animate-float-slow" style={{ animationDelay: '1.5s' }}></div>
          <div className="w-14 h-64 border border-current rounded animate-float-slow" style={{ animationDelay: '3s' }}></div>
        </div>

        {!session ? (
          /* Neumorphic Login Form */
          <div className="w-full relative z-10 animate-fadeIn">
            <NeumorphicLogin onSuccessLogin={handleLoginSuccess} />
          </div>
        ) : (
          /* Authorized Terminal Preview State */
          <div className="w-full max-w-xl mx-auto p-8 neu-raised-card relative z-10 animate-fadeIn space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--neu-border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="neu-convex w-12 h-12 rounded-2xl flex items-center justify-center text-[var(--accent-emerald)]">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight">Terminal Authorized</h2>
                    <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full neu-inset text-[var(--accent-emerald)] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)] animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-[var(--neu-text-secondary)] font-mono-numbers mt-0.5">
                    {session.email} • {session.server}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="neu-btn p-2.5 rounded-xl text-[var(--neu-text-muted)] hover:text-[var(--accent-rose)] cursor-pointer"
                title="Disconnect & Return to Login"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              <div className="neu-inset p-3.5 rounded-2xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--neu-text-muted)]">
                  Account Equity
                </div>
                <div className="text-base font-bold font-mono-numbers text-[var(--accent-cyan)] mt-1">
                  $100,000.00
                </div>
                <div className="text-[10px] text-[var(--accent-emerald)] font-mono-numbers mt-0.5">
                  +2.45% MTD
                </div>
              </div>

              <div className="neu-inset p-3.5 rounded-2xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--neu-text-muted)]">
                  Free Margin
                </div>
                <div className="text-base font-bold font-mono-numbers text-[var(--neu-text-primary)] mt-1">
                  $98,450.00
                </div>
                <div className="text-[10px] text-[var(--neu-text-secondary)] font-mono-numbers mt-0.5">
                  Margin Level: 1,420%
                </div>
              </div>

              <div className="neu-inset p-3.5 rounded-2xl col-span-2 sm:col-span-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--neu-text-muted)]">
                  Active Risk
                </div>
                <div className="text-base font-bold font-mono-numbers text-[var(--accent-amber)] mt-1">
                  1.00% ($1,000)
                </div>
                <div className="text-[10px] text-[var(--accent-cyan)] font-mono-numbers mt-0.5">
                  Max Drawdown: 4.8%
                </div>
              </div>
            </div>

            {/* Success Notification Banner */}
            <div className="neu-inset p-4 rounded-2xl border border-[var(--accent-emerald)]/30 flex items-start gap-3 text-xs text-[var(--neu-text-secondary)]">
              <CheckCircle className="w-5 h-5 text-[var(--accent-emerald)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--neu-text-primary)]">
                  Neumorphic Authentication Handshake Successful!
                </span>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  Your secure institutional session is ready. You can test switching between Dark and Light Neumorphic modes at the top right, or click below to return and test the login form again.
                </p>
              </div>
            </div>

            {/* Return / Sign out button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full neu-btn py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold cursor-pointer hover:text-[var(--accent-cyan)]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out & Return to Neumorphic Login Form</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Institutional Legal & Risk Disclaimer Footer */}
      <footer className="border-t border-[var(--neu-border-subtle)] bg-[var(--neu-bg)] px-4 py-4 text-center text-xs text-[var(--neu-text-muted)] transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
              High-Risk Investment Warning: CFDs & Spot FX carry significant risk of capital loss.
            </span>
            <span>•</span>
            <span>Tantix.FX Engine v1.0.4</span>
            <span>•</span>
            <span>Equinix LD4 London Hub</span>
          </div>
          <p className="text-[10px] opacity-70">
            © {new Date().getFullYear()} Tantix.FX Technologies Ltd. All rights reserved. Mathematical calculations are provided for professional risk management modeling.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
