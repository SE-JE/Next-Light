import { buttonProps } from "./button.props";
import {
  buttonVariant,
  buttonContainer,
  buttonRadius,
} from "./button.decorate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

export function ButtonComponent({
  type = "button",
  label,
  variant = "solid",
  paint = "primary",
  rounded,
  block,
  className,
  disabled,
  size = "md",
  onClick,
  icon,
  loading,
}: buttonProps) {
  const buttonClasses = clsx(
    "button",
    buttonVariant[variant][paint],
    buttonContainer[size],
    rounded ? "rounded-full" : buttonRadius[size],
    block && "w-full justify-center",
    className
  );

  const loadingClasses = clsx(
    "button-loading",
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
  );

  const iconClasses = clsx(
    size === "xs"
      ? "text-xs"
      : size === "sm"
      ? "text-sm mb-0.5"
      : size === "lg"
      ? "text-xl mb-0.5"
      : "text-base mb-0.5"
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
