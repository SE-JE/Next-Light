"use client"

import { FC, ReactNode, useEffect, useRef } from "react";



export interface OutsideClickHandlerProps {
  children: ReactNode;
  onOutsideClick?: () => void;
}



export const OutsideClickComponent: FC<OutsideClickHandlerProps> = ({
  children,
  onOutsideClick,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const handlerRef = useRef(onOutsideClick);

  useEffect(() => {
    handlerRef.current = onOutsideClick;
  }, [onOutsideClick]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const el = ref.current;
      if (!el || !(event.target instanceof Node)) return;

      const isOutside = !el.contains(event.target);

      if (isOutside) {
        queueMicrotask(() => {
          if (ref.current && !ref.current.contains(event.target as Node)) {
            handlerRef.current?.();
          }
        });
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
};
