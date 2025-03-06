import { cn, pcn } from "@/helpers";
import { useEffect, useState } from "react";

type CT = "label" | "checked" | "error" | "input";

export type RadioPropsType = {
  name: string;
  label?: string;
  disabled?: boolean;
  value?: string;
  onChange?: () => void;
  checked?: boolean;
  error?: string;
  /** Use custom class with: "label::", "checked::", "error::". */
  className?: string;
};

export function RadioComponent({
  name,
  label,
  disabled,
  value,
  onChange,
  checked,
  error,
  className = "",
}: RadioPropsType) {
  // =========================>
  // ## initial
  // =========================>
  const [randomId, setRandomId] = useState("");
  const [isInvalid, setIsInvalid] = useState("");

  useEffect(() => {
    setRandomId(Math.random().toString(36).substring(7));
  }, []);

  // =========================>
  // ## invalid handler
  // =========================>
  useEffect(() => {
    setIsInvalid(error || "");
  }, [error]);

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
          >
            {label}
          </div>
        </label>
        {isInvalid && (
          <small
            className={cn("input-error-message", pcn<CT>(className, "error"))}
          >
            {isInvalid}
          </small>
        )}
      </div>
    </>
  );
}
