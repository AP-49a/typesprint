import React, { useState } from 'react';
import { useSettings, ThemeType, FontSizeType, SoundType } from '../context/SettingsContext.js';
import { playKeySound } from '../utils/sound.js';
import { Settings as SettingsIcon, Type, Volume2, Palette, Sparkles } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, fontSize, soundType, setTheme, setFontSize, setSoundType } = useSettings();
  const [testInput, setTestInput] = useState('');

  const themesList: { id: ThemeType; label: string; desc: string; colors: string[] }[] = [
    { id: 'carbon', label: 'Carbon Dark', desc: 'Sleek, gold, slate gray (Default)', colors: ['bg-[#151515]', 'bg-[#F4B41A]', 'bg-[#64748B]'] },
    { id: 'light', label: 'Clean Paper', desc: 'Bright, minimalist blue-gray styling', colors: ['bg-[#F4F4F6]', 'bg-[#3B82F6]', 'bg-[#8C8C96]'] },
    { id: 'cyberpunk', label: 'Neon Cyber', desc: 'Vibrant cyberpunk neon glow', colors: ['bg-[#0A0A14]', 'bg-[#00FFF0]', 'bg-[#AA00FF]'] },
    { id: 'nord', label: 'Nordic Frost', desc: 'Calming arctic frost colorways', colors: ['bg-[#2E3440]', 'bg-[#88C0D0]', 'bg-[#768692]'] },
  ];

  const handleTestKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      playKeySound(soundType, 'space');
    } else if (e.key !== 'Backspace' && e.key.length === 1) {
      playKeySound(soundType, 'click');
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-theme-text mb-2 flex items-center gap-2">
        <SettingsIcon className="text-theme-main animate-spin-slow" /> Customization Settings
      </h1>
      <p className="text-sm text-theme-sub mb-8">
        Personalize your typing interface, font sizes, mechanical clicking sounds, and visual skins.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Settings Columns */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Theme Selector */}
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-theme-sub mb-4 flex items-center gap-1.5">
              <Palette size={16} /> Theme &amp; Visual Skin
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {themesList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                    theme === t.id
                      ? 'border-theme-main bg-theme-main/5 shadow-md'
                      : 'border-theme-sub/10 hover:border-theme-sub/20 bg-black/10'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm text-theme-text block">{t.label}</span>
                    <span className="text-[10px] text-theme-sub block mt-0.5">{t.desc}</span>
                  </div>
                  <div className="flex gap-1">
                    {t.colors.map((color, index) => (
                      <span key={index} className={`w-3 h-3 rounded-full ${color}`} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Sizing */}
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-theme-sub mb-4 flex items-center gap-1.5">
              <Type size={16} /> Typography Sizing
            </h3>
            <div className="flex bg-black/20 p-1.5 rounded-xl border border-theme-sub/10">
              {(['small', 'medium', 'large'] as FontSizeType[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    fontSize === size
                      ? 'bg-theme-main text-black shadow'
                      : 'text-theme-sub hover:text-theme-text'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Key Clicking Sounds */}
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-theme-sub mb-4 flex items-center gap-1.5">
              <Volume2 size={16} /> Keypress Click Sounds
            </h3>
            <div className="flex bg-black/20 p-1.5 rounded-xl border border-theme-sub/10">
              {([
                { id: 'mechanical', label: 'Mechanical' },
                { id: 'digital', label: 'Digital Pop' },
                { id: 'none', label: 'Silent' },
              ] as { id: SoundType; label: string }[]).map((sd) => (
                <button
                  key={sd.id}
                  onClick={() => {
                    setSoundType(sd.id);
                    // Play a quick test click to preview
                    playKeySound(sd.id, 'click');
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    soundType === sd.id
                      ? 'bg-theme-main text-black shadow'
                      : 'text-theme-sub hover:text-theme-text'
                  }`}
                >
                  {sd.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview Side */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10 shadow-xl flex flex-col justify-between h-full">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-theme-sub mb-3 flex items-center gap-1.5">
                <Sparkles size={16} /> Interactive Sandbox
              </h3>
              <p className="text-xs text-theme-sub leading-relaxed mb-4">
                Type in the box below to test your font size settings and key click latency in real-time.
              </p>

              <div
                className={`p-4 rounded-xl border border-theme-sub/10 bg-black/20 select-none text-left typing-font min-h-[90px] ${
                  fontSize === 'small'
                    ? 'font-size-small'
                    : fontSize === 'large'
                    ? 'font-size-large'
                    : 'font-size-medium'
                }`}
              >
                {testInput ? (
                  <span className="text-theme-correct">{testInput}</span>
                ) : (
                  <span className="text-theme-sub/40 italic">Type here to test...</span>
                )}
                <span className="custom-cursor">&nbsp;</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Start test-typing..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              onKeyDown={handleTestKeydown}
              className="mt-6 w-full px-4 py-2.5 rounded-xl bg-black/40 border border-theme-sub/20 text-theme-text text-sm focus:border-theme-main outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
