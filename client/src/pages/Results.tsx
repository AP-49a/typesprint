import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import html2canvas from 'html2canvas';
import { RefreshCw, Award, Download, Share2, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const resultCardRef = useRef<HTMLDivElement>(null);

  const [certClaimed, setCertClaimed] = useState(false);
  const [certLoading, setCertLoading] = useState(false);
  const [certId, setCertId] = useState<string | null>(null);

  const stats = location.state;

  // Trigger celebration on high WPM (>70) or when arriving at results
  useEffect(() => {
    if (!stats) {
      navigate('/test');
      return;
    }
    if (stats.wpmNet >= 70 && stats.accuracy >= 95) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [stats, navigate]);

  if (!stats) return null;

  const {
    wpmGross,
    wpmNet,
    accuracy,
    correctChars,
    incorrectChars,
    mistakes,
    mistakesJson,
    duration,
    mode,
    wpmHistory,
    elapsedTime,
  } = stats;

  const parsedMistakes: Record<string, number> = mistakesJson ? JSON.parse(mistakesJson) : {};

  // Check certificate eligibility
  const eligibleForCert = wpmNet >= 40 && accuracy >= 90;

  const handleClaimCertificate = async () => {
    if (!user || !eligibleForCert) return;
    setCertLoading(true);
    try {
      // First, we need the database test ID. If we don't have it, we search for recent tests
      // Let's call generate with the recently submitted test
      // Since the test was submitted during completion, let's fetch user's recent tests to get the ID
      const historyRes = await fetch('/api/tests/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      let idToUse = '';
      if (historyRes.ok) {
        const history = await historyRes.json();
        // Match the closest test
        const match = history.find(
          (t: any) =>
            Math.abs(t.wpmNet - wpmNet) < 0.5 &&
            Math.abs(t.accuracy - accuracy) < 0.5 &&
            t.duration === duration
        );
        if (match) idToUse = match.id;
      }

      if (!idToUse) {
        throw new Error('Could not verify recent test record on server.');
      }

      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ testId: idToUse }),
      });

      if (res.ok) {
        const data = await res.json();
        setCertId(data.id);
        setCertClaimed(true);
        confetti({
          particleCount: 200,
          spread: 100,
          colors: ['#F4B41A', '#10B981', '#3B82F6'],
        });
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to claim certificate');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error processing certificate claim.');
    } finally {
      setCertLoading(false);
    }
  };

  const handleShare = () => {
    const text = `⚡ TypeSprint Speed Results!\n🎯 Net Speed: ${wpmNet} WPM\n🔥 Accuracy: ${accuracy}%\n⏱️ Mode: ${mode} (${duration}s)\nJoin the sprint at TypeSprint!`;
    navigator.clipboard.writeText(text);
    alert('Copied stats to clipboard! Go ahead and share it.');
  };

  const handleDownloadImage = async () => {
    if (resultCardRef.current) {
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: null,
        scale: 2, // High resolution
      });
      const link = document.createElement('a');
      link.download = `typesprint-score-${wpmNet}wpm.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-theme-main text-center mb-8 flex items-center justify-center gap-2">
        <Sparkles className="animate-pulse" /> Speed Test Results
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Stats and Heatmap */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Main Score Card */}
          <div
            ref={resultCardRef}
            className="glass-panel p-8 rounded-2xl border border-theme-sub/10 shadow-xl relative overflow-hidden"
          >
            {/* Background highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-main/5 rounded-full blur-2xl" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-xs text-theme-sub uppercase tracking-wider font-semibold">Net Speed</p>
                <h2 className="text-5xl font-extrabold text-theme-main font-mono mt-1">{Math.round(wpmNet)}</h2>
                <p className="text-xs text-theme-sub font-mono mt-0.5">WPM</p>
              </div>
              <div>
                <p className="text-xs text-theme-sub uppercase tracking-wider font-semibold">Accuracy</p>
                <h2 className="text-5xl font-extrabold text-theme-text font-mono mt-1">{Math.round(accuracy)}%</h2>
                <p className="text-xs text-theme-sub font-mono mt-0.5">Correct Ratio</p>
              </div>
              <div>
                <p className="text-xs text-theme-sub uppercase tracking-wider font-semibold">Gross Speed</p>
                <h2 className="text-3xl font-bold text-theme-text/80 font-mono mt-2.5">{Math.round(wpmGross)}</h2>
                <p className="text-xs text-theme-sub font-mono">WPM</p>
              </div>
              <div>
                <p className="text-xs text-theme-sub uppercase tracking-wider font-semibold">Mistakes</p>
                <h2 className="text-3xl font-bold text-theme-error font-mono mt-2.5">{mistakes}</h2>
                <p className="text-xs text-theme-sub font-mono">errors</p>
              </div>
            </div>

            {/* Extra Stats */}
            <div className="mt-8 pt-6 border-t border-theme-sub/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-theme-sub">
              <div>
                Correct Keys: <span className="text-theme-correct font-mono font-bold">{correctChars}</span>
              </div>
              <div>
                Incorrect Keys: <span className="text-theme-error font-mono font-bold">{incorrectChars}</span>
              </div>
              <div>
                Time Elapsed: <span className="text-theme-text font-mono font-bold">{elapsedTime}s</span>
              </div>
              <div>
                Mode: <span className="text-theme-text uppercase font-bold">{mode}</span>
              </div>
            </div>
          </div>

          {/* Speed Progression Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-theme-sub mb-4">WPM Progression Graph</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wpmHistory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(21, 21, 21, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    name="Net WPM"
                    stroke="#F4B41A"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Side: Actions and Certificates */}
        <div className="flex flex-col gap-8">
          {/* Certificate Claim */}
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl flex flex-col items-center text-center">
            <Award className="w-12 h-12 text-theme-main mb-3" />
            <h3 className="text-lg font-bold text-theme-text">Typing Certificate</h3>
            
            {eligibleForCert ? (
              <p className="text-xs text-theme-sub mt-2 px-4">
                Congratulations! You met the criteria (WPM &ge; 40, Acc &ge; 90%) to claim an official certificate.
              </p>
            ) : (
              <p className="text-xs text-theme-error mt-2 px-4 flex items-center gap-1.5 justify-center">
                <AlertTriangle size={14} /> Certificate requires WPM &ge; 40 and Accuracy &ge; 90%. Keep practicing!
              </p>
            )}

            {user ? (
              eligibleForCert ? (
                certClaimed ? (
                  <div className="w-full mt-4 flex flex-col gap-2">
                    <p className="text-xs text-theme-correct flex items-center justify-center gap-1 font-semibold">
                      <CheckCircle size={15} /> Certificate Claimed Successfully!
                    </p>
                    <Link
                      to={`/certificate/${certId}`}
                      className="w-full py-2.5 rounded-lg bg-theme-correct text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      View Certificate
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleClaimCertificate}
                    disabled={certLoading}
                    className="w-full mt-4 py-2.5 rounded-lg bg-theme-main text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {certLoading ? 'Claiming...' : 'Claim Free Certificate'}
                  </button>
                )
              ) : null
            ) : (
              eligibleForCert && (
                <div className="w-full mt-4 flex flex-col gap-2">
                  <p className="text-xs text-theme-sub">
                    Sign in to claim your permanent verified certificate link!
                  </p>
                  <Link
                    to="/login"
                    className="w-full py-2.5 rounded-lg bg-theme-main text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Login &amp; Claim
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Action Buttons */}
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl flex flex-col gap-3">
            <button
              onClick={() => navigate('/test')}
              className="w-full py-3 rounded-lg bg-theme-main text-black text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              <RefreshCw size={16} /> Take Another Test
            </button>

            <button
              onClick={handleShare}
              className="w-full py-3 rounded-lg border border-theme-sub/20 text-theme-text text-sm font-semibold flex items-center justify-center gap-2 hover:bg-theme-sub/5 transition-colors"
            >
              <Share2 size={16} /> Share Result (Copy)
            </button>

            <button
              onClick={handleDownloadImage}
              className="w-full py-3 rounded-lg border border-theme-sub/20 text-theme-text text-sm font-semibold flex items-center justify-center gap-2 hover:bg-theme-sub/5 transition-colors"
            >
              <Download size={16} /> Download Score Card
            </button>
          </div>

          {/* Mistakes Heatmap */}
          {Object.keys(parsedMistakes).length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-theme-sub mb-3">Mistake Distribution</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(parsedMistakes).map(([char, count]) => (
                  <div
                    key={char}
                    className="px-2.5 py-1.5 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5"
                    style={{
                      backgroundColor: count > 3 ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: 'rgb(244 63 94)',
                    }}
                  >
                    <span className="text-theme-text font-bold">{char === ' ' ? 'Space' : char}</span>
                    <span className="px-1 py-0.5 rounded bg-black/30 font-mono">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Results;
