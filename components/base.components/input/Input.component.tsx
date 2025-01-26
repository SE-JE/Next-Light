import {
  parseClassName,
  useValidationHelper,
  ValidationRules,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, {
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

type classNamePrefix =
  | "label"
  | "tip"
  | "error"
  | "input"
  | "icon"
  | "suggest"
  | "suggest-item";

export interface inputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  tip?: string | ReactNode;
  leftIcon?: any;
  rightIcon?: any;

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className?: string;

  value?: string;
  error?: string;
  suggestions?: string[];

  validations?: ValidationRules;
  onlyAlphabet?: boolean;
  autoUppercase?: boolean;

  onChange?: (value: string) => any;
  register?: (name: string, validations?: ValidationRules) => void;
}

export function InputComponent({
  label,
  tip,
  leftIcon,
  rightIcon,
  className = "",

  value,
  error,
  suggestions,

  validations,
  onlyAlphabet,
  autoUppercase,

  register,
  onChange,

  ...props
}: inputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isInvalid, setIsInvalid] = useState("");
  const [isFirst, setIsFirst] = useState(true);

  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dataSuggestions, setDataSuggestions] = useState<string[] | undefined>(
    []
  );
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    string[] | undefined
  >([]);

  // =========================>
  // ## initial
  // =========================>
  useEffect(() => {
    register?.(props.name || "", validations);
  }, [register, validations]);

  const randomId = useMemo(() => Math.random().toString(36).substring(7), []);

  // =========================>
  // ## invalid handler
  // =========================>
  const [errorMessage] = useValidationHelper(
    {
      value: inputValue,
      rules: validations,
    },
    isFirst
  );

  useEffect(() => {
    setIsInvalid(errorMessage || error || "");
  }, [error, errorMessage]);

  // =========================>
  // ## change value handler
  // =========================>
  useEffect(() => {
    setInputValue(value || "");
    value && setIsFirst(false);
  }, [value]);

  useEffect(() => {
    if (inputValue && typeof inputValue === "string") {
      let val = inputValue.split("");
      let newVal = "";

      if (onlyAlphabet) {
        val.map((data) => {
          if (data == " ") {
            newVal += " ";
          } else if (/[A-Za-z]/.test(data)) {
            newVal += data;
          }
        });
      } else {
        newVal = inputValue;
      }

      if (autoUppercase) newVal = newVal.toUpperCase();

      if (validations?.max) newVal = newVal.slice(0, validations?.max);

      setInputValue(newVal);
    }
  }, [inputValue, onlyAlphabet, autoUppercase, validations]);

  // =========================>
  // ## suggestions handler
  // =========================>
  useEffect(() => {
    setDataSuggestions(suggestions);
  }, [suggestions]);

  const filterSuggestion = (e: any) => {
    if (dataSuggestions?.length) {
      let filteredSuggestion = [];

      if (e.target.value) {
        filteredSuggestion = dataSuggestions
          .filter(
            (suggestion) =>
              suggestion.toLowerCase().indexOf(e.target.value.toLowerCase()) >
              -1
          )
          .slice(0, 10);
      } else {
        filteredSuggestion = dataSuggestions.slice(0, 10);
      }

      setActiveSuggestion(-1);
      setFilteredSuggestions(filteredSuggestion);
      setShowSuggestions(true);
    }
  };

  const onKeyDownSuggestion = (e: any) => {
    if (dataSuggestions?.length) {
      if (e.keyCode === 13) {
        let resultValue = filteredSuggestions?.at(activeSuggestion);
        setActiveSuggestion(-1);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setInputValue(resultValue ? resultValue : inputValue);
        if (onChange) {
          onChange(resultValue ? resultValue : inputValue);
        }
        e.preventDefault();
      } else if (e.keyCode === 38) {
        if (activeSuggestion === 0) {
          return;
        }

        setActiveSuggestion(activeSuggestion - 1);
      } else if (e.keyCode === 40) {
        if (activeSuggestion + 1 >= (filteredSuggestions?.length || 0)) {
          return;
        }

        setActiveSuggestion(activeSuggestion + 1);
      }
    }
  };

  return (
    <>
      <div className="relative flex flex-col gap-y-0.5">
        <label
          htmlFor={randomId}
          className={clsx(
            "input-label",
            parseClassName<classNamePrefix>(className, "label"),
            props.disabled && "opacity-50",
            props.disabled &&
              parseClassName<classNamePrefix>(className, "label", "disabled"),
            isFocus && "text-primary",
            isFocus &&
              parseClassName<classNamePrefix>(className, "label", "focus"),
            isInvalid && "text-danger",
            isInvalid &&
              parseClassName<classNamePrefix>(className, "label", "focus")
          )}
        >
          {label}
        </label>

        {tip && (
          <small
            className={clsx(
              "input-tip",
              parseClassName<classNamePrefix>(className, "tip"),
              props.disabled && "opacity-60",
              props.disabled &&
                parseClassName<classNamePrefix>(className, "tip", "disabled")
            )}
          >
            {tip}
          </small>
        )}

        <div className="relative">
          <input
            {...props}
            id={randomId}
            className={clsx(
              "input",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              parseClassName<classNamePrefix>(className, "input"),
              isInvalid && "input-error",
              isInvalid &&
                parseClassName<classNamePrefix>(className, "input", "error")
            )}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsFirst(false);
              setIsInvalid("");
              onChange?.(e.target.value);
              dataSuggestions?.length && filterSuggestion(e);
            }}
            onFocus={(e) => {
              props.onFocus?.(e);
              setIsFocus(true);
              dataSuggestions?.length && filterSuggestion(e);
            }}
            onBlur={(e) => {
              props.onBlur?.(e);
              setTimeout(() => setIsFocus(false), 100);
            }}
            onKeyDown={(e) => {
              dataSuggestions?.length && onKeyDownSuggestion(e);
            }}
            autoComplete={
              props.autoComplete || dataSuggestions?.length ? "off" : ""
            }
          />

          {leftIcon && (
            <FontAwesomeIcon
              className={clsx(
                "left-4 input-icon ",
                parseClassName<classNamePrefix>(className, "icon"),
                props.disabled && "opacity-60",
                props.disabled &&
                  parseClassName<classNamePrefix>(
                    className,
                    "icon",
                    "disabled"
                  ),
                isFocus && "text-primary",
                isFocus &&
                  parseClassName<classNamePrefix>(className, "icon", "focus")
              )}
              icon={leftIcon}
            />
          )}

          {rightIcon && (
            <FontAwesomeIcon
              className={clsx(
                "right-4 input-icon",
                parseClassName<classNamePrefix>(className, "icon"),
                props.disabled && "opacity-60",
                props.disabled &&
                  parseClassName<classNamePrefix>(
                    className,
                    "icon",
                    "disabled"
                  ),
                isFocus && "text-primary",
                isFocus &&
                  parseClassName<classNamePrefix>(className, "icon", "focus")
              )}
              icon={rightIcon}
            />
          )}
        </div>

        {!!dataSuggestions?.length &&
          showSuggestions &&
          !!filteredSuggestions?.length && (
            <div>
              <ul
                className={clsx(
                  "input-suggest-container",
                  parseClassName<classNamePrefix>(className, "suggest"),
                  isFocus
                    ? "opacity-100 scale-y-100 -translate-y-0"
                    : "opacity-0 scale-y-0 -translate-y-1/2"
                )}
              >
                {filteredSuggestions.map((suggestion, key) => {
                  return (
                    <li
                      className={clsx(
                        "input-suggest",
                        parseClassName<classNamePrefix>(
                          className,
                          "suggest-item"
                        ),
                        inputValue == suggestion &&
                          "bg-light-primary text-primary",
                        inputValue == suggestion &&
                          parseClassName<classNamePrefix>(
                            className,
                            "suggest-item",
                            "active"
                          )
                      )}
                      key={suggestion}
                      onMouseDown={() => {
                        setTimeout(() => setIsFocus(true), 110);
                      }}
                      onMouseUp={() => {
                        setActiveSuggestion(key);
                        setFilteredSuggestions([]);
                        setShowSuggestions(false);
                        setInputValue(filteredSuggestions[key] || inputValue);
                        onChange?.(filteredSuggestions[key] || inputValue);
                        setTimeout(() => setIsFocus(false), 120);
                      }}
                    >
                      {suggestion}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

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
