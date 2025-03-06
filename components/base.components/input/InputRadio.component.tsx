import React, { ReactNode, useEffect, useState } from "react";
import {
  cn,
  get,
  GetPropsType,
  pcn,
  useValidationHelper,
  ValidationRulesType,
} from "../../../helpers";
import { RadioComponent } from "./Radio.component";

type CT = "label" | "tip" | "error" | "input" | "icon";

export type InputRadioOptionPropsType = {
  value: string | number;
  label: string;
};

export type InputRadioPropsType = {
  name: string;
  label?: string;
  tip?: string | ReactNode;
  vertical?: boolean;

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className?: string;
  /** Use custom class with: "label::", "checked::", "error::". */
  classNameCheckbox?: string;

  value?: string | number;
  disabled?: boolean;
  error?: string;

  options?: InputRadioOptionPropsType[];
  serverOptionControl?: GetPropsType;
  customOptions?: any;
  validations?: ValidationRulesType;

  onChange?: (value: string | number) => any;
  register?: (name: string, validations?: ValidationRulesType) => void;
};

export function InputRadioComponent({
  name,
  label,
  tip,
  vertical,
  className = "",
  classNameCheckbox = "",

  value,
  disabled,
  error,

  options,
  serverOptionControl,
  customOptions,
  validations,

  register,
  onChange,
}: InputRadioPropsType) {
  const [isInvalid, setIsInvalid] = useState("");
  const [inputValue, setInputValue] = useState<string | number>("");
  const [dataOptions, setDataOptions] = useState<InputRadioPropsType[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================>
  // ## initial
  // =========================>
  useEffect(() => {
    register?.(name || "", validations);
  }, [name, validations]);

  useEffect(() => {
    if (value) {
      setInputValue(value);
    } else {
      setInputValue("");
    }
  }, [value]);

  // =========================>
  // ## fetch option
  // =========================>
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      const mutateOptions = await get(serverOptionControl || {});
      if (mutateOptions?.status == 200) {
        customOptions
          ? setDataOptions([customOptions, ...mutateOptions.data])
          : setDataOptions(mutateOptions.data);
        setLoading(false);
      }
    };

    if (serverOptionControl?.path || serverOptionControl?.url) {
      fetchOptions();
    } else {
      !options && setDataOptions([]);
    }
  }, [serverOptionControl?.path, serverOptionControl?.url]);

  // =========================>
  // ## invalid handler
  // =========================>
  const [errorMessage] = useValidationHelper({
    value: inputValue,
    rules: validations,
  });

  useEffect(() => {
    setIsInvalid(errorMessage || error || "");
  }, [error, errorMessage]);

  const dummy = vertical ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3];

  return (
    <>
      <div className="w-full relative flex flex-col gap-y-0.5">
        <label
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            disabled && "opacity-50",
            disabled && pcn<CT>(className, "label", "disabled"),
            isInvalid && "text-danger",
            isInvalid && pcn<CT>(className, "label", "focus"),
          )}
        >
          {label}
        </label>

        {tip && (
          <small
            className={cn(
              "input-tip",
              pcn<CT>(className, "tip"),
              disabled && "opacity-60",
              disabled && pcn<CT>(className, "tip", "disabled"),
            )}
          >
            {tip}
          </small>
        )}

        <div
          className={cn(
            `input overflow-auto input-scroll w-full flex flex-nowrap gap-y-2 gap-4 ${
              vertical && `flex-col flex-wrap ${vertical}`
            }`,
            pcn<CT>(className, "input"),
            isInvalid && "input-error",
            isInvalid && pcn<CT>(className, "input", "error"),
          )}
        >
          {loading &&
            dummy.map((_, key) => {
              return (
                <>
                  <div
                    key={key}
                    className="w-1/3 h-6 skeleton-loading rounded-lg"
                  ></div>
                </>
              );
            })}
          {(options || dataOptions) &&
            (options || dataOptions)?.map((option, key) => {
              return (
                <RadioComponent
                  key={key}
                  label={option.label}
                  name={`option[${option.value}]#${name}`}
                  checked={inputValue == option.value}
                  disabled={disabled}
                  className={classNameCheckbox}
                  onChange={() => {
                    if (inputValue == option.value) {
                      setInputValue("");
                      onChange?.("");
                    } else {
                      setInputValue(option.value || "");
                      onChange?.(option.value || "");
                    }
                  }}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}
