import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownZA, faArrowUpAZ, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { ApiFilterType, cn, pcn, useLazySearch } from "@utils";
import { useToggleContext } from "@contexts";
import { ControlBarComponent, ControlBarOptionType, PaginationComponent, PaginationProps, ScrollContainerComponent, FilterComponent, FilterColumnOption, CheckboxComponent } from "@components";



type CT = "controller-bar" | "head-column" | "column" | "row" | "floating-action" | "base";

export interface TableColumnType {
  selector    :  string;
  label       :  string;
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
  pagination                ?:  PaginationProps;

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

  onRowClick                ?:  (data: object, key: number) => void;
  onRefresh                 ?:  () => void;

  block                     ?: boolean;

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

  onRowClick,
  onRefresh,
  
  block,
  
  className = "",
}: TableProps) {
  const { toggle }                                       =  useToggleContext()
  const [displayColumns, setDisplayColumns]              =  useState<string[]>([]);
  const [showFloatingAction, setShowFloatingAction]      =  useState(false);
  const [floatingActionActive, setFloatingActionActive]  =  useState<false | number>(false);
  const [keyword, setKeyword]                            =  useState<string>("");
  const [keywordSearch]                                  =  useLazySearch(keyword);

  const actionColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (columns) setDisplayColumns([...columns.map((column) => column.selector)]);
  }, [columns]);
  

  useEffect(() => {
    setKeyword(search || "");
  }, [search]);

  useEffect(() => {
    keywordSearch ? onChangeSearch?.(keywordSearch) : onChangeSearch?.("");
    pagination?.onChange?.(pagination.totalRow, pagination.paginate, 1);
  }, [keywordSearch]);

  const columnMapping = useMemo(() => {
    return ( columns?.filter((column) => displayColumns.includes(column.selector)) || []);
  }, [columns, displayColumns]);



  const styles = {
    head            :  "px-4 py-2.5 font-bold w-full flex justify-between gap-2 items-center text-sm text-foreground capitalize",
    column          :  cn("px-4 py-4 font-medium", pcn<CT>(className, "column")),
    row             :  "flex items-center gap-4 rounded-[4px] relative animate-intro-right border-b hover:bg-light-primary/30",
    floatingAction  :  cn("sticky bg-background -right-5 z-30 cursor-pointer flex items-center shadow rounded-l-lg", pcn<CT>(className, "floating-action")),
  };


  const numberOfRow = (key: number) => pagination && (pagination?.page || 1) != 1 ? pagination?.paginate * ((pagination?.page || 1) - 1) + key + 1 : key + 1;



  function renderItem(item: object) {
    const itemMapping = columnMapping.map((column) => column?.item 
      ? column?.item(item) : (typeof item[column.selector as keyof object] == "object" ? JSON.stringify(item[column.selector as keyof object]) 
      : item[column.selector as keyof object]) || "-"
    );

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
              className={cn(styles.column, onRowClick && "cursor-pointer")}
              style={{ width: columnMapping?.at(key)?.width || 200 }}
              onClick={() => onRowClick?.(item, key) }
              title={title}
            >
              {one}
            </div>
          );
        })}
      </>
    );
  }



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
          className={pcn<CT>(className, "controller-bar") || ""}
        />
      )}

      <FilterComponent 
        className={cn("", !toggle.FILTER ? "p-0 h-0 hidden overflow-hidden" : "mb-2 animate-intro-down")}
        columns={columns?.filter((c) => !!c?.filterable)?.map((c) => ({
          label: c.label, 
          selector: c.selector, 
          type: typeof c?.filterable == "object" ? c?.filterable?.type : "text",
          options: typeof c?.filterable == "object" &&  c?.filterable?.type == "select" ? c?.filterable?.options : undefined
        })) as FilterColumnOption[]}
        onChange={(filters) => onChangeFilter?.(filters)}
        value={filter}
      />

      <div className="relative">
        <ScrollContainerComponent
          scrollFloating
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
          {
            // =========================>
            // ## When Loading
            // =========================>
          }
          {loading ? (
            <>
              <div className="w-max min-w-full">
                <div className="flex gap-4 mb-2 px-3 py-2">
                  <div className="w-16 px-4 py-2.5 font-bold skeleton-loading"></div>
                  {[1, 2, 3, 4, 5, 6, 7].map((_, key) => {
                    return (
                      <div
                        key={key}
                        className={`px-6 py-3 skeleton-loading`}
                        style={{ width: "200px" }}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-y-1.5">
                  {[1, 2, 3, 4, 5, 6].map((_, key) => {
                    return (
                      <div
                        style={{ animationDelay: `${0.25 + key * 0.05}s` }}
                        className="flex items-center gap-4 bg-white rounded-lg shadow-sm relative p-2.5"
                        key={key}
                      >
                        <div className="w-16 px-4 py-2.5 font-medium skeleton-loading"></div>
                        {[1, 2, 3, 4, 5, 6, 7].map((_, key) => {
                          return (
                            <div
                              key={key}
                              className="px-4 py-2.5 text-lg font-medium skeleton-loading"
                              style={{ width: "200px" }}
                            ></div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-max min-w-full">
                {
                  // =========================>
                  // ## Head Column
                  // =========================>
                }
                <div className="flex gap-4">
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
                  <div className={cn(styles.head, "w-8", pcn<CT>(className, "head-column"))}>#</div>
                  {renderHead()}
                </div>
                {
                  // =========================>
                  // ## Body Column
                  // =========================>
                }
                <div className={`flex flex-col gap-y-0.5`}>
                  {data && data.length ? (
                    data.map((item: Record<string, any>, key) => {
                      return (
                        <div
                          style={{ animationDelay: `${(key + 1) * 0.05}s` }}
                          className={cn(
                            styles.row,
                            key % 2 ? "bg-light-primary/10" : "bg-white",
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
                          <div className={cn("w-8", styles?.column)}>{numberOfRow(key)}</div>
                          {renderItem(item)}
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
                    })
                  ) : (
                    <>
                      {
                        // =========================>
                        // ## When Empty
                        // =========================>
                      }
                      <div className="flex flex-col items-center justify-center gap-8 p-20 opacity-50">
                        <h1 className="text-lg text-foreground">
                          Belum Ada Data
                        </h1>
                      </div>
                    </>
                  )}
                </div>
              </div>
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
