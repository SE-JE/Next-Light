"use client"

import { MouseEvent, ReactNode, TouchEvent, useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import { cn, pcn } from "@utils";

type CT = "base" | "backdrop" | "footer";

export type BottomSheetProps = {
  show       :  boolean;
  children   :  ReactNode;
  onClose    :  () => void;
  size      ?:  string | number;
  maxSize   ?:  string | number;
  footer    ?:  ReactNode;

   /** Use custom class with: "backdrop::", "footer::". */
  className ?:  string;
};

function sizeToPx(value: string | number | undefined): number {
  if (typeof window === "undefined") return 0;
  if (value === undefined || value === null) return 0;

  if (typeof value === "number") return value;

  const v = value.trim();

  if (v.endsWith("vh")) {
    const n = parseFloat(v.replace("vh", ""));
    return (n / 100) * window.innerHeight;
  }
  if (v.endsWith("px")) {
    return parseFloat(v.replace("px", ""));
  }
  return parseFloat(v) || 0;
}

const BottomSheet = ({
  show,
  children,
  onClose,
  size = 500,
  maxSize,
  footer,
  className = "",
}: BottomSheetProps) => {
  const scrollRef  =  useRef<HTMLDivElement | null>(null);
  const sheetRef   =  useRef<HTMLDivElement | null>(null);

  const startY    =  useRef(0);
  const lastY     =  useRef(0);
  const dragging  =  useRef(false);

  const [offset, setOffset]                        =  useState(0);
  const [isExpanded, setIsExpanded]                =  useState(false);
  const [scrollLocked, setScrollLocked]            =  useState(false);
  const [contentScrollable, setContentScrollable]  =  useState(false);

  const realMaxSize = maxSize ?? size;

  const clamp = (v: number) => {
    const max = window.innerHeight;
    return Math.max(-200, Math.min(v, max));
  };

  const animateTo = (target: number, onFinish?: () => void) => {
    lastY.current = target;
    setOffset(clamp(target));
    onFinish?.();
  };

  useEffect(() => {
    if (show) {
      lastY.current = 0;
      setOffset(0);
      setIsExpanded(false);
    } else {
      const t = setTimeout(() => {
        lastY.current = 0;
        setOffset(0);
        setIsExpanded(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [show]);

  const onStart = (clientY: number) => {
    const sc  =  scrollRef.current;

    if (sc && sc.scrollTop < 0) {
      setScrollLocked(true);
      return;
    }

    setScrollLocked(false);

    dragging.current  =  true;
    startY.current    =  clientY;
    lastY.current     =  offset;
  };

  const onMove = (clientY: number) => {
    if (scrollLocked) return;
    if (!dragging.current) return;

    const diff = clientY - startY.current;
    setOffset(clamp(lastY.current + diff));
  };

  const onEnd = () => {
    if (scrollLocked) {
      setScrollLocked(false);
      return;
    }

    if (!dragging.current) return;
    dragging.current = false;

    const current = offset;

    const thresholdDown = 120;
    const thresholdUp = -40;

    if (!isExpanded && current < thresholdUp && maxSize !== undefined) {
      setIsExpanded(true);
      animateTo(0);
      return;
    }

    if (isExpanded && current > thresholdDown) {
      setIsExpanded(false);
      animateTo(0);
      return;
    }

    if (!isExpanded && current > thresholdDown) {
      animateTo(window.innerHeight, () => {
        onClose();
        lastY.current = 0;
        setOffset(0);
      });
      return;
    }

    animateTo(0);
  };

  const collapsedPx = sizeToPx(size);
  const expandedPx = sizeToPx(realMaxSize);

  const topPx = isExpanded ? window.innerHeight - expandedPx : window.innerHeight - collapsedPx;

  const bindTouch = {
    onTouchStart : (e: TouchEvent) => onStart(e.touches[0].clientY),
    onTouchMove  : (e: TouchEvent) => onMove(e.touches[0].clientY),
    onTouchEnd   :  () => onEnd(),
  };

  const bindMouse = {
    onMouseDown   :  (e: MouseEvent) => onStart(e.clientY),
    onMouseMove   :  (e: MouseEvent) => dragging.current && onMove(e.clientY),
    onMouseUp     :  () => onEnd(),
    onMouseLeave  :  () => onEnd(),
  };

  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return;

    const canScroll = sc.scrollHeight > sc.clientHeight;
    setContentScrollable(canScroll);
  }, [show, size, maxSize]);

  useEffect(() => {
    if (show) {
      history.pushState({ bottomsheet: true }, "");
    }
  }, [show]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      if (show) {
        event.preventDefault();

        onClose();
        history.pushState({}, "");
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [show, onClose]);

  return (
    <>
      <div
        className={cn(
          "modal-backdrop",
          !show && "translate-y-full",
          pcn<CT>(className, "backdrop"),
        )}
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        className="fixed left-0 right-0 w-full h-full z-50 transition-[top] duration-75"
        style={{
          top: show ? `${topPx}px` : "150vh",
          transform: `translateY(${offset}px)`,
          touchAction: "none",
        }}
        {...bindTouch}
        {...bindMouse}
      >
        <div className="w-full h-full bg-white rounded-t shadow-xl overflow-hidden">
          <div className="py-2 flex justify-center cursor-grab">
            <div className="w-14 h-[2.5px] bg-slate-200 rounded-full" />
          </div>

          <div
            ref={scrollRef}
            className="overflow-y-auto"
            style={{
              height: isExpanded ? realMaxSize : size,
              touchAction: contentScrollable ? "auto" : "none",
              overscrollBehaviorY: "contain",
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {show && footer && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {footer}
        </div>
      )}
    </>
  );
}


export const BottomSheetComponent = dynamic(() => Promise.resolve(BottomSheet), { ssr: false })