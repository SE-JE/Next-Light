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

function formatCurrency(value: string, locale = "id-ID", currency = "IDR") {
  const numberValue = parseFloat(value.replace(/[^0-9]/g, "")) || 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(numberValue);
}

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
          parseClassName<classNamePrefix>(className, "label")
        )}
      >
        {label}
      </label>

      {tip && (
        <small
          className={clsx(
            "input-tip",
            parseClassName<classNamePrefix>(className, "tip")
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
            parseClassName<classNamePrefix>(className, "input")
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
              parseClassName<classNamePrefix>(className, "icon")
            )}
            icon={leftIcon}
          />
        )}
        {rightIcon && (
          <FontAwesomeIcon
            className={clsx(
              "right-4 input-icon",
              parseClassName<classNamePrefix>(className, "icon")
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
