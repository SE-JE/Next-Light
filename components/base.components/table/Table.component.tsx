/* eslint-disable @next/next/no-img-element */

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownZA, faArrowUpAZ, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn, useLazySearch } from "@utils/.";
import { ControlBarComponent, ControlBarOptionType, PaginationComponent, PaginationProps, ScrollContainerComponent } from "@components/.";



type CT = "controller-bar" | "head-column" | "column" | "row" | "floating-action" | "base";

export interface TableColumnType {
  selector    :  string;
  label       :  string;
  width      ?:  string;
  sortable   ?:  boolean;
  className  ?:  string;
  item       ?:  (data: any) => string | ReactNode;
};

export interface TableProps {
  controlBar                ?:  false | ControlBarOptionType[];

  columns                    :  TableColumnType[];
  data                       :  object[];
  pagination                ?:  PaginationProps;

  loading                   ?:  boolean;
  sortBy                    ?:  { column: string; direction: "asc" | "desc" };
  onChangeSortBy            ?:  ({ column, direction } : { column: string; direction: "asc" | "desc"; }) => void;
  search                    ?:  string;
  onChangeSearch            ?:  (search: string) => void;
  searchableColumn          ?:  string[];
  onChangeSearchableColumn  ?:  (column: string) => void;
  onRowClick                ?:  (data: object, key: number) => void;
  onRefresh                 ?:  () => void;

  /** Use custom class with: "controller-bar::", "head-column::", "column::", "floating-action::", "row::". */
  className?: string;
};



