import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && msg) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMsg('');
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 text-left leading-relaxed">
      <h1 className="text-3xl font-extrabold text-theme-text mb-2">Contact Us</h1>
      <p className="text-theme-sub text-sm mb-8">
        Have questions or support issues? Send us a message and our team will get back to you within 24 hours.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-theme-sub/10 flex flex-col gap-2">
            <Mail className="text-theme-main" size={20} />
            <h4 className="font-bold text-theme-text text-sm">Direct Support</h4>
            <p className="text-xs text-theme-sub">support@typesprint.com</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-theme-sub/10 flex flex-col gap-2">
            <MessageSquare className="text-theme-main" size={20} />
            <h4 className="font-bold text-theme-text text-sm">Community</h4>
            <p className="text-xs text-theme-sub">Join our Discord server for keyboard setups and typing discussion.</p>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-8 rounded-2xl border border-theme-correct/30 flex flex-col items-center text-center gap-3 shadow-lg"
            >
              <CheckCircle2 className="text-theme-correct" size={40} />
              <h3 className="font-bold text-theme-text text-lg">Message Sent</h3>
              <p className="text-xs text-theme-sub">
                Thank you! Your message has been received. Our team will review and reply shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-theme-sub/10 hover:bg-theme-sub/15 text-theme-text text-xs font-semibold"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-theme-sub/10 flex flex-col gap-4 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-theme-sub">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-black/20 border border-theme-sub/15 text-theme-text text-xs focus:border-theme-main outline-none focus:ring-0"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-theme-sub">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-black/20 border border-theme-sub/15 text-theme-text text-xs focus:border-theme-main outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-theme-sub">Message / Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-black/20 border border-theme-sub/15 text-theme-text text-xs focus:border-theme-main outline-none focus:ring-0 resize-none"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-theme-main text-black font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 self-start transition-opacity"
              >
                <Send size={13} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default Contact;
