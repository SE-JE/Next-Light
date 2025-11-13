import { ReactNode, useEffect, useState } from "react";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api, ApiType, cn, pcn } from "@utils";
import { ToastComponent, ButtonComponent, ButtonProps } from "@components";



type CT = "base" | "backdrop" | "header" | "footer";

export interface ModalConfirmProps {
  show            :  boolean;
  onClose         :  () => void;
  title          ?:  string | ReactNode;
  children       ?:  any;
  icon           ?:  any;
  footer         ?:  string | ReactNode;
  submitControl  ?:  ButtonProps & {
    onSubmit     ?:  ApiType | (() => void);
    onSuccess    ?:  () => void;
    onError      ?:  () => void;
  };

  /** Use custom class with: "backdrop::", "header::", "footer::". */
  className  ?:  string;
};



export function ModalConfirmComponent({
  show,
  title,
  children,
  icon,
  footer,

  submitControl,
  onClose,

  className = "",
}: ModalConfirmProps) {
  const [toast, setToast] = useState<boolean | "success" | "failed">(false);
  const [loading, setLoading] = useState(false);

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
          "modal rounded-[4px] border-t-4 !border-primary",
          "w-[calc(100vw-2rem)] md:w-[50vw] max-w-[300px]",
          !show && "-translate-y-full opacity-0 scale-y-0",
          pcn<CT>(className, "base")
        )}
      >
        {title && (
          <div
            className={cn(
              "flex flex-col gap-2 items-center text-primary",
              pcn<CT>(className, "header")
            )}
          >
            <div className="mt-6">
              <FontAwesomeIcon
                icon={icon || faQuestion}
                className={`text-xl`}
              />
            </div>

            <h6 className="font-semibold text-lg">{title}</h6>
          </div>
        )}

        {show && children}

        {footer && (
          <div className={cn("modal-footer", pcn<CT>(className, "footer"))}>
            {show && footer}
          </div>
        )}

        <div className="flex justify-center pt-6">
          <ButtonComponent
            label="Batal"
            variant="simple"
            onClick={() => onClose()}
            className="text-foreground bg-background rounded-none"
            // size="sm"
            block
          />
          <ButtonComponent
            label={"Konfirmasi"}
            loading={loading}
            onClick={async () => {
              if(!submitControl?.onSubmit) return;

              setLoading(true);
              if (typeof submitControl?.onSubmit == "function") {
                submitControl?.onSubmit?.();
              } else {
                const response = await api(submitControl?.onSubmit as ApiType);

                if (response?.status == 200 || response?.status == 201) {
                  setToast("success");
                  submitControl?.onSuccess?.();
                  setLoading(false);
                } else {
                  setToast("failed");
                  submitControl?.onError?.();
                  setLoading(false);
                }
              }
            }}
            // size="sm"
            className="rounded-none"
            block
            {...submitControl}
          />
        </div>
      </div>

      <ToastComponent
        show={toast == "failed"}
        onClose={() => setToast(false)}
        title="Gagal"
        className="!border-danger header::text-danger"
      >
        <p className="px-3 pb-2 text-sm">
          Gagal {title || ""}! cek data dan koneksi internet dan coba kembali!
        </p>
      </ToastComponent>

      <ToastComponent
        show={toast == "success"}
        onClose={() => setToast(false)}
        title="Berhasil"
        className="!border-success header::text-success"
      >
        <p className="px-3 pb-2 text-sm">Berhasil {title || ""}!</p>
      </ToastComponent>
    </>
  );
}
