import { cn, pcn, useValidationHelper, ValidationRulesType } from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, {
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { OutsideClickComponent } from "../formater-wrapper";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

type CT =
  | "label"
  | "tip"
  | "error"
  | "input"
  | "icon"
  | "suggest"
  | "suggest-item";

type CustomDatePickerPropsType = {
  onDateSelect?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
};

export interface InputDatePropsType
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  tip?: string | ReactNode;
  leftIcon?: any;
  rightIcon?: any;

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className?: string;

  value?: string;
  error?: string;

  validations?: ValidationRulesType;

  onChange?: (value: string) => any;
  register?: (name: string, validations?: ValidationRulesType) => void;
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
}: InputDatePropsType) {
  const [inputValue, setInputValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isInvalid, setIsInvalid] = useState("");
  const [isFirst, setIsFirst] = useState(true);

  // =========================>
  // ## initial
  // =========================>
  useEffect(() => {
    register?.(props.name || "", validations);
  }, [props.name, validations]);

  const [randomId, setRandomId] = useState("");

  useEffect(() => {
    setRandomId(Math.random().toString(36).substring(7));
  }, []);

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
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            props.disabled && "opacity-50",
            props.disabled && pcn<CT>(className, "label", "disabled"),
            isFocus && "text-primary",
            isFocus && pcn<CT>(className, "label", "focus"),
            isInvalid && "text-danger",
            isInvalid && pcn<CT>(className, "label", "focus")
          )}
        >
          {label}
          {validations?.required && <span className="text-danger">*</span>}
        </label>

        {tip && (
          <small
            className={cn(
              "input-tip",
              pcn<CT>(className, "tip"),
              props.disabled && "opacity-60",
              props.disabled && pcn<CT>(className, "tip", "disabled")
            )}
          >
            {tip}
          </small>
        )}

        <OutsideClickComponent onOutsideClick={() => setIsFocus(false)}>
          <div className="relative">
            <input
              {...props}
              id={randomId}
              className={cn(
                "input",
                leftIcon && "pl-12",
                rightIcon && "pr-12",
                pcn<CT>(className, "input"),
                isInvalid && "input-error",
                isInvalid && pcn<CT>(className, "input", "error")
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
                // setTimeout(() => setIsFocus(false), 100);
              }}
              autoComplete="off"
            />

            {leftIcon && (
              <FontAwesomeIcon
                className={cn(
                  "left-4 input-icon ",
                  pcn<CT>(className, "icon"),
                  props.disabled && "opacity-60",
                  props.disabled && pcn<CT>(className, "icon", "disabled"),
                  isFocus && "text-primary",
                  isFocus && pcn<CT>(className, "icon", "focus")
                )}
                icon={leftIcon}
              />
            )}

            {rightIcon && (
              <FontAwesomeIcon
                className={cn(
                  "right-4 input-icon",
                  pcn<CT>(className, "icon"),
                  props.disabled && "opacity-60",
                  props.disabled && pcn<CT>(className, "icon", "disabled"),
                  isFocus && "text-primary",
                  isFocus && pcn<CT>(className, "icon", "focus")
                )}
                icon={rightIcon}
              />
            )}

            {isFocus && (
              <CustomDatePicker
                minDate="2025-01-20"
                maxDate="2025-04-22"
                onDateSelect={(e) => {
                  setInputValue(e);
                  onChange?.(e);
                }}
              />
            )}
          </div>
        </OutsideClickComponent>

        {isInvalid && (
          <small
            className={cn("input-error-message", pcn<CT>(className, "error"))}
          >
            {isInvalid}
          </small>
        )}
      </div>
    </>
  );
}

const CustomDatePicker: React.FC<CustomDatePickerPropsType> = ({
  onDateSelect,
  minDate,
  maxDate,
}) => {
  const activeYearRef = useRef<HTMLDivElement | null>(null);
  const containerYearRef = useRef<HTMLDivElement | null>(null);

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
    const startDay = moment(startDate);
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
    const day = moment(startDate);
    while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = moment(day);
        days.push(
          <div
            key={day.toString()}
            className={`w-8 aspect-square flex items-center justify-center text-center rounded-lg transition-all 
              ${
                day.isSame(currentDate, "month")
                  ? "text-foreground"
                  : "text-light-foreground"
              } 
              ${
                day.isSame(selectedDate, "day")
                  ? "bg-primary text-background"
                  : "hover:bg-light-primary"
              }
              ${
                day.isSame(moment(), "day")
                  ? "border !border-primary"
                  : "hover:bg-light-primary"
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

  const years = useMemo(() => {
    const dumpYears = [];

    for (let i = 1945; i <= moment().year(); i++) {
      dumpYears.push(i);
    }

    return dumpYears;
  }, []);

  useEffect(() => {
    if (activeYearRef.current && containerYearRef.current) {
      containerYearRef.current.scrollTo({
        top:
          activeYearRef.current.offsetTop - containerYearRef.current.offsetTop,
      });
    }
  }, []);

  return (
    <div className="w-80 h-72 bg-white border p-2 rounded-[6px] absolute top-full left-0 mt-1 z-50">
      <div className="flex gap-2">
        <div
          className="max-h-[260] overflow-y-auto input-scroll pr-1"
          ref={containerYearRef}
        >
          <div className="flex flex-col">
            {years?.map((item, key) => {
              const isActive = currentDate?.year() === item;

              return (
                <>
                  <div
                    key={key}
                    ref={isActive ? activeYearRef : null}
                    className={`py-1 px-2 font-semibold rounded-[6px] cursor-pointer ${isActive && "bg-light-primary"}`}
                    onClick={() => {
                      setCurrentDate(moment().set("year", item));
                    }}
                  >
                    {item}
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <button
              onClick={handlePrevMonth}
              className="w-8 text-sm aspect-square rounded-full cursor-pointer"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h2 className="font-semibold">{currentDate.format("MMMM YYYY")}</h2>
            <button
              onClick={handleNextMonth}
              className="w-8 text-sm aspect-square rounded-full cursor-pointer"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">{renderDays()}</div>
          <div>{renderCells()}</div>
        </div>
      </div>
    </div>
  );
};
