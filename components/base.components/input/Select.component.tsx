"use client"

import { ReactNode, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown, faTimes,} from "@fortawesome/free-solid-svg-icons";
import { api, ApiType, cavity, cn, pcn, useInputHandler, useInputRandomId, useLazySearch, useValidation, validation, ValidationRules,} from "@utils";



type CT = "label" | "tip" | "error" | "input" | "icon" | "suggest" | "suggest-item";

export interface SelectOptionProps {
  label         :  string | ReactNode;
  value         :  string | number;
  searchable   ?:  string[];
  customLabel  ?:  ReactNode;
};

export interface SelectProps {
  name          :  string;
  label        ?:  string;
  placeholder  ?:  string;
  tip          ?:  string | ReactNode;
  leftIcon     ?:  any;
  rightIcon    ?:  any;

  value        ?:  string | number | (string | number)[];
  invalid      ?:  string;
  disabled     ?:  boolean;
  validations  ?:  ValidationRules;
  multiple     ?:  boolean;
  autoFocus    ?:  boolean;
  clearable    ?:  boolean;

  options              ?:  SelectOptionProps[];
  searchable           ?:  boolean;
  serverOptionControl  ?:  ApiType & { cacheName?: string };
  serverSearchable     ?:  boolean;
  includedOptions      ?:  SelectOptionProps[];
  exceptOptions        ?:  (string | number)[];
  tempOptions          ?:  SelectOptionProps[];
  newOption            ?:  SelectOptionProps;
  maxShowOption        ?:  number;

  onChange  ?:  (value: string | number | (string | number)[], data?: any) => any;
  register  ?:  (name: string, validations?: ValidationRules) => void;
  onFocus   ?:  () => void;
  onBlur    ?:  () => void;

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className    ?:  string;
}



