import React, { InputHTMLAttributes, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn, useInputHandler, useInputRandomId, useValidation, validation } from "@utils/.";
import { OutsideClickComponent } from "@components/.";



type CT = "label" | "tip" | "error" | "input" | "icon";

export interface InputDateProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label      ?:  string;
  tip        ?:  string | ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  string;
  invalid      ?:  string;
  validations  ?:  string;
  
  onChange  ?:  (value: string) => any;
  register  ?:  (name: string, validations?: string) => void;

  /** Use custom class with: "label::", "tip::", "error::", "icon::". */
  className  ?:  string;
}



export function InputDateComponent({
  label,
  tip,
  leftIcon,
  rightIcon,
  
  value,
  invalid,
  validations,

  register,
  onChange,
  
  className = "",
  ...props
}: InputDateProps) {

  // =========================>
  // ## Initial
  // =========================>
  const inputHandler = useInputHandler(props.name, value, validations, register, false)
  const randomId = useInputRandomId()


  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage] = useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


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
            inputHandler.focus && "text-primary",
            inputHandler.focus && pcn<CT>(className, "label", "focus"),
            !!invalidMessage && "text-danger",
            !!invalidMessage && pcn<CT>(className, "label", "focus")
          )}
        >
          {label}
          {validations && validation.hasRules(validations, "required") && <span className="text-danger">*</span>}
        </label>

        {tip && (
          <small
            className={cn(
              "input-tip",
              pcn<CT>(className, "tip"),
              props.disabled && "opacity-60",
              props.disabled && pcn<CT>(className, "tip", "disabled")
            )}
          >{tip}</small>
        )}

        <OutsideClickComponent onOutsideClick={() => inputHandler.setFocus(false)}>
          <div className="relative">
            <input
              {...props}
              id={randomId}
              className={cn(
                "input",
                leftIcon && "pl-12",
                rightIcon && "pr-12",
                pcn<CT>(className, "input"),
                !!invalidMessage && "input-error",
                !!invalidMessage && pcn<CT>(className, "input", "error")
              )}
              value={inputHandler.value}
              onChange={(e) => {
                inputHandler.setValue(e.target.value);
                inputHandler.setValue(false);
                onChange?.(e.target.value);
              }}
              onFocus={(e) => {
                props.onFocus?.(e);
                inputHandler.setFocus(true);
              }}
              onBlur={(e) => {
                props.onBlur?.(e);
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
                  inputHandler.focus && "text-primary",
                  inputHandler.focus && pcn<CT>(className, "icon", "focus")
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
                  inputHandler.focus && "text-primary",
                  inputHandler.focus && pcn<CT>(className, "icon", "focus")
                )}
                icon={rightIcon}
              />
            )}

            {inputHandler.focus && (
              <InputDatePickerComponent
                onChange={(e) => {
                  inputHandler.setValue(e);
                  onChange?.(e);
                }}
              />
            )}
          </div>
        </OutsideClickComponent>

        {invalidMessage && (
          <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
        )}
      </div>
    </>
  );
}



export interface InputDatePickerProps {
  onChange      ?:  (date: string) => void;
  minDate       ?:  string;
  maxDate       ?:  string;
  rightElement  ?:  ReactNode;
};



export const InputDatePickerComponent: React.FC<InputDatePickerProps> = ({
  onChange,
  minDate,
  maxDate,
  rightElement,
}) => {
  const activeYearRef     =  useRef<HTMLDivElement | null>(null);
  const containerYearRef  =  useRef<HTMLDivElement | null>(null);

  const [currentDate, setCurrentDate]    =  useState(moment());
  const [selectedDate, setSelectedDate]  =  useState(moment());

  const startDate  =  moment(currentDate).startOf("month").startOf("week");
  const endDate    =  moment(currentDate).endOf("month").endOf("week");

  const handlePrevMonth = () => setCurrentDate(moment(currentDate).subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(moment(currentDate).add(1, "month"));

  const handleDateClick = (date: moment.Moment) => {
    if ((minDate && date.isBefore(moment(minDate))) || (maxDate && date.isAfter(moment(maxDate)))) { return; }

    setSelectedDate(date);
    onChange?.(date.format("YYYY-MM-DD"));
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
    const rows  =  [];
    let   days  =  [];
    const day   =  moment(startDate);

    while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = moment(day);

        days.push(
          <div
            key={day.toString()}
            className={`w-8 aspect-square flex items-center justify-center text-center rounded-lg transition-all 
              ${day.isSame(currentDate, "month") ? "text-foreground" : "text-light-foreground"} 
              ${day.isSame(selectedDate, "day") ? "bg-primary text-background" : "hover:bg-light-primary"}
              ${day.isSame(moment(), "day") ? "border !border-primary" : "hover:bg-light-primary"} 
              ${(minDate && day.isBefore(moment(minDate))) || (maxDate && day.isAfter(moment(maxDate))) ? "opacity-10 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => handleDateClick(cloneDay)}
          >{day.format("D")}</div>
        );

        day.add(1, "day");
      }

      rows.push(<div key={day.toString()} className="grid grid-cols-7 gap-1">{days}</div>);

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
        top: activeYearRef.current.offsetTop - containerYearRef.current.offsetTop,
      });
    }
  }, []);

  return (
    <div className="w-max h-72 bg-white border p-2 rounded-[6px] absolute top-full left-0 mt-1 z-50">
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
                    onClick={() => setCurrentDate(moment().set("year", item))}
                  >
                    {item}
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={handlePrevMonth}
              className="w-8 text-sm aspect-square rounded-full cursor-pointer"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h2 className="font-semibold">{currentDate.format("MMMM")}</h2>
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

        {rightElement && <div>{rightElement}</div>}
      </div>
    </div>
  );
};
