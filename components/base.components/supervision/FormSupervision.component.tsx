import React, { ReactNode, useEffect, useState } from "react";
import {
  InputCheckboxComponent,
  inputCheckboxProps,
  InputComponent,
  InputCurrencyComponent,
  inputCurrencyProps,
  InputDateComponent,
  inputDateProps,
  InputNumberComponent,
  inputNumberProps,
  inputProps,
  InputRadioComponent,
  inputRadioProps,
  SelectComponent,
  SelectProps,
} from "../input";
import { parseClassName, postProps, useForm, ValidationRules } from "@/helpers";
import { ButtonComponent } from "../button";
import { faQuestionCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { ModalConfirmComponent, ToastComponent } from "../modal";

type classNamePrefix = "base" | "title" | "submit";

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
    register?: (regName: string, reqValidation: ValidationRules) => void;
    value?: any;
    error?: string;
  };
  values?: { name: string; value?: any }[];
  setValues?: (values: { name: string; value?: any }[]) => void;
  errors?: { name: string; error?: any }[];
  setErrors?: (values: { name: string; error?: any }[]) => void;
  registers?: { name: string; validations?: ValidationRules | undefined }[];
  setRegisters?: (
    registers: { name: string; validations?: ValidationRules | undefined }[]
  ) => void;
}) => ReactNode;

type ConstructionMap = {
  default: inputProps;
  check: inputCheckboxProps;
  currency: inputCurrencyProps;
  date: inputDateProps;
  // file: InputFileProps;
  // image: InputImageProps;
  // map: InputMapProps;
  number: inputNumberProps;
  // time: InputTimeProps;
  radio: inputRadioProps;
  select: SelectProps;
  custom: customConstructionType;
};

type TypeKeys = keyof ConstructionMap;

export type FormProps<
  T extends TypeKeys =
    | "default"
    | "check"
    | "currency"
    | "date"
    | "number"
    | "radio"
    | "select"
    | "custom"
> = {
  construction?: ConstructionMap[T];
  /** Use responsive class with: "sm::", "md::", "lg::", "xl::". */
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | string;
  type?: T;
  className?: string;
};

export type formSupervisionProps = {
  title?: string;
  forms: FormProps[];
  submitControl: postProps;
  confirmation?: boolean;
  defaultValue?: object | null;
  /** Use custom class with: "title::", "submit::". */
  className?: string;
  onSuccess?: () => void;
  onError?: (code: number) => void;
  footerControl?: () => ReactNode;
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
}: formSupervisionProps) {
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
    }
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <>
      {title && (
        <h4
          className={clsx(
            "text-lg font-semibold mb-4",
            parseClassName<classNamePrefix>(className, "title")
          )}
        >
          {title}
        </h4>
      )}

      <form
        className={clsx(
          "grid grid-cols-12 gap-3",
          parseClassName<classNamePrefix>(className, "base")
        )}
        onSubmit={submit}
      >
        {fresh &&
          forms.map((form, key) => {
            const inputType = form.type || "default";
            return (
              <React.Fragment key={key}>
                <div
                  className={`${form?.className}`}
                  style={{
                    gridColumn: `span ${form?.col ? form.col : "12"} / span ${
                      form?.col ? form.col : "12"
                    }`,
                  }}
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
                      {...(form.construction as inputCheckboxProps)}
                      {...formControl(form.construction?.name || "input_name")}
                    />
                  ) : inputType == "currency" ? (
                    <InputCurrencyComponent
                      {...(form.construction as inputNumberProps)}
                      {...formControl(form.construction?.name || "input_name")}
                      autoFocus={key == 0}
                    />
                  ) : inputType == "date" ? (
                    <InputDateComponent
                      {...(form.construction as inputDateProps)}
                      {...formControl(form.construction?.name || "input_name")}
                      autoFocus={key == 0}
                    />
                  ) : inputType == "number" ? (
                    <InputNumberComponent
                      {...(form.construction as inputNumberProps)}
                      {...formControl(form.construction?.name || "input_name")}
                      autoFocus={key == 0}
                    />
                  ) : inputType == "radio" ? (
                    <InputRadioComponent
                      {...(form.construction as inputRadioProps)}
                      {...formControl(form.construction?.name || "input_name")}
                    />
                  ) : inputType == "select" ? (
                    <SelectComponent
                      {...(form.construction as SelectProps)}
                      {...formControl(form.construction?.name || "input_name")}
                      autoFocus={key == 0}
                    />
                  ) : (
                    <InputComponent
                      {...(form.construction as inputProps)}
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
                  className={parseClassName<classNamePrefix>(
                    className,
                    "submit"
                  )}
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
        onSubmit={() => confirm.onConfirm()}
      >
        Apakah data yang di masukkan sudah benar?
      </ModalConfirmComponent>

      <ToastComponent
        show={modal == "failed"}
        onClose={() => setModal(false)}
        title="Gagal"
      >
        Data gagal di simpan, cek data dan koneksi internet dan coba kembali!
      </ToastComponent>

      <ToastComponent
        show={modal == "success"}
        onClose={() => setModal(false)}
        title="Berhasil"
      >
        Data berhasil di simpan!
      </ToastComponent>
    </>
  );
}
