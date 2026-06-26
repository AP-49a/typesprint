import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Mail, Lock, LogIn, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) {
      setError('Please fill in all details.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection refused. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center max-w-md mx-auto w-full px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full glass-panel border border-theme-sub/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-theme-main/5 rounded-full blur-xl" />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-theme-text">Welcome Back</h2>
          <p className="text-xs text-theme-sub mt-1">Sprint back into your custom dashboard metrics</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl border border-theme-error/25 bg-theme-error/5 text-theme-error text-xs flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-theme-sub">Username or Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-sub" size={16} />
              <input
                type="text"
                placeholder="e.g. speedy_typer"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/20 border border-theme-sub/15 text-theme-text text-sm focus:border-theme-main outline-none focus:ring-0"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-theme-sub">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-sub" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/20 border border-theme-sub/15 text-theme-text text-sm focus:border-theme-main outline-none focus:ring-0"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 rounded-xl bg-theme-main text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <LogIn size={16} />}
            <span>{loading ? 'Sprinting in...' : 'Sign In'}</span>
          </button>
        </form>

        <p className="text-center text-xs text-theme-sub mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-theme-main font-semibold hover:underline">
            Register Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
export default Login;
