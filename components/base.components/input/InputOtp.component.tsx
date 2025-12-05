"use client"

import { ClipboardEvent, FC, KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import { cn, pcn } from "@utils";



type CT = "label" | "tip" | "error" | "base" | "icon";

export interface InputOtpProps {
  label     ?:  string;
  tip       ?:  string | ReactNode;
  name       :  string;
  disabled  ?:  boolean;

  value    ?:  string;
  invalid  ?:  string;
  length   ?:  number;

  onChange  ?:  (value: string) => any;

  /** Use custom class with: "label::", "tip::", "error::". */
  className  ?:  string;
}



export const InputOtpComponent: FC<InputOtpProps> = ({
  label,
  tip,
  name,
  disabled,

  value,
  invalid,  
  length = 6,

  onChange,

  className = "",
}) => {
  const [isFocus, setIsFocus]  =  useState(false);
  const inputsRef              =  useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp]          =  useState<string[]>((value || "").split("").concat(Array(length).fill("")).slice(0, length));


  useEffect(() => {
    const handleFocusChange = () => {
      const anyFocused = inputsRef.current.some((input) => input === document.activeElement);
      setIsFocus(anyFocused);
    };

    window.addEventListener("focusin", handleFocusChange);
    window.addEventListener("focusout", handleFocusChange);

    return () => {
      window.removeEventListener("focusin", handleFocusChange);
      window.removeEventListener("focusout", handleFocusChange);
    };
  }, []);


  const emitChange = (newOtp: string[]) => {
    const val = newOtp.join("");
    onChange?.(val);
  };


  const handleChange = (val: string, index: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp   =  [...otp];
    newOtp[index]  =  val;

    setOtp(newOtp);
    emitChange(newOtp);

    (val && index < length - 1) && inputsRef.current[index + 1]?.focus();
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        emitChange(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };


  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^[0-9]+$/.test(paste)) return;
    const pasted = paste.slice(0, length).split("");
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    emitChange(newOtp);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };


  return (
    <>
      <div className="relative flex flex-col gap-y-0.5">
        <label
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            disabled && "opacity-50",
            disabled && pcn<CT>(className, "label", "disabled"),
            isFocus && "text-primary",
            isFocus && pcn<CT>(className, "label", "focus"),
            !!invalid && "text-danger",
            !!invalid && pcn<CT>(className, "label", "focus"),
          )}
        >
          {label}
        </label>

        {tip && (
          <small
            className={cn(
              "input-tip",
              pcn<CT>(className, "tip"),
              disabled && "opacity-60",
              disabled && pcn<CT>(className, "tip", "disabled"),
            )}
          >{tip}</small>
        )}
        <div className={cn(
          "input pb-1", 
          isFocus && "!border-primary",
          !!invalid && "input-error"
          )}
        >
          <div className="flex gap-2 justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                ref={(el) => {inputsRef.current[index] = el }}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className={`w-8 h-full pb-1 text-center border-b outline-none border-foreground focus:!border-primary placeholder:text-light-foreground`}
                placeholder="-"
                autoFocus={index === 0}
              />
            ))}
          </div>
          <input type="hidden" name={name} value={otp.join("")} />
        </div>

        {invalid && (
          <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalid}</small>
        )}
      </div>
    </>
  );
};
