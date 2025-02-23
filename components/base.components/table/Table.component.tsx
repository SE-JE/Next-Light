/* eslint-disable @next/next/no-img-element */
import {
  faArrowDownZA,
  faArrowUpAZ,
  faChevronLeft,
  faChevronRight,
  faEyeLowVision,
  faMagnifyingGlass,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useRef, useState } from "react";
import PaginationComponent, { PaginationProps } from "./Pagination.component";
import { InputComponent, SelectComponent } from "../input";
import { useLazySearch } from "@/helpers";
import { InputCheckboxComponent } from "../input/InputCheckbox.component";
import { OutsideClickComponent } from "../outside-click/OutsideClick.component";
import { IconButtonComponent } from "../button";
import { ScrollContainerComponent } from "../scroll-container";

export type TableColumnType = {
  selector: string;
  label: string;
  width?: string;
  sortable?: boolean;
  className?: string;
};

export type tablePropsType = {
  headBar?: ReactNode;
  controlBar?:
    | boolean
    | (
        | "refresh"
        | "search"
        | "searchColumn"
        | "filterColumn"
        | (() => ReactNode)
      )[];
  columns: TableColumnType[];
  data: object[];
  pagination?: PaginationProps;
  loading?: boolean;

  sortBy?: { column: string; direction: "asc" | "desc" };
  onChangeSortBy?: (column: string, direction: "asc" | "desc") => void;
  search?: string;
  onChangeSearch?: (search: string) => void;
  searchableColumn?: string[];
  onChangeSearchableColumn?: (column: string) => void;
  filter?: object;
  onChangeFilter?: (value: object[]) => void;

  onRowClick?: (data: object, key: number) => void;
  onRefresh?: () => void;
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
  // filter,
  // onChangeFilter,

  onRowClick,
  onRefresh,
}: tablePropsType) {
  const [displayColumns, setDisplayColumns] = useState<string[]>([]);
  const [showFloatingAction, setShowFloatingAction] = useState(false);
  const [floatingActionActive, setFloatingActionActive] = useState<
    false | number
  >(false);
  const [floatingDisplay, setFloatingDisplay] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [keywordSearch] = useLazySearch(keyword);

  const actionColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (columns) {
      setDisplayColumns([...columns.map((column) => column.selector)]);
    }
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

  return (
    <>
      {controlBar != false && (
        <div className="py-1 bg-white shadow-2xs flex items-center mb-2">
          {
            // =========================>
            // ## Display column
            // =========================>
          }

          {searchableColumn && searchableColumn?.length > 0 && (
            <div className="w-36">
              <SelectComponent
                name="searchableColumn"
                options={[
                  { label: "Semua", value: "all" },
                  ...columns.map((column) => {
                    return {
                      label: column.label,
                      value: column.selector,
                    };
                  }),
                ]}
                value={searchableColumn || "all"}
                onChange={(e) => onChangeSearchableColumn?.(String(e))}
                className="py-1.5 text-sm"
              />
            </div>
          )}
          <div className="w-full min-w-[150px] px-1.5">
            <InputComponent
              name="search"
              placeholder="Cari disini..."
              rightIcon={faMagnifyingGlass}
              value={keyword}
              onChange={(e) => setKeyword(e)}
              className="py-1.5 text-sm"
            />
          </div>
          <div className="p-1.5 rounded-md relative">
            <IconButtonComponent
              icon={faEyeLowVision}
              variant="simple"
              className="!text-foreground"
              onClick={() => {
                setFloatingDisplay(!floatingDisplay);
              }}
              size="sm"
            />
            <OutsideClickComponent
              onOutsideClick={() => {
                setFloatingDisplay(false);
              }}
            >
              <div
                className={`
                  absolute -bottom-4 bg-white translate-y-full right-0 p-2 w-[240px] z-20 rounded-lg shadow
                  ${!floatingDisplay && "scale-y-0 top-0 opacity-0"}
                `}
              >
                <label className="text-sm font-semibold mb-2">
                  Kolom Ditampilkan
                </label>
                <InputCheckboxComponent
                  vertical
                  name="show_column"
                  options={columns?.map((column) => {
                    return {
                      label: column.label,
                      value: column.selector,
                    };
                  })}
                  onChange={(e) => {
                    setDisplayColumns(
                      Array()
                        .concat(e)
                        .map((val) => String(val))
                    );
                  }}
                  value={displayColumns}
                />
              </div>
            </OutsideClickComponent>
          </div>
          <div className="p-1.5 rounded-md relative">
            <IconButtonComponent
              icon={faRefresh}
              variant="simple"
              className="!text-foreground"
              onClick={() => {
                onRefresh?.();
              }}
              size="sm"
            />
          </div>
        </div>
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
                {
                  // =========================>
                  // ## Head Column
                  // =========================>
                }
                <div className="flex gap-4 mb-2 px-3 py-2">
                  <div className="w-16 px-4 py-2.5 font-bold skeleton__loading"></div>
                  {[1, 2, 3, 4, 5, 6, 7].map((_, key) => {
                    return (
                      <div
                        key={key}
                        className={`px-6 py-3 font-bold skeleton__loading`}
                        style={{
                          width: "200px",
                        }}
                      ></div>
                    );
                  })}
                </div>

                {
                  // =========================>
                  // ## Body Column
                  // =========================>
                }
                <div className="flex flex-col gap-y-1.5">
                  {[1, 2, 3].map((_, key) => {
                    return (
                      <div
                        style={{
                          animationDelay: `${0.25 + key * 0.05}s`,
                        }}
                        className="flex items-center gap-4 bg-white rounded-lg shadow-sm relative p-2.5 intro__table__column"
                        key={key}
                      >
                        <div className="w-16 px-4 py-2.5 font-medium skeleton__loading"></div>
                        {[1, 2, 3, 4, 5, 6, 7].map((_, key) => {
                          return (
                            <div
                              key={key}
                              className="px-4 py-2.5 text-lg font-medium skeleton__loading"
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
              {!data || !data.length ? (
                <div className="flex justify-center p-5">
                  {
                    // =========================>
                    // ## When Empty
                    // =========================>
                  }
                  <div className="flex flex-col items-center justify-center gap-8 p-5">
                    <img src="/204.svg" width={"200px"} alt="server error" />
                    <h1 className="text-2xl font-bold">Data Kosong</h1>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-max min-w-full">
                    {
                      // =========================>
                      // ## Head Column
                      // =========================>
                    }
                    <div className="flex gap-4">
                      <div className="w-8 px-4 py-2.5 font-bold text-sm">#</div>
                      {columns &&
                        columns
                          .filter((column) =>
                            displayColumns.includes(column.selector)
                          )
                          .map((column, key) => {
                            return (
                              <div
                                key={key}
                                className={`px-4 py-2.5 font-bold`}
                                style={{
                                  width: column.width ? column.width : "200px",
                                }}
                              >
                                <div className="flex justify-between gap-2 items-center">
                                  <div
                                    className={`
                                w-full text-sm text-foreground capitalize
                                ${column.sortable ? "cursor-pointer" : ""}
                              `}
                                    onClick={() => {
                                      if (column.sortable && onChangeSortBy) {
                                        onChangeSortBy(
                                          column.selector,
                                          sortBy &&
                                            sortBy?.column == column.selector &&
                                            sortBy?.direction == "desc"
                                            ? "asc"
                                            : "desc"
                                        );
                                      }
                                    }}
                                  >
                                    {column.label}
                                  </div>

                                  <div className="relative flex gap-4">
                                    {sortBy &&
                                      sortBy.column == column.selector && (
                                        <div
                                          className={`${
                                            column.sortable
                                              ? "cursor-pointer"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            if (
                                              column.sortable &&
                                              onChangeSortBy
                                            ) {
                                              onChangeSortBy(
                                                column.selector,
                                                sortBy &&
                                                  sortBy?.column !=
                                                    column.selector &&
                                                  sortBy?.direction == "asc"
                                                  ? "desc"
                                                  : "asc"
                                              );
                                            }
                                          }}
                                        >
                                          {sortBy.direction == "desc" ? (
                                            <FontAwesomeIcon
                                              icon={faArrowDownZA}
                                              className="text-slate-400"
                                            />
                                          ) : (
                                            <FontAwesomeIcon
                                              icon={faArrowUpAZ}
                                              className="text-slate-400"
                                            />
                                          )}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                    {
                      // =========================>
                      // ## Body Column
                      // =========================>
                    }
                    <div className={`flex flex-col gap-y-1.5`}>
                      {data &&
                        data.map((item: object, key) => {
                          return (
                            <div
                              style={{
                                animationDelay: `${(key + 1) * 0.05}s`,
                              }}
                              className={`
                                flex items-center gap-4 rounded-lg  relative intro__table__column animate-intro-right
                                ${key % 2 ? "bg-white/40" : "bg-white"}
                                ${
                                  onRowClick &&
                                  "cursor-pointer hover:bg-light-primary/40"
                                }
                              `}
                              key={key}
                            >
                              <div className="w-8 px-4 py-2 font-medium">
                                {pagination && pagination?.page != 1
                                  ? pagination?.paginate *
                                      (pagination?.page - 1) +
                                    key +
                                    1
                                  : key + 1}
                              </div>
                              {columns &&
                                columns
                                  .filter((column) =>
                                    displayColumns.includes(column.selector)
                                  )
                                  .map((column, columnKey) => {
                                    return (
                                      <div
                                        key={columnKey}
                                        className="px-4 py-2 font-medium"
                                        style={{
                                          width: column.width || "200px",
                                        }}
                                        onClick={() => {
                                          onRowClick?.(item, key);
                                        }}
                                      >
                                        {item[
                                          column.selector as keyof object
                                        ] || "-"}
                                      </div>
                                    );
                                  })}
                              <div
                                ref={actionColumnRef}
                                className={`flex-1 flex justify-end gap-2 px-4 py-2`}
                              >
                                {item["action" as keyof object]}
                              </div>

                              {item["action" as keyof object] &&
                                showFloatingAction && (
                                  <div
                                    className="sticky bg-background -right-5 z-30 cursor-pointer flex items-center shadow rounded-l-lg"
                                    onClick={() =>
                                      floatingActionActive !== false &&
                                      floatingActionActive == key
                                        ? setFloatingActionActive(false)
                                        : setFloatingActionActive(key)
                                    }
                                  >
                                    <div className=" pl-4 pr-7 py-2">
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
                        })}
                    </div>
                  </div>
                  {/* <div className="absolute left-0 top-0 bg-background w-[200px] h-full z-30"></div> */}
                </>
              )}
            </>
          )}
        </ScrollContainerComponent>
      </div>

      {pagination && (
        <div className="mt-4">
          <PaginationComponent {...pagination} />
        </div>
      )}
    </>
  );
}