export function TableComponent({
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

  onRowClick,
  onRefresh,

  className = "",
}: TableProps) {
  const [displayColumns, setDisplayColumns] = useState<string[]>([]);
  const [showFloatingAction, setShowFloatingAction] = useState(false);
  const [floatingActionActive, setFloatingActionActive] = useState<false | number>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [keywordSearch] = useLazySearch(keyword);

  const actionColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (columns) setDisplayColumns([...columns.map((column) => column.selector)]);
  }, [columns]);

  useEffect(() => {
    setKeyword(search || "");
    pagination?.onChange?.(pagination.totalRow, pagination.paginate, 1);
  }, [search]);

  useEffect(() => {
    if (keywordSearch) {
      onChangeSearch?.(keywordSearch);
    } else {
      onChangeSearch?.("");
    }
  }, [keywordSearch]);

  const columnMapping = useMemo(() => {
    return ( columns?.filter((column) => displayColumns.includes(column.selector)) || []);
  }, [columns, displayColumns]);

  function numberOfRow(key: number) {
    const page = pagination?.page || 1;
    return pagination && page != 1 ? pagination?.paginate * (page - 1) + key + 1 : key + 1;
  }

  const styles = {
    head            :  "px-4 py-2.5 font-bold w-full flex justify-between gap-2 items-center text-sm text-foreground capitalize",
    column          :  cn("px-4 py-2 font-medium", pcn<CT>(className, "column")),
    row             :  "flex items-center gap-4 rounded-[6px] relative animate-intro-right border-b",
    floatingAction  :  cn("sticky bg-background -right-5 z-30 cursor-pointer flex items-center shadow rounded-l-lg", pcn<CT>(className, "floating-action")),
  };

  function renderItem(item: object) {
    const itemMapping = columnMapping.map((column) =>
        column?.item ? column?.item(item) : 
        (typeof item[column.selector as keyof object] == "object"
          ? JSON.stringify(item[column.selector as keyof object])
          : item[column.selector as keyof object]) || "-"
    );

    return (
      <>
        {itemMapping?.map((one, key) => {
          return (
            <div
              key={key}
              className={styles.column}
              style={{
                width: columnMapping?.at(key)?.width || 200,
              }}
              onClick={() => {
                onRowClick?.(item, key);
              }}
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
          return (
            <div
              key={key}
              className={cn(
                styles?.head,
                column.sortable && "cursor-pointer",
                pcn<CT>(className, "head-column")
              )}
              style={{
                width: column.width ? column.width : 200,
              }}
              onClick={() =>
                column.sortable &&
                onChangeSortBy?.({
                  column: column.selector,
                  direction:
                    sortBy?.column == column.selector &&
                    sortBy?.direction == "desc" ? "asc" : "desc",
                })
              }
            >
              {column.label}

              {sortBy?.column == column.selector && (
                <FontAwesomeIcon
                  icon={
                    sortBy.direction == "desc" ? faArrowDownZA : faArrowUpAZ
                  }
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
    <div className={pcn<CT>(className, "base")}>
      {controlBar != false && (
        <ControlBarComponent 
          options={!controlBar ? ["SEARCHABLE", "SEARCH", "SELECTABLE", "REFRESH"] : controlBar}
          onSearchable={(e) => onChangeSearchableColumn?.(String(e))}
          searchable={searchableColumn || []}
          onSearch={(e) => setKeyword(e)}
          search={keyword}
          onSelectable={(e) => setDisplayColumns(e)}
          selectable={displayColumns}
          onRefresh={() => onRefresh?.()}
          className={pcn<CT>(className, "controller-bar") || ""}
        />
      )}

      <div className="relative w-full">
        <ScrollContainerComponent
          scrollFloating
          onScroll={(e) => {
            actionColumnRef.current?.clientWidth &&
              e.scrollLeft &&
              setShowFloatingAction(
                e.scrollLeft + e.clientWidth <=
                  e.scrollWidth - actionColumnRef.current?.clientWidth
              );
          }}
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
                        style={{
                          width: "200px",
                        }}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-y-1.5">
                  {[1, 2, 3, 4, 5, 6].map((_, key) => {
                    return (
                      <div
                        style={{
                          animationDelay: `${0.25 + key * 0.05}s`,
                        }}
                        className="flex items-center gap-4 bg-white rounded-lg shadow-sm relative p-2.5"
                        key={key}
                      >
                        <div className="w-16 px-4 py-2.5 font-medium skeleton-loading"></div>
                        {[1, 2, 3, 4, 5, 6, 7].map((_, key) => {
                          return (
                            <div
                              key={key}
                              className="px-4 py-2.5 text-lg font-medium skeleton-loading"
                              style={{
                                width: "200px",
                              }}
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
                  <div
                    className={cn(
                      styles.head,
                      "w-8",
                      pcn<CT>(className, "head-column")
                    )}
                  >
                    #
                  </div>
                  {renderHead()}
                </div>
                {
                  // =========================>
                  // ## Body Column
                  // =========================>
                }
                <div className={`flex flex-col gap-y-1.5`}>
                  {data && data.length ? (
                    data.map((item: object, key) => {
                      return (
                        <div
                          style={{
                            animationDelay: `${(key + 1) * 0.05}s`,
                          }}
                          className={cn(
                            styles.row,
                            key % 2 ? "bg-white/40" : "bg-white",
                            onRowClick &&
                              "cursor-pointer hover:bg-light-primary/40",
                            pcn<CT>(className, "row")
                          )}
                          key={key}
                        >
                          <div className={cn("w-8", styles?.column)}>
                            {numberOfRow(key)}
                          </div>
                          {renderItem(item)}
                          <div
                            ref={actionColumnRef}
                            className={`flex-1 flex justify-end gap-2 px-4 py-2`}
                          >
                            {item["action" as keyof object]}
                          </div>

                          {item["action" as keyof object] &&
                            showFloatingAction && (
                              <div
                                className={styles.floatingAction}
                                onClick={() =>
                                  floatingActionActive !== false &&
                                  floatingActionActive == key
                                    ? setFloatingActionActive(false)
                                    : setFloatingActionActive(key)
                                }
                              >
                                <div className="pl-4 pr-7 py-2">
                                  <FontAwesomeIcon
                                    icon={
                                      floatingActionActive === false ||
                                      floatingActionActive != key
                                        ? faChevronLeft
                                        : faChevronRight
                                    }
                                  />
                                </div>

                                <div
                                  className={`py-1 flex gap-2 ${
                                    floatingActionActive !== false &&
                                    floatingActionActive == key
                                      ? "w-max pl-2 pr-8"
                                      : "w-0"
                                  }`}
                                >
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
                        <img
                          src="/204.svg"
                          width={"160px"}
                          alt="server error"
                        />
                        <h1 className="text-2xl text-foreground">
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

      {pagination && (
        <div className="mt-4">
          <PaginationComponent {...pagination} />
        </div>
      )}
    </div>
  );
}
