import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Search, Calendar, Award, User, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export const VerifyCertificate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [certId, setCertId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto search if id is in query params
  React.useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
  }, [initialId]);

  const handleVerify = async (idToVerify?: string) => {
    const id = idToVerify || certId;
    if (!id.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(id.trim())}`);
      const data = await res.json();

      if (res.ok && data.valid) {
        setResult(data);
      } else {
        setError(data.error || 'Invalid Certificate ID. Please double check.');
      }
    } catch (err) {
      console.error(err);
      setError('Server communication failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex flex-col items-center justify-center">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-theme-text text-center mb-2 flex items-center gap-2">
        <ShieldCheck className="text-theme-main" size={32} /> Certificate Verification
      </h1>
      <p className="text-sm text-theme-sub text-center mb-8 max-w-md">
        Enter a TypeSprint certificate ID to check its validity and authenticity against our verified typing logs.
      </p>

      {/* Search Input Card */}
      <div className="w-full max-w-xl glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-sub" size={18} />
            <input
              type="text"
              placeholder="e.g. TS-2026-102948"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 border border-theme-sub/20 text-theme-text font-mono text-sm placeholder:text-theme-sub/50 focus:border-theme-main focus:ring-1 focus:ring-theme-main outline-none"
            />
          </div>
          <button
            onClick={() => handleVerify()}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-theme-main text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>

      {/* Result Cards */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl glass-panel border border-theme-correct/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Top Banner */}
          <div className="flex items-center gap-2.5 text-theme-correct font-semibold text-lg border-b border-theme-sub/10 pb-4 mb-5">
            <ShieldCheck size={24} /> Verified Valid Certificate
          </div>

          <div className="flex flex-col gap-4 text-theme-text">
            <div className="flex items-center gap-3">
              <User size={18} className="text-theme-sub" />
              <div>
                <p className="text-xs text-theme-sub font-semibold uppercase">Candidate</p>
                <p className="font-bold text-base">{result.displayName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-3">
                <Target size={18} className="text-theme-sub" />
                <div>
                  <p className="text-xs text-theme-sub font-semibold uppercase">Net Speed</p>
                  <p className="font-mono font-bold text-lg text-theme-main">{Math.round(result.wpmNet)} WPM</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Target size={18} className="text-theme-sub" />
                <div>
                  <p className="text-xs text-theme-sub font-semibold uppercase">Accuracy</p>
                  <p className="font-mono font-bold text-lg">{Math.round(result.accuracy)}%</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-3">
                <Award size={18} className="text-theme-sub" />
                <div>
                  <p className="text-xs text-theme-sub font-semibold uppercase">Certificate ID</p>
                  <p className="font-mono text-sm font-semibold">{result.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-theme-sub" />
                <div>
                  <p className="text-xs text-theme-sub font-semibold uppercase">Issued Date</p>
                  <p className="text-sm font-semibold">{new Date(result.issuedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl glass-panel border border-theme-error/30 rounded-2xl p-6 shadow-xl flex items-center gap-4"
        >
          <ShieldAlert className="text-theme-error flex-shrink-0" size={32} />
          <div>
            <h3 className="font-bold text-theme-text">Verification Failed</h3>
            <p className="text-sm text-theme-sub mt-1">{error}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default VerifyCertificate;
