import { cn, pcn, useValidationHelper, ValidationRulesType } from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { CurrencyFormatComponent } from "../formater-wrapper";

type CT =
  | "label"
  | "tip"
  | "error"
  | "input"
  | "icon"
  | "suggest"
  | "suggest-item";

export interface InputCurrencyPropsType
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  tip?: string | ReactNode;
  leftIcon?: any;
  rightIcon?: any;
  className?: string;
  value?: string;
  error?: string;
  validations?: ValidationRulesType;
  onChange?: (value: string) => any;
  register?: (name: string, validations?: ValidationRulesType) => void;
  format?: {
    locale?: string;
    currency?: string;
  };
}

export function InputCurrencyComponent({
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
  format,
  ...props
}: InputCurrencyPropsType) {
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

  const [errorMessage] = useValidationHelper(
    {
      value: inputValue,
      rules: validations,
    },
    isFirst
  );

  useEffect(() => {
    setIsInvalid(errorMessage || error || "");
  }, [error, errorMessage]);

  useEffect(() => {
    setInputValue(value || "");
    value && setIsFirst(false);
  }, [value]);

  return (
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
          isInvalid && pcn<CT>(className, "label", "focus")
        )}
      >
        {label}
      </label>

      {tip && (
        <small
          className={cn(
            "input-tip",
            pcn<CT>(className, "tip"),
            props.disabled && "opacity-60",
            props.disabled && pcn<CT>(className, "tip", "disabled")
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
            isInvalid && pcn<CT>(className, "input", "error")
          )}
          value={
            inputValue
              ? CurrencyFormatComponent(
                  inputValue,
                  format?.locale,
                  format?.currency
                )
              : ""
          }
          onChange={(e) => {
            const rawValue = e.target.value;
            setInputValue(rawValue);
            setIsFirst(false);
            setIsInvalid("");
            onChange?.(
              CurrencyFormatComponent(
                rawValue,
                format?.locale,
                format?.currency
              )
            );
          }}
          onFocus={(e) => {
            props.onFocus?.(e);
            setIsFocus(true);
          }}
          onBlur={(e) => {
            props.onBlur?.(e);
            setTimeout(() => setIsFocus(false), 100);
          }}
          autoComplete="off"
        />

        {leftIcon && (
          <FontAwesomeIcon
            className={cn(
              "left-4 input-icon",
              pcn<CT>(className, "icon"),
              props.disabled && "opacity-60",
              props.disabled && pcn<CT>(className, "icon", "disabled"),
              isFocus && "text-primary",
              isFocus && pcn<CT>(className, "icon", "focus")
            )}
            icon={leftIcon}
          />
        )}
        {rightIcon && (
          <FontAwesomeIcon
            className={cn(
              "right-4 input-icon",
              pcn<CT>(className, "icon"),
              props.disabled && "opacity-60",
              props.disabled && pcn<CT>(className, "icon", "disabled"),
              isFocus && "text-primary",
              isFocus && pcn<CT>(className, "icon", "focus")
            )}
            icon={rightIcon}
          />
        )}
      </div>

      {isInvalid && (
        <small
          className={cn("input-error-message", pcn<CT>(className, "error"))}
        >
          {isInvalid}
        </small>
      )}
    </div>
  );
}
