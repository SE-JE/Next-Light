import React, { ReactNode, useEffect, useRef } from "react";



export interface OutsideClickHandlerProps {
  children        :  ReactNode;
  onOutsideClick  :  () => void;
}



export const OutsideClickComponent: React.FC<OutsideClickHandlerProps> = ({ children, onOutsideClick }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutsideClick();
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onOutsideClick]);

  return <div ref={ref}>{children}</div>;
};