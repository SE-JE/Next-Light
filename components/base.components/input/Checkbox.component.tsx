import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

export type CheckboxProps = {
  name: string;
  label: string;
  disabled?: boolean;
  value?: string;
  onChange?: () => void;
  checked?: boolean;
  error?: string;
  className?: string;
};

export function CheckboxComponent({
  label,
  name,
  onChange,
  checked = false,
  value,
  disabled = false,
  error = "",
  className = "",
}: CheckboxProps) {
  return (
    <div className={`flex flex-col gap-1 `}>
      <input
        type="checkbox"
        className="hidden"
        id={`checkbox_${name}`}
        name={name}
        onChange={onChange}
        checked={checked}
        value={value}
        disabled={disabled}
      />

      <label
        htmlFor={`checkbox_${name}`}
        className={`flex gap-2 items-center cursor-pointer ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <div
          className={clsx(
            `flex justify-center items-center rounded-md border-2 w-6 h-6 transition-colors ${
              checked
                ? "border-light-primary bg-primary text-white"
                : "border-light-foreground text-light-foreground"
            }`,
            className
          )}
        >
          {checked && <FontAwesomeIcon icon={faCheck} className="text-sm" />}
        </div>
        <span className={`${checked ? "font-semibold" : ""}`}>{label}</span>
      </label>

      {error && <small className="text-red-500 text-sm">{error}</small>}
    </div>
  );
}
