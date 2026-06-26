import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'carbon' | 'light' | 'cyberpunk' | 'nord';
export type FontSizeType = 'small' | 'medium' | 'large';
export type SoundType = 'mechanical' | 'digital' | 'none';

interface SettingsContextProps {
  theme: ThemeType;
  fontSize: FontSizeType;
  soundType: SoundType;
  setTheme: (t: ThemeType) => void;
  setFontSize: (s: FontSizeType) => void;
  setSoundType: (sd: SoundType) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    return (localStorage.getItem('typesprint-theme') as ThemeType) || 'carbon';
  });

  const [fontSize, setFontSizeState] = useState<FontSizeType>(() => {
    return (localStorage.getItem('typesprint-font-size') as FontSizeType) || 'medium';
  });

  const [soundType, setSoundTypeState] = useState<SoundType>(() => {
    return (localStorage.getItem('typesprint-sound') as SoundType) || 'mechanical';
  });

  useEffect(() => {
    // Apply theme class to html element
    const root = document.documentElement;
    root.classList.remove('theme-carbon', 'theme-light', 'theme-cyberpunk', 'theme-nord', 'dark');

    if (theme === 'light') {
      root.classList.add('theme-light');
    } else if (theme === 'cyberpunk') {
      root.classList.add('theme-cyberpunk', 'dark');
    } else if (theme === 'nord') {
      root.classList.add('theme-nord', 'dark');
    } else {
      root.classList.add('theme-carbon', 'dark');
    }
  }, [theme]);

  const setTheme = (t: ThemeType) => {
    setThemeState(t);
    localStorage.setItem('typesprint-theme', t);
  };

  const setFontSize = (s: FontSizeType) => {
    setFontSizeState(s);
    localStorage.setItem('typesprint-font-size', s);
  };

  const setSoundType = (sd: SoundType) => {
    setSoundTypeState(sd);
    localStorage.setItem('typesprint-sound', sd);
  };

  return (
    <SettingsContext.Provider value={{ theme, fontSize, soundType, setTheme, setFontSize, setSoundType }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
