"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

type ContextType = {
  theme: Theme;
  toggleTheme: () => void;
}

const initialValue: ContextType = {
  theme: Theme.LIGHT,
  toggleTheme: () => {},
};

// Primera parte: declaracion del contexto
const ThemeContext = createContext<ContextType>(initialValue);

const THEME_EVENT = "theme-change";

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_EVENT, onStoreChange);
  };
}

function getStoredTheme(): Theme {
  return window.localStorage.getItem("theme") === Theme.DARK
    ? Theme.DARK
    : Theme.LIGHT;
}

function getServerTheme(): Theme {
  return Theme.LIGHT;
}

// Segunda parte: proveedor del contexto
export const ThemeProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getStoredTheme,
    getServerTheme,
  );

  const toggleTheme = useCallback(() => {
    const nextTheme = getStoredTheme() === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    window.localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const value = useMemo(() => {
    return { 
      theme, 
      toggleTheme 
    };
  }, [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Tercera parte: funcion para consumer
export const useTheme = (): ContextType => useContext(ThemeContext);