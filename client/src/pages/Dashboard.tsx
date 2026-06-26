import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Award, Zap, History, Flame, TrendingUp, Clock, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        // Fetch stats
        const statsRes = await fetch(`/api/tests/stats?userId=${user.id}`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch history
        const historyRes = await fetch('/api/tests/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData.slice(0, 10)); // Top 10 recent
        }

        // Fetch certificates
        const certsRes = await fetch('/api/certificates', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (certsRes.ok) {
          const certsData = await certsRes.json();
          setCerts(certsData.slice(0, 3)); // Top 3
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, token]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-theme-sub">
        <p className="animate-pulse">Loading dashboard statistics...</p>
      </div>
    );
  }

  // Formatting history data for Recharts (reverse to show chronological order)
  const chartData = [...history]
    .reverse()
    .map((test, index) => ({
      index: index + 1,
      wpm: test.wpmNet,
      accuracy: test.accuracy,
      date: new Date(test.createdAt).toLocaleDateString(),
    }));

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-theme-sub/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-theme-main/5 rounded-full blur-3xl" />

        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <img
            src={user?.avatarUrl}
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2 border-theme-main/40"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-theme-text">Welcome back, {user?.displayName}!</h1>
            <p className="text-sm text-theme-sub mt-0.5">Ready to sprint past your limits? Track your progress below.</p>
          </div>
        </div>

        {/* Daily Streak Indicator */}
        <div className="flex items-center gap-2.5 bg-theme-main/10 border border-theme-main/20 px-5 py-2.5 rounded-2xl">
          <Flame className="text-theme-main fill-theme-main animate-bounce" size={24} />
          <div className="text-left font-mono">
            <span className="block text-2xl font-extrabold text-theme-main line-height-1">
              {stats?.dailyStreak || 0}
            </span>
            <span className="text-[10px] text-theme-sub uppercase font-semibold font-sans tracking-wide">Daily Streak</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-5 rounded-2xl border border-theme-sub/10 shadow flex items-center gap-4">
          <div className="p-3 rounded-xl bg-theme-main/10 text-theme-main">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-xs text-theme-sub font-semibold uppercase block">Best Net WPM</span>
            <span className="text-2xl font-extrabold font-mono text-theme-text">{stats?.bestWpm || 0}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-theme-sub/10 shadow flex items-center gap-4">
          <div className="p-3 rounded-xl bg-theme-sub/10 text-theme-sub">
            <Activity size={22} />
          </div>
          <div>
            <span className="text-xs text-theme-sub font-semibold uppercase block">Average WPM</span>
            <span className="text-2xl font-extrabold font-mono text-theme-text">{stats?.avgWpm || 0}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-theme-sub/10 shadow flex items-center gap-4">
          <div className="p-3 rounded-xl bg-theme-correct/10 text-theme-correct">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="text-xs text-theme-sub font-semibold uppercase block">Avg Accuracy</span>
            <span className="text-2xl font-extrabold font-mono text-theme-text">{stats?.avgAccuracy || 0}%</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-theme-sub/10 shadow flex items-center gap-4">
          <div className="p-3 rounded-xl bg-theme-main/10 text-theme-main">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-xs text-theme-sub font-semibold uppercase block">Total Time</span>
            <span className="text-2xl font-extrabold font-mono text-theme-text">
              {stats?.totalTimeSeconds ? Math.round(stats.totalTimeSeconds / 60) : 0}m
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-theme-sub mb-4 flex items-center gap-2">
              <TrendingUp size={16} /> Progress Progression Chart
            </h3>
            {chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-theme-sub text-sm">
                No progress history. Complete a test to populate!
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(var(--color-main))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="rgb(var(--color-main))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(21, 21, 21, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#F1F5F9',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="wpm"
                      name="WPM"
                      stroke="rgb(var(--color-main))"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorWpm)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Recent Tests Table */}
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-theme-sub mb-4 flex items-center gap-2">
              <History size={16} /> Recent Sprints
            </h3>
            {history.length === 0 ? (
              <div className="text-center py-6 text-theme-sub text-sm">
                No recent sprints. Start a new test now!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-theme-sub">
                  <thead>
                    <tr className="border-b border-theme-sub/10 text-xs font-semibold text-theme-sub uppercase">
                      <th className="py-3 px-2">Mode</th>
                      <th className="py-3 px-2">Net WPM</th>
                      <th className="py-3 px-2">Accuracy</th>
                      <th className="py-3 px-2">Duration</th>
                      <th className="py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((test) => (
                      <tr key={test.id} className="border-b border-theme-sub/5 hover:bg-theme-sub/5 text-theme-text">
                        <td className="py-3 px-2 uppercase font-mono text-xs">{test.mode}</td>
                        <td className="py-3 px-2 font-mono font-bold text-theme-main">{Math.round(test.wpmNet)}</td>
                        <td className="py-3 px-2 font-mono">{Math.round(test.accuracy)}%</td>
                        <td className="py-3 px-2 font-mono">{test.duration}s</td>
                        <td className="py-3 px-2 text-theme-sub text-xs">
                          {new Date(test.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Certificates & Sprint CTA */}
        <div className="flex flex-col gap-8">
          {/* Certificate Quick Overview */}
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-theme-sub mb-4 flex items-center gap-2">
                <Award size={16} /> Claimed Certificates
              </h3>
              {certs.length === 0 ? (
                <p className="text-xs text-theme-sub leading-relaxed">
                  You haven't claimed any certificates yet. Earn an official certificate on your profile by typing over 40 WPM with &ge;90% accuracy.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {certs.map((c) => (
                    <Link
                      key={c.id}
                      to={`/certificate/${c.id}`}
                      className="p-3 rounded-xl border border-theme-sub/10 hover:border-theme-main/30 bg-black/10 flex items-center justify-between text-xs transition-colors hover:bg-black/25"
                    >
                      <div>
                        <span className="font-semibold block text-theme-text">TypeSprint Official Certificate</span>
                        <span className="text-theme-sub font-mono text-[10px]">{c.id}</span>
                      </div>
                      <span className="text-theme-main font-mono font-bold">{Math.round(c.wpmNet)} WPM</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {certs.length > 0 && (
              <Link
                to="/certificates"
                className="mt-4 font-bold text-xs text-theme-main hover:underline flex items-center gap-0.5 justify-end"
              >
                All Certificates <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {/* Quick Play CTA */}
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 bg-gradient-to-br from-theme-main/5 to-transparent text-center flex flex-col items-center shadow-xl">
            <Zap className="w-10 h-10 text-theme-main mb-3 animate-pulse" />
            <h4 className="font-extrabold text-theme-text">Unchain Your Fingers</h4>
            <p className="text-xs text-theme-sub mt-2 leading-relaxed px-4">
              Push your boundaries and compete on the weekly global rankings to show off your typing supremacy.
            </p>
            <Link
              to="/test"
              className="mt-5 w-full py-2.5 rounded-xl bg-theme-main text-black font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Start Sprinting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
