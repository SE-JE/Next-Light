"use client"

import { ReactNode, useEffect, useState } from "react";
import { api, ApiType, cn, pcn, useInputHandler, useValidation, validation, ValidationRules } from "@utils";
import { CheckboxComponent } from "@components";



type CT = "label" | "tip" | "error" | "input" | "icon";

export interface InputCheckboxOptionProps {
  value: string | number;
  label: string;
};

export interface InputCheckboxProps {
  name       :  string;
  label     ?:  string;
  tip       ?:  string | ReactNode;
  vertical  ?:  boolean;

  value     ?:  string[] | number[];
  disabled  ?:  boolean;
  invalid   ?:  string;

  options              ?:  InputCheckboxOptionProps[];
  serverOptionControl  ?:  ApiType;
  customOptions        ?:  any;
 validations           ?:  ValidationRules;
  
  onChange             ?:  (value: string[] | number[]) => any;
  register             ?:  (name: string, validations?: ValidationRules) => void;

  /** Use custom class with: "label::", "tip::", "error::", "icon::". */
  className            ?: string;
  
  /** Use custom class with: "label::", "checked::", "error::". */
  classNameCheckbox    ?: string;
};



export function InputCheckboxComponent({
  name,
  label,
  tip,
  vertical,
  className="",
  classNameCheckbox="",

  value,
  disabled,
  invalid,

  options,
  serverOptionControl,
  customOptions,
  validations,

  register,
  onChange,
}: InputCheckboxProps) {

  const [dataOptions, setDataOptions]  =  useState<InputCheckboxOptionProps[]>([]);
  const [loading, setLoading]          =  useState(false);


  // =========================>
  // ## initial
  // =========================>
  const inputHandler = useInputHandler(name, value, validations, register, false)


  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage] = useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


  // =========================>
  // ## fetch option
  // =========================>
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      const mutateOptions = await api(serverOptionControl || {});
      if (mutateOptions?.status == 200) {
        customOptions ? setDataOptions([customOptions, ...mutateOptions.data]) : setDataOptions(mutateOptions.data);
        setLoading(false);
      }
    };

    if (serverOptionControl?.path || serverOptionControl?.url) {
      fetchOptions();
    } else {
      !options && setDataOptions([]);
    }
  }, [serverOptionControl?.path, serverOptionControl?.url]);


  return (
    <>
      <div className="w-full relative flex flex-col gap-y-0.5">
        <label
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            disabled && "opacity-50",
            disabled && pcn<CT>(className, "label", "disabled"),
            invalidMessage && "text-danger",
            invalidMessage && pcn<CT>(className, "label", "focus"),
          )}
        >
          {label}
          {validations && validation.hasRules(validations, "required") && <span className="text-danger">*</span>}
        </label>

        {tip && (
          <small
            className={cn(
              "input-tip",
              pcn<CT>(className, "tip"),
              disabled && "opacity-60",
              disabled && pcn<CT>(className, "tip", "disabled"),
            )}
          >{tip}</small>
        )}

        <div
          className={cn(
            `input overflow-auto input-scroll w-full flex flex-nowrap gap-y-2 gap-4`,
            vertical && "flex-col flex-wrap",
            pcn<CT>(className, "input"),
            invalidMessage && "input-error",
            invalidMessage && pcn<CT>(className, "input", "error"),
          )}
        >
          {loading && (vertical ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3]).map((_, key) => {
            return <div key={key} className="w-1/3 h-6 rounded-lg"></div>;
          })}

          {(options || dataOptions) && (options || dataOptions)?.map((option, key) => {
            const checked = Array().concat(inputHandler.value).find((val) => val == option.value);

            return (
              <CheckboxComponent
                key={key}
                label={option.label}
                name={`option[${option.value}]#${name}`}
                checked={!!checked}
                disabled={disabled}
                className={classNameCheckbox}
                onChange={() => {
                  const newVal = (Array.isArray(inputHandler.value) ? inputHandler.value : [])
                    .filter((val) => val !== option.value)
                    .concat(checked ? [] : [option.value]);

                  inputHandler.setValue(newVal);
                  onChange?.(newVal);
                }}
              />
            );
          })}
        </div>

        {invalidMessage && (
          <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
        )}
      </div>
    </>
  );
}
