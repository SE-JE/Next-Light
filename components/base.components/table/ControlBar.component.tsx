"use client"

import { ReactNode, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownZA, faArrowUpAZ, faEllipsisV, faEyeLowVision, faMagnifyingGlass, faPlus, faRefresh, faSearch, faSliders, faSort } from '@fortawesome/free-solid-svg-icons';
import { ApiFilterType, cn, conversion, shortcut, useResponsive } from '@utils';
import { useToggleContext } from '@contexts';
import { IconButtonComponent, InputCheckboxComponent, InputComponent, SelectComponent, OutsideClickComponent, ButtonComponent, BottomSheetComponent, FilterComponent, FilterColumnOption } from '@components';



export type ControlBarOptionType = "SEARCH" | "SEARCHABLE" | "FILTER" | "SELECTABLE" | "REFRESH" | ReactNode;

export interface ControlBarProps {
  id                 ?:  string;
  options            ?:  ControlBarOptionType[];
  className          ?:  string
  search             ?:  string,
  onSearch           ?:  (searchable: string) => void,
  searchableOptions  ?:  {label: string | ReactNode, selector: string}[]
  searchable         ?:  string[],
  onSearchable       ?:  (searchable: string[]) => void,
  selectableOptions  ?:  {label: string | ReactNode, selector: string}[]
  selectable         ?:  string[],
  onSelectable       ?:  (searchable: string[]) => void,
  sortableOptions    ?:  {label: string | ReactNode, selector: string}[]
  sort               ?:  string[],
  onSort             ?:  (sort: string[]) => void,
  filterableColumns  ?:  FilterColumnOption[],
  onFilter           ?:  (filters: ApiFilterType[]) => void,
  filter             ?:  ApiFilterType[],
  onRefresh          ?:  () => void,
}



