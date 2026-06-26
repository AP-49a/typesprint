import { useState, useEffect, useRef, useCallback } from 'react';
import { playKeySound } from '../utils/sound.js';

export type TestMode = 'words' | 'quote' | 'paragraph';
export type TestDuration = 15 | 30 | 60 | 120;

interface UseTypingTestProps {
  initialWords: string[];
  mode: TestMode;
  duration: TestDuration;
  soundType: 'mechanical' | 'digital' | 'none';
  onComplete?: (results: any) => void;
}

export const useTypingTest = ({
  initialWords,
  mode,
  duration,
  soundType,
  onComplete,
}: UseTypingTestProps) => {
  const [words, setWords] = useState<string[]>(initialWords);
  const [userInput, setUserInput] = useState<string>('');
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [testState, setTestState] = useState<'idle' | 'typing' | 'completed'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Stats tracking
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [wpmHistory, setWpmHistory] = useState<{ time: number; wpm: number; accuracy: number }[]>([]);

  // Refs for tracking mutable states in event listeners without re-binding
  const timerRef = useRef<any>(null);
  const wordsRef = useRef<string[]>(words);
  const wordIndexRef = useRef<number>(wordIndex);
  const userInputRef = useRef<string>(userInput);
  const correctCharsRef = useRef<number>(correctChars);
  const incorrectCharsRef = useRef<number>(incorrectChars);
  const mistakesRef = useRef<Record<string, number>>(mistakes);
  const testStateRef = useRef<'idle' | 'typing' | 'completed'>(testState);
  const timeLeftRef = useRef<number>(timeLeft);
  const elapsedTimeRef = useRef<number>(elapsedTime);
  const wpmHistoryRef = useRef<{ time: number; wpm: number; accuracy: number }[]>([]);

  // Update refs on state changes
  useEffect(() => { wordsRef.current = words; }, [words]);
  useEffect(() => { wordIndexRef.current = wordIndex; }, [wordIndex]);
  useEffect(() => { userInputRef.current = userInput; }, [userInput]);
  useEffect(() => { correctCharsRef.current = correctChars; }, [correctChars]);
  useEffect(() => { incorrectCharsRef.current = incorrectChars; }, [incorrectChars]);
  useEffect(() => { mistakesRef.current = mistakes; }, [mistakes]);
  useEffect(() => { testStateRef.current = testState; }, [testState]);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { elapsedTimeRef.current = elapsedTime; }, [elapsedTime]);
  useEffect(() => { wpmHistoryRef.current = wpmHistory; }, [wpmHistory]);

  // Sync timeLeft when duration changes
  useEffect(() => {
    setTimeLeft(duration);
    timeLeftRef.current = duration;
    setElapsedTime(0);
    elapsedTimeRef.current = 0;
    setTestState('idle');
    setWordIndex(0);
    setUserInput('');
    setCorrectChars(0);
    setIncorrectChars(0);
    setMistakes({});
    setWpmHistory([]);
  }, [duration]);

  const resetTest = useCallback((newWords: string[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setWords(newWords);
    setUserInput('');
    setWordIndex(0);
    setTestState('idle');
    setTimeLeft(duration);
    setElapsedTime(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setMistakes({});
    setWpmHistory([]);
  }, [duration]);

  // Real-time WPM calculation formula
  const getWpmStats = useCallback((elapsedSec: number, correct: number, wrong: number) => {
    const min = elapsedSec / 60;
    if (min <= 0) return { gross: 0, net: 0, accuracy: 100 };

    const gross = (correct + wrong) / 5 / min;
    const net = Math.max(0, (correct / 5 / min) - (wrong / min)); // Standard WPM Net formula
    const totalTyped = correct + wrong;
    const accuracy = totalTyped > 0 ? (correct / totalTyped) * 100 : 100;

    return {
      gross: Math.round(gross * 10) / 10,
      net: Math.round(net * 10) / 10,
      accuracy: Math.round(accuracy * 10) / 10,
    };
  }, []);

  const endTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTestState('completed');

    const totalElapsed = elapsedTimeRef.current > 0 ? elapsedTimeRef.current : 1;
    const finalStats = getWpmStats(
      totalElapsed,
      correctCharsRef.current,
      incorrectCharsRef.current
    );

    // Calculate mistakes map
    const mistakesCount = Object.values(mistakesRef.current).reduce((a, b) => a + b, 0);

    const results = {
      wpmGross: finalStats.gross,
      wpmNet: finalStats.net,
      accuracy: finalStats.accuracy,
      correctChars: correctCharsRef.current,
      incorrectChars: incorrectCharsRef.current,
      mistakes: mistakesCount,
      mistakesJson: JSON.stringify(mistakesRef.current),
      duration: duration,
      mode: mode,
      wpmHistory: wpmHistoryRef.current,
      elapsedTime: totalElapsed,
    };

    if (onComplete) {
      onComplete(results);
    }
  }, [duration, mode, getWpmStats, onComplete]);

  // Core Timer Interval
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      const currentElapsed = elapsedTimeRef.current + 1;
      const currentRemaining = timeLeftRef.current - 1;

      setElapsedTime(currentElapsed);
      setTimeLeft(currentRemaining);

      // Record WPM history snapshot every second
      const stats = getWpmStats(
        currentElapsed,
        correctCharsRef.current,
        incorrectCharsRef.current
      );
      
      setWpmHistory((prev) => [
        ...prev,
        { time: currentElapsed, wpm: stats.net, accuracy: stats.accuracy },
      ]);

      if (currentRemaining <= 0) {
        endTest();
      }
    }, 1000);
  }, [getWpmStats, endTest]);

  // Keyboard Event handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (testStateRef.current === 'completed') return;

      const key = e.key;

      // Start test on first keypress
      if (testStateRef.current === 'idle') {
        setTestState('typing');
        startTimer();
      }

      // Ignore Function/System keys
      if (
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        key === 'Tab' ||
        key === 'Escape' ||
        key === 'CapsLock' ||
        key === 'Shift' ||
        key === 'Enter' ||
        key.startsWith('Arrow') ||
        key.startsWith('F') && key.length > 1
      ) {
        return;
      }

      const activeWord = wordsRef.current[wordIndexRef.current];
      const activeInput = userInputRef.current;

      // Handle Backspace
      if (key === 'Backspace') {
        e.preventDefault();
        if (activeInput.length > 0) {
          const removedChar = activeInput[activeInput.length - 1];
          const indexInWord = activeInput.length - 1;
          const targetChar = activeWord[indexInWord];

          // Revert statistics
          if (removedChar === targetChar) {
            setCorrectChars((prev) => Math.max(0, prev - 1));
          } else {
            setIncorrectChars((prev) => Math.max(0, prev - 1));
          }

          const newInput = activeInput.slice(0, -1);
          setUserInput(newInput);
          playKeySound(soundType, 'click');
        } else if (wordIndexRef.current > 0) {
          // Allow backspacing to previous word only if it was typed incorrectly
          const prevIndex = wordIndexRef.current - 1;
          const prevWord = wordsRef.current[prevIndex];
          const prevInput = localStorage.getItem(`word-input-${prevIndex}`) || '';

          if (prevInput !== prevWord) {
            setWordIndex(prevIndex);
            setUserInput(prevInput);
            playKeySound(soundType, 'click');
          }
        }
        return;
      }

      // Handle Space (advance to next word)
      if (key === ' ') {
        e.preventDefault();
        if (activeInput.length === 0) return; // Ignore multiple double-spaces

        // Save current input for backspacing reference
        localStorage.setItem(`word-input-${wordIndexRef.current}`, activeInput);

        // Count correct/incorrect letters at spacebar press
        // Remaining untyped characters in the word are counted as mistakes
        const remainingLength = Math.max(0, activeWord.length - activeInput.length);
        if (remainingLength > 0) {
          setIncorrectChars((prev) => prev + remainingLength);
          
          // Register mistakes for untyped chars
          setMistakes((prev) => {
            const next = { ...prev };
            for (let i = activeInput.length; i < activeWord.length; i++) {
              const char = activeWord[i];
              next[char] = (next[char] || 0) + 1;
            }
            return next;
          });
        }

        // Play space sound
        playKeySound(soundType, 'space');

        // Check if it was the last word
        if (wordIndexRef.current >= wordsRef.current.length - 1) {
          endTest();
        } else {
          setWordIndex((prev) => prev + 1);
          setUserInput('');
        }
        return;
      }

      // Handle normal character input
      if (key.length === 1) {
        e.preventDefault();
        
        // Prevent typing beyond the word's maximum reasonable limit (active word length + 5 extra characters max)
        if (activeInput.length >= activeWord.length + 5) {
          playKeySound(soundType, 'error');
          return;
        }

        const targetChar = activeWord[activeInput.length];
        const isCorrect = key === targetChar;

        if (isCorrect) {
          setCorrectChars((prev) => prev + 1);
          playKeySound(soundType, 'click');
        } else {
          setIncorrectChars((prev) => prev + 1);
          playKeySound(soundType, 'error');

          // Track character mistake
          const expectedChar = targetChar || 'extra';
          setMistakes((prev) => ({
            ...prev,
            [expectedChar]: (prev[expectedChar] || 0) + 1,
          }));
        }

        setUserInput((prev) => prev + key);
      }
    },
    [soundType, startTimer, endTest]
  );

  // Attach and clean up keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleKeyDown]);

  // Clean local storage tags
  useEffect(() => {
    return () => {
      for (let i = 0; i < words.length; i++) {
        localStorage.removeItem(`word-input-${i}`);
      }
    };
  }, [words]);

  return {
    words,
    userInput,
    wordIndex,
    testState,
    timeLeft,
    elapsedTime,
    correctChars,
    incorrectChars,
    wpmHistory,
    mistakes,
    resetTest,
    endTest,
    getWpmStats: () => getWpmStats(elapsedTime, correctChars, incorrectChars),
  };
};
