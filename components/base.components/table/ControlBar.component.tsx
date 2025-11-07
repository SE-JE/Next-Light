import React, { ReactNode } from 'react'
import { faEyeLowVision, faMagnifyingGlass, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useToggleContext } from '@/contexts/Toggle.context';
import { cn } from '@utils/.';
import { IconButtonComponent, InputCheckboxComponent, InputComponent, SelectComponent, OutsideClickComponent } from '@components';



export type ControlBarOptionType = "SEARCH" | "SEARCHABLE" | "FILTER" | "SELECTABLE" | "REFRESH" | ReactNode;

export interface ControlBarProps {
  options            ?:  ControlBarOptionType[];
  className          ?:  string
  search             ?:  string,
  onSearch           ?:  (searchable: string) => void,
  searchableOptions  ?:  {label: string, selector: string}[]
  searchable         ?:  string[],
  onSearchable       ?:  (searchable: string[]) => void,
  selectableOptions  ?:  {label: string, selector: string}[]
  selectable         ?:  string[],
  onSelectable       ?:  (searchable: string[]) => void,
  onRefresh          ?:  () => void,
}



export function ControlBarComponent({
  options, 
  className, 
  search, 
  onSearch, 
  searchableOptions,
  searchable,
  onSearchable,
  selectableOptions,
  selectable,
  onSelectable,
  onRefresh
}: ControlBarProps) {
  const {toggle, setToggle} = useToggleContext()

  return (
    <>
      <div className={cn("py-1 bg-white rounded-[6px] border flex items-center mb-2", className)}>
        {options?.map((option: ControlBarOptionType, key: number) => {
          {
            // =========================>
            // ## Search Field
            // =========================>
          }
          if (option == "SEARCH") {
            return (
              <div className="w-full min-w-[150px] px-1.5" key={key}>
                <InputComponent
                  name="search"
                  placeholder="Cari disini..."
                  rightIcon={faMagnifyingGlass}
                  value={search}
                  onChange={(e) => onSearch?.(e)}
                  className="py-1.5 text-sm"
                />
              </div>
            );
          }

          {
            // =========================>
            // ## Searchable Field
            // =========================>
          }
          if (option == "SEARCHABLE") {
            return (
              <div className="w-48 px-1.5" key={key}>
                <SelectComponent
                  name="searchableColumn"
                  placeholder="Pencarian..."
                  options={searchableOptions?.map((column) => {
                    return {
                      label: column.label,
                      value: column.selector,
                    };
                  }) || []}
                  value={searchable}
                  onChange={(e) => onSearchable?.(e as string[])}
                  className="py-1.5 text-sm"
                  multiple
                />
              </div>
            );
          }

          {
            // =========================>
            // ## Selectable Button
            // =========================>
          }
          if (option == "SELECTABLE") {
            return (
              <div className="p-1.5 rounded-md relative" key={key}>
                <IconButtonComponent
                  icon={faEyeLowVision}
                  variant="simple"
                  className="!text-foreground"
                  onClick={() => setToggle("SELECTABLE")}
                  size="sm"
                />
                <OutsideClickComponent onOutsideClick={() => setToggle("SELECTABLE", false)}>
                  <div
                    className={cn(
                      "absolute -bottom-4 bg-white translate-y-full right-0 p-2 w-[240px] z-20 rounded-lg border",
                      !toggle.SELECTABLE && "scale-y-0 top-0 opacity-0"
                    )}
                  >
                    <label className="text-sm font-semibold mb-2">
                      Kolom Ditampilkan
                    </label>
                    <InputCheckboxComponent
                      vertical
                      name="show_column"
                      options={selectableOptions?.map((option) => {
                        return {
                          label: option.label,
                          value: option.selector,
                        };
                      })}
                      onChange={(e) => onSelectable?.(Array().concat(e).map((val) => String(val)))}
                      value={selectable}
                    />
                  </div>
                </OutsideClickComponent>
              </div>
            );
          }

          {
            // =========================>
            // ## Refresh Button 
            // =========================>
          }
          if (option == "REFRESH") {
            return (
              <div className="p-1.5 rounded-md relative mr-2" key={key}>
                <IconButtonComponent
                  icon={faRefresh}
                  variant="simple"
                  className="!text-foreground"
                  onClick={() => onRefresh?.()}
                  size="sm"
                />
              </div>
            );
          }

          {
            // =========================>
            // ## Filter Button 
            // =========================>
          }
          if (option == "FILTER") {
            return (<></>);
          }

          return option;
        })}
      </div>
    </>
  )
}
