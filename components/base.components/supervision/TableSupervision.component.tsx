import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ApiType, useGetApi, useResponsive } from "@utils/.";
import { FloatingPageComponent, FloatingPageProps, ButtonComponent, IconButtonComponent, TableColumnType, TableComponent, FormSupervisionComponent, FormType, ModalConfirmComponent } from "@components/.";


export interface TableSupervisionColumnProps {
  selector         :  string;
  label           ?:  string;
  width           ?:  string;
  sortable        ?:  boolean;
  item            ?:  (data: any) => string | ReactNode;
  permissionCode  ?:  string;
};

export interface TableSupervisionFormProps {
  forms                :  string[] | (FormType & { visibility?: "*" | "create" | "update" })[];
  customDefaultValue  ?:  object;
  payload             ?:  (values: any) => object;
  modalControl        ?:  FloatingPageProps;
  contentType         ?:  "application/json" | "multipart/form-data";
};

export type TableSupervisionProps = {
  title           ?:  string;
  fetchControl     :  ApiType;
  setToRefresh    ?:  boolean;
  refreshOnClose  ?:  boolean;
  setToLoading    ?:  boolean;
  headBar         ?:  any;
  columnControl   ?:  string[] | TableSupervisionColumnProps[];
  formControl     ?:  TableSupervisionFormProps;
  permissionCode  ?:  number;
  searchable      ?:  boolean;
  customDetail    ?:  (data: object) => any;
  actionControl   ?:  boolean | (
    | string
    | ((
        row              :  object,
        setModal         :  (type: "form" | "delete" | "show") => void,
        setDataSelected  :  () => void
      ) => ReactNode[])
  )[];
};

