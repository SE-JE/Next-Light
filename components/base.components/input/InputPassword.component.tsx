"use client"

import { InputHTMLAttributes, ReactNode, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn, pcn, useInputHandler, useInputRandomId, useValidation, validation, ValidationRules } from "@utils";



type CT = "label" | "tip" | "error" | "base" | "icon";

export interface InputPasswordProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label      ?:  string;
  tip        ?:  string | ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  string;
  invalid      ?:  string;
  validations  ?:  ValidationRules;

  onChange  ?:  (value: string, confirm?: string) => any;
  register  ?:  (name: string, validations?: ValidationRules) => void;

  /** Use custom class with: "label::", "tip::", "error::", "icon::". */
  className  ?:  string;
}



export function InputPasswordComponent({
  label,
  tip,
  leftIcon,
  rightIcon,

  value,
  invalid,
  validations,

  register,
  onChange,

  className = "",
  ...props
}: InputPasswordProps) {
  const [password, setPassword]                =  useState("");
  const [confirmPassword, setConfirmPassword]  =  useState("");
  const [strength, setStrength]                =  useState<"weak" | "strong" | "excellent" | "">("");


  // =========================>
  // ## Initial
  // =========================>
  const inputHandler     =  useInputHandler(props.name, value, validations, register, false)
  const randomId         =  useInputRandomId()
  const randomConfirmId  =  useInputRandomId()


  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage]  =  useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


  // =========================>
  // ## Password strength handler
  // =========================>
  useEffect(() => {
    if (!password) return setStrength("");

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (hasLetter && !hasNumber && !hasSymbol) setStrength("weak");
    else if (hasLetter && hasNumber && !hasSymbol) setStrength("strong");
    else if (hasLetter && hasNumber && hasSymbol) setStrength("excellent");
    else setStrength("weak");
  }, [password]);


  // =========================>
  // ## Check match confirm password
  // =========================>
  const isConfirmMismatch = confirmPassword && password !== confirmPassword;


  return (
    <div className="relative flex flex-col gap-y-1">
      {label && (
        <label
          htmlFor={randomId}
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            props.disabled && "opacity-50",
            inputHandler.focus && "text-primary",
            !!invalidMessage && "text-danger",
          )}
        >
          {label}
          {validations && validation.hasRules(validations, "required") && <span className="text-danger">*</span>}
        </label>
      )}

      {tip && (
        <small
          className={cn(
            "input-tip",
            pcn<CT>(className, "tip"),
            props.disabled && "opacity-60",
          )}
        >{tip}</small>
      )}

      <div className="relative">
        <input
          {...props}
          type="password"
          id={randomId}
          className={cn(
            "input",
            leftIcon && "pl-12",
            rightIcon && "pr-12",
            pcn<CT>(className, "base"),
            !!invalidMessage && "input-error",
          )}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            inputHandler.setIdle(false);
            onChange?.(e.target.value, confirmPassword);
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
            className={cn("left-4 input-icon", pcn<CT>(className, "icon"))}
            icon={leftIcon}
          />
        )}
        {rightIcon && (
          <FontAwesomeIcon
            className={cn("right-4 input-icon", pcn<CT>(className, "icon"))}
            icon={rightIcon}
          />
        )}
      </div>

      {invalidMessage && (
        <small className={cn("input-error-message", "text-danger mt-1")}>
          {invalidMessage}
        </small>
      )}

      {strength && (
        <div className="flex items-center gap-2 mt-1">
          <div
            className={cn(
              "h-1 rounded transition-all duration-300 w-1/3",
              strength === "weak" && "bg-danger",
              strength === "strong" && "bg-warning",
              strength === "excellent" && "bg-success",
            )}
          />
          <div
            className={cn(
              "h-1 rounded transition-all duration-300 w-1/3",
              strength === "weak" && "bg-background",
              strength === "strong" && "bg-warning",
              strength === "excellent" && "bg-success",
            )}
          />
          <div
            className={cn(
              "h-1 rounded transition-all duration-300 w-1/3",
              strength === "weak" && "bg-background ",
              strength === "strong" && "bg-background",
              strength === "excellent" && "bg-success",
            )}
          />
          <span
            className={cn(
              "text-[10px] font-medium",
              strength === "weak" && "text-danger",
              strength === "strong" && "text-warning",
              strength === "excellent" && "text-success",
            )}
          >{strength === "weak" ? "Weak" : strength === "strong" ? "Strong" : "Excellent"}</span>
        </div>
      )}

      <div className="mt-4">
        <label
          htmlFor={randomConfirmId}
          className={cn("input-label text-sm", pcn<CT>(className, "label"))}
        >Password Confirm</label>
        <div className="relative">
          <input
            {...props}
            id={randomConfirmId}
            type="password"
            className={cn(
              "input",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              pcn<CT>(className, "base"),
              isConfirmMismatch && "input-error",
            )}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              onChange?.(password, e.target.value);
            }}
            autoComplete="off"
          />
        </div>
      </div>

      {isConfirmMismatch && (
        <small className={cn("input-error-message", "text-danger mt-1")}>Password confirmation not match</small>
      )}
    </div>
  );
}
