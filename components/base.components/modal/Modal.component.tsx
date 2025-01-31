import { ReactNode, useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { IconButtonComponent } from "../button";
import { parseClassName } from "@/helpers";
type classNamePrefix = "base" | "backdrop" | "header" | "footer";

export type modalProps = {
  show: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children?: any;
  tip?: string | ReactNode;
  footer?: string | ReactNode;
  className?: string;
};

export function ModalComponent({
  show,
  onClose,
  title,
  children,
  tip,
  footer,
  className = "",
}: modalProps) {
  useEffect(() => {
    if (show) {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
    } else {
      document.getElementsByTagName("body")[0].style.removeProperty("overflow");
    }
  }, [show]);

  return (
    <>
      <div
        className={clsx(
          "modal-backdrop",
          !show && "opacity-0 scale-0 -translate-y-full",
          parseClassName<classNamePrefix>(className, "backdrop")
        )}
        onClick={() => onClose()}
      ></div>

      <div
        className={clsx(
          "modal",
          "w-[calc(100vw-2rem)] md:w-[50vw] max-w-[500px]",
          !show && "-translate-y-full opacity-0 scale-y-0",
          parseClassName<classNamePrefix>(className, "base")
        )}
      >
        {title && (
          <div
            className={clsx(
              "modal-header",
              parseClassName<classNamePrefix>(className, "header")
            )}
          >
            <div>
              <h6 className="text-lg font-semibold text-foreground">{title}</h6>
              <p className="text-sm text-light-foreground leading-4 mt-1">
                {tip}
              </p>
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
