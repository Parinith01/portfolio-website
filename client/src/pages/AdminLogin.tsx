import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle, ArrowLeft, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed. Invalid credentials.');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user || { username }));

      toast({
        title: 'Authentication Successful',
        description: 'Welcome back to Parinith C M Control Center!'
      });

      setLocation('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
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
                  placeholder="admin"
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

          {/* Footer note */}
          <div className="mt-8 text-center text-xs text-gray-500 font-mono">
            Credentials: <span className="text-cyan-400">admin</span> / <span className="text-cyan-400">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
