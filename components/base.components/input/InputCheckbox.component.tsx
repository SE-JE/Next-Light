import React, { ReactNode, useEffect, useState } from "react";
import {
  get,
  getProps,
  parseClassName,
  useValidationHelper,
  ValidationRules,
} from "../../../helpers";
import { CheckboxComponent } from "./Checkbox.component";
import styles from "./input.module.css";
import clsx from "clsx";

type classNamePrefix = "label" | "tip" | "error" | "input" | "icon";

export type inputCheckboxOptionProps = {
  value: string | number;
  label: string;
};

export type inputCheckboxProps = {
  name: string;
  label?: string;
  tip?: string | ReactNode;
  vertical?: boolean;

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className?: string;
  /** Use custom class with: "label::", "checked::", "error::". */
  classNameCheckbox?: string;

  value?: string[] | number[];
  disabled?: boolean;
  error?: string;

  options?: inputCheckboxOptionProps[];
  serverOptionControl?: getProps;
  customOptions?: any;
  validations?: ValidationRules;

  onChange?: (value: string[] | number[]) => any;
  register?: (name: string, validations?: ValidationRules) => void;
};

export function InputCheckboxComponent({
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
}: inputCheckboxProps) {
  const [isInvalid, setIsInvalid] = useState("");
  const [inputValue, setInputValue] = useState<string[] | number[]>([]);
  const [dataOptions, setDataOptions] = useState<inputCheckboxProps[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================>
  // ## initial
  // =========================>
  useEffect(() => {
    register?.(name, validations);
  }, [register, name, validations]);

  useEffect(() => {
    if (value) {
      setInputValue(value);
    } else {
      setInputValue([]);
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

  let dummy = vertical ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3];

  return (
    <>
      <div className="w-full relative flex flex-col gap-y-0.5">
        <label
          className={clsx(
            "input-label",
            parseClassName<classNamePrefix>(className, "label"),
            disabled && "opacity-50",
            disabled &&
              parseClassName<classNamePrefix>(className, "label", "disabled"),
            isInvalid && "text-danger",
            isInvalid &&
              parseClassName<classNamePrefix>(className, "label", "focus")
          )}
        >
          {label}
        </label>

        {tip && (
          <small
            className={clsx(
              "input-tip",
              parseClassName<classNamePrefix>(className, "tip"),
              disabled && "opacity-60",
              disabled &&
                parseClassName<classNamePrefix>(className, "tip", "disabled")
            )}
          >
            {tip}
          </small>
        )}

        <div
          className={clsx(
            `input overflow-auto input-scroll w-full flex flex-nowrap gap-y-2 gap-4 ${
              vertical && `flex-col flex-wrap ${vertical}`
            }`,
            parseClassName<classNamePrefix>(className, "input"),
            isInvalid && "input-error",
            isInvalid &&
              parseClassName<classNamePrefix>(className, "input", "error")
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
              const checked = Array()
                .concat(inputValue)
                .find((val) => val == option.value);
              return (
                <CheckboxComponent
                  key={key}
                  label={option.label}
                  name={`option[${option.value}]#${name}`}
                  checked={!!checked}
                  disabled={disabled}
                  className={classNameCheckbox}
                  onChange={() => {
                    let newVal: string[] | number[] = [];
                    if (checked) {
                      newVal = Array()
                        .concat(inputValue)
                        .filter((val) => val != option.value);
                    } else {
                      newVal = [
                        ...Array()
                          .concat(inputValue)
                          .filter((val) => val != option.value),
                        option.value,
                      ];
                    }

                    setInputValue(newVal);
                    onChange?.(newVal);
                  }}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}
