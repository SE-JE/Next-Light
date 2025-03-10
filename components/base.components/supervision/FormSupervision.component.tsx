import React, { ReactNode, useEffect, useState } from "react";
import {
  InputCheckboxComponent,
  InputCheckboxPropsType,
  InputComponent,
  InputCurrencyComponent,
  InputCurrencyPropsType,
  InputDateComponent,
  InputDatePropsType,
  InputNumberComponent,
  InputNumberPropsType,
  InputPropsType,
  InputRadioComponent,
  InputRadioPropsType,
  SelectComponent,
  SelectPropsType,
} from "../input";
import {
  cn,
  pcn,
  PostPropsType,
  useForm,
  ValidationRulesType,
} from "@/helpers";
import { ButtonComponent } from "../button";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ModalConfirmComponent, ToastComponent } from "../modal";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

type CT = "base" | "title" | "submit";

type customConstructionType = ({
  formControl,
  values,
  setValues,
  registers,
  setRegisters,
  errors,
  setErrors,
}: {
  formControl: (name: string) => {
    onChange?: (value: any) => void;
    register?: (regName: string, reqValidation: ValidationRulesType) => void;
    value?: any;
    error?: string;
  };
  values?: { name: string; value?: any }[];
  setValues?: (values: { name: string; value?: any }[]) => void;
  errors?: { name: string; error?: any }[];
  setErrors?: (values: { name: string; error?: any }[]) => void;
  registers?: { name: string; validations?: ValidationRulesType | undefined }[];
  setRegisters?: (
    registers: {
      name: string;
      validations?: ValidationRulesType | undefined;
    }[],
  ) => void;
}) => ReactNode;

type ConstructionMap = {
  default: InputPropsType;
  check: InputCheckboxPropsType;
  currency: InputCurrencyPropsType;
  date: InputDatePropsType;
  // file: InputFileProps;
  // image: InputImageProps;
  // map: InputMapProps;
  number: InputNumberPropsType;
  // time: InputTimeProps;
  radio: InputRadioPropsType;
  select: SelectPropsType;
  custom: customConstructionType;
};

type TypeKeys = keyof ConstructionMap;

export type FormType<
  T extends TypeKeys =
    | "default"
    | "check"
    | "currency"
    | "date"
    | "number"
    | "radio"
    | "select"
    | "custom",
> = {
  construction?: ConstructionMap[T];
  type?: T;

  /** Use responsive class with: "sm::", "md::", "lg::", "xl::". */
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | string;
  className?: string;
};

export type formSupervisionPropsType = {
  title?: string;
  forms: FormType[];
  confirmation?: boolean;
  defaultValue?: object | null;

  submitControl: PostPropsType;
  footerControl?: () => ReactNode;

  onSuccess?: () => void;
  onError?: (code: number) => void;

  /** Use custom class with: "title::", "submit::". */
  className?: string;
};

