import React, { createContext, useContext, useState, useMemo } from "react";

interface ToggleContextInterface {
  getActive: (key: string) => string | boolean | null;
  setActive: (key: string, value: string | boolean | null) => void;
}

const ToggleContext = createContext<ToggleContextInterface | undefined>(
  undefined
);

export const ToggleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [actives, setActives] = useState<
    Record<string, string | boolean | null>
  >({});

  const setActive = (key: string, value: string | boolean | null) => {
    setActives((prev) => ({ ...prev, [key]: value }));
  };

  const getActive = (key: string) => actives[key] ?? null;

  const value = useMemo(() => ({ getActive, setActive }), [actives]);

  return (
    <ToggleContext.Provider value={value}>{children}</ToggleContext.Provider>
  );
};

export const useToggleContext = (): ToggleContextInterface => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error("useToggleContext must be used within a ToggleProvider");
  }
  return context;
};
