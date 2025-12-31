"use client"

import React, { InputHTMLAttributes, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn, useInputHandler, useInputRandomId, useValidation, validation, ValidationRules } from "@utils";



type CT = "label" | "tip" | "error" | "input" | "icon";

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label      ?:  string;
  tip        ?:  string | ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  number;
  invalid      ?:  string;
  validations  ?:  ValidationRules;
  min          ?:  number;
  max          ?:  number;
  
  onChange  ?:  (value: number) => any;
  register  ?:  (name: string, validations?: ValidationRules) => void;
  
  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className  ?:  string;
}



export function InputNumberComponent({
  label,
  tip,
  leftIcon,
  rightIcon,

  value,
  invalid,
  validations,
  min,
  max,

  onChange,
  register,

  className = "",
  ...props
}: InputNumberProps) {

  // =========================>
  // ## Initial
  // =========================>
  const inputHandler  =  useInputHandler(props.name, value, validations, register, false)
  const randomId      =  useInputRandomId()


  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage]  =  useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


  // =========================>
  // ## Change value handler
  // =========================>
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const regex = /^-?\d*\.?\d*$/;
    if (regex.test(newValue)) {
      inputHandler.setValue(newValue);
      inputHandler.setIdle(false);
      onChange?.(Number(newValue));
    }
  };


  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    props.onBlur?.(e);
    setTimeout(() => inputHandler.setFocus(false), 100);
  };


  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    props.onFocus?.(e);
    inputHandler.setFocus(true);
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
            value={inputHandler.value}
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
                inputHandler.focus && "text-primary",
                inputHandler.focus && pcn<CT>(className, "icon", "focus"),
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
              inputHandler.focus && "text-primary",
              inputHandler.focus && pcn<CT>(className, "icon", "focus"),
            )}
          >
            <div className="flex flex-col">
              <FontAwesomeIcon
                className={`text-light-foreground hover:text-primary -mb-1`}
                icon={faSortUp}
                onClick={() => inputHandler.setValue(String(Number(inputHandler.value) + 1))}
              />
              <FontAwesomeIcon
                className={`text-light-foreground hover:text-primary -mt-1`}
                icon={faSortDown}
                onClick={() => inputHandler.setValue(String(Number(inputHandler.value) - 1))}
              />
            </div>
          </label>
        </div>

        {invalidMessage && (
          <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
        )}
      </div>
    </>
  );
}
