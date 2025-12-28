"use client"

import { useEffect, useState } from "react";



// ==============================>
// ## Export all from utils
// ==============================>
export * from "./api.util";
export * from "./auth.util";
export * from "./cavity.util";
export * from "./encryption.util";
export * from "./cn.util";
export * from "./form.util";
export * from "./socket.util";
export * from "./table.util";
export * from "./validation.util";
export * from "./conversion.util";
export * from "./shortcut.util";



// ==============================>
// ## Detect device size
// ==============================>
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({width: 0, height: 0});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({width: window.innerWidth, height: window.innerHeight});
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isXs       :  windowSize.width < 640,
    isSm       :  windowSize.width < 768,
    isMd       :  windowSize.width < 1024,
    isLg       :  windowSize.width < 1280,
    isXl       :  windowSize.width >= 1280,
    isMobile   :  windowSize.width < 768,
    isTablet   :  windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop  :  windowSize.width >= 1024,
    width      :  windowSize.width,
    height     :  windowSize.height,
  };
};



// ==============================>
// ## Detect keyboard open
// ==============================>
export function useKeyboardOpen() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;

        setIsKeyboardOpen(viewportHeight < windowHeight);
      }
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    
    return () => window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  return isKeyboardOpen;
}



// ==============================>
// ## Search with typing reference
// ==============================>
export const useLazySearch = (keyword: string) => {
  const [keywordSearch, setKeywordSearch]  =  useState("");
  const [doSearch, setDoSearch]            =  useState(false);

  useEffect(() => {
    if (keyword != undefined) {
      const delaySearch  =  setTimeout(() => setDoSearch(!doSearch), 500);
      
      return () => clearTimeout(delaySearch);
    }
  }, [keyword]);

  useEffect(() => setKeywordSearch(keyword), [doSearch]);

  return [keywordSearch];
};

