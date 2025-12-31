"use client"

import { InputHTMLAttributes, ReactNode, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn, pcn, useInputHandler, useInputRandomId, useResponsive, useValidation, validation, ValidationRules } from "@utils";
import { OutsideClickComponent, InputDatePickerComponent, InputTimePickerComponent, BottomSheetComponent, ButtonComponent, TabbarComponent } from "@components";



type CT = "label" | "tip" | "error" | "input" | "icon";

export interface InputDateTimeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label      ?:  string;
  tip        ?:  string | ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  string;
  invalid      ?:  string;
  validations  ?: ValidationRules;
  
  onChange  ?:  (value: string) => any;
  register  ?:  (name: string, validations?: ValidationRules) => void;

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
  const { isSm }  =  useResponsive();

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


  return (
    <>
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

        <OutsideClickComponent onOutsideClick={!isSm ? () => inputHandler.setFocus(false) : undefined}>
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
              inputMode={isSm ? "none" : undefined}
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

            {!isSm && inputHandler.focus && (
              <>
                <div className="absolute z-50 top-full right-0 mt-1 w-max bg-white border rounded-[6px] p-2 shadow min-w-[350]">
                  <TabbarComponent 
                    items={[
                      {
                        label: "Tanggal",
                        value: 'date'
                      },
                      {
                        label: "Jam",
                        value: 'time'
                      },
                    ]}
                    active={pickerType}
                    onChange={(e) => setPickerType(e as "time" | "date")}
                    className="mb-4"
                  />
                  {pickerType === "date" ? (
                    <InputDatePickerComponent
                      onChange={(e) => {
                        setDateValue(e);
                        handleChange(e, timeValue);
                      }}
                    />
                  ) : (
                    <InputTimePickerComponent
                      onChange={(e) => {
                        setTimeValue(e);
                        handleChange(dateValue, e);
                      }}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </OutsideClickComponent>

        {invalidMessage && (
          <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
        )}
      </div>

      {isSm && (
        <BottomSheetComponent
          show={inputHandler.focus}
          onClose={() => inputHandler.setFocus(false)}
          size={430}
          footer={
            <div className="p-4">
              <ButtonComponent
                label="Selesai"
                variant="outline"
                onClick={() => inputHandler.setFocus(false)}
                block
              />
            </div>
          }
        >
          <div className="p-4">
            <TabbarComponent 
              items={[
                {
                  label: "Tanggal",
                  value: 'date'
                },
                {
                  label: "Jam",
                  value: 'time'
                },
              ]}
              active={pickerType}
              onChange={(e) => setPickerType(e as "time" | "date")}
              className="mb-4"
            />
            {pickerType === "date" ? (
              <InputDatePickerComponent
                onChange={(e) => {
                  setDateValue(e);
                  handleChange(e, timeValue);
                }}
              />
            ) : (
              <InputTimePickerComponent
                onChange={(e) => {
                  setTimeValue(e);
                  handleChange(dateValue, e);
                }}
              />
            )}
          </div>
        </BottomSheetComponent>
      )}
    </>
  );
}