export function ControlBarComponent({
  id = "",
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
  sortableOptions,
  sort,
  onSort,
  filterableColumns,
  onFilter,
  filter,
  onRefresh
}: ControlBarProps) {
  const {toggle, setToggle}  =  useToggleContext()
  const { isSm }             =  useResponsive();

  const searchRef             =  useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (options?.includes("SEARCH")) {
      shortcut.register("ctrl+s", () => {
        searchRef.current?.focus()
      }, "Cari")
    }

    if (options?.includes("FILTER")) {
      shortcut.register("ctrl+f", () => {
        setToggle("FILTER")
      }, "Filter")
    }

    if (options?.includes("SORT")) {
      shortcut.register("ctrl+o", () => {
        setToggle("SORT")
      }, "Urutkan")
    }

    if (options?.includes("SELECTABLE")) {
      shortcut.register("ctrl+l", () => {
        setToggle("SELECTABLE")
      }, "Kolom Ditampilkan")
    }

    if (options?.includes("REFRESH")) {
      shortcut.register("ctrl+shift+r", () => {
        onRefresh?.()
      }, "Refresh Tabel")
    }

    return () => {
      options?.includes("SEARCH") && shortcut.unregister("ctrl+s")
      options?.includes("FILTER") && shortcut.unregister("ctrl+f")
      options?.includes("SORT") && shortcut.unregister("ctrl+o")
      options?.includes("SELECTABLE") && shortcut.unregister("ctrl+l")
      options?.includes("REFRESH") && shortcut.unregister("ctrl+shift+r")
    }
  }, [options])

  const onChangeSort = (item: string) => {
    if(!!sort?.find((s) => s.split(" ")?.at(0) == item)) {
      const findSort = sort.find((s) => s.split(" ")?.at(0) == item);

      if (findSort?.split(" ")?.at(1) == "desc") {
        onSort?.(sort.filter((s) => s != findSort));
      } else {
        const newSorts = [...sort];
        newSorts[newSorts?.findIndex((s) => s == findSort)] = `${item} desc`
        onSort?.(newSorts);
      }
    } else {
      onSort?.([...(sort || []), `${item} asc`])
    }
  }
  
  return (
    <>
      <div className={cn("py-1 md:py-2 md:px-1.5 bg-white rounded-[6px] border flex items-center mb-2", className)}>
        {(isSm ? [
          ...(options?.filter((op, iop) => iop == 0 || op == "REFRESH") || []), 
          ...(options && options?.length > 1 ? ['MOBILE_OPTION'] : [])
        ] : options)?.map((option: ControlBarOptionType, key: number) => {
          {
            // =========================>
            // ## Create button 
            // =========================>
          }
          if (option == "CREATE") {
            return (
              <div className="pl-1.5 pr-3 mr-2 border-r" key="button-add">
                <ButtonComponent
                  icon={faPlus}
                  label="Tambah Data"
                  size="sm"
                  onClick={() => setToggle(`MODAL_FORM_${conversion.strSnake(id).toUpperCase()}`)}
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
                  ref={searchRef}
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
            return searchableOptions?.length ? (
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
            ) : <></>;
          }

          {
            // =========================>
            // ## Selectable Button
            // =========================>
          }
          if (option == "SELECTABLE") {
            return (
              <div className="px-1.5 rounded-md relative" key={key}>
                <IconButtonComponent
                  icon={faEyeLowVision}
                  variant="outline"
                  className="!text-foreground p-4"
                  onClick={() => setToggle("SELECTABLE")}
                  size="sm"
                />
                <OutsideClickComponent onOutsideClick={() => setToggle("SELECTABLE", false)}>
                  <div
                    className={cn(
                      "absolute -bottom-4 bg-white translate-y-full right-0 w-[240px] z-20 rounded-lg border",
                      !toggle.SELECTABLE && "scale-y-0 top-0 opacity-0"
                    )}
                  >
                    <p className='input-label text-xs p-4'>Kolom Ditampilkan</p>
                    <InputCheckboxComponent
                      vertical
                      name="show_column"
                      options={selectableOptions?.map((option) => {
                        return {
                          label: option.label as string,
                          value: option.selector,
                        };
                      })}
                      onChange={(e) => onSelectable?.(Array().concat(e).map((val) => String(val)))}
                      value={selectable}
                      className='px-4 border-0 gap-4 mb-4'
                      classNameCheckbox='w-5 h-5 label::text-xs'
                    />
                  </div>
                </OutsideClickComponent>
              </div>
            );
          }

          {
            // =========================>
            // ## Sort Button
            // =========================>
          }
          if (option == "SORT") {
            return sortableOptions?.length ? (
              <div className="px-1.5 rounded-md relative" key={key}>
                <IconButtonComponent
                  icon={faSort}
                  variant="outline"
                  className="!text-foreground p-4"
                  onClick={() => setToggle("SORT")}
                  size="sm"
                />
                <OutsideClickComponent onOutsideClick={() => setToggle("SORT", false)}>
                  <div
                    className={cn(
                      "absolute -bottom-4 bg-white translate-y-full right-0 w-[240px] z-20 rounded-lg border",
                      !toggle.SORT && "scale-y-0 top-0 opacity-0"
                    )}
                  >
                    <p className='input-label text-xs p-4'>Urut Berdasarkan</p>
                    <div className='flex flex-col mb-4'>
                      {sortableOptions?.map((option, key) => {
                        const sortBy = sort?.find((s) => s.split(" ")?.at(0) == option?.selector)?.split(" ")?.at(1) || "";
                        return (
                          <div 
                            key={key}
                            className={cn('flex justify-between cursor-pointer text-sm px-4 py-2 hover:bg-light-primary', !!sortBy && "text-primary bg-primary/10")}
                            onClick={() => onChangeSort(option.selector)}
                          >
                            <p>{option.label}</p>

                            {sortBy && (
                              <div className='text-primary'>
                                <FontAwesomeIcon icon={sortBy == "desc" ? faArrowDownZA : faArrowUpAZ} className='text-xs' /> 
                                {sort?.length && sort?.length > 1 && <span className='text-[9px] ml-1'>{sort.findIndex((s) => s.split(" ")?.at(0) == option?.selector) + 1}</span>}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </OutsideClickComponent>
              </div>
            ) : <></>;
          }

          {
            // =========================>
            // ## Refresh Button 
            // =========================>
          }
          if (option == "REFRESH") {
            return (
              <div className="md:px-1.5 relative" key={key}>
                <IconButtonComponent
                  icon={faRefresh}
                  variant="outline"
                  className="!text-foreground p-4"
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
              <div className="px-1.5 rounded-md relative" key={key}>
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

          {
            // =========================>
            // ## Mobile option button
            // =========================>
          }
          if (option == "MOBILE_OPTION") {
            return (
              <div className="px-1.5 relative" key={key}>
                <IconButtonComponent
                  icon={faEllipsisV}
                  variant="outline"
                  className="!text-foreground p-4"
                  onClick={() => setToggle("MOBILE_OPTION")}
                  size="sm"
                />
              </div>
            );
          }

          return option;
        })}
      </div>

      {!!filterableColumns && !!filterableColumns?.length && (
        <FilterComponent 
          className={cn("", !toggle.FILTER ? "p-0 h-0 hidden overflow-hidden" : "mb-2 animate-intro-down")}
          columns={filterableColumns}
          onChange={onFilter}
          value={filter}
          onMinimize={() => setToggle("FILTER")}
        />
      )}

      {isSm && (
        <BottomSheetComponent
          show={!!toggle["MOBILE_OPTION"]}
          onClose={() => setToggle("MOBILE_OPTION", false)}
          maxSize="98vh"
        >
          <div className='flex flex-col gap-4 p-2'>
            {options?.filter((op, iop) => (iop != 0 && op != "CREATE" && op != "REFRESH"))?.map((option: ControlBarOptionType, key: number) => {
              {
                // =========================>
                // ## Search Field
                // =========================>
              }
              if (option == "SEARCH") {
                return (
                  <div key={key}>
                    <InputComponent
                      name="search"
                      placeholder="Cari disini..."
                      rightIcon={faMagnifyingGlass}
                      value={search}
                      onChange={(e) => onSearch?.(e)}
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
                return searchableOptions?.length ? (
                  <div key={key}>
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
                      multiple
                    />
                  </div>
                ) : <></>;
              }

              {
                // =========================>
                // ## Selectable Button
                // =========================>
              }
              if (option == "SELECTABLE") {
                return (
                  <div key={key}>
                    <p className='input-label text-xs pb-2'>Kolom Ditampilkan</p>
                    <InputCheckboxComponent
                      vertical
                      name="show_column"
                      options={selectableOptions?.map((option) => {
                        return {
                          label: option.label as string,
                          value: option.selector,
                        };
                      })}
                      onChange={(e) => onSelectable?.(Array().concat(e).map((val) => String(val)))}
                      value={selectable}
                      className='px-2 border-0 gap-4 bg-transparent'
                      classNameCheckbox='w-5 h-5 label::text-xs'
                    />
                  </div>
                );
              }

              {
                // =========================>
                // ## Sort Button
                // =========================>
              }
              if (option == "SORT") {
                return sortableOptions?.length ? (
                  <div key={key}>
                    <p className='input-label text-xs pb-2'>Urut Berdasarkan</p>
                    <div className='flex flex-col'>
                      {sortableOptions?.map((option, key) => {
                        const sortBy = sort?.find((s) => s.split(" ")?.at(0) == option?.selector)?.split(" ")?.at(1) || "";
                        return (
                          <div 
                            key={key}
                            className={cn('flex justify-between cursor-pointer text-sm p-2 hover:bg-light-primary active:scale-x-[102%]', !!sortBy && "text-primary bg-primary/10")}
                            onClick={() => onChangeSort(option.selector)}
                          >
                            <p>{option.label}</p>

                            {sortBy && (
                              <div className='text-primary'>
                                <FontAwesomeIcon icon={sortBy == "desc" ? faArrowDownZA : faArrowUpAZ} className='text-xs' /> 
                                {sort?.length && sort?.length > 1 && <span className='text-[9px] ml-1'>{sort.findIndex((s) => s.split(" ")?.at(0) == option?.selector) + 1}</span>}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : <></>;
              }

              {
                // =========================>
                // ## Filter 
                // =========================>
              }
              if (option == "FILTER") {
                return (
                  <div key={key}>
                    {filterableColumns && filterableColumns?.length && (
                      <FilterComponent
                        className='border-0 p-0 mb-2 title::text-xs'
                        columns={filterableColumns}
                        onChange={onFilter}
                        value={filter}
                      />
                    )}
                  </div>
                );
              }

              return option;
            })}
          </div>
        </BottomSheetComponent>
      )}
    </>
  )
}
