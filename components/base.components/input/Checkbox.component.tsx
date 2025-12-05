"use client"

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn, useInputRandomId } from "@utils";



type CT  =  "label" | "checked" | "error" | "base";

export type CheckboxProps = {
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



export function CheckboxComponent({
  name,
  label,

  value,
  disabled = false,
  checked = false,
  invalid,

  onChange,

  className = "",
}: CheckboxProps) {


  // =========================>
  // ## Initial
  // =========================>
  const randomId                             =  useInputRandomId()
  const [invalidMessage, setInvalidMessage]  =  useState("");


  // =========================>
  // ## Invalid handler
  // =========================>
  useEffect(() => {
    setInvalidMessage(invalid || "");
  }, [invalid]);


  return (
    <div className={`flex flex-col gap-1`}>
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
        className={cn(
        "flex gap-2 items-center cursor-pointer active:scale-x-[102%]",
        disabled && "pointer-events-none opacity-60"
        )}
      >
        <div
          className={cn(
            `flex justify-center items-center rounded-md border w-6 h-6 transition-colors border-light-foreground text-light-foreground`,
            checked && "border-light-primary bg-primary text-white",
            checked && pcn<CT>(className, "checked"),
            pcn<CT>(className, "base"),
          )}
        >
          {checked && <FontAwesomeIcon icon={faCheck} className="text-sm" />}
        </div>
        <span
          className={cn(
            "whitespace-nowrap",
            checked && "font-semibold",
            pcn<CT>(className, "label"),
            checked && pcn<CT>(className, "label", "checked"),
            disabled && pcn<CT>(className, "label", "disabled"),
          )}
        >
          {label}
        </span>
      </label>

      {invalidMessage && (
        <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
      )}
    </div>
  );
}
