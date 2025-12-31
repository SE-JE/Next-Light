"use client"

import { FC, InputHTMLAttributes, ReactNode, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn, pcn, useInputHandler, useInputRandomId, useResponsive, useValidation, validation, ValidationRules } from "@utils";
import { BottomSheetComponent, ButtonComponent, OutsideClickComponent } from "@components";



type CT = "label" | "tip" | "error" | "input"| "icon";

export interface InputTimeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label      ?:  string;
  tip        ?:  string | ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  string;
  invalid      ?:  string;
  validations  ?:  ValidationRules;

  onChange  ?:  (value: string) => any;
  register  ?:  (name: string, validations?: ValidationRules) => void;

  /** Use custom class with: "label::", "tip::", "error::", "icon::". */
  className  ?:  string;
}



export function InputTimeComponent({
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
}: InputTimeProps) {
  const { isSm }  =  useResponsive();

  // =========================>
  // ## Initial
  // =========================>
  const inputHandler  =  useInputHandler(props.name, value, validations, register, false)
  const randomId      =  useInputRandomId()
  
  
  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage]  =  useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


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
              className={cn(
                "input",
                leftIcon && "pl-12",
                rightIcon && "pr-12",
                pcn<CT>(className, "input"),
                !!invalidMessage && "input-error"
              )}
              value={inputHandler.value}
              onChange={(e) => {
                inputHandler.setValue(e.target.value);
                inputHandler.setIdle(false);
                onChange?.(e.target.value);
              }}
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
              <div className="absolute z-50 top-full right-0 mt-1 w-max bg-white border rounded-[6px] p-2 shadow min-w-[300]">
                <InputTimePickerComponent
                  onChange={(time) => {
                    inputHandler.setValue(time);
                    onChange?.(time);
                  }}
                />
              </div>
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
          size={380}
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
            <InputTimePickerComponent
              onChange={(time) => {
                inputHandler.setValue(time);
                onChange?.(time);
              }}
            />
          </div>
        </BottomSheetComponent>
      )}
    </>
  );
}



interface InputTimePickerProps {
  onChange      ?:  (time: string) => void;
  rightElement  ?:  ReactNode;
};




export const InputTimePickerComponent: FC<InputTimePickerProps> = ({
  onChange,
  rightElement,
}) => {
  const [hour, setHour]      =  useState(0);
  const [minute, setMinute]  =  useState(0);
  const [second, setSecond]  =  useState(0);

  const hours    =  Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes  =  Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const seconds  =  Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  const handleSelect = (type: "h" | "m" | "s", val: string) => {
    if (type === "h") setHour(Number(val));
    if (type === "m") setMinute(Number(val));
    if (type === "s") setSecond(Number(val));
  };

  useEffect(() => {
    const formatted = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
    onChange?.(formatted);
  }, [hour, minute, second]);

  const renderColumn = (items: string[], type: "h" | "m" | "s", activeValue: number) => (
    <div className="flex-1 overflow-y-auto text-center input-scroll">
      {items.map((item) => {
        const active = Number(item) === activeValue;

        return (
          <div
            key={item}
            onClick={() => handleSelect(type, item)}
            className={cn(
              "p-2 cursor-pointer rounded text-sm",
              active ? "bg-primary text-background font-semibold" : "hover:bg-light-primary"
            )}
          >{item}</div>
        );
      })}
    </div>
  );

  const timeSlots = useMemo(() => {
    const newTimeSlots = [];

    for (let i = 0; i <= 24 * 60; i += 30) {
      const hours    =  Math.floor(i / 60);
      const minutes  =  i % 60;
      const label    =  `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      newTimeSlots.push(label);
    }

    return newTimeSlots;
  }, [])

  return (
    <div className="w-full max-h-[260] flex gap-2">
      <div className="w-1/3 overflow-y-auto bg-white rounded-[6px] input-scroll">
        {timeSlots.map((time) => (
          <div
            key={time}
            className="p-2 text-sm rounded cursor-pointer hover:bg-light-primary text-center"
            onClick={() => onChange?.(time)}
          >{time}</div>
        ))}
      </div>

      <div className="w-2/3 flex gap-2">
        {renderColumn(hours, "h", hour)}
        {renderColumn(minutes, "m", minute)}
        {renderColumn(seconds, "s", second)}
      </div>

      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};