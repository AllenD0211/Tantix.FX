import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Server,
  Zap,
  ShieldCheck,
  Globe2,
} from 'lucide-react';

interface NeumorphicLoginProps {
  onSuccessLogin?: (userData: { email: string; server: string; isDemo: boolean }) => void;
}

export const NeumorphicLogin: React.FC<NeumorphicLoginProps> = ({ onSuccessLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [server, setServer] = useState('tantix-live-01');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [leverage, setLeverage] = useState('1:100');

  // Interactive feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isBioScanning, setIsBioScanning] = useState(false);

  // Quick 1-Click Demo Credentials
  const handleQuickDemo = () => {
    setEmail('trader.pro@tantix.fx');
    setPassword('TantixAlpha2026!');
    setServer('tantix-demo-ecn');
    setErrorMessage('');
    setSuccessMessage('Demo credentials loaded. Ready to initialize.');
  };

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-[var(--accent-rose)]' };
    if (score <= 3) return { score: 70, label: 'Good', color: 'bg-[var(--accent-amber)]' };
    return { score: 100, label: 'Institutional Grade', color: 'bg-[var(--accent-emerald)]' };
  };

  const pwdStrength = calculatePasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please provide your Trader ID and Security Password.');
      return;
    }

    if (activeTab === 'register' && password !== confirmPassword) {
      setErrorMessage('Security Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      setLoadingStep('Connecting to LD4 London gateway...');
      await new Promise((resolve) => setTimeout(resolve, 600));

      setLoadingStep('Verifying 256-bit encryption handshake...');
      await new Promise((resolve) => setTimeout(resolve, 600));

      setLoadingStep('Synchronizing risk analysis parameters...');
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSuccessMessage(
        activeTab === 'login'
          ? 'Terminal authorized. Loading Forex workspace...'
          : 'Demo Account provisioned! Redirecting to Terminal...'
      );

      setTimeout(() => {
        setIsLoading(false);
        if (onSuccessLogin) {
          onSuccessLogin({
            email,
            server,
            isDemo: server.includes('demo') || activeTab === 'register',
          });
        }
      }, 700);
    } catch {
      setIsLoading(false);
      setErrorMessage('Authentication handshake timed out. Check network connection.');
    }
  };

  // Biometric / TouchID simulation
  const handleBiometricAuth = async () => {
    setIsBioScanning(true);
    setErrorMessage('');
    setSuccessMessage('Touch ID / Security Key sensor engaged...');

    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsBioScanning(false);
    setEmail('biometric.trader@tantix.fx');
    setPassword('••••••••••••');
    setSuccessMessage('Biometric signature verified via WebAuthn.');

    setTimeout(() => {
      if (onSuccessLogin) {
        onSuccessLogin({
          email: 'biometric.trader@tantix.fx',
          server: 'tantix-live-01',
          isDemo: false,
        });
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto px-4 py-8">
      {/* Outer Neumorphic Floating Card */}
      <div className="neu-raised-card p-7 sm:p-9 relative overflow-hidden transition-all duration-300">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-[var(--accent-cyan-glow)] blur-3xl pointer-events-none opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 rounded-full bg-[var(--accent-emerald-glow)] blur-3xl pointer-events-none opacity-40" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7 relative z-10">
          {/* Neumorphic 3D Emblem with Candlestick Delta Crest */}
          <div className="neu-inset-circle p-2.5 mb-3.5 relative group">
            <div className="neu-convex w-14 h-14 rounded-full flex items-center justify-center relative cursor-default transition-transform duration-300 group-hover:scale-105">
              {/* Candlestick & Delta icon graphic */}
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-6 bg-[var(--accent-emerald)] rounded-sm relative shadow-sm">
                  <div className="w-0.5 h-8 bg-[var(--accent-emerald)] absolute left-0.5 -top-1 opacity-75"></div>
                </div>
                <div className="w-1.5 h-4 bg-[var(--accent-cyan)] rounded-sm relative shadow-sm">
                  <div className="w-0.5 h-6 bg-[var(--accent-cyan)] absolute left-0.5 -top-1 opacity-75"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--neu-text-primary)]">
              TANTIX<span className="text-[var(--accent-cyan)]">.FX</span>
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full neu-inset text-[var(--accent-cyan)] font-mono-numbers">
              PRO
            </span>
          </div>
          <p className="text-xs text-[var(--neu-text-secondary)] mt-1 font-medium">
            Forex Computation & Risk Management Terminal
          </p>
        </div>

        {/* Neumorphic Segmented Tab Switcher */}
        <div className="neu-inset-pill p-1.5 flex items-center mb-6 relative z-10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'login'
                ? 'neu-convex text-[var(--accent-cyan)]'
                : 'text-[var(--neu-text-secondary)] hover:text-[var(--neu-text-primary)]'
            }`}
          >
            Trader Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'register'
                ? 'neu-convex text-[var(--accent-cyan)]'
                : 'text-[var(--neu-text-secondary)] hover:text-[var(--neu-text-primary)]'
            }`}
          >
            Open Demo / Account
          </button>
        </div>

        {/* Quick Demo Access Floating Banner */}
        <div className="mb-6 flex items-center justify-between p-3 neu-inset rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full neu-convex flex items-center justify-center text-[var(--accent-amber)]">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--neu-text-primary)]">
                Instant Demo Access
              </div>
              <div className="text-[10px] text-[var(--neu-text-muted)]">
                Pre-loaded with $100,000 balance
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="neu-btn px-3 py-1.5 rounded-xl text-[11px] font-bold text-[var(--accent-cyan)] hover:text-white transition-colors cursor-pointer"
          >
            Autofill
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-2xl neu-inset border border-[var(--accent-rose)]/30 flex items-start gap-2.5 text-xs text-[var(--accent-rose)] animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3 rounded-2xl neu-inset border border-[var(--accent-emerald)]/30 flex items-start gap-2.5 text-xs text-[var(--accent-emerald)] animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Trading Server Environment Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--neu-text-secondary)] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Server className="w-3 h-3 text-[var(--accent-cyan)]" />
                Trading Gateway
              </span>
              <span className="text-[10px] text-[var(--accent-emerald)] font-mono-numbers">
                ● 1.2ms LD4
              </span>
            </label>
            <div className="relative">
              <select
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl neu-input-field text-xs appearance-none font-medium cursor-pointer"
              >
                <option value="tantix-live-01">Tantix-Live-01 (LD4 London - ECN Prime)</option>
                <option value="tantix-live-02">Tantix-Live-02 (NY4 New York - Institutional)</option>
                <option value="tantix-demo-ecn">Tantix-Demo-ECN (Global Simulated Liquidity)</option>
                <option value="tantix-prop-eval">Prop Firm Risk Evaluation Gateway</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--neu-text-muted)] text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* Trader ID / Email Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--neu-text-secondary)] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-[var(--accent-cyan)]" />
              Trader ID / Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@tantix.fx"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl neu-input-field text-xs placeholder:text-[var(--neu-text-muted)] font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--neu-text-secondary)] flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[var(--accent-cyan)]" />
                Security Password
              </label>
              {activeTab === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered broker email.')}
                  className="text-[11px] font-semibold text-[var(--neu-text-muted)] hover:text-[var(--accent-cyan)] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 pr-10 rounded-2xl neu-input-field text-xs placeholder:text-[var(--neu-text-muted)] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator (For Register Mode) */}
            {activeTab === 'register' && password && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full neu-inset rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pwdStrength.color} transition-all duration-300`}
                    style={{ width: `${pwdStrength.score}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[var(--neu-text-muted)]">
                  <span>Strength: {pwdStrength.label}</span>
                  <span>Min 8 characters</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (Register Mode only) */}
          {activeTab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--neu-text-secondary)] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[var(--accent-cyan)]" />
                Confirm Security Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl neu-input-field text-xs placeholder:text-[var(--neu-text-muted)] font-mono"
              />
            </div>
          )}

          {/* Additional Preferences for Registration */}
          {activeTab === 'register' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--neu-text-secondary)] mb-1">
                  Account Currency
                </label>
                <select
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl neu-input-field text-xs font-semibold cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--neu-text-secondary)] mb-1">
                  Default Leverage
                </label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl neu-input-field text-xs font-semibold cursor-pointer"
                >
                  <option value="1:30">1:30 (Retail EU)</option>
                  <option value="1:50">1:50 (US Regulated)</option>
                  <option value="1:100">1:100 (Standard)</option>
                  <option value="1:500">1:500 (Pro ECN)</option>
                </select>
              </div>
            </div>
          )}

          {/* Tactile Neumorphic Switch for "Remember Terminal" */}
          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <button
                type="button"
                role="switch"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                  rememberMe ? 'neu-inset bg-[var(--neu-surface-elevated)]' : 'neu-inset'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-transform duration-200 ${
                    rememberMe
                      ? 'translate-x-5 neu-convex bg-[var(--accent-cyan)] shadow-sm'
                      : 'translate-x-0 neu-raised-circle bg-[var(--neu-text-muted)]'
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-[var(--neu-text-secondary)]">
                Remember this terminal
              </span>
            </label>

            {/* Simulated Two-Factor Authentication badge */}
            <span className="text-[10px] font-mono-numbers text-[var(--accent-emerald)] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              2FA Ready
            </span>
          </div>

          {/* Primary Action Button (Tactile Convex with Glow) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full neu-btn-primary py-3 px-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[var(--neu-text-primary)] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold tracking-wide">{loadingStep}</span>
                </>
              ) : (
                <>
                  <span className="text-xs font-extrabold tracking-wider uppercase">
                    {activeTab === 'login' ? 'Authorize & Open Terminal' : 'Create Demo Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Biometrics / Security Key Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[var(--neu-border-subtle)]"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-[var(--neu-text-muted)]">
              Or Authenticate With
            </span>
            <div className="flex-grow border-t border-[var(--neu-border-subtle)]"></div>
          </div>

          {/* Biometrics & FIDO2 Passkey Quick Button */}
          <button
            type="button"
            onClick={handleBiometricAuth}
            disabled={isBioScanning || isLoading}
            className={`w-full py-2.5 px-4 rounded-2xl neu-btn flex items-center justify-center gap-2 text-xs font-bold text-[var(--neu-text-primary)] cursor-pointer ${
              isBioScanning ? 'neu-inset text-[var(--accent-cyan)]' : ''
            }`}
          >
            <Fingerprint
              className={`w-4 h-4 text-[var(--accent-cyan)] ${
                isBioScanning ? 'animate-pulse' : ''
              }`}
            />
            <span>
              {isBioScanning ? 'Scanning Fingerprint / Passkey...' : 'Touch ID / Hardware Security Key'}
            </span>
          </button>
        </form>

        {/* Security & Regulatory Standards Footer */}
        <div className="mt-7 pt-4 border-t border-[var(--neu-border-subtle)] flex items-center justify-between text-[10px] text-[var(--neu-text-muted)]">
          <div className="flex items-center gap-1.5">
            <Globe2 className="w-3 h-3 text-[var(--accent-cyan)]" />
            <span>London LD4 Equinix</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[var(--accent-emerald)]" />
            <span>ISO/IEC 27001 Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
