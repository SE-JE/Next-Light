"use client"

import { ReactNode, useEffect, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn } from "@utils";
import { IconButtonComponent } from "@components";



type CT = "base" | "backdrop" | "header" | "footer";

export interface ToastProps {
  show: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children?: any;
  footer?: string | ReactNode;

  /** Use custom class with: "backdrop::", "header::", "footer::". */
  className?: string;
};



export function ToastComponent({
  show,
  onClose,
  title,
  children,
  footer,
  className = "",
}: ToastProps) {
  const [countdown, setCountdown] = useState(5);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (show) {
      setCountdown(5); // Reset countdown saat toast muncul
      const id = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerId(id);
    }
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [show]);

  const handleMouseEnter = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  const handleMouseLeave = () => {
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerId(id);
  };

  return (
    <>
      <div
        className={cn(
          "toast border-t-4 !border-primary rounded-[6px]",
          "w-[calc(100vw-2rem)] md:w-[50vw] max-w-[300px]",
          !show && "translate-y-full opacity-0 scale-y-0",
          pcn<CT>(className, "base"),
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {title && (
          <div
            className={cn(
              "pt-2 px-3 flex justify-between items-center text-foreground",
              pcn<CT>(className, "header"),
            )}
          >
            <h6 className="font-semibold">{title}</h6>

            <div className="flex gap-2 items-center">
              <span className="text-xs text-foreground/50">{countdown}</span>
              <IconButtonComponent
                icon={faTimes}
                variant="simple"
                paint="danger"
                onClick={() => {
                  clearInterval(timerId || "");
                  onClose();
                }}
                size="sm"
              />
            </div>
          </div>
        )}

        {show && children}

        {footer && (
          <div className={cn("modal-footer", pcn<CT>(className, "footer"))}>
            {show && footer}
          </div>
        )}
      </div>
    </>
  );
}
