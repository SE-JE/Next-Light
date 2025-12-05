"use client"

import { ReactNode, useRef, useState } from 'react'
import { cn } from '@/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export type SwipeActionType = {
  label      ?:  string,
  icon       ?:  any,
  onAction   ?:  () => void;
  className  ?:  string;
}

export type SwipeProps = {
  leftActionControl   ?:  SwipeActionType;
  rightActionControl  ?:  SwipeActionType;
  children            ?:  ReactNode;
  className           ?:  string;
};

export function SwipeComponent({
  leftActionControl,
  rightActionControl,
  children,
  className,
} : SwipeProps) {

  const startX = useRef(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  function onTouchStart(e: React.TouchEvent) {
    setDragging(true);
    startX.current = e.touches[0].clientX;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!dragging) return;

    const currentX = e.touches[0].clientX;
    const delta = currentX - startX.current;

    let allowed = delta;

    // Jika tidak ada aksi kiri → larang geser ke kanan
    if (!leftActionControl && delta > 0) allowed = 0;

    // Jika tidak ada aksi kanan → larang geser ke kiri
    if (!rightActionControl && delta < 0) allowed = 0;

    // Batasi maksimal ±100px
    allowed = Math.max(Math.min(allowed, 100), -100);

    setOffset(allowed);
    e.preventDefault();
  }

  function onTouchEnd() {
    if (!dragging) return;
    setDragging(false);

    if (offset > 60 && leftActionControl) leftActionControl.onAction?.();
    if (offset < -60 && rightActionControl) rightActionControl.onAction?.();

    setOffset(0);
  }
  
  return (
    <div className="relative w-full overflow-hidden select-none">
      <div className={cn("absolute h-full left-0 w-1/2 flex items-center px-5 gap-2 bg-light-warning text-warning", leftActionControl?.className)}>
        <FontAwesomeIcon icon={leftActionControl?.icon} /> {leftActionControl?.label}
      </div>

      <div className={cn("absolute h-full right-0 w-1/2 flex justify-end items-center px-5 gap-2 bg-light-danger text-danger", rightActionControl?.className)}>
        <FontAwesomeIcon icon={rightActionControl?.icon} /> {rightActionControl?.label}
      </div>

      <div
        className={cn("relative z-10 bg-background", className)}
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging ? "none" : "transform 0.2s ease",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}
