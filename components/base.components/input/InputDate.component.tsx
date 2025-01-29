import {
  parseClassName,
  useValidationHelper,
  ValidationRules,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import moment from "moment";
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

type CustomDatePickerProps = {
  onDateSelect?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
};

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

  validations?: ValidationRules;

  onChange?: (value: string) => any;
  register?: (name: string, validations?: ValidationRules) => void;
}

export function InputDateComponent({
  label,
  tip,
  leftIcon,
  rightIcon,
  className = "",

  value,
  error,

  validations,

  register,
  onChange,

  ...props
}: inputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isInvalid, setIsInvalid] = useState("");
  const [isFirst, setIsFirst] = useState(true);

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

          {isFocus && (
            <CustomDatePicker
              minDate="2025-01-20"
              onDateSelect={(e) => {
                setInputValue(e);
                onChange?.(e);
              }}
            />
          )}
        </div>

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

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onDateSelect,
  minDate,
  maxDate,
}) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());

  const startDate = moment(currentDate).startOf("month").startOf("week");
  const endDate = moment(currentDate).endOf("month").endOf("week");

  const handlePrevMonth = () =>
    setCurrentDate(moment(currentDate).subtract(1, "month"));
  const handleNextMonth = () =>
    setCurrentDate(moment(currentDate).add(1, "month"));

  const handleDateClick = (date: moment.Moment) => {
    if (
      (minDate && date.isBefore(moment(minDate))) ||
      (maxDate && date.isAfter(moment(maxDate)))
    ) {
      return;
    }
    setSelectedDate(date);
    onDateSelect?.(date.format("YYYY-MM-DD"));
  };

  const renderDays = () => {
    const days = [];
    let startDay = moment(startDate);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-bold">
          {startDay.add(i, "days").format("dd")}
        </div>
      );
    }
    return days;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = moment(startDate);
    while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = moment(day);
        days.push(
          <div
            key={day.toString()}
            className={`p-2 text-center rounded-lg transition-all 
              ${
                day.isSame(currentDate, "month")
                  ? "text-black"
                  : "text-gray-400"
              } 
              ${
                day.isSame(selectedDate, "day")
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100"
              } 
              ${
                (minDate && day.isBefore(moment(minDate))) ||
                (maxDate && day.isAfter(moment(maxDate)))
                  ? "opacity-10 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            onClick={() => handleDateClick(cloneDay)}
          >
            {day.format("D")}
          </div>
        );
        day.add(1, "day");
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg p-4 absolute top-full left-0 mt-1 z-50">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={handlePrevMonth}
          className="p-2 bg-gray-200 rounded-full"
        >
          ◀
        </button>
        <h2 className="text-lg font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <button
          onClick={handleNextMonth}
          className="p-2 bg-gray-200 rounded-full"
        >
          ▶
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">{renderDays()}</div>
      <div>{renderCells()}</div>
    </div>
  );
};
