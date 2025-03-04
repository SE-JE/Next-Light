import { ReactNode } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { IconButtonComponent } from "../button";
import { cn, pcn } from "@/helpers";

type CT = "base" | "backdrop" | "header" | "footer";

export type ToastPropsType = {
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
}: ToastPropsType) {
  return (
    <>
      <div
        className={cn(
          "toast",
          "w-[calc(100vw-2rem)] md:w-[50vw] max-w-[300px]",
          !show && "translate-y-full opacity-0 scale-y-0",
          pcn<CT>(className, "base")
        )}
      >
        {title && (
          <div
            className={cn(
              "p-2 flex justify-between items-center",
              pcn<CT>(className, "header")
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
          <div className={cn("modal-footer", pcn<CT>(className, "footer"))}>
            {show && footer}
          </div>
        )}
      </div>
    </>
  );
}
