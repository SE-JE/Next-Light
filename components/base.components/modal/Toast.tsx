import { ReactNode, useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { IconButtonComponent } from "../button";
import { parseClassName } from "@/helpers";
type classNamePrefix = "base" | "backdrop" | "header" | "footer";

export type toastProps = {
  show: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children?: any;
  footer?: string | ReactNode;
  className?: string;
};

export function ToastComponent({
  show,
  onClose,
  title,
  children,
  footer,
  className = "",
}: toastProps) {
  return (
    <>
      <div
        className={clsx(
          "toast",
          "w-[calc(100vw-2rem)] md:w-[50vw] max-w-[300px]",
          !show && "translate-y-full opacity-0 scale-y-0",
          parseClassName<classNamePrefix>(className, "base")
        )}
      >
        {title && (
          <div
            className={clsx(
              "p-2 flex justify-between items-center",
              parseClassName<classNamePrefix>(className, "header")
            )}
          >
            <h6 className="font-semibold text-foreground">{title}</h6>

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
          <div
            className={clsx(
              "modal-footer",
              parseClassName<classNamePrefix>(className, "footer")
            )}
          >
            {show && footer}
          </div>
        )}
      </div>
    </>
  );
}
