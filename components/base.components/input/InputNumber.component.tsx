import { cn, pcn, useValidationHelper, ValidationRulesType } from "@/helpers";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";

type CT =
  | "label"
  | "tip"
  | "error"
  | "input"
  | "icon"
  | "suggest"
  | "suggest-item";

export interface InputNumberPropsType
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  tip?: string | ReactNode;
  leftIcon?: any;
  rightIcon?: any;

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className?: string;

  value?: number;
  error?: string;

  validations?: ValidationRulesType;

  onChange?: (value: number) => any;
  register?: (name: string, validations?: ValidationRulesType) => void;

  min?: number;
  max?: number;
}

export function InputNumberComponent({
  label,
  tip,
  leftIcon,
  rightIcon,
  className = "",
  value,
  error,
  validations,
  register,
  onChange,
  min,
  max,
  ...props
}: InputNumberPropsType) {
  const [inputValue, setInputValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isInvalid, setIsInvalid] = useState("");
  const [isFirst, setIsFirst] = useState(true);

  // =========================>
  // ## initial
  // =========================>
  useEffect(() => {
    register?.(props.name || "", validations);
  }, [props.name, validations]);

  const [randomId, setRandomId] = useState("");

  useEffect(() => {
    setRandomId(Math.random().toString(36).substring(7));
  }, []);

  // =========================>
  // ## invalid handler
  // =========================>
  const [errorMessage] = useValidationHelper(
    {
      value: inputValue,
      rules: validations,
    },
    isFirst,
  );

  useEffect(() => {
    setIsInvalid(errorMessage || error || "");
  }, [error, errorMessage]);

  // =========================>
  // ## change value handler
  // =========================>
  useEffect(() => {
    setInputValue(String(value || ""));
    value && setIsFirst(false);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const regex = /^-?\d*\.?\d*$/;
    if (regex.test(newValue)) {
      setInputValue(newValue);
      setIsFirst(false);
      setIsInvalid("");
      onChange?.(Number(newValue));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    props.onBlur?.(e);
    setTimeout(() => setIsFocus(false), 100);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    props.onFocus?.(e);
    setIsFocus(true);
  };

  return (
    <>
      <div className="relative flex flex-col gap-y-0.5">
        <label
          htmlFor={randomId}
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            props.disabled && "opacity-50",
            props.disabled && pcn<CT>(className, "label", "disabled"),
            isFocus && "text-primary",
            isFocus && pcn<CT>(className, "label", "focus"),
            isInvalid && "text-danger",
            isInvalid && pcn<CT>(className, "label", "focus"),
          )}
        >
          {label}
          {validations?.required && <span className="text-danger">*</span>}
        </label>

        {tip && (
          <small
            className={cn(
              "input-tip",
              pcn<CT>(className, "tip"),
              props.disabled && "opacity-60",
              props.disabled && pcn<CT>(className, "tip", "disabled"),
            )}
          >
            {tip}
          </small>
        )}

        <div className="relative">
          <input
            {...props}
            id={randomId}
            className={cn(
              "input",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              pcn<CT>(className, "input"),
              isInvalid && "input-error",
              isInvalid && pcn<CT>(className, "input", "error"),
            )}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="off"
            min={min}
            max={max}
          />

          {leftIcon && (
            <FontAwesomeIcon
              className={cn(
                "left-4 input-icon ",
                pcn<CT>(className, "icon"),
                props.disabled && "opacity-60",
                props.disabled && pcn<CT>(className, "icon", "disabled"),
                isFocus && "text-primary",
                isFocus && pcn<CT>(className, "icon", "focus"),
              )}
              icon={leftIcon}
            />
          )}

          <label
            htmlFor={randomId}
            className={cn(
              "right-4 input-icon",
              pcn<CT>(className, "icon"),
              props.disabled && "opacity-60",
              props.disabled && pcn<CT>(className, "icon", "disabled"),
              isFocus && "text-primary",
              isFocus && pcn<CT>(className, "icon", "focus"),
            )}
          >
            <div className="flex flex-col">
              <FontAwesomeIcon
                className={`
                  text-light-foreground hover:text-primary -mb-1
                `}
                icon={faSortUp}
                onClick={() => setInputValue(String(Number(inputValue) + 1))}
              />
              <FontAwesomeIcon
                className={`
                  text-light-foreground hover:text-primary -mt-1
              `}
                icon={faSortDown}
                onClick={() => setInputValue(String(Number(inputValue) - 1))}
              />
            </div>
          </label>
        </div>

        {isInvalid && (
          <small
            className={cn("input-error-message", pcn<CT>(className, "error"))}
          >
            {isInvalid}
          </small>
        )}
      </div>
    </>
  );
}
