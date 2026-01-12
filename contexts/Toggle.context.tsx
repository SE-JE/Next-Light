"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ToggleContextInterface {
  toggle: Record<string, ToggleValue>;
  setToggle: (key: string, value?: ToggleValue) => void;
}

const ToggleContext = createContext<ToggleContextInterface | null>(null);

type ToggleValue = string | number | boolean | object;

const toggleState: Record<string, ToggleValue> = {};


export const ToggleContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [, forceRender] = useState(0);

  const setToggle = useCallback((key: string, value?: ToggleValue) => {
    const next = value !== undefined ? value : !toggleState[key];
    if (toggleState[key] === next) return;

    toggleState[key] = next;
    forceRender(v => v + 1);
  }, []);

  return (
    <ToggleContext.Provider
      value={{
        toggle: toggleState,
        setToggle
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
};

export const useToggleContext = () => {
  const ctx = useContext(ToggleContext);
  if (!ctx) throw new Error("useToggleContext must be used inside provider");
  return ctx;
};
