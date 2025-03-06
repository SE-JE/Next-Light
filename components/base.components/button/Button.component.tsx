import { cn, pcn } from "@/helpers";
import {
  buttonVariant,
  buttonContainer,
  buttonRadius,
} from "./button.decorate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

type CT = "icon" | "loading" | "base";

export type ButtonPropsType = {
  type?: "submit" | "button";
  label?: string | ReactNode;
  variant?: "solid" | "outline" | "light" | "simple";
  paint?: "primary" | "secondary" | "success" | "danger" | "warning";
  rounded?: boolean | string;
  block?: boolean;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  onClick?: any;
  icon?: any;
  loading?: boolean;
  hover?: boolean;

  /** Use custom class with: "icon::", "loading::". */
  className?: string;
};

export function ButtonComponent({
  type = "button",
  label,
  variant = "solid",
  paint = "primary",
  rounded,
  block,
  disabled,
  size = "md",
  onClick,
  icon,
  loading,
  className = "",
}: ButtonPropsType) {
  const buttonClasses = cn(
    "button",
    buttonVariant[variant][paint],
    buttonContainer[size],
    rounded ? "rounded-full" : buttonRadius[size],
    block && "w-full justify-center",
    pcn<CT>(className, "base")
  );

  const loadingClasses = cn(
    "button-loading",
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4",
    pcn<CT>(className, "loading")
  );

  const iconClasses = cn(
    size === "xs"
      ? "text-xs"
      : size === "sm"
      ? "text-sm mb-0.5"
      : size === "lg"
      ? "text-xl mb-0.5"
      : "text-base mb-0.5",
    pcn<CT>(className, "icon")
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className={loadingClasses}></div>
      ) : (
        icon && <FontAwesomeIcon icon={icon} className={iconClasses} />
      )}
      {label}
    </button>
  );
}
