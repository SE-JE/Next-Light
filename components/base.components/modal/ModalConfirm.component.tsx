import { ReactNode, useEffect } from "react";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { ButtonComponent } from "../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn, pcn } from "@/helpers";

type CT = "base" | "backdrop" | "header" | "footer";

export type ModalConfirmPropsType = {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string | ReactNode;
  children?: any;
  icon?: any;
  footer?: string | ReactNode;

  /** Use custom class with: "backdrop::", "header::", "footer::". */
  className?: string;
};

export function ModalConfirmComponent({
  show,
  onClose,
  onSubmit,
  title,
  children,
  icon,
  footer,
  className = "",
}: ModalConfirmPropsType) {
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
        className={cn(
          "modal-backdrop",
          !show && "opacity-0 scale-0 -translate-y-full",
          pcn<CT>(className, "backdrop")
        )}
        onClick={() => onClose()}
      ></div>

      <div
        className={cn(
          "modal",
          "w-[calc(100vw-2rem)] md:w-[50vw] max-w-[300px]",
          !show && "-translate-y-full opacity-0 scale-y-0",
          pcn<CT>(className, "base")
        )}
      >
        {title && (
          <div
            className={cn(
              "flex flex-col gap-4 items-center",
              pcn<CT>(className, "header")
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
          <div className={cn("modal-footer", pcn<CT>(className, "footer"))}>
            {show && footer}
          </div>
        )}

        <div className="flex justify-center gap-4 py-4">
          <ButtonComponent
            label="Batal"
            variant="simple"
            onClick={() => onClose()}
            className="text-foreground"
          />
          <ButtonComponent
            label={"Konfirmasi"}
            paint={"warning"}
            onClick={onSubmit}
          />
        </div>
      </div>
    </>
  );
}
