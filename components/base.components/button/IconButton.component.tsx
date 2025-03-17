import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  buttonVariant,
  buttonRadius,
  iconButtonContainer,
} from "./button.decorate";
import { cn, pcn } from "@/helpers";

type CT = "icon" | "loading" | "base";

export type IconButtonPropsType = {
  icon?: any;
  type?: "submit" | "button";
  variant?: "solid" | "outline" | "light" | "simple";
  paint?: "primary" | "secondary" | "success" | "danger" | "warning";
  customPaint?: {
    bg?: string;
    color?: string;
    border?: string;
  };
  rounded?: boolean | string;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  onClick?: any;
  loading?: boolean;
  hover?: boolean;
  tips?: string | undefined;

  /** Use custom class with: "icon::", "loading::". */
  className?: string;
};

export function IconButtonComponent({
  type = "button",
  variant = "solid",
  paint = "primary",
  rounded,
  disabled,
  size = "md",
  onClick,
  icon,
  loading,
  tips,
  className = "",
}: IconButtonPropsType) {
  const buttonClasses = cn(
    "button",
    buttonVariant[variant][paint],
    iconButtonContainer[size],
    rounded ? "rounded-full" : buttonRadius[size],
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
