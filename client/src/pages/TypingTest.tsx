import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useTypingTest, TestMode, TestDuration } from '../hooks/useTypingTest.js';
import { COMMON_WORDS, SAMPLE_PARAGRAPHS, SAMPLE_QUOTES } from '../utils/words.js';
import { Keyboard, Timer, RefreshCw, Volume2, Award, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const TypingTest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { soundType, fontSize, setSoundType } = useSettings();

  const [mode, setMode] = useState<TestMode>('words');
  const [duration, setDuration] = useState<TestDuration>(30);
  const [activeQuote, setActiveQuote] = useState<{ text: string; author: string } | null>(null);

  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const wordsWrapperRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Word Generator
  const generateWordsList = useCallback((testMode: TestMode, testDuration: TestDuration) => {
    if (testMode === 'paragraph') {
      const idx = Math.floor(Math.random() * SAMPLE_PARAGRAPHS.length);
      return SAMPLE_PARAGRAPHS[idx].split(' ');
    } else if (testMode === 'quote') {
      const idx = Math.floor(Math.random() * SAMPLE_QUOTES.length);
      const quote = SAMPLE_QUOTES[idx];
      setActiveQuote(quote);
      return quote.text.split(' ');
    } else {
      // Generate words based on duration (15s = ~50 words, 30s = ~100, 60s = ~150, 120s = ~250)
      const count = testDuration === 15 ? 60 : testDuration === 30 ? 110 : testDuration === 60 ? 200 : 350;
      const list: string[] = [];
      for (let i = 0; i < count; i++) {
        const rand = Math.floor(Math.random() * COMMON_WORDS.length);
        list.push(COMMON_WORDS[rand]);
      }
      setActiveQuote(null);
      return list;
    }
  }, []);

  const [initialWords, setInitialWords] = useState<string[]>(() =>
    generateWordsList('words', 30)
  );

  const handleTestComplete = useCallback(
    async (results: any) => {
      // Save test if user is logged in
      if (user) {
        try {
          const bodyData = {
            ...results,
            userId: user.id,
          };
          await fetch('/api/tests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
          });
        } catch (error) {
          console.error('Failed to auto-save test to backend:', error);
        }
      }
      // Navigate to results page passing stats
      navigate('/results', { state: results });
    },
    [user, navigate]
  );

  const {
    words,
    userInput,
    wordIndex,
    testState,
    timeLeft,
    resetTest,
    getWpmStats,
  } = useTypingTest({
    initialWords,
    mode,
    duration,
    soundType,
    onComplete: handleTestComplete,
  });

  // Calculate live stats
  const liveStats = getWpmStats();

  const handleReset = useCallback(() => {
    const list = generateWordsList(mode, duration);
    setInitialWords(list);
    resetTest(list);
  }, [mode, duration, generateWordsList, resetTest]);

  // Adjust test parameters
  const changeMode = (newMode: TestMode) => {
    setMode(newMode);
    const list = generateWordsList(newMode, duration);
    setInitialWords(list);
    resetTest(list);
  };

  const changeDuration = (newDur: TestDuration) => {
    setDuration(newDur);
    const list = generateWordsList(mode, newDur);
    setInitialWords(list);
    resetTest(list);
  };

  // Scroll active word line into view smoothly (Monkeytype scroll engine)
  useEffect(() => {
    if (activeWordRef.current && wordsWrapperRef.current && wordsContainerRef.current) {
      const activeEl = activeWordRef.current;
      const wrapperEl = wordsWrapperRef.current;

      const activeOffsetTop = activeEl.offsetTop;

      // Check if we are past the first line (approx 36px line height)
      if (activeOffsetTop > 40) {
        // Calculate shift height: we shift the container up so the active word is on line 2
        const shiftY = activeOffsetTop - 40;
        wrapperEl.style.transform = `translateY(-${shiftY}px)`;
      } else {
        wrapperEl.style.transform = `translateY(0px)`;
      }
    }
  }, [wordIndex]);

  // Helper to get character status/styling
  const getCharClass = (wIdx: number, cIdx: number, char: string) => {
    if (wIdx < wordIndex) {
      // Words already completed
      const savedInput = localStorage.getItem(`word-input-${wIdx}`) || '';
      const typedChar = savedInput[cIdx];
      if (typedChar === undefined) return 'text-theme-error underline decoration-wavy';
      return typedChar === char ? 'text-theme-correct' : 'text-theme-error';
    }

    if (wIdx === wordIndex) {
      // Active word
      if (cIdx < userInput.length) {
        return userInput[cIdx] === char ? 'text-theme-correct' : 'text-theme-error';
      }
      return 'text-theme-sub/60';
    }

    // Future words
    return 'text-theme-sub/60';
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full px-4 py-8">
      {/* Settings Panel */}
      {testState === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 glass-panel px-6 py-3 rounded-full mb-8 border border-theme-sub/10 text-xs md:text-sm font-medium text-theme-sub"
        >
          {/* Modes */}
          <div className="flex items-center gap-3 border-r border-theme-sub/20 pr-5">
            <button
              onClick={() => changeMode('words')}
              className={`hover:text-theme-text transition-colors flex items-center gap-1 ${
                mode === 'words' ? 'text-theme-main font-semibold' : ''
              }`}
            >
              <Keyboard size={15} /> Words
            </button>
            <button
              onClick={() => changeMode('quote')}
              className={`hover:text-theme-text transition-colors flex items-center gap-1 ${
                mode === 'quote' ? 'text-theme-main font-semibold' : ''
              }`}
            >
              <FileText size={15} /> Quotes
            </button>
            <button
              onClick={() => changeMode('paragraph')}
              className={`hover:text-theme-text transition-colors flex items-center gap-1 ${
                mode === 'paragraph' ? 'text-theme-main font-semibold' : ''
              }`}
            >
              <Award size={15} /> Paragraph
            </button>
          </div>

          {/* Time Durations (only applicable if words/paragraph mode) */}
          {mode !== 'quote' && (
            <div className="flex items-center gap-3 border-r border-theme-sub/20 pr-5">
              {([15, 30, 60, 120] as TestDuration[]).map((dur) => (
                <button
                  key={dur}
                  onClick={() => changeDuration(dur)}
                  className={`hover:text-theme-text transition-colors ${
                    duration === dur ? 'text-theme-main font-semibold' : ''
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          )}

          {/* Sounds */}
          <div className="flex items-center gap-2">
            <Volume2 size={16} />
            <select
              value={soundType}
              onChange={(e) => setSoundType(e.target.value as any)}
              className="bg-transparent text-theme-sub hover:text-theme-text border-none focus:ring-0 outline-none text-xs"
            >
              <option value="mechanical" className="bg-theme-bg text-theme-text">Mechanical Click</option>
              <option value="digital" className="bg-theme-bg text-theme-text">Digital Pop</option>
              <option value="none" className="bg-theme-bg text-theme-text">Silent</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Typing Stats Dashboard (visible during typing) */}
      {testState !== 'idle' && (
        <div className="flex justify-between items-center w-full max-w-3xl mb-6 text-theme-sub text-lg font-semibold border-b border-theme-sub/10 pb-3">
          <div className="flex items-center gap-2">
            <Timer size={18} className="text-theme-main" />
            <span className="text-theme-main font-mono">{timeLeft}s</span>
          </div>
          <div className="flex gap-8 text-sm md:text-base font-medium">
            <div>
              WPM: <span className="text-theme-text font-mono font-bold">{Math.round(liveStats.net)}</span>
            </div>
            <div>
              Acc: <span className="text-theme-text font-mono font-bold">{Math.round(liveStats.accuracy)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Typing Board Wrapper */}
      <div className="w-full max-w-3xl glass-panel p-8 rounded-2xl relative border border-theme-sub/10 shadow-2xl">
        {/* Invisible Textarea focus catcher */}
        <div
          onClick={() => {
            // Refocus typing input
            window.focus();
          }}
          className="absolute inset-0 bg-transparent cursor-text z-0"
        />

        {/* Outer scrolling viewport */}
        <div
          ref={wordsContainerRef}
          className={`relative overflow-hidden h-[126px] z-10 select-none typing-font ${
            fontSize === 'small'
              ? 'font-size-small'
              : fontSize === 'large'
              ? 'font-size-large'
              : 'font-size-medium'
          }`}
        >
          {/* Inner flexible wrapper */}
          <div
            ref={wordsWrapperRef}
            className="flex flex-wrap gap-x-4 gap-y-3 transition-transform duration-300 ease-out text-left"
          >
            {words.map((word, wIdx) => {
              const isActive = wIdx === wordIndex;
              const savedInput = localStorage.getItem(`word-input-${wIdx}`) || '';
              const isWrong = wIdx < wordIndex && savedInput !== word;

              return (
                <span
                  key={wIdx}
                  ref={isActive ? activeWordRef : null}
                  className={`relative inline-block ${
                    isActive ? 'bg-theme-main/10 rounded-sm px-0.5' : ''
                  } ${isWrong ? 'border-b border-theme-error/50' : ''}`}
                >
                  {word.split('').map((char, cIdx) => {
                    const isCursor = isActive && cIdx === userInput.length;
                    return (
                      <span
                        key={cIdx}
                        className={`transition-colors duration-100 ${getCharClass(
                          wIdx,
                          cIdx,
                          char
                        )} ${isCursor ? 'custom-cursor' : ''}`}
                      >
                        {char}
                      </span>
                    );
                  })}
                  
                  {/* Append extra letters if user typed too many */}
                  {isActive && userInput.length > word.length && (
                    <span className="text-theme-error/80 line-through">
                      {userInput.slice(word.length)}
                    </span>
                  )}

                  {/* Render space character cursor */}
                  {isActive && userInput.length === word.length && (
                    <span className="custom-cursor">&nbsp;</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {/* Interactive Blur focus notice overlay */}
        {testState === 'idle' && (
          <div className="absolute inset-0 bg-theme-bg/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-20 flex-col gap-3 pointer-events-none">
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
              className="text-theme-main font-semibold text-lg"
            >
              Start typing to begin the test
            </motion.p>
            <p className="text-xs text-theme-sub">
              Your words will remain fixed during the test. Happy typing!
            </p>
          </div>
        )}
      </div>

      {/* Quote author if in Quote Mode */}
      {mode === 'quote' && activeQuote && testState !== 'idle' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm italic text-theme-sub/60 mt-4 text-center"
        >
          — {activeQuote.author}
        </motion.p>
      )}

      {/* Restart Actions */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-theme-sub/20 hover:border-theme-main text-theme-sub hover:text-theme-text hover:bg-theme-main/5 transition-all text-sm font-semibold active:scale-95"
          title="Restart Test (Ctrl + R or click)"
        >
          <RefreshCw size={15} /> Restart Test
        </button>
      </div>
    </div>
  );
};
export default TypingTest;