export function TableSupervisionComponent({
  title,
  fetchControl,
  setToLoading,
  columnControl,
  formControl,
  actionControl,
}: TableSupervisionProps) {
  const router    =  useRouter();
  const { isSm }  =  useResponsive();
  const {
    page              :  pageParams,
    paginate          :  paginateParams,
    search            :  searchParams,
    "sort.direction"  :  sortDirectionParams,
    "sort.column"     :  sortColumnParams,
  } = router.query;

  const [paginate, setPaginate]  =  useState(10);
  const [page, setPage]          =  useState(1);
  const [sort, setSort]          =  useState<{ column: string; direction: "desc" | "asc"; }>({ column: "created_at", direction: "desc" });
  const [search, setSearch]      =  useState<string>("");
  // const [searchColumn, setSearchColumn] = useState<string>("");
  // const [filter, setFilter] = useState<GetFilterType[]>([]);

  const [modal, setModal]                =  useState<"form" | "delete" | "show" | null>(null);
  const [dataSelected, setDataSelected]  =  useState<object | null>(null);

  // ============================
  // ## fetching
  // ============================
  const { loading, data, reset } = useGetApi(
    {
      ...fetchControl,
      method  :  "GET",
      params  :  {
        page,
        paginate,
        sortBy         :  sort.column,
        sortDirection  :  sort.direction,
        search         :  search,
        // filter: filter,
      },
    },
    setToLoading
  );

  useEffect(() => {
    // if (!unUrlPage) {
    pageParams && setPage(Number(pageParams));
    paginateParams && setPaginate(Number(paginateParams));
    searchParams && setSearch(String(searchParams));
    sortColumnParams &&
      sortDirectionParams &&
      setSort({
        column: String(sortColumnParams),
        direction: sortDirectionParams as "asc" | "desc",
      });
    // }
  }, [router]);

  // ============================
  // ## router handler
  // ============================
  useEffect(() => {
    // if (!unUrlPage) {
    const url = new URL(window.location.href);
    search && url.searchParams.set("search", search);
    page && url.searchParams.set("page", page.toString());
    paginate && url.searchParams.set("paginate", paginate.toString());
    sort?.column && url.searchParams.set("sort.column", sort.column);
    sort?.direction && url.searchParams.set("sort.direction", sort.direction);
    window.history.pushState({}, "", url.toString());
    // }
  }, [page, paginate, sort.column, sort.direction, search]);

  // ============================
  // ## column preparation
  // ============================
  const columns = useMemo(() => {
    return columnControl?.length
      ? columnControl.map((col) => {
          if (typeof col === "string") {
            return {
              selector: col,
              label: col,
            };
          } else {
            return {
              ...col,
            };
          }
        })
      : data?.columns || data?.data?.at(0)
        ? Object.keys(data.data[0]).map((col) => {
            return {
              selector: col,
              label: col,
            };
          })
        : [];
  }, [columnControl, data]);

  // ============================
  // ## data table preparation
  // ============================
  const dataTables = useMemo(() => {
    return data?.data?.map((row: object) => {
      return {
        ...row,
        action: (actionControl !== false ||
          (Array.isArray(actionControl) && actionControl?.length)) && (
          <div className="flex items-center gap-2">
            {/* edit action */}
            {(!Array.isArray(actionControl) ||
              actionControl
                ?.filter((ac) => typeof ac === "string")
                .includes("edit")) && (
              <ButtonComponent
                icon={faEdit}
                label={"Ubah"}
                variant="outline"
                paint="warning"
                size={"xs"}
                rounded
                onClick={() => {
                  setModal("form");
                  setDataSelected(row);
                }}
              />
            )}
            {/* delete action */}
            {(!Array.isArray(actionControl) ||
              actionControl
                ?.filter((ac) => typeof ac === "string")
                .includes("delete")) && (
              <ButtonComponent
                icon={faTrash}
                label={"Hapus"}
                variant="outline"
                paint="danger"
                size={"xs"}
                rounded
                onClick={() => {
                  setModal("delete");
                  setDataSelected(row);
                }}
              />
            )}
            {/* custom action */}
            {Array.isArray(actionControl) &&
              actionControl
                ?.filter((ac) => typeof ac === "function")
                .map((ac) => ac(row, setModal, () => setDataSelected(row)))}
          </div>
        ),
      };
    });
  }, [actionControl, data]);

  // ============================
  // ## form preparation
  // ============================
  const forms = useMemo(() => {
    return formControl?.forms?.length
      ? formControl?.forms.map((form) => {
          return typeof form === "string"
            ? {
                col: 12,
                type: "text",
                construction: {
                  name: form,
                  label: form,
                },
              }
            : {
                ...form,
              };
        })
      : data?.forms ||
          data?.columns ||
          columnControl?.map((col) => {
            return {
              col: 12,
              type: "text",
              construction: {
                name: typeof col == "string" ? col : col?.selector,
                label: typeof col == "string" ? col : col?.label,
                placeholder: `Masukkan ${
                  typeof col == "string" ? col : col?.label
                }...`,
              },
            };
          }) ||
          (data?.data?.at(0)
            ? Object.keys(data.data[0]).map((col) => {
                return {
                  col: 12,
                  type: "text",
                  construction: {
                    name: col,
                    label: col,
                    placeholder: `Masukkan ${col}...`,
                  },
                };
              })
            : []);
  }, [formControl, data]);

  return (
    <>
      <h1 className="text-lg lg:text-xl font-bold mb-2 lg:mb-4">{title}</h1>

      <TableComponent
        columns={columns as TableColumnType[]}
        data={dataTables}
        loading={loading}
        pagination={{
          totalRow: data?.total_row,
          page: page,
          paginate: paginate,
          onChange: (page, pageSize) => {
            setPage(page);
            setPaginate(pageSize);
          },
        }}
        sortBy={sort}
        onChangeSortBy={(e) =>
          setSort({ column: e.column, direction: e.direction })
        }
        search={search}
        onChangeSearch={(e) => setSearch(e)}
        onRefresh={() => {}}
        onRowClick={() => {}}
        controlBar={[
          ...(!isSm
            ? [
                <div className="pl-2 pr-4 mr-2 border-r" key="button-add">
                  <ButtonComponent
                    icon={faPlus}
                    label="Tambah Data"
                    size="sm"
                    onClick={() => setModal("form")}
                  />
                </div>
              ]
            : []),
          "SEARCHABLE", "SEARCH", "SELECTABLE", "REFRESH",
        ]}
      />

      <IconButtonComponent
        icon={faPlus}
        className="fixed bottom-4 right-4 w-12 h-12 lg:hidden"
        size="lg"
        onClick={() => setModal("form")}
      />

      <FloatingPageComponent
        show={modal === "form"}
        onClose={() => setModal(null)}
        title="Tambah Data"
        className="bg-white"
      >
        <div className="p-4">
          <FormSupervisionComponent
            defaultValue={formControl?.customDefaultValue}
            forms={forms as FormType[]}
            submitControl={fetchControl.path ? 
              { path: `${fetchControl.path}/${(dataSelected as { id: number })?.id || "" }`} 
            : 
              { url: `${fetchControl.url}/${(dataSelected as { id: number })?.id || ""}`}
            }
            payload={formControl?.payload}
            onSuccess={() => {
              reset();
              setModal(null);
            }}
          />
        </div>
      </FloatingPageComponent>

      <ModalConfirmComponent
        show={modal === "delete"}
        onClose={() => setModal(null)}
        icon={faQuestionCircle}
        title={`Menghapus Data?`}
        submitControl={{
          onSubmit: {
            method: "DELETE",
            ...(fetchControl.path ? 
              {path: `${fetchControl.path}/${(dataSelected as { id: number })?.id || ""}`} 
            : 
              {url: `${fetchControl.url}/${(dataSelected as { id: number })?.id || ""}`}
            ),
          },
          onSuccess: () => {
            reset();
            setModal(null);
          },
        }}
      >
        <p className="px-2 pb-2 text-sm text-center">
          Yakin yang dihapus sudah benar?
        </p>
      </ModalConfirmComponent>
    </>
  );
}
