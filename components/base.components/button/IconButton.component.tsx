import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconButtonProps } from "./button.props";
import {
  buttonVariant,
  buttonRadius,
  iconButtonContainer,
  buttonIcon,
} from "./button.decorate";
import clsx from "clsx";

export function IconButtonComponent({
  type = "button",
  variant = "solid",
  paint = "primary",
  rounded,
  className,
  disabled,
  size = "md",
  onClick,
  icon,
  loading,
  customPaint,
  tips,
}: iconButtonProps) {
  const buttonClasses = clsx(
    "button",
    !customPaint && buttonVariant[variant][paint],
    iconButtonContainer[size],
    rounded ? "rounded-full" : buttonRadius[size],
    className
  );

  const loadingClasses = clsx(
    "button-loading",
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
  );

  const iconClasses = clsx(
    !customPaint && buttonIcon[variant][paint],
    customPaint?.color && `text-${customPaint.color}`,
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
      title={tips}
    >
      {loading ? (
        <div className={loadingClasses}></div>
      ) : (
        <FontAwesomeIcon icon={icon} className={iconClasses} />
      )}
    </button>
  );
}
