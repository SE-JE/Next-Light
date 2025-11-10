import React, { ReactNode } from 'react'
import { faEyeLowVision, faMagnifyingGlass, faPlus, faRefresh, faSearch, faSliders } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@utils';
import { useToggleContext } from '@contexts';
import { IconButtonComponent, InputCheckboxComponent, InputComponent, SelectComponent, OutsideClickComponent, ButtonComponent } from '@components';



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
            // ## Create button 
            // =========================>
          }
          if (option == "CREATE") {
            return (
              <div className="pl-2 pr-4 mr-2 border-r" key="button-add">
                <ButtonComponent
                  icon={faPlus}
                  label="Tambah Data"
                  size="sm"
                  onClick={() => setToggle("MODAL_FORM")}
                />
              </div>
            );
          }

          {
            // =========================>
            // ## Search Field
            // =========================>
          }
          if (option == "SEARCH") {
            const searchable = !!options?.find((option) => option == "SEARCHABLE");

            return (
              <div className={cn("w-full min-w-[150px]", searchable ? "pr-1.5" : "px-1.5")} key={key}>
                <InputComponent
                  name="search"
                  placeholder="Cari disini..."
                  rightIcon={faMagnifyingGlass}
                  value={search}
                  onChange={(e) => onSearch?.(e)}
                  className={cn("py-1.5 text-sm", searchable && "rounded-l-none")}
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
              <div className="w-28 pl-1.5" key={key}>
                <SelectComponent
                  name="searchableColumn"
                  leftIcon={faSearch}
                  options={searchableOptions?.map((column) => {
                    return {
                      label: column.label,
                      value: column.selector,
                    };
                  }) || []}
                  value={searchable}
                  onChange={(e) => onSearchable?.(e as string[])}
                  className="py-1.5 text-sm rounded-r-none border-r-0"
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
                      "absolute -bottom-4 bg-white translate-y-full right-0 p-2 px-4 w-[240px] z-20 rounded-lg border",
                      !toggle.SELECTABLE && "scale-y-0 top-0 opacity-0"
                    )}
                  >
                    <InputCheckboxComponent
                      vertical
                      label='Kolom Ditampilkan'
                      name="show_column"
                      options={selectableOptions?.map((option) => {
                        return {
                          label: option.label,
                          value: option.selector,
                        };
                      })}
                      onChange={(e) => onSelectable?.(Array().concat(e).map((val) => String(val)))}
                      value={selectable}
                      className='px-1 border-0 gap-2.5'
                      classNameCheckbox='w-5 h-5 label::text-xs'
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
            return (
              <div className="p-1.5 rounded-md relative mr-2" key={key}>
                <ButtonComponent
                  icon={faSliders}
                  label="Filter"
                  variant="outline"
                  className="!text-foreground"
                  onClick={() => setToggle("FILTER")}
                  size="sm"
                />
              </div>
            );
          }

          return option;
        })}
      </div>
    </>
  )
}
