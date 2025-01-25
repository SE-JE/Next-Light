import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";

interface CarouselItem {
  background: string;
  content?: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

export function CarouselComponent({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = (): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      if (touchStartX.current - touchEndX.current > 50) handleNext();
      if (touchEndX.current - touchStartX.current > 50) handlePrev();
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(handleNext, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full aspect-[16/6] flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${item.background})` }}
          >
            {item.content}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-8 h-1 rounded-full ${
              currentIndex === index ? "bg-primary" : "bg-light-foreground/40"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>

      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-light-foreground/40 text-white p-2 rounded-full cursor-pointer"
        onClick={handlePrev}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-light-foreground/40 text-white p-2 rounded-full cursor-pointer"
        onClick={handleNext}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
