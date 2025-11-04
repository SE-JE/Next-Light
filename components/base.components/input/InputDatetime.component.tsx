import React, { InputHTMLAttributes, ReactNode, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn, useInputHandler, useInputRandomId, useValidation, validation } from "@utils/.";
import { OutsideClickComponent, InputDatePickerComponent, InputTimePickerComponent } from "@components/.";



type CT = "label" | "tip" | "error" | "input" | "icon";

export interface InputDateTimeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label      ?:  string;
  tip        ?:  string | ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  string;
  invalid      ?:  string;
  validations  ?:  string;
  
  onChange  ?:  (value: string) => any;
  register  ?:  (name: string, validations?: string) => void;

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className  ?:  string;
}



export function InputDatetimeComponent({
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
}: InputDateTimeProps) {
  const [pickerType, setPickerType]  =  useState<"date" | "time">("date");
  const [dateValue, setDateValue]    =  useState("");
  const [timeValue, setTimeValue]    =  useState("");


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
  // ## change value handler
  // =========================>
  useEffect(() => {
    inputHandler.setValue(value || "");
    value && inputHandler.setValue(false);

    if (value) {
      const [d, t] = value.split(" ");
      setDateValue(d || "");
      setTimeValue(t || "");
    }
  }, [value]);


  const handleChange = (date: string, time: string) => {
    const newVal = `${date} ${time}`;
    inputHandler.setValue(newVal.trim());
    onChange?.(newVal.trim());
  };


  const TypePickerOption = () => (
    <div className="flex flex-col border-l !border-slate-200 pl-2 h-full">
      <div 
        className={cn(
        "p-2 cursor-pointer hover:bg-light-primary text-sm rounded", 
        pickerType == "date" && "bg-primary"
        )} 
        onClick={() => setPickerType("date")}
      ><FontAwesomeIcon icon={faCalendarAlt} /></div>
      <div 
        className={cn(
        "p-2 cursor-pointer hover:bg-light-primary text-sm rounded", 
        pickerType == "time" && "bg-primary"
        )} 
        onClick={() => setPickerType("time")}
      ><FontAwesomeIcon icon={faClock} /></div>
    </div>
  )


  return (
    <div className="relative flex flex-col gap-y-0.5">
      <label
        htmlFor={randomId}
        className={cn(
          "input-label",
          pcn<CT>(className, "label"),
          props.disabled && "opacity-50",
          inputHandler.focus && "text-primary",
          !!invalidMessage && "text-danger"
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
            props.disabled && "opacity-60"
          )}
        >{tip}</small>
      )}

      <OutsideClickComponent onOutsideClick={() => inputHandler.setFocus(false)}>
        <div className="relative">
          <input
            {...props}
            id={randomId}
            readOnly
            className={cn(
              "input",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              pcn<CT>(className, "input"),
              !!invalidMessage && "input-error"
            )}
            value={inputHandler.value}
            onFocus={(e) => {
              props.onFocus?.(e);
              inputHandler.setFocus(true);
            }}
            autoComplete="off"
          />

          {leftIcon && (
            <FontAwesomeIcon
              className={cn(
                "left-4 input-icon",
                pcn<CT>(className, "icon"),
                props.disabled && "opacity-60",
                inputHandler.focus && "text-primary"
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
                inputHandler.focus && "text-primary"
              )}
              icon={rightIcon}
            />
          )}

          {inputHandler.focus && (
            <>
              {pickerType === "date" ? (
                <InputDatePickerComponent
                  onChange={(e) => {
                    setDateValue(e);
                    handleChange(e, timeValue);
                  }}
                  rightElement={<TypePickerOption />}
                />
              ) : (
                <InputTimePickerComponent
                  onChange={(e) => {
                    setTimeValue(e);
                    handleChange(dateValue, e);
                  }}
                  rightElement={<TypePickerOption />}
                />
              )}
            </>
          )}
        </div>
      </OutsideClickComponent>

      {invalidMessage && (
        <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
      )}
    </div>
  );
}