export default function FormSupervisionComponent({
  title,
  forms,
  submitControl,
  confirmation,
  defaultValue,
  onSuccess,
  onError,
  footerControl,
  className = "",
}: formSupervisionPropsType) {
  const [modal, setModal] = useState<boolean | "success" | "failed">(false);
  const [fresh, setFresh] = useState<boolean>(true);

  const [
    {
      formControl,
      values,
      setValues,
      errors,
      setErrors,
      setDefaultValues,
      registers,
      setRegisters,
      submit,
      loading,
      confirm,
    },
  ] = useForm(
    submitControl,
    confirmation,
    () => {
      onSuccess?.();
      setModal("success");
      setFresh(false);
      setTimeout(() => {
        setFresh(true);
      }, 500);
    },
    (code: number) => {
      onError?.(code);

      if (code == 422) {
        confirm.onClose();
      } else {
        setModal("failed");
      }
    },
  );

  useEffect(() => {
    setFresh(false);
    setTimeout(() => {
      setFresh(true);
    }, 500);
  }, [forms]);

  useEffect(() => {
    if (defaultValue) {
      setDefaultValues(defaultValue);
    } else {
      setDefaultValues({});
      setFresh(false);
      setTimeout(() => {
        setFresh(true);
      }, 500);
    }
  }, [defaultValue]);

  const generateColClass = (col: string | number) => {
    return String(col)
      .split(" ")
      .map((c) =>
        c.includes(":") ? `${c.replace(":", ":col-span-")}` : `col-span-${c}`,
      )
      .join(" ");
  };

  return (
    <>
      {title && (
        <h4
          className={cn(
            "text-lg font-semibold mb-4",
            pcn<CT>(className, "title"),
          )}
        >
          {title}
        </h4>
      )}

      <form
        className={cn("grid grid-cols-12 gap-4", pcn<CT>(className, "base"))}
        onSubmit={submit}
      >
        {fresh &&
          forms.map((form, key) => {
            const inputType = form.type || "default";

            return (
              <React.Fragment key={key}>
                <div
                  className={cn(
                    form?.className,
                    generateColClass(form?.col || "12"),
                  )}
                >
                  {inputType == "custom" ? (
                    <>
                      {(form.construction as customConstructionType)?.({
                        formControl,
                        values,
                        setValues,
                        registers,
                        setRegisters,
                        errors,
                        setErrors,
                      })}
                    </>
                  ) : inputType == "check" ? (
                    <InputCheckboxComponent
                      {...(form.construction as InputCheckboxPropsType)}
                      {...formControl(form.construction?.name || "input_name")}
                    />
                  ) : inputType == "currency" ? (
                    <InputCurrencyComponent
                      {...(form.construction as InputNumberPropsType)}
                      {...formControl(form.construction?.name || "input_name")}
                      autoFocus={key == 0}
                    />
                  ) : inputType == "date" ? (
                    <InputDateComponent
                      {...(form.construction as InputDatePropsType)}
                      {...formControl(form.construction?.name || "input_name")}
                      autoFocus={key == 0}
                    />
                  ) : inputType == "number" ? (
                    <InputNumberComponent
                      {...(form.construction as InputNumberPropsType)}
                      {...formControl(form.construction?.name || "input_name")}
                      autoFocus={key == 0}
                    />
                  ) : inputType == "radio" ? (
                    <InputRadioComponent
                      {...(form.construction as InputRadioPropsType)}
                      {...formControl(form.construction?.name || "input_name")}
                    />
                  ) : inputType == "select" ? (
                    <SelectComponent
                      {...(form.construction as SelectPropsType)}
                      {...formControl(form.construction?.name || "input_name")}
                      autoFocus={key == 0}
                    />
                  ) : (
                    <InputComponent
                      {...(form.construction as InputPropsType)}
                      {...formControl(form.construction?.name || "input_name")}
                      autoFocus={key == 0}
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        <div className="col-span-12">
          {footerControl?.() || (
            <>
              <div className="flex justify-end mt-4">
                <ButtonComponent
                  type="submit"
                  label="Simpan"
                  icon={faSave}
                  loading={loading}
                  className={pcn<CT>(className, "submit")}
                />
              </div>
            </>
          )}
        </div>
      </form>

      <ModalConfirmComponent
        show={confirm.show}
        onClose={() => confirm.onClose()}
        icon={faQuestionCircle}
        title="Yakin"
        submitControl={{
          onSubmit: () => confirm?.onConfirm(),
          paint: "primary",
        }}
      >
        <p className="px-2 pb-2 text-sm text-center">
          Yakin semua data sudah benar?
        </p>
      </ModalConfirmComponent>

      <ToastComponent
        show={modal == "failed"}
        onClose={() => setModal(false)}
        title="Gagal"
        className="!border-danger header::text-danger"
      >
        <p className="px-3 pb-2 text-sm">
          Data gagal di simpan, cek data dan koneksi internet dan coba kembali!
        </p>
      </ToastComponent>

      <ToastComponent
        show={modal == "success"}
        onClose={() => setModal(false)}
        title="Berhasil"
        className="!border-success header::text-success"
      >
        <p className="px-3 pb-2 text-sm">Data berhasil di simpan!</p>
      </ToastComponent>
    </>
  );
}
