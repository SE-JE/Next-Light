import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { parseClassName } from "@/helpers";
import { useMemo } from "react";
type classNamePrefix = "label" | "checked" | "error" | "input";

export type CheckboxProps = {
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
}: CheckboxProps) {
  const randomId = useMemo(() => Math.random().toString(36).substring(7), []);

  return (
    <div className={`flex flex-col gap-1 `}>
      <input
        type="checkbox"
        className="hidden"
        id={randomId}
        name={name}
        onChange={onChange}
        checked={checked}
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
            `flex justify-center items-center rounded-md border-2 w-6 h-6 transition-colors border-light-foreground text-light-foreground`,
            checked && "border-light-primary bg-primary text-white",
            checked && parseClassName<classNamePrefix>(className, "checked"),
            parseClassName<classNamePrefix>(className, "input")
          )}
        >
          {checked && <FontAwesomeIcon icon={faCheck} className="text-sm" />}
        </div>
        <span
          className={clsx(
            "whitespace-nowrap",
            parseClassName<classNamePrefix>(className, "label"),
            checked && "text-semibold",
            checked &&
              parseClassName<classNamePrefix>(className, "label", "checked"),
            disabled &&
              parseClassName<classNamePrefix>(className, "label", "disabled")
          )}
        >
          {label}
        </span>
      </label>

      {error && (
        <small
          className={clsx(
            "input-error-message",
            parseClassName<classNamePrefix>(className, "error")
          )}
        >
          {error}
        </small>
      )}
    </div>
  );
}
