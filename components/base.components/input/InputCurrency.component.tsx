"use client"

import { InputHTMLAttributes, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn, conversion, pcn, useInputHandler, useInputRandomId, useValidation, validation, ValidationRules } from "@utils";



type CT = "label" | "tip" | "error" | "input" | "icon";

export interface InputCurrencyProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label      ?:  string;
  tip        ?:  string | ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  number;
  invalid      ?:  string;
  validations  ?: ValidationRules;
  format       ?:  {
    locale     ?:  string;
    currency   ?:  string;
  };

  onChange  ?:  (value: number) => any;
  register  ?:  (name: string, validations?: ValidationRules) => void;

  /** Use custom class with: "label::", "tip::", "error::", "icon::". */
  className  ?:  string;
}



export function InputCurrencyComponent({
  label,
  tip,
  leftIcon,
  rightIcon,

  value,
  invalid,
  
  validations,
  format,

  register,
  onChange,
  
  className = "",
  ...props
}: InputCurrencyProps) {

  // =========================>
  // ## Initial
  // =========================>
  const inputHandler = useInputHandler(props.name, value, validations, register, false)
  const randomId = useInputRandomId()


  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage] = useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


  return (
    <div className="relative flex flex-col gap-y-0.5">
      <label
        htmlFor={randomId}
        className={cn(
          "input-label",
          pcn<CT>(className, "label"),
          props.disabled && "opacity-50",
          props.disabled && pcn<CT>(className, "label", "disabled"),
          inputHandler.focus && "text-primary",
          inputHandler.focus && pcn<CT>(className, "label", "focus"),
          !!invalidMessage && "text-danger",
          !!invalidMessage && pcn<CT>(className, "label", "focus"),
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
            props.disabled && "opacity-60",
            props.disabled && pcn<CT>(className, "tip", "disabled"),
          )}
        >{tip}</small>
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
            !!invalidMessage && "input-error",
            !!invalidMessage && pcn<CT>(className, "input", "error"),
          )}
          value={inputHandler.value ? conversion.currency(inputHandler.value, format?.locale, format?.currency) : ""}
          onChange={(e) => {
            const val = Number(e.target.value.replace(/[^0-9]/g,""));

            inputHandler.setValue(val);
            inputHandler.setIdle(false);
            
            onChange?.(val);
          }}
          onFocus={(e) => {
            props.onFocus?.(e);
            inputHandler.setFocus(true);
          }}
          onBlur={(e) => {
            props.onBlur?.(e);
            setTimeout(() => inputHandler.setFocus(false), 100);
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
              inputHandler.focus && "text-primary",
              inputHandler.focus && pcn<CT>(className, "icon", "focus"),
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
              inputHandler.focus && "text-primary",
              inputHandler.focus && pcn<CT>(className, "icon", "focus"),
            )}
            icon={rightIcon}
          />
        )}
      </div>

      {invalidMessage && (
        <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
      )}
    </div>
  );
}
