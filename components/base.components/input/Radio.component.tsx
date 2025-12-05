"use client"

import { useEffect, useState } from "react";
import { cn, pcn, useInputRandomId } from "@utils";



type CT = "label" | "checked" | "error" | "input";

export interface RadioProps {
  name    :  string;
  label  ?:  string;

  value     ?:  string;
  disabled  ?:  boolean;
  checked   ?:  boolean;
  invalid   ?:  string;

  onChange  ?:  () => void;

  /** Use custom class with: "label::", "checked::", "error::". */
  className  ?:  string;
};




export function RadioComponent({
  name,
  label,

  value,
  disabled,
  checked,
  invalid,

  onChange,

  className = "",
}: RadioProps) {

  // =========================>
  // ## initial
  // =========================>
  const randomId                             =  useInputRandomId()
  const [invalidMessage, setInvalidMessage]  =  useState("");


  // =========================>
  // ## invalid handler
  // =========================>
  useEffect(() => {
    setInvalidMessage(invalid || "");
  }, [invalid]);


  return (
    <>
      <div className={`flex flex-col gap-1 `}>
        <input
          type="checkbox"
          className="hidden"
          id={randomId}
          name={name}
          onChange={onChange}
          defaultChecked={checked}
          value={value}
          disabled={disabled}
        />

        <label
          htmlFor={randomId}
          className={`flex gap-2 items-center cursor-pointer ${
            disabled ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <div
            className={cn(
              `flex justify-center items-center rounded-full w-5 h-5 active:outline border border-light-foreground`,
              checked && "border-[5px] outline-light-primary !border-primary",
              checked && pcn<CT>(className, "checked"),
              pcn<CT>(className, "input"),
            )}
          ></div>
          <div
            className={cn(
              "whitespace-nowrap",
              pcn<CT>(className, "label"),
              checked && "font-semibold",
              checked && pcn<CT>(className, "label", "checked"),
              disabled && pcn<CT>(className, "label", "disabled"),
            )}
          >{label}</div>
        </label>

        {invalidMessage && (
          <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
        )}
      </div>
    </>
  );
}
