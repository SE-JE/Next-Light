import { ReactNode, useEffect } from "react";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { ButtonComponent } from "../button";
import { parseClassName } from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
type classNamePrefix = "base" | "backdrop" | "header" | "footer";

export type modalConfirmProps = {
  show: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children?: any;
  icon?: any;
  footer?: string | ReactNode;
  className?: string;
};

export function ModalConfirmComponent({
  show,
  onClose,
  title,
  children,
  icon,
  footer,
  className = "",
}: modalConfirmProps) {
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
          "w-[calc(100vw-2rem)] md:w-[50vw] max-w-[300px]",
          !show && "-translate-y-full opacity-0 scale-y-0",
          parseClassName<classNamePrefix>(className, "base")
        )}
      >
        {title && (
          <div
            className={clsx(
              "flex flex-col gap-4 items-center",
              parseClassName<classNamePrefix>(className, "header")
            )}
          >
            <div className="mt-4">
              <FontAwesomeIcon
                icon={icon || faQuestion}
                className={`text-xl text-warning`}
              />
            </div>

            <h6 className="text-lg font-semibold text-foreground">{title}</h6>
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

        <div className="flex justify-center gap-4 py-4">
          <ButtonComponent
            label="Cancel"
            variant="simple"
            onClick={() => onClose()}
            className="text-foreground"
          />
          <ButtonComponent label={"Yes"} paint={"warning"} />
        </div>
      </div>
    </>
  );
}
