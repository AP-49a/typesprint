import React, { useEffect, useState } from 'react';
import { Trophy, Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Leaderboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('alltime');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rankings, setRankings] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/leaderboard?timeframe=${timeframe}&search=${encodeURIComponent(search)}&page=${page}&limit=10`
      );
      if (res.ok) {
        const data = await res.json();
        setRankings(data.rankings);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, page]);

  // Reset page when timeframe changes or search queries run
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeaderboard();
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      {/* Title */}
      <div className="flex items-center gap-3 mb-2 justify-center">
        <Trophy className="text-theme-main" size={32} />
        <h1 className="text-3xl font-extrabold text-theme-text text-center">Global Leaderboard</h1>
      </div>
      <p className="text-sm text-theme-sub text-center mb-8">
        See how you stack up against the fastest keyboard typists in the world.
      </p>

      {/* Controls: Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Timeframe Tabs */}
        <div className="flex bg-black/20 p-1.5 rounded-xl border border-theme-sub/10 self-stretch md:self-auto justify-center">
          {(['weekly', 'monthly', 'alltime'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTimeframe(t);
                setPage(1);
              }}
              className={`px-5 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                timeframe === t
                  ? 'bg-theme-main text-black shadow'
                  : 'text-theme-sub hover:text-theme-text'
              }`}
            >
              {t === 'alltime' ? 'All Time' : t}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto self-stretch">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-sub" size={16} />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/20 border border-theme-sub/15 text-theme-text text-xs focus:border-theme-main focus:ring-1 focus:ring-theme-main outline-none placeholder:text-theme-sub/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-theme-sub/10 border border-theme-sub/15 hover:bg-theme-sub/15 text-theme-text font-semibold text-xs transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Rankings List Card */}
      <div className="glass-panel border border-theme-sub/10 rounded-2xl shadow-xl overflow-hidden mb-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-theme-sub gap-3">
            <RefreshCw className="animate-spin" />
            <p className="text-xs">Fetching rankings...</p>
          </div>
        ) : rankings.length === 0 ? (
          <div className="py-20 text-center text-theme-sub text-sm">
            No rankings found for the selected timeframe.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-theme-sub">
              <thead>
                <tr className="border-b border-theme-sub/10 text-xs font-semibold uppercase tracking-wider text-theme-sub bg-black/10">
                  <th className="py-3.5 px-4 text-center w-16">Rank</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4 text-center">Net WPM</th>
                  <th className="py-3.5 px-4 text-center">Accuracy</th>
                  <th className="py-3.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {rankings.map((player, idx) => {
                    const globalRank = (page - 1) * 10 + idx + 1;
                    const isTop3 = globalRank <= 3;
                    const rankColor =
                      globalRank === 1
                        ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
                        : globalRank === 2
                        ? 'text-stone-400 bg-stone-400/10 border-stone-400/30'
                        : globalRank === 3
                        ? 'text-amber-600 bg-amber-600/10 border-amber-600/30'
                        : '';

                    return (
                      <motion.tr
                        key={player.userId}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="border-b border-theme-sub/5 hover:bg-theme-sub/5 text-theme-text transition-colors"
                      >
                        <td className="py-4 px-4 text-center font-mono font-bold">
                          {isTop3 ? (
                            <span className={`inline-block px-2 py-1 rounded-md text-xs border ${rankColor}`}>
                              #{globalRank}
                            </span>
                          ) : (
                            <span className="text-theme-sub font-medium">#{globalRank}</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={player.avatarUrl}
                              alt={player.username}
                              className="w-8 h-8 rounded-full border border-theme-sub/10"
                            />
                            <div>
                              <span className="font-bold block text-theme-text text-sm">
                                {player.displayName}
                              </span>
                              <span className="text-[10px] text-theme-sub">@{player.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-mono font-bold text-theme-main text-base">
                          {Math.round(player.bestWpm)}
                        </td>
                        <td className="py-4 px-4 text-center font-mono">{Math.round(player.accuracy)}%</td>
                        <td className="py-4 px-4 text-right text-theme-sub text-xs">
                          {new Date(player.date).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-xs font-semibold text-theme-sub">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/20 border border-theme-sub/10 hover:bg-black/35 transition-colors disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span>
            Page <span className="text-theme-text font-bold font-mono">{page}</span> of{' '}
            <span className="text-theme-text font-mono">{totalPages}</span>
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/20 border border-theme-sub/10 hover:bg-black/35 transition-colors disabled:opacity-40"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
export default Leaderboard;
