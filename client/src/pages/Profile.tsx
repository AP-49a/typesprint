import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { User as UserIcon, Calendar, Award, Zap, ShieldCheck } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/tests/stats?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <UserIcon className="text-theme-sub/40 mb-4" size={48} />
        <h2 className="text-xl font-bold text-theme-text">Sign in to view Profile</h2>
        <p className="text-xs text-theme-sub mt-2">
          Your public profile shows your typing stats, achievements, and earned badges.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-theme-sub">
        <p className="animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 flex flex-col items-center">
      {/* Profile Card */}
      <div className="w-full glass-panel border border-theme-sub/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-theme-main/5 rounded-full blur-2xl" />

        <img
          src={user.avatarUrl}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-theme-main/30 shadow-lg mb-4"
        />

        <h2 className="text-2xl font-extrabold text-theme-text">{user.displayName}</h2>
        <p className="text-sm text-theme-sub">@{user.username}</p>

        <div className="flex items-center gap-1.5 text-xs text-theme-sub mt-3 justify-center">
          <Calendar size={14} />
          <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full mt-8 pt-8 border-t border-theme-sub/10">
          <div className="flex flex-col items-center">
            <Zap className="text-theme-main mb-1.5" size={20} />
            <span className="text-[10px] text-theme-sub uppercase font-semibold">Best WPM</span>
            <span className="text-xl font-extrabold font-mono text-theme-text mt-0.5">{stats?.bestWpm || 0}</span>
          </div>

          <div className="flex flex-col items-center">
            <Award className="text-theme-main mb-1.5" size={20} />
            <span className="text-[10px] text-theme-sub uppercase font-semibold">Avg Accuracy</span>
            <span className="text-xl font-extrabold font-mono text-theme-text mt-0.5">{stats?.avgAccuracy || 0}%</span>
          </div>

          <div className="flex flex-col items-center col-span-2 md:col-span-1">
            <ShieldCheck className="text-theme-main mb-1.5" size={20} />
            <span className="text-[10px] text-theme-sub uppercase font-semibold">Total Sprints</span>
            <span className="text-xl font-extrabold font-mono text-theme-text mt-0.5">{stats?.totalTests || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
