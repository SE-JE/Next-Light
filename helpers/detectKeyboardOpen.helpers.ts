import { useEffect, useState } from "react";

export function useDetectKeyboardOpen() {
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
