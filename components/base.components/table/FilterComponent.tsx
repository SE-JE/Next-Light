import React, { useState, useEffect } from "react";
import { faChevronUp, faPlus, faRotate, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ApiFilterType, cn, pcn, useResponsive } from "@utils";
import {ButtonComponent, IconButtonComponent, InputComponent, InputCurrencyComponent, InputDateComponent, InputNumberComponent, SelectComponent} from "@components";



type CT = "base" | "title";

export type FilterColumnOption = {
  label: string;
  selector: string;
  type: "text" | "number" | "currency" | "date";
} | {
  label: string;
  selector: string;
  type: "select";
  options: { label: string; value: any }[];
};


export interface AdvancedFilterProps {
  columns     :  FilterColumnOption[];
  onChange   ?:  (filters: ApiFilterType[]) => void;
  value      ?:  ApiFilterType[];
  onMinimize ?:  () => void;

  /** Use custom class with: "title::". */
  className  ?:  string;
}

const FILTER_OPERATORS = [
  { label: "Cari", value: "li" },
  { label: "Sama", value: "eq" },
  { label: "Tidak Sama", value: "ne" },
  { label: "Termasuk", value: "in" },
  { label: "Tidak Termasuk", value: "ni" },
  { label: "Antara", value: "bw" },
];

const LOGIC_OPTIONS = [
  { label: "Dan", value: "and" },
  { label: "Atau", value: "or" },
];



export function FilterComponent({
  columns,
  onChange,
  value,
  onMinimize,
  className = "",
}: AdvancedFilterProps) {
  const { isSm }              = useResponsive();
  const [filters, setFilters] = useState<ApiFilterType[]>([]);

  const handleChange = (index: number, key: keyof ApiFilterType, value: any) => {
    const updated = [...filters];
    updated[index][key] = value;

    if (key === "column") {
      updated[index].type = "";
      updated[index].value = "";
    }

    setFilters(updated);
  };

  const addFilter = () => {
    setFilters([
      ...filters,
      { column: "", type: "", value: "", logic: filters.length ? "and" : undefined },
    ]);
  };

  const removeFilter = (index: number) => {
    const updated = filters.filter((_, i) => i !== index);
    setFilters(updated);
  };

  useEffect(() => {
    if (onChange) onChange(filters);
  }, [filters]);


  useEffect(() => {}, [value]);

  return (
    <>
      <div className={cn("p-4 border rounded-sm", pcn<CT>(className, "base"))}>
        <div className="flex justify-between items-center mb-2">
          <p className={cn(pcn<CT>(className, "title"))}>Filter</p>
          <div className="flex gap-2">
            <ButtonComponent
              icon={faRotate}
              label="Bersihkan"
              variant="outline"
              paint="primary"
              className="text-slate-400 icon::text-slate-400"
              size="xs"
              onClick={() => setFilters([])}
            />

            {onMinimize && (
              <IconButtonComponent
                icon={faChevronUp}
                variant="outline"
                paint="primary"
                className="text-slate-400 icon::text-slate-400"
                size="xs"
                onClick={onMinimize}
              />
            )}
          </div>
        </div>

        {filters.map((f, i) => {
          const column = columns.find((c) => c.selector === f.column);

          return (
            <div key={i} className="flex flex-wrap  items-center gap-2 mb-2">
              {i > 0 && (
                <div className="w-[20%] md:w-[10%]">
                  <SelectComponent
                    name={`filter_logic_${i}`}
                    options={LOGIC_OPTIONS}
                    placeholder="Dan/Atau"
                    value={f.logic}
                    onChange={(e) => handleChange(i, "logic", e as "and" | "or")}
                    className="text-sm p-2 px-3"
                  />
                </div>
              )}

              <div className={i > 0 ? "w-[30%] md:w-[20%]" : "w-[52.5%] md:w-[30.7%]"}>
                <SelectComponent
                  name={`filter_column_${i}`}
                  options={columns.map((c) => ({
                    label: c.label,
                    value: c.selector,
                  }))}
                  placeholder="Kolom"
                  value={f.column}
                  onChange={(e) => handleChange(i, "column", e)}
                  className="text-sm p-2 px-3"
                />
              </div>

              <div className="w-[35%] md:w-[18%]">
                <SelectComponent
                  name={`filter_operator_${i}`}
                  options={FILTER_OPERATORS}
                  placeholder="Operator"
                  value={f.type}
                  onChange={(e) => handleChange(i, "type", e)}
                  className="text-sm p-2 px-3"
                />
              </div>
              
              {isSm && (
                <IconButtonComponent 
                  icon={faTimes}
                  paint="danger"
                  variant="outline"
                  onClick={() => removeFilter(i)}
                  size="xs"
                />
              )}
              
              {column && (
                <div className="w-full md:w-[45%]">
                  <InputFilterValueComponent 
                    type={column.type}
                    name={`filter_value_${i}`}
                    placeholder="..."
                    value={f.value || ""}
                    onChange={(e: any) => handleChange(i, "value", e)}
                    options={column.type === "select" && column.options ? column.options : []}
                    className="text-sm p-2 px-3"
                    between={f.type === "bw"}
                    multiple={["in", "ni"].includes(f.type || "")}
                  />
                </div>
              )}

              {!isSm && (
                <IconButtonComponent 
                  icon={faTimes}
                  paint="danger"
                  variant="outline"
                  onClick={() => removeFilter(i)}
                  size="xs"
                />
              )}
            </div>
          );
        })}

        <ButtonComponent
          label="Tambahkan"
          icon={faPlus}
          variant="outline"
          paint="primary"
          size={isSm ? "xs" : "sm"}
          onClick={addFilter}
          className="md:mt-4"
        />
      </div>
    </>
  );
}



