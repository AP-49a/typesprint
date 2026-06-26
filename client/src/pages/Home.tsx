import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Keyboard, Award, Trophy, Sparkles, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  // Mock typing animation state
  const mockTarget = 'the ultimate speed typing test engine built for developers...';
  const [mockTyped, setMockTyped] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (charIndex < mockTarget.length) {
        setMockTyped((prev) => prev + mockTarget[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        // Reset typing loop
        setTimeout(() => {
          setMockTyped('');
          setCharIndex(0);
        }, 1500);
      }
    }, 120);

    return () => clearInterval(timer);
  }, [charIndex]);

  const features = [
    {
      icon: Keyboard,
      title: 'Professional Engine',
      desc: 'No disappearing words, flickering, or text jumping. Blazing-fast key capture with customized scrolling.',
    },
    {
      icon: Award,
      title: 'Verified Certificates',
      desc: 'Claim official PDF certificates. Every certificate features a unique QR code linked directly to our verified logs.',
    },
    {
      icon: Trophy,
      title: 'Global Rankings',
      desc: 'Submit your scores to compete globally. Sort by Weekly, Monthly, or All-Time sprints.',
    },
    {
      icon: Sparkles,
      title: 'Acoustic Feedback',
      desc: 'Synthesized mechanical key clicks and error sound cues generated on-the-fly via Web Audio API.',
    },
  ];

  const faqs = [
    {
      q: 'How is typing speed (WPM) calculated?',
      a: 'We use the industry-standard formulas: Gross WPM = (Correct Characters / 5) / Minutes. Net WPM = Gross WPM - (Errors / Minutes). This guarantees that mistakes reduce your net score directly, matching standard typing tests.',
    },
    {
      q: 'Are certificates permanently stored and verifiable?',
      a: 'Yes! Every certificate claimed is saved securely in our PostgreSQL database. Anyone can scan the QR code or visit the /verify page to input the certificate ID and confirm its authenticity.',
    },
    {
      q: 'Can I practice without creating an account?',
      a: 'Absolutely. Anyone can practice typing, test different speeds, and view results anonymously. However, logging in is required to save tests, track streaks, and claim certificates.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 justify-between">
        {/* Glow Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-theme-main/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-theme-main/10 rounded-full blur-3xl -z-10" />

        {/* Text */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-main/10 border border-theme-main/20 text-theme-main text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles size={12} /> Keyboard Typing Supremacy
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-theme-text leading-[1.1] tracking-tight">
              Slick, Professional <br />
              <span className="bg-gradient-to-r from-theme-main via-theme-text to-theme-text bg-clip-text text-transparent">
                Typing Platform
              </span>
            </h1>
            <p className="text-base md:text-lg text-theme-sub mt-6 leading-relaxed">
              TypeSprint is a modern keyboard ground built for programmers and speed typists. Evaluate your raw speed, analyze mistake distributions, and claim cryptographic verification certificates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/test"
              className="px-8 py-3.5 rounded-xl bg-theme-main text-black font-extrabold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group shadow-lg"
            >
              Start Sprinting <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/verify"
              className="px-8 py-3.5 rounded-xl border border-theme-sub/20 text-theme-text font-bold text-sm hover:bg-theme-sub/5 transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} /> Verify Certificate
            </Link>
          </motion.div>
        </div>

        {/* Hero Typing Preview Animation */}
        <div className="flex-1 w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-2xl relative text-left"
          >
            <div className="flex items-center justify-between border-b border-theme-sub/10 pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] text-theme-sub font-mono">typesprint_engine_v1.0.js</span>
            </div>

            <div className="typing-font font-size-medium text-theme-sub/40 h-28 leading-relaxed select-none relative">
              {/* Green typed chars */}
              <span className="text-theme-correct">{mockTyped}</span>
              {/* Caret */}
              <span className="custom-cursor">&nbsp;</span>
              {/* Remaining gray chars */}
              <span>{mockTarget.slice(mockTyped.length)}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black/10 border-t border-b border-theme-sub/5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-3xl font-extrabold text-theme-text">Engineered for Accuracy</h2>
          <p className="text-sm text-theme-sub mt-2 mb-12">Every detail crafted to optimize muscle memory development.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="glass-panel p-6 rounded-2xl border border-theme-sub/10 hover:border-theme-main/20 transition-all text-left flex flex-col gap-3 shadow-md"
                >
                  <div className="p-3 rounded-xl bg-theme-main/10 text-theme-main self-start">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-extrabold text-theme-text text-base mt-2">{f.title}</h3>
                  <p className="text-xs text-theme-sub leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full text-center">
        <h2 className="text-3xl font-extrabold text-theme-text">Loved by Keyboard Enthusiasts</h2>
        <p className="text-sm text-theme-sub mt-2 mb-12">See why developers and typists choose TypeSprint.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Miller', title: 'Senior Software Engineer', quote: 'The clicking feedback is completely lag-free. The scrolling is smooth and matches standard Monkeytype mechanics. Perfect for warm-ups.', stars: 5 },
            { name: 'Marcus Chen', title: 'Competitor / WPM 145', quote: 'Verified PDF certificates are a game changer. I added mine to my LinkedIn. Finally, a platform that takes typing credentials seriously.', stars: 5 },
            { name: 'Elena Rostova', title: 'UX Designer', quote: 'The themes are absolutely stunning. Carbon Dark and Cyberpunk are pure art. Spacing is perfect and font options are highly readable.', stars: 5 }
          ].map((t, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-theme-sub/10 text-left flex flex-col justify-between shadow">
              <div className="flex gap-0.5 text-theme-main mb-4">
                {[...Array(t.stars)].map((_, idx) => (
                  <Star key={idx} size={15} fill="rgb(var(--color-main))" />
                ))}
              </div>
              <p className="text-sm text-theme-sub italic leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 pt-4 border-t border-theme-sub/10">
                <span className="block font-bold text-theme-text text-sm">{t.name}</span>
                <span className="text-[10px] text-theme-sub block mt-0.5">{t.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-20 bg-black/10 border-t border-theme-sub/5 px-4 md:px-8">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-extrabold text-theme-text text-center mb-12">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-theme-sub/10 text-left">
                <h3 className="font-extrabold text-theme-text text-base">{faq.q}</h3>
                <p className="text-xs text-theme-sub leading-relaxed mt-2.5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
