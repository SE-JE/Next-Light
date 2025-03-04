import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn } from "@/helpers";
import { useEffect, useMemo, useState } from "react";
type CT = "label" | "checked" | "error" | "base";

export type CheckboxPropsType = {
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

export function CheckboxComponent({
  label,
  name = "",
  onChange,
  checked = false,
  value,
  disabled = false,
  error = "",
  className = "",
}: CheckboxPropsType) {
  const randomId = useMemo(() => Math.random().toString(36).substring(7), []);

  const [isInvalid, setIsInvalid] = useState("");

  // =========================>
  // ## invalid handler
  // =========================>
  useEffect(() => {
    setIsInvalid(error || "");
  }, [error]);

  return (
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
            `flex justify-center items-center rounded-md border w-6 h-6 transition-colors border-light-foreground text-light-foreground`,
            checked && "border-light-primary bg-primary text-white",
            checked && pcn<CT>(className, "checked"),
            pcn<CT>(className, "base")
          )}
        >
          {checked && <FontAwesomeIcon icon={faCheck} className="text-sm" />}
        </div>
        <span
          className={cn(
            "whitespace-nowrap",
            pcn<CT>(className, "label"),
            checked && "font-semibold",
            checked && pcn<CT>(className, "label", "checked"),
            disabled && pcn<CT>(className, "label", "disabled")
          )}
        >
          {label}
        </span>
      </label>

      {isInvalid && (
        <small
          className={cn("input-error-message", pcn<CT>(className, "error"))}
        >
          {isInvalid}
        </small>
      )}
    </div>
  );
}
