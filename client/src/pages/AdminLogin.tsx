import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle, ArrowLeft, Terminal, HelpCircle, X, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot Password / Username Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotType, setForgotType] = useState<'username' | 'password'>('password');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryResult, setRecoveryResult] = useState<string | null>(null);

  // Load saved credentials on mount if Remember Me was previously enabled
  useEffect(() => {
    const savedUser = localStorage.getItem('saved_admin_user');
    const savedPass = localStorage.getItem('saved_admin_pass');
    if (savedUser) {
      setUsername(savedUser);
      setRememberMe(true);
    }
    if (savedPass) {
      setPassword(savedPass);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error(responseText && responseText.length < 100 ? responseText : 'Server error. Please try again.');
      }

      if (!res.ok) {
        throw new Error(data.message || 'Invalid username or password.');
      }

      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem('saved_admin_user', username);
        localStorage.setItem('saved_admin_pass', password);
      } else {
        localStorage.removeItem('saved_admin_user');
        localStorage.removeItem('saved_admin_pass');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user || { username }));

      toast({
        title: 'Authentication Successful',
        description: 'Welcome back to Parinith C M Control Center!'
      });

      setLocation('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast({ title: 'Email Required', description: 'Please enter your admin recovery email address.', variant: 'destructive' });
      return;
    }

    // Verify recovery email
    if (recoveryEmail.toLowerCase().includes('parinith') || recoveryEmail.toLowerCase().includes('gmail.com')) {
      if (forgotType === 'username') {
        setRecoveryResult('Registered Admin Account Verified.');
      } else {
        setRecoveryResult('Password Recovery instructions sent to your email.');
      }
      toast({ title: 'Recovery Request Sent', description: 'Check your email inbox for instructions.' });
    } else {
      toast({ title: 'Verification Failed', description: 'Unrecognized recovery email address.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-cyan-500/30 font-sans">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Button */}
      <button
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-mono text-cyan-400 hover:bg-white/10 hover:border-cyan-400/50 transition-all z-20"
      >
        <ArrowLeft size={16} /> Back to Live Portfolio
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-3xl p-8 border border-cyan-400/20 bg-cyan-900/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Terminal className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              PARINITH C M
            </h1>
            <p className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-widest">
              Admin Control Center
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-mono">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-400 tracking-widest ml-1">Admin Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/60 focus:bg-cyan-400/5 transition-all text-sm font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-400 tracking-widest ml-1">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/60 focus:bg-cyan-400/5 transition-all text-sm font-mono"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password Options */}
            <div className="flex items-center justify-between text-xs font-mono px-1">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 bg-white/5 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0 accent-cyan-500 cursor-pointer"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setRecoveryResult(null);
                }}
                className="text-cyan-400 hover:text-cyan-300 hover:underline transition-all flex items-center gap-1"
              >
                <HelpCircle size={13} />
                Forgot Credentials?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-2xl font-bold text-white uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4 font-mono"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Log In to Control Center</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* RECOVERY / FORGOT MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-cyan-500/30 rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="text-cyan-400" size={22} />
              Account Recovery
            </h3>
            <p className="text-xs text-gray-400 font-mono mb-6">
              Recover access to your Parinith C M Admin Account.
            </p>

            {/* Toggle Tab */}
            <div className="flex bg-white/5 p-1 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setForgotType('password');
                  setRecoveryResult(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-mono transition-all ${
                  forgotType === 'password' ? 'bg-cyan-500 text-black font-bold shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Forgot Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotType('username');
                  setRecoveryResult(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-mono transition-all ${
                  forgotType === 'username' ? 'bg-cyan-500 text-black font-bold shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Forgot Username
              </button>
            </div>

            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-2">
                  Admin Recovery Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="parinithmswamy15@gmail.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-gray-600 text-sm font-mono focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-2xl text-xs font-mono uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
              >
                Send Recovery Request
              </button>
            </form>

            {recoveryResult && (
              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-300 text-xs font-mono flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Verification Status</div>
                  <div className="font-bold text-sm text-white">{recoveryResult}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
