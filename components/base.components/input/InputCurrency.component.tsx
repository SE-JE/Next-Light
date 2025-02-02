import {
  parseClassName,
  useValidationHelper,
  ValidationRules,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, {
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CurrencyFormatComponent } from "../format";

type classNamePrefix =
  | "label"
  | "tip"
  | "error"
  | "input"
  | "icon"
  | "suggest"
  | "suggest-item";

export interface inputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  tip?: string | ReactNode;
  leftIcon?: any;
  rightIcon?: any;
  className?: string;
  value?: string;
  error?: string;
  validations?: ValidationRules;
  onChange?: (value: string) => any;
  register?: (name: string, validations?: ValidationRules) => void;
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
}: inputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isInvalid, setIsInvalid] = useState("");
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    register?.(props.name || "", validations);
  }, [register, validations]);

  const randomId = useMemo(() => Math.random().toString(36).substring(7), []);

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
        className={clsx(
          "input-label",
          parseClassName<classNamePrefix>(className, "label"),
          props.disabled && "opacity-50",
          props.disabled &&
            parseClassName<classNamePrefix>(className, "label", "disabled"),
          isFocus && "text-primary",
          isFocus &&
            parseClassName<classNamePrefix>(className, "label", "focus"),
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
            props.disabled && "opacity-60",
            props.disabled &&
              parseClassName<classNamePrefix>(className, "tip", "disabled")
          )}
        >
          {tip}
        </small>
      )}

      <div className="relative">
        <input
          {...props}
          id={randomId}
          className={clsx(
            "input",
            leftIcon && "pl-12",
            rightIcon && "pr-12",
            parseClassName<classNamePrefix>(className, "input"),
            isInvalid && "input-error",
            isInvalid &&
              parseClassName<classNamePrefix>(className, "input", "error")
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
            className={clsx(
              "left-4 input-icon",
              parseClassName<classNamePrefix>(className, "icon"),
              props.disabled && "opacity-60",
              props.disabled &&
                parseClassName<classNamePrefix>(className, "icon", "disabled"),
              isFocus && "text-primary",
              isFocus &&
                parseClassName<classNamePrefix>(className, "icon", "focus")
            )}
            icon={leftIcon}
          />
        )}
        {rightIcon && (
          <FontAwesomeIcon
            className={clsx(
              "right-4 input-icon",
              parseClassName<classNamePrefix>(className, "icon"),
              props.disabled && "opacity-60",
              props.disabled &&
                parseClassName<classNamePrefix>(className, "icon", "disabled"),
              isFocus && "text-primary",
              isFocus &&
                parseClassName<classNamePrefix>(className, "icon", "focus")
            )}
            icon={rightIcon}
          />
        )}
      </div>

      {isInvalid && (
        <small
          className={clsx(
            "input-error-message",
            parseClassName<classNamePrefix>(className, "error")
          )}
        >
          {isInvalid}
        </small>
      )}
    </div>
  );
}
