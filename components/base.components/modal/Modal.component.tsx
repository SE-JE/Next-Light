"use client"

import { ReactNode, useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn, shortcut } from "@utils";
import { IconButtonComponent } from "@components";



type CT = "base" | "backdrop" | "header" | "footer";

export interface ModalProps {
  show       :  boolean;
  onClose    :  () => void;
  title     ?:  string | ReactNode;
  children  ?:  any;
  tip       ?:  string | ReactNode;
  footer    ?:  string | ReactNode;

  /** Use custom class with: "backdrop::", "header::", "footer::". */
  className  ?:  string;
};



export function ModalComponent({
  show,
  onClose,
  title,
  children,
  tip,
  footer,
  className = "",
}: ModalProps) {
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
          "modal",
          "w-[calc(100vw-2rem)] md:w-[50vw] max-w-[500px]",
          !show && "-translate-y-full opacity-0 scale-y-0",
          pcn<CT>(className, "base"),
        )}
      >
        {title && (
          <div className={cn("modal-header", pcn<CT>(className, "header"))}>
            <div>
              <h6 className="text-lg font-semibold text-foreground">{title}</h6>
              <p className="text-sm text-light-foreground leading-4 mt-1">{tip}</p>
            </div>

            <IconButtonComponent
              icon={faTimes}
              variant="simple"
              paint="danger"
              onClick={() => onClose()}
            />
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
