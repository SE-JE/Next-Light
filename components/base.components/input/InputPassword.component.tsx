import { cn, pcn, useValidationHelper, ValidationRulesType } from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";

type CT = "label" | "tip" | "error" | "base" | "icon";

export interface InputPasswordType
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  tip?: string | ReactNode;
  leftIcon?: any;
  rightIcon?: any;

  value?: string;
  error?: string;
  validations?: ValidationRulesType;
  onlyAlphabet?: boolean;
  autoUppercase?: boolean;

  onChange?: (value: string, confirm?: string) => any;
  register?: (name: string, validations?: ValidationRulesType) => void;

  /** Use custom class with: "label::", "tip::", "error::", "icon::". */
  className?: string;
}

export function InputPasswordComponent({
  label,
  tip,
  leftIcon,
  rightIcon,
  className = "",

  value,
  error,

  validations,
  onlyAlphabet,
  autoUppercase,

  register,
  onChange,

  ...props
}: InputPasswordType) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isInvalid, setIsInvalid] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const [strength, setStrength] = useState<"weak" | "strong" | "excellent" | "">(
    "",
  );

  const [randomId, setRandomId] = useState("");
  const [randomConfirmId, setRandomConfirmId] = useState("");

  useEffect(() => {
    register?.(props.name || "", validations);
  }, [props.name, validations]);

  useEffect(() => {
    setRandomId(Math.random().toString(36).substring(7));
    setRandomConfirmId(Math.random().toString(36).substring(7));
  }, []);

  // =========================>
  // ## VALIDATION HANDLER
  // =========================>
  const [errorMessage] = useValidationHelper(
    { value: password, rules: validations },
    isFirst,
  );

  useEffect(() => {
    setIsInvalid(errorMessage || error || "");
  }, [error, errorMessage]);

  // =========================>
  // ## VALUE CHANGES
  // =========================>
  useEffect(() => {
    setPassword(value || "");
    value && setIsFirst(false);
  }, [value]);

  useEffect(() => {
    if (password && typeof password === "string") {
      let newVal = password;

      if (onlyAlphabet) {
        newVal = password
          .split("")
          .filter((ch) => ch === " " || /[A-Za-z]/.test(ch))
          .join("");
      }

      if (autoUppercase) newVal = newVal.toUpperCase();
      if (validations?.max) newVal = newVal.slice(0, validations?.max);
      setPassword(newVal);
    }
  }, [password, onlyAlphabet, autoUppercase, validations]);

  // =========================>
  // ## PASSWORD STRENGTH
  // =========================>
  useEffect(() => {
    if (!password) return setStrength("");

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (hasLetter && !hasNumber && !hasSymbol) setStrength("weak");
    else if (hasLetter && hasNumber && !hasSymbol) setStrength("strong");
    else if (hasLetter && hasNumber && hasSymbol) setStrength("excellent");
    else setStrength("weak");
  }, [password]);

  // =========================>
  // ## CONFIRM PASSWORD
  // =========================>
  const isConfirmMismatch = confirmPassword && password !== confirmPassword;

  useEffect(() => {
    if (isConfirmMismatch) {
      setIsInvalid("Konfirmasi password tidak cocok");
    } else if (!errorMessage) {
      setIsInvalid("");
    }
  }, [confirmPassword, password]);

  return (
    <div className="relative flex flex-col gap-y-1">
      {label && (
        <label
          htmlFor={randomId}
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            props.disabled && "opacity-50",
            isFocus && "text-primary",
            isInvalid && "text-danger",
          )}
        >
          {label}
        </label>
      )}

      {tip && (
        <small
          className={cn(
            "input-tip",
            pcn<CT>(className, "tip"),
            props.disabled && "opacity-60",
          )}
        >
          {tip}
        </small>
      )}

      <div className="relative">
        <input
          {...props}
          type="password"
          id={randomId}
          className={cn(
            "input",
            leftIcon && "pl-12",
            rightIcon && "pr-12",
            pcn<CT>(className, "base"),
            isInvalid && "input-error",
          )}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setIsFirst(false);
            setIsInvalid("");
            onChange?.(e.target.value, confirmPassword);
          }}
          onFocus={(e) => {
            props.onFocus?.(e);
            setIsFocus(true);
          }}
          onBlur={(e) => {
            props.onBlur?.(e);
            setTimeout(() => setIsFocus(false), 100);
          }}
          autoComplete="off"
        />

        {leftIcon && (
          <FontAwesomeIcon
            className={cn("left-4 input-icon", pcn<CT>(className, "icon"))}
            icon={leftIcon}
          />
        )}
        {rightIcon && (
          <FontAwesomeIcon
            className={cn("right-4 input-icon", pcn<CT>(className, "icon"))}
            icon={rightIcon}
          />
        )}
      </div>

      {strength && (
        <div className="flex items-center gap-2 mt-1">
          <div
            className={cn(
              "h-1 rounded transition-all duration-300 w-1/3",
              strength === "weak" && "bg-danger",
              strength === "strong" && "bg-warning",
              strength === "excellent" && "bg-success",
            )}
          />
          <div
            className={cn(
              "h-1 rounded transition-all duration-300 w-1/3",
              strength === "weak" && "bg-background",
              strength === "strong" && "bg-warning",
              strength === "excellent" && "bg-success",
            )}
          />
          <div
            className={cn(
              "h-1 rounded transition-all duration-300 w-1/3",
              strength === "weak" && "bg-background ",
              strength === "strong" && "bg-background",
              strength === "excellent" && "bg-success",
            )}
          />
          <span
            className={cn(
              "text-[10px] font-medium",
              strength === "weak" && "text-danger",
              strength === "strong" && "text-warning",
              strength === "excellent" && "text-success",
            )}
          >
            {strength === "weak"
              ? "Weak"
              : strength === "strong"
              ? "Strong"
              : "Excellent"}
          </span>
        </div>
      )}

      <div className="mt-4">
        <label
          htmlFor={randomConfirmId}
          className={cn("input-label text-sm", pcn<CT>(className, "label"))}
        >
          Password Confirm
        </label>
        <div className="relative">
          <input
            {...props}
            id={randomConfirmId}
            type="password"
            className={cn(
              "input",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              pcn<CT>(className, "base"),
              isConfirmMismatch && "input-error",
            )}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              onChange?.(password, e.target.value);
            }}
            autoComplete="off"
          />
        </div>
      </div>

      {(isInvalid || isConfirmMismatch) && (
        <small className={cn("input-error-message", "text-danger mt-1")}>
          {isInvalid || "Password confirmation not match"}
        </small>
      )}
    </div>
  );
}
