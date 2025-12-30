"use client";

import { createContext, FC, ReactNode, useContext, useState } from "react";

interface ToggleContextInterface {
  toggle: Record<string, string | number | Record<string,any> | boolean>;
  setToggle: (key: string, value?: string | number | object | boolean) => void;
}

const ToggleContext = createContext<ToggleContextInterface | undefined>(undefined);

export const ToggleContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [actives, setActives] = useState<Record<string, string | number | object | boolean>>({});

  const setActive = (key: string, value?: (string | number | object | boolean)) => setActives((prev) => ({ ...prev, [key]: value != undefined ? value : !prev?.[key] }));

  return <ToggleContext.Provider value={{toggle: actives, setToggle: setActive}}>{children}</ToggleContext.Provider>;
};

export const useToggleContext = (): ToggleContextInterface => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error("useToggleContext must be used within a ToggleContextProvider");
  }
  return context;
};
