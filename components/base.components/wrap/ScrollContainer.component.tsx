"use client"

import { cn, pcn } from "@utils";
import { useRef, useState, useEffect, ReactNode } from "react";



type CT = "base" | "container" | "floating-scroll";

export interface ScrollContainerProps {
  children         :  ReactNode;
  footer          ?:  ReactNode;
  scrollFloating  ?:  boolean;
  onScroll        ?:  (e: any) => void;

  /** Use custom class with: "container::", "floating-scroll::"". */
  className?: string;
}



export function ScrollContainerComponent({
  children,
  footer,
  className = "",
  scrollFloating = false,
  onScroll,
}: ScrollContainerProps) {
  const containerRef                         =  useRef<HTMLDivElement | null>(null);
  const floatingScrollbarRef                 =  useRef<HTMLDivElement | null>(null);
  const floatingScrollbarContainerRef        =  useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth]  =  useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      onScroll?.(containerRef.current);
    };

    const container = containerRef.current;
    if (container) {
      handleScroll();
      container.addEventListener("scroll", handleScroll);
    }

    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const scrollContainer    =  containerRef.current;
    const floatingScrollbar  =  floatingScrollbarRef.current;

    if (!scrollContainer || !floatingScrollbar) return;

    const syncScroll         =  () => floatingScrollbar.scrollLeft  =  scrollContainer.scrollLeft;
    const syncScrollReverse  =  () => scrollContainer.scrollLeft    =  floatingScrollbar.scrollLeft;

    scrollContainer.addEventListener("scroll", syncScroll);
    floatingScrollbar.addEventListener("scroll", syncScrollReverse);

    return () => {
      scrollContainer.removeEventListener("scroll", syncScroll);
      floatingScrollbar.removeEventListener("scroll", syncScrollReverse);
    };
  }, []);

  const handleResize = () => {
    if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (floatingScrollbarContainerRef.current) floatingScrollbarContainerRef.current.style.width = `${containerWidth}px`;
  }, [containerWidth]);

  return (
    <div className={cn("relative", pcn<CT>(className, "base"))}>
      <div
        ref={containerRef}
        className={cn(
          "w-full overflow-x-auto scroll",
          scrollFloating && "scroll-none",
          pcn<CT>(className, "container"),
        )}
      >
        {children}
      </div>

      <div className="fixed bottom-0 py-1 bg-background w-full" ref={floatingScrollbarContainerRef}>
        <div ref={floatingScrollbarRef} className={cn(scrollFloating ? "scroll overflow-x-auto overflow-y-hidden" : "")}>
          <div className="h-0.5 opacity-0">{children}</div>
        </div>
        
        {footer}
      </div>
    </div>
  );
}
