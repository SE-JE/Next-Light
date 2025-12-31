"use client"

import { InputHTMLAttributes, ReactNode, Ref, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn, pcn, useInputHandler, useInputRandomId, useValidation, validation, ValidationRules } from "@utils";
import { InputValues } from "./InputValues.component";



type CT = "label" | "tip" | "error" | "base" | "icon" | "suggest" | "suggest-item";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label      ?:  string;
  tip        ?:  string | ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  any;
  invalid      ?:  string;
  suggestions  ?:  string[];

  validations   ?:  ValidationRules;
  onlyAlphabet  ?:  boolean;
  uppercase     ?:  boolean;
  lowercase     ?:  boolean;
  multiple      ?:  boolean;

  onChange  ?:  (value: any) => any;
  register  ?:  (name: string, validations?: ValidationRules) => void;

  ref       ?:  Ref<HTMLInputElement>,

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className  ?:  string;
}



export function InputComponent({
  label,
  tip,
  leftIcon,
  rightIcon,
  className = "",

  value,
  invalid,
  suggestions,

  validations,
  onlyAlphabet,
  uppercase,
  lowercase,
  multiple,

  register,
  onChange,

  ref,
  ...props
}: InputProps) {


  const [activeSuggestion, setActiveSuggestion]        =  useState(0);
  const [showSuggestions, setShowSuggestions]          =  useState(false);
  const [dataSuggestions, setDataSuggestions]          =  useState<string[] | undefined>([]);
  const [filteredSuggestions, setFilteredSuggestions]  =  useState<string[] | undefined>([]);


  // =========================>
  // ## Initial
  // =========================>
  const inputHandler      =  useInputHandler(props.name, value, validations, register, props.type == "file")
  const randomId          =  useInputRandomId()


  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage]  =  useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


  // =========================>
  // ## Change value handler
  // =========================>
  useEffect(() => {
    if (inputHandler.value && typeof inputHandler.value === "string") {
      let newVal = onlyAlphabet ? inputHandler.value.replace(/[^A-Za-z ]+/g, "") : inputHandler.value;

      if (uppercase) newVal = newVal.toUpperCase();
      if (lowercase) newVal = newVal.toLowerCase();

      if (validations && validation.hasRules(validations, "max")) newVal = newVal.slice(0, parseInt(validation.getRules(validations, "max") || "0"));

      inputHandler.setValue(newVal);
    }
  }, [inputHandler.value, onlyAlphabet, uppercase, lowercase, validations]);


  // =========================>
  // ## suggestions handler
  // =========================>
  useEffect(() => {
    setDataSuggestions(suggestions);
  }, [suggestions]);

  const filterSuggestion = (e: any) => {
    if (dataSuggestions?.length) {
      let filteredSuggestion = [];

      if (e.target.value) {
        filteredSuggestion = dataSuggestions
          .filter((suggestion) => suggestion.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
          .slice(0, 10);
      } else {
        filteredSuggestion = dataSuggestions.slice(0, 10);
      }

      setActiveSuggestion(-1);
      setFilteredSuggestions(filteredSuggestion);
      setShowSuggestions(true);
    }
  };


  const onKeyDownSuggestion = (e: any) => {
    if (dataSuggestions?.length) {
      if (e.keyCode === 13) {
        const resultValue = filteredSuggestions?.at(activeSuggestion);
        setActiveSuggestion(-1);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        inputHandler.setValue(resultValue ? resultValue : inputHandler.value);
        if (onChange) {
          onChange(resultValue ? resultValue : inputHandler.value);
        }
        e.preventDefault();
      } else if (e.keyCode === 38) {
        if (activeSuggestion === 0) {
          return;
        }

        setActiveSuggestion(activeSuggestion - 1);
      } else if (e.keyCode === 40) {
        if (activeSuggestion + 1 >= (filteredSuggestions?.length || 0)) {
          return;
        }

        setActiveSuggestion(activeSuggestion + 1);
      }
    }
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
            ref={ref}
            id={randomId}
            placeholder={!multiple || (multiple && !inputHandler.value?.length) ? props.placeholder : ""}
            className={cn(
              "input",
              props.type == "file" && "input-file",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              pcn<CT>(className, "base"),
              !!invalidMessage && "input-error",
              !!invalidMessage && pcn<CT>(className, "base", "error"),
            )}
            value={!multiple ? inputHandler.value: undefined}
            onChange={(e) => {
              if(!multiple) {
                inputHandler.setValue(e.target.value);
                inputHandler.setIdle(false);
                onChange?.(props.type == "file" ? e.target?.files && e.target?.files[0] : e.target.value);
                dataSuggestions?.length && filterSuggestion(e);
              }
            }}
            onFocus={(e) => {
              props.onFocus?.(e);
              inputHandler.setFocus(true);
              dataSuggestions?.length && filterSuggestion(e);
            }}
            onBlur={(e) => {
              props.onBlur?.(e);
              setTimeout(() => inputHandler.setFocus(false), 100);
            }}
            onKeyDown={(e) => {
              dataSuggestions?.length && onKeyDownSuggestion(e);

              if (multiple && e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                const currentValue = e.currentTarget.value.trim();
                if (!currentValue) return;
                
                const currentValues = Array.isArray(inputHandler.value) ? [...inputHandler.value] : [];
                if (!currentValues.includes(currentValue)) {
                  const newValues = [...currentValues, currentValue];
                  onChange?.(newValues);
                  inputHandler.setValue(newValues);
                  e.currentTarget.value = "";
                }
              }
            }}
            autoComplete={props.autoComplete || dataSuggestions?.length ? "off" : ""}
          />


          {(multiple) && (
            <InputValues 
              value={inputHandler.value || []} 
              isFocus={inputHandler.focus} 
              onFocus={() => setTimeout(() => inputHandler.setFocus(true), 110)}
              onDelete={(_, index) => {
                const values = Array().concat(inputHandler.value);
                const newValues = values.filter((_, val) => val != index);

                inputHandler.setValue(newValues);
                onChange?.(newValues);
              }}
              className={`${!inputHandler.focus && (leftIcon ? "ml-[2.5rem]" : "ml-[1rem]")}`} 
              style={{ maxWidth: `calc(100% - ${leftIcon ? "5.2rem" : "2rem"})` }}
            />
          )}

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

        {!!dataSuggestions?.length && showSuggestions && !!filteredSuggestions?.length && (
            <div>
              <ul
                className={cn(
                  "input-suggest-container",
                  pcn<CT>(className, "suggest"),
                  inputHandler.focus ? "opacity-100 scale-y-100 -translate-y-0" : "opacity-0 scale-y-0 -translate-y-1/2",
                )}
              >
                {filteredSuggestions.map((suggestion, key) => {
                  return (
                    <li
                      className={cn(
                        "input-suggest",
                        pcn<CT>(className, "suggest-item"),
                        inputHandler.value == suggestion && "bg-light-primary text-primary",
                        inputHandler.value == suggestion && pcn<CT>(className, "suggest-item", "active"),
                      )}
                      key={suggestion}
                      onMouseDown={() => {
                        setTimeout(() => inputHandler.setFocus(true), 110);
                      }}
                      onMouseUp={() => {
                        setActiveSuggestion(key);
                        setFilteredSuggestions([]);
                        setShowSuggestions(false);
                        inputHandler.setValue(filteredSuggestions[key] || inputHandler.value);
                        onChange?.(filteredSuggestions[key] || inputHandler.value);
                        setTimeout(() => inputHandler.setFocus(false), 120);
                      }}
                    >
                      {suggestion}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        {invalidMessage && (
          <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
        )}
      </div>
    </>
  );
}
