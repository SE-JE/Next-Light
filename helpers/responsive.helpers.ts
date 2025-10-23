import { useState, useEffect } from "react";

// ==============================>
// ## Hook of device size
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
