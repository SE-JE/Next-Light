import { cn, pcn } from "@/helpers";
import { useRef, useState, useEffect, ReactNode } from "react";

type CT = "base" | "container" | "floating-scroll";

interface ScrollContainerPropsType {
  children: ReactNode;
  scrollFloating?: boolean;
  onScroll?: (e: any) => void;

  /** Use custom class with: "container::", "floating-scroll::"". */
  className?: string;
}

export function ScrollContainerComponent({
  children,
  className = "",
  scrollFloating = false,
  onScroll,
}: ScrollContainerPropsType) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const floatingScrollbarRef = useRef<HTMLDivElement | null>(null);
  const floatingScrollbarContainerRef = useRef<HTMLDivElement | null>(null);

  // const [showLeftShadow, setShowLeftShadow] = useState(false);
  // const [showRightShadow, setShowRightShadow] = useState(false);
  // const [showTopShadow, setShowTopShadow] = useState(false);
  // const [showBottomShadow, setShowBottomShadow] = useState(false);
  // const [isScrollable, setIsScrollable] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      onScroll?.(containerRef.current);
      // const {
      //   scrollLeft,
      //   scrollWidth,
      //   clientWidth,
      //   scrollTop,
      //   scrollHeight,
      //   clientHeight,
      // } = containerRef.current;
      // setShowLeftShadow(scrollLeft > 0);
      // setShowRightShadow(scrollLeft + clientWidth < scrollWidth);
      // setShowTopShadow(scrollTop > 0);
      // setShowBottomShadow(scrollTop + clientHeight < scrollHeight);
      // setIsScrollable(scrollWidth > clientWidth || scrollHeight > clientHeight);
    };

    const container = containerRef.current;
    if (container) {
      handleScroll();
      container.addEventListener("scroll", handleScroll);
    }

    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    const floatingScrollbar = floatingScrollbarRef.current;

    if (!scrollContainer || !floatingScrollbar) return;

    const syncScroll = () => {
      floatingScrollbar.scrollLeft = scrollContainer.scrollLeft;
    };

    const syncScrollReverse = () => {
      scrollContainer.scrollLeft = floatingScrollbar.scrollLeft;
    };

    scrollContainer.addEventListener("scroll", syncScroll);
    floatingScrollbar.addEventListener("scroll", syncScrollReverse);

    return () => {
      scrollContainer.removeEventListener("scroll", syncScroll);
      floatingScrollbar.removeEventListener("scroll", syncScrollReverse);
    };
  }, []);

  const handleResize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (floatingScrollbarContainerRef.current) {
      floatingScrollbarContainerRef.current.style.width = `${containerWidth}px`;
    }
  }, [containerWidth]);

  return (
    <div className={cn("relative", pcn<CT>(className, "base"))}>
      {/* {isScrollable && showLeftShadow && (
        <div className="absolute z-10 left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-foreground/15 to-transparent pointer-events-none" />
      )}
      {isScrollable && showRightShadow && (
        <div className="absolute z-10 right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-foreground/15 to-transparent pointer-events-none" />
      )}
      {isScrollable && showTopShadow && (
        <div className="absolute z-10 top-0 left-0 right-0 h-4 bg-gradient-to-b from-foreground/15 to-transparent pointer-events-none" />
      )}
      {isScrollable && showBottomShadow && (
        <div className="absolute z-10 bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-foreground/15 to-transparent pointer-events-none" />
      )} */}
      <div
        ref={containerRef}
        className={cn(
          "w-full overflow-x-auto scroll",
          scrollFloating && "scroll-none",
          pcn<CT>(className, "base"),
        )}
      >
        {children}
      </div>
      {scrollFloating && (
        <div
          className="fixed bottom-0 py-1 bg-background"
          ref={floatingScrollbarContainerRef}
        >
          <div
            className="scroll overflow-x-auto overflow-y-hidden"
            ref={floatingScrollbarRef}
          >
            <div className="h-0.5 opacity-0">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