export function SelectComponent({
  name,
  label,
  placeholder,
  tip,
  leftIcon,
  rightIcon,

  value,
  invalid,
  disabled,
  validations,
  multiple,
  autoFocus,
  clearable,

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

  className = "",
}: SelectProps) {
  const [inputShowValue, setInputShowValue]    =  useState<string | ReactNode>("");
  const [keydown, setKeydown]                  =  useState(false);
  const [useTemp, setUseTemp]                  =  useState(true);
  const [dataOptions, setDataOptions]          =  useState<SelectOptionProps[]>([]);
  const [filteredOptions, setFilteredOptions]  =  useState<SelectOptionProps[]>([]);
  const [loadingOption, setLoadingOption]      =  useState(false);
  const [activeOption, setActiveOption]        =  useState(0);
  const [showOption, setShowOption]            =  useState(false);
  const [keyword, setKeyword]                  =  useState("");
  const [keywordSearch]                        =  useLazySearch(keyword);


  // =========================>
  // ## Initial
  // =========================>
  const inputHandler  =  useInputHandler(name, value, validations, register, false)
  const randomId      =  useInputRandomId()


  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage]  =  useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


  // =========================>
  // ## change value handler
  // =========================>
  useEffect(() => {
    if (value) {
      inputHandler.setValue(value);
      Array.isArray(dataOptions) && setInputShowValue((newOption ? [newOption, ...dataOptions] : dataOptions)?.find((option) => option.value == value)?.label || "");
      inputHandler.setIdle(false);
    } else {
      inputHandler.setValue("");
      setInputShowValue("");
    }
  }, [value, dataOptions]);


  // =========================>
  // ## options handler
  // =========================>
  useEffect(() => {
    options?.length && setDataOptions([...options, ...includedOptions].filter((op: SelectOptionProps) => !exceptOptions?.includes(op.value)));
  }, [options]);


  const filterOption = (e: any) => {
    if (dataOptions?.length) {
      let newFilteredOptions: SelectOptionProps[] = [];

      if (searchable && !serverSearchable) {
        if (e.target.value) {
          newFilteredOptions = dataOptions.filter((Option) => (Option.label as string)?.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1).slice(0, maxShowOption);
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
          inputHandler.setValue(resultValue?.value || inputShowValue);
          serverSearchable && setKeyword((resultValue?.label as string) || keyword);
        } else {
          if (resultValue?.value) {
            searchable ? setInputShowValue(resultValue.label) : searchable && setInputShowValue("");
            serverSearchable && setKeyword(resultValue.label as string);

            const values: string[] = Array.isArray(inputHandler.value) ? Array().concat(inputHandler.value)?.filter((val: string | number) => val != resultValue?.value) : [];

            if (values.find((val) => val == resultValue?.value)) {
              inputHandler.setValue(values);
            } else {
              inputHandler.setValue([...Array().concat(values), resultValue.value]);
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
      params: serverSearchable ? { search: keywordSearch } : {},
    };

    const cacheOptions = await cavity.get(serverOptionControl?.cacheName || `option_${serverOptionControl?.path}`);

    if (cacheOptions) {
      // setDataOptions(
      //   [...cacheOptions, ...includedOptions].filter(
      //     (op: SelectOptionPropsType) => !exceptOptions?.includes(op.value)
      //   )
      // );
      setLoadingOption(false);
    } else {
      const mutateOptions = await api(serverControl || {});
      setDataOptions(
        [...mutateOptions?.data, ...includedOptions].filter(
          (op: SelectOptionProps) => !exceptOptions?.includes(op.value)
        )
      );
      setShowOption(true);
      cavity.set({
        key: serverOptionControl?.cacheName || `option_${serverOptionControl?.path}`,
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
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            disabled && "opacity-50",
            disabled && pcn<CT>(className, "label", "disabled"),
            inputHandler.focus && "text-primary",
            inputHandler.focus && pcn<CT>(className, "label", "focus"),
            invalidMessage && "text-danger",
            invalidMessage && pcn<CT>(className, "label", "focus")
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
              disabled && "opacity-60",
              disabled && pcn<CT>(className, "tip", "disabled")
            )}
          >{tip}</small>
        )}

        <div className="relative">
          <input
            type="hidden"
            value={!multiple ? String(inputHandler.value) : Array().concat(inputHandler.value).map((val) => String(val))}
            name={name}
          />
          <input
            type="text"
            readOnly={!searchable}
            id={randomId}
            placeholder={!inputHandler.value || (Array.isArray(inputHandler.value) && !inputHandler.value.length) ? placeholder : ""}
            disabled={disabled}
            className={cn(
              "input cursor-pointer",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              pcn<CT>(className, "input"),
              invalidMessage && "input-error",
              invalidMessage && pcn<CT>(className, "input", "error")
            )}
            value={(useTemp && tempOptions ? tempOptions.at(0)?.label : serverSearchable ? keyword : inputShowValue) as string}
            onChange={(e) => {
              setUseTemp(false);
              searchable && setInputShowValue(e.target.value);
              serverSearchable && setKeyword(e.target.value);
              inputHandler.setIdle(false);
              dataOptions?.length && filterOption(e);
            }}
            onFocus={(e) => {
              setUseTemp(false);
              inputHandler.setFocus(true);
              onFocus?.();
              dataOptions?.length && filterOption(e);
              searchable && e.target.select();
            }}
            onBlur={(e) => {
              setUseTemp(false);
              const value = e.target.value;
              const valueOption = dataOptions?.find((option) => (option.label as string)?.toLowerCase() == value?.toLowerCase());

              if (!keydown) {
                if (!multiple) {
                  setTimeout(() => {
                    if (valueOption?.value) {
                      setInputShowValue(valueOption.label);
                      inputHandler.setValue(valueOption.value);
                      serverSearchable && setKeyword(valueOption.label as string);
                      onChange?.(valueOption.value, valueOption);
                    } else {
                      setInputShowValue("");
                      serverSearchable && setKeyword("");
                      inputHandler.setValue("");
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
                inputHandler.setFocus(false);
              }, 100);

              onBlur?.();
            }}
            onKeyDown={(e) => {
              dataOptions?.length && onKeyDownOption(e);
            }}
            autoComplete="off"
            autoFocus={autoFocus}
          />


          {(multiple && !searchable || (searchable && !inputHandler.focus)) && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 overflow-x-auto py-1.5 input-scroll ${leftIcon ? "ml-[2.5rem]" : "ml-2"}`}
              style={{ maxWidth: `calc(100% - ${leftIcon ? "5.2rem" : "3.2rem"})` }}
            >
              <div className={`input-values-container`}>
                {multiple && typeof inputHandler.value != "string" && Array().concat(inputHandler.value)?.map((item, key) => {
                  return (
                    <div key={key} className={`input-values-item`}>
                      <span className="">{dataOptions?.find((option) => option.value == item)?.label}</span>
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={`input-values-delete`}
                        onClick={() => {
                          const values = Array().concat(inputHandler.value);
                          const index = values.findIndex((val: string | number) => val == item);

                          inputHandler.setValue(values.filter((_, val) => val != index));

                          if (!values.filter((_, val) => val != index)?.length) {
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
              className={cn(
                "left-4 input-icon ",
                pcn<CT>(className, "icon"),
                disabled && "opacity-60",
                disabled && pcn<CT>(className, "icon", "disabled"),
                inputHandler.focus && "text-primary",
                inputHandler.focus && pcn<CT>(className, "icon", "focus")
              )}
              icon={leftIcon}
            />
          )}

          {!multiple && clearable && inputHandler.value && (
            <div
              className={cn(
                "right-12 input-icon cursor-pointer hover:text-danger",
                disabled && "opacity-60 pointer-events-none",
                disabled && pcn<CT>(className, "icon", "disabled")
              )}
              onClick={() => {
                setInputShowValue("");
                inputHandler.setValue("");
                onChange?.("");
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          )}

          <label
            htmlFor={randomId}
            className={cn(
              "right-4 input-icon cursor-pointer hover:text-primary",
              disabled && "opacity-60 pointer-events-none",
              disabled && pcn<CT>(className, "icon", "disabled")
            )}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </label>
        </div>

        {!!dataOptions?.length && showOption && !loadingOption && !!filteredOptions?.length && (
            <div>
              <ul className={`input-suggest-container scroll-sm ${inputHandler.focus ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}>
                {(newOption ? [newOption, ...filteredOptions] : filteredOptions ).map((option, key) => {
                  const selected = !!((typeof inputHandler.value == "string" || typeof inputHandler.value == "number") && inputHandler.value == option.value) ||
                    (Array.isArray(inputHandler.value) && Array().concat(inputHandler.value).find((val: string | number) => val == option.value));

                  return (
                    <li
                      className={`
                        cursor-pointer hover:bg-light-primary
                        input-suggest
                        ${(key == activeOption || selected) && "bg-light-primary text-primary"}
                      `}
                      key={key}
                      onMouseDown={() => {
                        setKeydown(true);
                        setTimeout(() => inputHandler.setFocus(true), 110);
                      }}
                      onMouseUp={() => {
                        setKeydown(false);
                        setActiveOption(key);
                        setFilteredOptions([]);
                        setShowOption(false);

                        if (!multiple) {
                          setInputShowValue(option.label);
                          serverSearchable && setKeyword(option.label as string);
                          inputHandler.setValue(option.value);
                          onChange?.(option.value, option);
                        } else {
                          const values: string[] | number[] = Array.isArray(inputHandler.value) 
                            ? Array().concat(inputHandler.value).filter((val) => val != option.value)
                            : [];                          

                          setInputShowValue("");
                          serverSearchable && setKeyword("");

                          if (
                            Array.isArray(inputHandler.value) && Array().concat(inputHandler.value).find((val) => val == option.value)
                          ) {
                            inputHandler.setValue(values);
                            onChange?.(values);
                          } else {
                            inputHandler.setValue([...Array().concat(values), option.value ]);
                            onChange?.([...Array().concat(values), option.value]);
                          }
                        }
                        setTimeout(() => inputHandler.setFocus(false), 120);
                      }}
                    >
                      {selected && (
                        <FontAwesomeIcon
                          icon={faCheck}
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

        {invalidMessage && (
          <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
        )}
      </div>
    </>
  );
}
