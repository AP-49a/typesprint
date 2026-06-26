import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Award, ShieldCheck, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Certificates: React.FC = () => {
  const { token } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await fetch('/api/certificates', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCerts(data);
        }
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, [token]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-theme-sub">
        <p className="animate-pulse">Loading certificates...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      <h1 className="text-3xl font-extrabold text-theme-text mb-2 flex items-center gap-2">
        <Award className="text-theme-main" /> Verified Certificates
      </h1>
      <p className="text-sm text-theme-sub mb-8">
        Manage and download your official speed typing certificates. Copy links to share on LinkedIn or resumes.
      </p>

      {certs.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl border border-theme-sub/10 text-center flex flex-col items-center">
          <Award className="text-theme-sub/40 w-16 h-16 mb-4" />
          <h3 className="text-lg font-bold text-theme-text">No certificates claimed yet</h3>
          <p className="text-xs text-theme-sub mt-2 max-w-sm">
            To earn a certificate, complete a typing test with a speed of at least 40 WPM and an accuracy of 90% or above.
          </p>
          <Link
            to="/test"
            className="mt-6 px-5 py-2.5 rounded-xl bg-theme-main text-black text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
          >
            Start Test <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => (
            <motion.div
              key={cert.id}
              whileHover={{ y: -3 }}
              className="glass-panel p-6 rounded-2xl border border-theme-sub/15 hover:border-theme-main/30 flex flex-col justify-between shadow-lg relative overflow-hidden"
            >
              {/* Corner light reflection */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-theme-main/5 rounded-full blur-xl" />

              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-theme-sub font-mono font-semibold bg-black/20 border border-theme-sub/10 px-2 py-0.5 rounded">
                    {cert.id}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-theme-correct font-semibold">
                    <ShieldCheck size={12} /> Verified
                  </span>
                </div>

                <h3 className="text-xl font-bold text-theme-text mt-4 flex items-center gap-1.5">
                  TypeSprint Certificate <Sparkles size={16} className="text-theme-main" />
                </h3>

                <div className="grid grid-cols-2 gap-4 mt-4 font-mono text-sm">
                  <div>
                    <span className="text-[10px] text-theme-sub block font-sans font-semibold">NET WPM</span>
                    <span className="font-bold text-theme-main text-lg">{Math.round(cert.wpmNet)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-sub block font-sans font-semibold">ACCURACY</span>
                    <span className="font-bold text-theme-text text-lg">{Math.round(cert.accuracy)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-theme-sub/10 flex items-center justify-between gap-4 text-xs text-theme-sub">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {new Date(cert.createdAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/certificate/${cert.id}`}
                  className="font-bold text-theme-main hover:underline flex items-center gap-0.5"
                >
                  View Details <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Certificates;
