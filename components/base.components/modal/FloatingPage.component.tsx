"use client"

import { ReactNode, useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { IconButtonComponent } from "@components";
import { cn, pcn, shortcut } from "@utils";



type CT = "base" | "backdrop" | "header" | "footer";

export interface FloatingPageProps {
  show       :  boolean;
  onClose    :  () => void;
  title     ?:  string | ReactNode;
  children  ?:  any;
  tip       ?:  string | ReactNode;
  footer    ?:  string | ReactNode;

  /** Use custom class with: "backdrop::", "header::", "footer::". */
  className  ?:  string;
};



export function FloatingPageComponent({
  show,
  onClose,
  title,
  children,
  tip,
  footer,
  className = "",
}: FloatingPageProps) {

  useEffect(() => {
    if (show) {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";

      shortcut.register("escape", () => {
        onClose?.()
      }, "Kembali")

    } else {
      document.getElementsByTagName("body")[0].style.removeProperty("overflow");
    }

    return () => {
      shortcut.unregister("escape")
    }
  }, [show]);

  return (
    <>
      <div
        className={cn(
          "modal-backdrop",
          !show && "opacity-0 scale-0 -translate-y-full",
          pcn<CT>(className, "backdrop"),
        )}
        onClick={() => onClose()}
      ></div>

      <div
        className={cn(
          "floating-page",
          "w-[100vw] md:w-[50vw] max-w-[700px]",
          !show && "top-[200vh] md:top-0 md:-right-[200vw]",
          pcn<CT>(className, "base"),
        )}
      >
        <div className={cn("modal-header", pcn<CT>(className, "header"))}>
          {title && (
            <div>
              <h6 className="text-lg font-semibold text-foreground">{title}</h6>
              <p className="text-sm text-light-foreground leading-4 mt-1">{tip}</p>
            </div>
          )}

          <IconButtonComponent
            icon={faTimes}
            variant="simple"
            paint="danger"
            onClick={() => onClose()}
          />
        </div>
        

        {show && children}

        {footer && (
          <div
            className={cn(
              "modal-footer absolute bottom-0 w-full",
              pcn<CT>(className, "footer"),
            )}
          >
            {show && footer}
          </div>
        )}
      </div>
    </>
  );
}
