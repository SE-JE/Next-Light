"use client"

import { isValidElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownZA, faArrowUpAZ, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { ApiFilterType, cn, pcn, useLazySearch, useResponsive } from "@utils";
import { ControlBarComponent, ControlBarOptionType, PaginationComponent, PaginationProps, ScrollContainerComponent, FilterColumnOption, CheckboxComponent, SwipeComponent, SwipeActionType } from "@components";



type CT = "controller-bar" | "head-column" | "column" | "row" | "floating-action" | "base";

export interface TableColumnType {
  selector    :  string;
  label       :  string | ReactNode;
  width      ?:  string;
  sortable   ?:  boolean;
  searchable ?:  boolean;
  filterable ?:  boolean | {
    type      : "text" | "number" | "currency" | "date";
  } | {
    type      :  "select";
    options   :  { label: string; value: any }[];
  };
  className  ?:  string;
  item       ?:  (data: any) => string | ReactNode;
  tip        ?:  string | ((data: any) => string);
};

export interface TableProps {
  id                        ?: string;
  
  controlBar                ?:  false | ControlBarOptionType[];

  columns                    :  TableColumnType[];
  data                       :  Record<string, any>[];
  pagination                ?:  PaginationProps | false;

  loading                   ?:  boolean;
  sortBy                    ?:  string[];
  onChangeSortBy            ?:  (sort: string[]) => void;
  search                    ?:  string;
  onChangeSearch            ?:  (search: string) => void;
  searchableColumn          ?:  string[];
  onChangeSearchableColumn  ?:  (column: string) => void;
  filter                    ?:  ApiFilterType[];
  onChangeFilter            ?:  (filters: ApiFilterType[]) => void;
  checks                    ?:  (string | number)[];
  onChangeChecks            ?:  (checks: (string | number)[]) => void;
  actionBulking             ?:  ((checks: (string | number)[]) => ReactNode) | false
  focus                     ?:  number | null,
  setFocus                  ?:  (focus: number | null) => void, 

  onRowClick                ?:  (data: Record<string, any>, key: number) => void;
  onRefresh                 ?:  () => void;

  block                     ?: boolean;
  noIndex                   ?: boolean;
  responsiveControl         ?: {
    mobile                ?: {
      item                ?:  (item: Record<string, any>, key: number) => ReactNode,
      leftActionControl   ?:  Omit<SwipeActionType, "onAction"> & { onAction?: (item: Record<string, any>, key?: number) => void },
      rightActionControl  ?:  Omit<SwipeActionType, "onAction"> & { onAction?: (item: Record<string, any>, key?: number) => void },
    }
  }

  /** Use custom class with: "controller-bar::", "head-column::", "column::", "floating-action::", "row::". */
  className?: string;
};



export function TableComponent({
  id,
  controlBar,
  columns,
  data,
  pagination,
  loading,
  
  sortBy,
  onChangeSortBy,
  search,
  onChangeSearch,
  searchableColumn,
  onChangeSearchableColumn,
  filter,
  onChangeFilter,
  checks,
  onChangeChecks,
  actionBulking,
  focus,

  onRowClick,
  onRefresh,
  
  block,
  noIndex,
  responsiveControl,
  
  className = "",
}: TableProps) {
  const [displayColumns, setDisplayColumns]              =  useState<string[]>([]);
  const [showFloatingAction, setShowFloatingAction]      =  useState(false);
  const [floatingActionActive, setFloatingActionActive]  =  useState<false | number>(false);
  const [keyword, setKeyword]                            =  useState<string>("");
  const [keywordSearch]                                  =  useLazySearch(keyword);
  const { isSm }                                         =  useResponsive ();

  const actionColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (columns) setDisplayColumns([...columns.map((column) => column.selector)]);
  }, [columns]);
  

  useEffect(() => {
    setKeyword(search || "");
  }, [search]);

  useEffect(() => {
    keywordSearch ? onChangeSearch?.(keywordSearch) : onChangeSearch?.("");
    
    if(pagination != false) {
      pagination?.onChange?.(pagination.totalRow, pagination.paginate, 1);
    }
  }, [keywordSearch]);

  const columnMapping = useMemo(() => {
    return ( columns?.filter((column) => displayColumns.includes(column.selector)) || []);
  }, [columns, displayColumns]);



  const styles = {
    head            :  "px-4 py-2.5 font-bold w-full flex justify-between gap-2 items-center text-sm text-foreground capitalize",
    column          :  cn("px-4 py-4 font-medium", pcn<CT>(className, "column")),
    row             :  "flex items-center gap-4 rounded-[4px] relative opacity-0 animate-intro-fade border-b hover:bg-light-primary/30",
    floatingAction  :  cn("sticky bg-background -right-5 z-30 cursor-pointer flex items-center shadow rounded-l-lg", pcn<CT>(className, "floating-action")),
  };


  const numberOfRow = (key: number) => pagination && (pagination?.page || 1) != 1 ? pagination?.paginate * ((pagination?.page || 1) - 1) + key + 1 : key + 1;


  function renderHead() {
    return (
      <>
        {columnMapping?.map((column, key) => {
          const sortColumn  = sortBy?.find((e) => e.split(" ")?.at(0) == column.selector)?.split(" ")?.at(0) || "";
          const sortDirection  = sortBy?.find((e) => e.split(" ")?.at(0) == column.selector)?.split(" ")?.at(1) || "";

          return (
            <div
              key={key}
              className={cn(
                styles?.head,
                column.sortable && "cursor-pointer",
                pcn<CT>(className, "head-column")
              )}
              style={{ width: column.width ? column.width : 200 }}
              onClick={() => column.sortable && onChangeSortBy?.([`${column.selector} ${sortDirection == "desc" ? "asc" : "desc"}`])}
            >
              {column.label}

              {!!sortColumn && (
                <FontAwesomeIcon
                  icon={sortDirection == "desc" ? faArrowDownZA : faArrowUpAZ}
                  className="text-light-foreground/70"
                />
              )}
            </div>
          );
        })}
      </>
    );
  }


  function renderItem(item: Record<string, any>, itemKey: number) {
    const itemMapping = columnMapping.map((column) => {
      if (column?.item) {
        return column.item(item);
      }

      const value = item[column.selector];

      if (isValidElement(value)) {
        return value;
      }

      if (value === null || value === undefined) {
        return "-";
      }

      if (typeof value === "object") {
        return JSON.stringify(value);
      }

      return value;
    });

    if(!isSm || !responsiveControl?.mobile) {
      return (
        <>
          {itemMapping?.map((one, key) => {
            const column = columnMapping?.[key];
          
            let title = one as string;
            if (column?.tip) {
              if (typeof column.tip === "string") {
                title = (item[column.tip as keyof object] as any)?.toString() || "-";
              } else if (typeof column.tip === "function") {
                title = column.tip(item);
              }
            }
            return (
              <div
                key={key}
                className={cn(styles.column , onRowClick && "cursor-pointer")}
                style={{ width: columnMapping?.at(key)?.width || 200 }}
                onClick={() => onRowClick?.(item, itemKey) }
                title={title}
              >
                {one}
              </div>
            );
          })}
        </>
      );
    } else {

      const { onAction: onLeftAction, ...restLeftAction } = responsiveControl?.mobile?.leftActionControl || {};
      const { onAction: onRightAction, ...restRightAction } = responsiveControl?.mobile?.rightActionControl || {};
      
      return (
        <SwipeComponent 
          className="border-b py-2 px-2 bg-white"
          leftActionControl={!!responsiveControl?.mobile?.leftActionControl ? {
            ...restLeftAction,
            ...(onLeftAction ? { onAction: () => onLeftAction?.(item, itemKey)} : {})
          } : undefined}
          rightActionControl={!!responsiveControl?.mobile?.rightActionControl ? {
            ...restRightAction,
            ...(onRightAction ? { onAction: () => onRightAction?.(item, itemKey)} : {})
          } : undefined}
        >
          {responsiveControl?.mobile?.item ? responsiveControl?.mobile?.item(item, itemKey) : (
            <div onClick={() => onRowClick?.(item, itemKey) }>
              <p className="font-semibold">{Object.values(itemMapping)[0]}</p>
              <p className="text-sm">{Object.values(itemMapping)[1]}</p>
            </div>
          )}
        </SwipeComponent>
      )
    }
  }



  


  




  return (
    <div className={cn("relative", pcn<CT>(className, "base"))}>
      {controlBar != false && (
        <ControlBarComponent 
          id={id}
          options={!controlBar ? ["SEARCH", "SELECTABLE", "REFRESH"] : controlBar}
          searchableOptions={columns?.filter((c: TableColumnType) => c.searchable)}
          onSearchable={(e) => onChangeSearchableColumn?.(String(e))}
          searchable={searchableColumn || []}
          onSearch={(e) => setKeyword(e)}
          search={keyword}
          selectableOptions={columns}
          onSelectable={(e) => setDisplayColumns(e)}
          selectable={displayColumns}
          sortableOptions={columns?.filter((c: TableColumnType) => c.sortable)}
          sort={sortBy}
          onSort={(sort) => onChangeSortBy?.(sort)}
          onRefresh={() => onRefresh?.()}
          filterableColumns={columns?.filter((c) => !!c?.filterable)?.map((c) => ({
            label: c.label, 
            selector: c.selector, 
            type: typeof c?.filterable == "object" ? c?.filterable?.type : "text",
            options: typeof c?.filterable == "object" &&  c?.filterable?.type == "select" ? c?.filterable?.options : undefined
          })) as FilterColumnOption[]}
          onFilter={(filters) => onChangeFilter?.(filters)}
          filter={filter}
          className={pcn<CT>(className, "controller-bar") || ""}
        />
      )}

      <div className="relative">
        <ScrollContainerComponent
          scrollFloating={!isSm && block}
          className="w-full"
          onScroll={(e) => {
            actionColumnRef.current?.clientWidth &&  e.scrollLeft &&
              setShowFloatingAction(e.scrollLeft + e.clientWidth <=  e.scrollWidth - actionColumnRef.current?.clientWidth);
          }}
          footer={
            <>
              {block && pagination && (
                <>
                  <div className="py-6"></div>
                  <div className="my-2 absolute bottom-0 w-full">
                    <PaginationComponent {...pagination} />
                  </div>
                </>
              )}
            </>
          }
        >
          {loading ? (
            <>
              {
                // =========================>
                // ## When Loading
                // =========================>
              }
              <div className="w-max min-w-full">
                <div className="flex flex-col items-center justify-center gap-8 p-20">
                  <h1 className="text-lg text-light-foreground animate-pulse">
                    Memuat data...
                  </h1>
                </div>
              </div>
            </>
          ) : !data || !data.length ? (
            <>
              {
                // =========================>
                // ## When Empty
                // =========================>
              }
              <div className="flex flex-col items-center justify-center gap-8 p-20 opacity-50">
                <h1 className="text-lg text-light-foreground">
                  Belum Ada Data
                </h1>
              </div>
            </>
          ) : (
            <>
              {!isSm || !responsiveControl?.mobile ? (
                <>
                  <div className="w-max min-w-full">
                    {
                      // =========================>
                      // ## Head Column
                      // =========================>
                    }
                    <div className={cn("flex gap-4", pcn<CT>(className, "row"))}>
                      {!!actionBulking && (
                        <div className={cn(styles.head, "w-max")}>
                          <CheckboxComponent
                            name="selected_table"
                            className="w-5 h-5"
                            checked={data.length > 0 && checks?.length === data.length}
                            onChange={() => data.length > 0 && checks?.length === data.length ? onChangeChecks?.([]) : onChangeChecks?.(data.map((d) => d.id))}
                          />
                        </div>
                      )}
                      {!noIndex && <div className={cn(styles.head, "w-8", pcn<CT>(className, "head-column"))}>#</div>}
                      {renderHead()}
                    </div>

                    {
                      // =========================>
                      // ## Body Column
                      // =========================>
                    }
                    <div className={`flex flex-col gap-y-0.5`}>
                      {data.map((item: Record<string, any>, key) => {
                        return (
                          <div
                            style={{ animationDelay: `${(key + 1) * 0.05}s` }}
                            className={cn(
                              styles.row,
                              key % 2 ? "bg-light-primary/10" : "bg-white",
                              focus == key && "bg-light-primary/30",
                              pcn<CT>(className, "row")
                            )}
                            key={key}
                          >
                            {!!actionBulking && (
                              <div className={cn("w-max", styles.column)}>
                                <CheckboxComponent
                                  name="selected_table"
                                  className="w-5 h-5"
                                  checked={checks?.includes(item?.id)}
                                  onChange={() => checks?.includes(item?.id) ? onChangeChecks?.(checks.filter((i) => i !== item?.id)) : onChangeChecks?.([...(checks || []), item?.id])}
                                />
                              </div>
                            )}
                            {!noIndex && <div className={cn("w-8", styles?.column)}>{numberOfRow(key)}</div>}
                            {renderItem(item, key)}
                            <div ref={actionColumnRef} className={cn(`flex-1 flex justify-end gap-2 px-4 py-2`)}>
                              {item["action" as keyof object]}
                            </div>

                            {item["action" as keyof object] &&
                              showFloatingAction && (
                                <div
                                  className={styles.floatingAction}
                                  onClick={() =>
                                    floatingActionActive !== false &&
                                    floatingActionActive == key ? setFloatingActionActive(false) : setFloatingActionActive(key)
                                  }
                                >
                                  <div className="pl-4 pr-7 py-2">
                                    <FontAwesomeIcon icon={floatingActionActive === false || floatingActionActive != key ? faChevronLeft : faChevronRight}/>
                                  </div>

                                  <div className={`py-1 flex gap-2 ${floatingActionActive !== false && floatingActionActive == key ? "w-max pl-2 pr-8" : "w-0"}`}>
                                    {item["action" as keyof object]}
                                  </div>
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={`w-full flex flex-col gap-y-0.5`}>
                    {data.map((item: Record<string, any>, key) => {
                      return (
                        <div
                          style={{ animationDelay: `${(key + 1) * 0.05}s` }}
                          key={key}
                        >
                          {renderItem(item, key)}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
              
            </>
          )}
        </ScrollContainerComponent>
      </div>

      {!!actionBulking && !!checks?.length && (
        <div className="rounded-[6px] bg-white mt-4 w-full px-4 py-2 border flex justify-between items-center">
          <div className="text-sm font-semibold">{checks?.length} Data Terpilih</div>
          <div className="flex justify-end items-center gap-2">
            {actionBulking?.(checks)}
          </div>
        </div>
      )}

      {!block && pagination && (
        <div className="mt-4">
          <PaginationComponent {...pagination} />
        </div>
      )}
    </div>
  );
}
