import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { parseClassName } from "@/helpers";
type classNamePrefix = "label" | "checked" | "error" | "input";

export type RadioProps = {
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
}: RadioProps) {
  const randomId = useMemo(() => Math.random().toString(36).substring(7), []);
  const [isInvalid, setIsInvalid] = useState("");

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
            className={clsx(
              `flex justify-center items-center rounded-full w-5 h-5 active:outline border-2 border-light-foreground`,
              checked && "border-[5px] outline-light-primary border-primary",
              checked && parseClassName<classNamePrefix>(className, "checked"),
              parseClassName<classNamePrefix>(className, "input")
            )}
          ></div>
          <div
            className={clsx(
              "whitespace-nowrap",
              parseClassName<classNamePrefix>(className, "label"),
              checked && "font-semibold",
              checked &&
                parseClassName<classNamePrefix>(className, "label", "checked"),
              disabled &&
                parseClassName<classNamePrefix>(className, "label", "disabled")
            )}
          >
            {label}
          </div>
        </label>
        {isInvalid && (
          <small
            className={clsx(
              "input-error-message",
              parseClassName<classNamePrefix>(className, "error")
            )}
          >
            {isInvalid}
          </small>
        )}
      </div>
    </>
  );
}