interface FilterInputProps {
  type         ?:  string | null;
  name          :  string;
  value         :  string | number | number[] | string[] | null;
  onChange      :  (value: any) => void;
  options      ?:  { label: string; value: any }[];
  placeholder  ?:  string;
  className    ?:  string;
  between      ?:  boolean;
  multiple     ?:  boolean;
}

export function InputFilterValueComponent({
  type,
  name,
  value,
  onChange,
  options = [],
  placeholder = "",
  className = "",
  between,
  multiple,
}: FilterInputProps) {
  const resolvedType = type || "text";

  if (!between) {
    switch (resolvedType) {
      case "select":
        return (
          <SelectComponent
            name={name}
            options={options}
            placeholder={placeholder}
            value={options.find((o) => o.value === value)?.label}
            onChange={onChange}
            className={className}
          />
        );

      case "number":
        return (
          <InputNumberComponent
            name={name}
            value={Number(value) || 0}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            multiple={multiple}
          />
        );

      case "currency":
        return (
          <InputCurrencyComponent
            name={name}
            value={Number(value) || 0}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
          />
        );

      case "date":
        return (
          <InputDateComponent
            name={name}
            value={value as string || ""}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
          />
        );

      default:
        return (
          <InputComponent
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            multiple={multiple}
          />
        );
    }
  }

  const val         =  Array.isArray(value) ? value : ["", ""];
  const [from, to]  =  val;

  const renderInput = (pos: "from" | "to") => {
    const currentValue  =  pos  ===  "from" ? from : to;
    const handle        =  (v: any) => onChange(pos === "from" ? [v, to] : [from, v]);

    switch (resolvedType) {
      case "number":
        return (
          <InputNumberComponent
            name={`${name}_${pos}`}
            value={Number(currentValue) || 0}
            onChange={handle}
            placeholder={pos === "from" ? "Dari" : "Sampai"}
            className={className}
          />
        );
      case "currency":
        return (
          <InputCurrencyComponent
            name={`${name}_${pos}`}
            value={Number(currentValue) || 0}
            onChange={handle}
            placeholder={pos === "from" ? "Dari" : "Sampai"}
            className={className}
          />
        );
      case "date":
        return (
          <InputDateComponent
            name={`${name}_${pos}`}
            value={currentValue as string || ""}
            onChange={handle}
            placeholder={pos === "from" ? "Dari" : "Sampai"}
            className={className}
          />
        );
      default:
        return (
          <InputComponent
            name={`${name}_${pos}`}
            value={currentValue || ""}
            onChange={(e: any) => handle(e.target.value)}
            placeholder={pos === "from" ? "Dari" : "Sampai"}
            className={className}
          />
        );
    }
  };

  return (
    <div className="flex items-center gap-2 flex-1">
      {renderInput("from")}
      <span>s/d</span>
      {renderInput("to")}
    </div>
  );
}
