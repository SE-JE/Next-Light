import { useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { IconButtonComponent } from "../button";

export type modalProps = {
  title: string;
  show: boolean;
  onClose: () => void;
  width?: "sm" | "md" | "lg" | "xl";
  children?: any;
  tip?: string;
  footer?: any;
};

export function ModalComponent({
  title,
  show,
  onClose,
  width,
  children,
  tip,
  footer,
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
          !show && "opacity-0 scale-0 -translate-y-full"
        )}
        onClick={() => onClose()}
      ></div>

      <div
        className={clsx(
          "modal",
          "w-[calc(100vw-2rem)] md:w-[50vw] max-w-[500px]",
          !show && "-translate-y-full opacity-0 scale-y-0"
        )}
      >
        <div className={clsx("modal-header")}>
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

        {show && children}

        {footer && <div className={clsx("modal-footer")}>{show && footer}</div>}
      </div>
    </>
  );
}
