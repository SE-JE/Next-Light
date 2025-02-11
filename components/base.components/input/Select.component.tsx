import {
  get,
  getProps,
  parseClassName,
  standIn,
  useLazySearch,
  useValidationHelper,
  ValidationRules,
} from "@/helpers";
import {
  faCheckCircle,
  faChevronDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { ReactNode, useEffect, useMemo, useState } from "react";

type classNamePrefix =
  | "label"
  | "tip"
  | "error"
  | "input"
  | "icon"
  | "suggest"
  | "suggest-item";

export type selectOptionProps = {
  label: string;
  value: string | number;
  searchable?: string[];
  customLabel?: ReactNode;
};

export interface SelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  tip?: string | ReactNode;
  leftIcon?: any;
  rightIcon?: any;

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className?: string;

  value?: string | number | (string | number)[];
  error?: string;
  disabled?: boolean;
  validations?: ValidationRules;
  multiple?: boolean;
  autoFocus?: boolean;

  options?: selectOptionProps[];
  searchable?: boolean;
  serverOptionControl?: getProps & { cacheName?: string };
  serverSearchable?: boolean;
  includedOptions?: selectOptionProps[];
  exceptOptions?: (string | number)[];
  tempOptions?: selectOptionProps[];
  newOption?: selectOptionProps;
  maxShowOption?: number;

  onChange?: (value: string | number | (string | number)[], data?: any) => any;
  register?: (name: string, validations?: ValidationRules) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SelectComponent({
  name,
  label,
  placeholder,
  tip,
  leftIcon,
  rightIcon,
  className = "",

  value,
  error,
  disabled,
  validations,
  multiple,
  autoFocus,

  options = [],
  searchable,
  serverOptionControl,
  serverSearchable,
  includedOptions = [],
  exceptOptions = [],
  tempOptions,
  newOption,
  maxShowOption = 10,

  register,
  onChange,
  onFocus,
  onBlur,
}: SelectProps) {
  const [inputShowValue, setInputShowValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<
    string | number | (string | number)[]
  >("");
  const [isFocus, setIsFocus] = useState(false);
  const [isInvalid, setIsInvalid] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const [keydown, setKeydown] = useState(false);
  const [useTemp, setUseTemp] = useState(true);

  const [dataOptions, setDataOptions] = useState<selectOptionProps[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<selectOptionProps[]>(
    []
  );
  const [loadingOption, setLoadingOption] = useState(false);
  const [activeOption, setActiveOption] = useState(0);
  const [showOption, setShowOption] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [keywordSearch] = useLazySearch(keyword);

  // =========================>
  // ## initial
  // =========================>
  useEffect(() => {
    register?.(name || "", validations);
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
    if (value) {
      setInputValue(value);
      Array.isArray(dataOptions) &&
        setInputShowValue(
          (newOption ? [newOption, ...dataOptions] : dataOptions)?.find(
            (option) => option.value == value
          )?.label || ""
        );
      setIsFirst(false);
    } else {
      setInputValue("");
      setInputShowValue("");
    }
  }, [value, dataOptions]);

  // =========================>
  // ## options handler
  // =========================>
  useEffect(() => {
    setDataOptions(
      [...options, ...includedOptions].filter(
        (op: selectOptionProps) => !exceptOptions?.includes(op.value)
      )
    );
  }, [options]);

  const filterOption = (e: any) => {
    if (dataOptions?.length) {
      let newFilteredOptions: selectOptionProps[] = [];

      if (searchable && !serverSearchable) {
        if (e.target.value) {
          newFilteredOptions = dataOptions
            .filter(
              (Option) =>
                Option.label
                  ?.toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) > -1
            )
            .slice(0, maxShowOption);
        } else {
          newFilteredOptions = dataOptions.slice(0, maxShowOption);
        }
      } else {
        newFilteredOptions = dataOptions;
      }

      setActiveOption(-1);
      setFilteredOptions(newFilteredOptions);
      setShowOption(true);
    }
  };

  const onKeyDownOption = (e: any) => {
    if (dataOptions?.length) {
      if (e.keyCode === 13) {
        const resultValue = filteredOptions?.at(activeOption);
        setActiveOption(-1);
        setFilteredOptions([]);
        setShowOption(false);
        if (!multiple) {
          setInputShowValue(resultValue?.label || inputShowValue);
          setInputValue(resultValue?.value || inputShowValue);
          serverSearchable && setKeyword(resultValue?.label || keyword);
        } else {
          if (resultValue?.value) {
            searchable
              ? setInputShowValue(resultValue.label)
              : searchable && setInputShowValue("");

            serverSearchable && setKeyword(resultValue.label);

            const values: string[] = Array.isArray(inputValue)
              ? Array()
                  .concat(inputValue)
                  ?.filter((val: string | number) => val != resultValue?.value)
              : [];

            if (values.find((val) => val == resultValue?.value)) {
              setInputValue(values);
            } else {
              setInputValue([...Array().concat(values), resultValue.value]);
            }
          }
        }
        e.preventDefault();
      } else if (e.keyCode === 38) {
        if (activeOption === 0) return;
        setActiveOption(activeOption - 1);
      } else if (e.keyCode === 40) {
        if (activeOption + 1 >= (filteredOptions?.length || 0)) return;
        setActiveOption(activeOption + 1);
      }
    }
  };

  const fetchOptions = async () => {
    setLoadingOption(true);

    const serverControl = {
      ...serverOptionControl,
      params: serverSearchable
        ? {
            search: keywordSearch,
          }
        : {},
    };

    const cacheOptions = await standIn.get(
      serverOptionControl?.cacheName || `option_${serverOptionControl?.path}`
    );

    if (cacheOptions) {
      setDataOptions(
        [...cacheOptions, ...includedOptions].filter(
          (op: selectOptionProps) => !exceptOptions?.includes(op.value)
        )
      );
      setLoadingOption(false);
    } else {
      const mutateOptions = await get(serverControl || {});
      setDataOptions(
        [...mutateOptions?.data, ...includedOptions].filter(
          (op: selectOptionProps) => !exceptOptions?.includes(op.value)
        )
      );
      setShowOption(true);
      standIn.set({
        key:
          serverOptionControl?.cacheName ||
          `option_${serverOptionControl?.path}`,
        data: mutateOptions?.data,
        expired: 5,
      });
      setLoadingOption(false);
    }
  };

  useEffect(() => {
    if (!serverSearchable) {
      if (serverOptionControl?.path || serverOptionControl?.url) {
        fetchOptions();
      } else {
        !options && setDataOptions([]);
      }
    }
  }, [serverOptionControl?.path, serverOptionControl?.url]);

  useEffect(() => {
    if (serverSearchable) {
      if (serverOptionControl?.path || serverOptionControl?.url) {
        fetchOptions();
      } else {
        !options && setDataOptions([]);
      }
    }
  }, [keywordSearch, serverOptionControl?.path, serverOptionControl?.url]);

  return (
    <>
      <div className="relative flex flex-col gap-y-0.5">
        <label
          htmlFor={randomId}
          className={clsx(
            "input-label",
            parseClassName<classNamePrefix>(className, "label"),
            disabled && "opacity-50",
            disabled &&
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
              disabled && "opacity-60",
              disabled &&
                parseClassName<classNamePrefix>(className, "tip", "disabled")
            )}
          >
            {tip}
          </small>
        )}

        <div className="relative">
          <input
            type="hidden"
            value={
              !multiple
                ? String(inputValue)
                : Array()
                    .concat(inputValue)
                    .map((val) => String(val))
            }
            name={name}
          />

          <input
            type="text"
            readOnly={!searchable}
            id={randomId}
            placeholder={
              !inputValue || (Array.isArray(inputValue) && !inputValue.length)
                ? placeholder
                : ""
            }
            disabled={disabled}
            className={clsx(
              "input",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              parseClassName<classNamePrefix>(className, "input"),
              isInvalid && "input-error",
              isInvalid &&
                parseClassName<classNamePrefix>(className, "input", "error")
            )}
            value={
              useTemp && tempOptions
                ? tempOptions.at(0)?.label
                : serverSearchable
                ? keyword
                : inputShowValue
            }
            onChange={(e) => {
              setUseTemp(false);
              searchable && setInputShowValue(e.target.value);
              serverSearchable && setKeyword(e.target.value);
              setIsFirst(false);
              !errorMessage && setIsInvalid("");
              dataOptions?.length && filterOption(e);
            }}
            onFocus={(e) => {
              setUseTemp(false);
              setIsFocus(true);
              onFocus?.();
              dataOptions?.length && filterOption(e);
              searchable && e.target.select();
            }}
            onBlur={(e) => {
              setUseTemp(false);
              const value = e.target.value;
              const valueOption = dataOptions?.find(
                (option) => option.label?.toLowerCase() == value?.toLowerCase()
              );

              if (!keydown) {
                if (!multiple) {
                  setTimeout(() => {
                    if (valueOption?.value) {
                      setInputShowValue(valueOption.label);
                      setInputValue(valueOption.value);
                      serverSearchable && setKeyword(valueOption.label);
                      onChange?.(valueOption.value, valueOption);
                    } else {
                      setInputShowValue("");
                      serverSearchable && setKeyword("");
                      setInputValue("");
                      onChange?.("");
                    }
                  }, 140);
                } else {
                  setInputShowValue("");
                  serverSearchable && setKeyword("");
                  onChange?.("");
                }
              }

              setTimeout(() => {
                setIsFocus(false);
              }, 100);
              onBlur?.();
            }}
            onKeyDown={(e) => {
              dataOptions?.length && onKeyDownOption(e);
            }}
            autoComplete="off"
            autoFocus={autoFocus}
          />

          {(!searchable || (searchable && !isFocus)) && (
            <div
              className={`
                absolute top-1/2 -translate-y-1/2 overflow-x-auto py-1.5 input-scroll
                ${leftIcon ? "ml-[2.5rem]" : "ml-2"}
              `}
              style={{
                maxWidth: `calc(100% - ${leftIcon ? "5.2rem" : "3.2rem"})`,
              }}
            >
              <div className={`input-values-container`}>
                {multiple &&
                  typeof inputValue != "string" &&
                  Array()
                    .concat(inputValue)
                    ?.map((item, key) => {
                      return (
                        <div key={key} className={`input-values-item`}>
                          <span className="">
                            {
                              dataOptions?.find(
                                (option) => option.value == item
                              )?.label
                            }
                          </span>
                          <FontAwesomeIcon
                            icon={faTimes}
                            className={`input-values-delete`}
                            onClick={() => {
                              const values = Array().concat(inputValue);
                              const index = values.findIndex(
                                (val: string | number) => val == item
                              );
                              setInputValue(
                                values.filter((_, val) => val != index)
                              );
                              if (
                                !values.filter((_, val) => val != index)?.length
                              ) {
                                setInputShowValue("");
                                serverSearchable && setKeyword("");
                                onChange?.("");
                              }
                            }}
                          />
                        </div>
                      );
                    })}
              </div>
            </div>
          )}

          {leftIcon && (
            <FontAwesomeIcon
              className={clsx(
                "left-4 input-icon ",
                parseClassName<classNamePrefix>(className, "icon"),
                disabled && "opacity-60",
                disabled &&
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

          {!multiple && inputValue && (
            <div
              className={clsx(
                "right-12 input-icon cursor-pointer hover:text-danger",
                disabled && "opacity-60 pointer-events-none",
                disabled &&
                  parseClassName<classNamePrefix>(className, "icon", "disabled")
              )}
              onClick={() => {
                setInputShowValue("");
                setInputValue("");
                onChange?.("");
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          )}

          <label
            htmlFor={randomId}
            className={clsx(
              "right-4 input-icon cursor-pointer hover:text-primary",
              disabled && "opacity-60 pointer-events-none",
              disabled &&
                parseClassName<classNamePrefix>(className, "icon", "disabled")
            )}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </label>
        </div>

        {!!dataOptions?.length &&
          showOption &&
          !loadingOption &&
          !!filteredOptions?.length && (
            <div>
              <ul
                className={`
                  input-suggest-container scroll-sm
                  ${isFocus ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}
                `}
              >
                {(newOption
                  ? [newOption, ...filteredOptions]
                  : filteredOptions
                ).map((option, key) => {
                  const selected =
                    !!(
                      (typeof inputValue == "string" ||
                        typeof inputValue == "number") &&
                      inputValue == option.value
                    ) ||
                    (Array.isArray(inputValue) &&
                      Array()
                        .concat(inputValue)
                        .find((val: string | number) => val == option.value));
                  return (
                    <li
                      className={`
                        cursor-pointer hover:bg-light-primary
                        input-suggest
                        ${
                          (key == activeOption || selected) &&
                          "bg-light-primary text-primary"
                        }
                      `}
                      key={key}
                      onMouseDown={() => {
                        setKeydown(true);
                        setTimeout(() => setIsFocus(true), 110);
                      }}
                      onMouseUp={() => {
                        setKeydown(false);
                        setActiveOption(key);
                        setFilteredOptions([]);
                        setShowOption(false);
                        if (!multiple) {
                          setInputShowValue(option.label);
                          serverSearchable && setKeyword(option.label);
                          setInputValue(option.value);
                          onChange?.(option.value, option);
                        } else {
                          const values: string[] | number[] = Array.isArray(
                            inputValue
                          )
                            ? Array()
                                .concat(inputValue)
                                .filter((val) => val != option.value)
                            : [];
                          setInputShowValue("");
                          serverSearchable && setKeyword("");
                          if (
                            Array.isArray(inputValue) &&
                            Array()
                              .concat(inputValue)
                              .find((val) => val == option.value)
                          ) {
                            setInputValue(values);
                            onChange?.(values);
                          } else {
                            setInputValue([
                              ...Array().concat(values),
                              option.value,
                            ]);
                            onChange?.([
                              ...Array().concat(values),
                              option.value,
                            ]);
                          }
                        }
                        setTimeout(() => setIsFocus(false), 120);
                      }}
                    >
                      {selected && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="mr-2 text-sm"
                        />
                      )}
                      {option.label}
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
