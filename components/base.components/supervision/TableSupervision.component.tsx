import React, { ReactNode, useMemo } from "react";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ApiType, cn, conversion, useResponsive, useTable } from "@utils";
import { useToggleContext } from "@contexts";
import { FloatingPageComponent, FloatingPageProps, ButtonComponent, IconButtonComponent, TableColumnType, TableComponent, FormSupervisionComponent, FormType, ModalConfirmComponent, TypographyColumnComponent } from "@components";



export interface TableSupervisionColumnProps {
  selector     :  string;
  label       ?:  string;
  width       ?:  string;
  sortable    ?:  boolean;
  searchable  ?:  boolean;
  accessCode  ?:  string;
  item        ?:  (data: any) => string | ReactNode;
};

export interface TableSupervisionFormProps {
  forms                :  string[] | (FormType & { visibility?: "*" | "create" | "update" })[];
  defaultValue        ?:  (item: Record<string, any> | null) => Record<string, any>;
  payload             ?:  (values: any) => object;
  modalControl        ?:  FloatingPageProps;
  contentType         ?:  "application/json" | "multipart/form-data";
};

export type TableSupervisionProps = {
  fetchControl     :  ApiType;
  title           ?:  string;
  id              ?:  string;
  accessCode      ?:  number;
  encodeParams    ?:  boolean;
  onRowClick      ?:  (data: Record<string, any>) => void;
  columnControl   ?:  string[] | TableSupervisionColumnProps[];
  formControl     ?:  TableSupervisionFormProps;
  detailControl   ?:  boolean | ({
    columns        :  (string | ((data: Record<string, any>) => ReactNode))[],
    className     ?:  string;
  });
  actionControl   ?:  boolean | (
    | 'edit' | 'delete'
    | ((
        row              :  object,
        setModal         :  (type: "form" | "delete" | "show") => void,
        setDataSelected  :  () => void
      ) => ReactNode[])
  )[];
};



export function TableSupervisionComponent({
  title,
  id,
  encodeParams,
  fetchControl,
  columnControl,
  formControl,
  onRowClick,
  detailControl,
  actionControl,
}: TableSupervisionProps) {
  const { tableKey, params, setParam, data, loading, selected, setSelected, reset }  =  useTable(fetchControl, id, title, encodeParams)
  const { setToggle, toggle }                                                        =  useToggleContext()
  const { isSm }                                                                     =  useResponsive();



  // ============================
  // ## Column preparation
  // ============================
  const columns = useMemo(() => {
    return columnControl?.length ? columnControl.map((col) => {
      if (typeof col === "string") {
        return {
          selector  :  col,
          label     :  col,
        };
      } else {
        return { ...col };
      }
    })
  : data?.columns || data?.data?.at(0) ? Object.keys(data.data[0]).map((col) => {
      return {
        selector  :  col,
        label     :  col,
      };
    })
  : [];
  }, [columnControl, data]);




  // ============================
  // ## Data table preparation
  // ============================
  const dataTables = useMemo(() => {
    return data?.data?.map((row: object) => {
      return {
        ...row,
        action: (actionControl !== false || (Array.isArray(actionControl) && actionControl?.length)) && (
          <div className="flex items-center gap-2">
            {(!Array.isArray(actionControl) || actionControl?.filter((ac) => typeof ac === "string").includes("edit")) && (
              <ButtonComponent
                icon={faEdit}
                label={"Ubah"}
                variant="outline"
                paint="warning"
                size={"xs"}
                rounded
                onClick={() => {
                  setToggle(`MODAL_FORM_${conversion.strSnake(tableKey).toUpperCase()}`);
                  setSelected(row);
                }}
              />
            )}

            {(!Array.isArray(actionControl) || actionControl?.filter((ac) => typeof ac === "string").includes("delete")) && (
              <ButtonComponent
                icon={faTrash}
                label={"Hapus"}
                variant="outline"
                paint="danger"
                size={"xs"}
                rounded
                onClick={() => {
                  setToggle(`MODAL_DELETE_${conversion.strSnake(tableKey).toUpperCase()}`);
                  setSelected(row);
                }}
              />
            )}

            {Array.isArray(actionControl) && 
              actionControl?.filter((ac) => typeof ac === "function").map((ac) => ac(row, (type: "EDIT" | "DELETE") => {
                if(type == "EDIT") {
                  setToggle(`MODAL_FORM_${conversion.strSnake(tableKey).toUpperCase()}`); 
                  setSelected(row)
                } 
                
                if (type == "DELETE") {
                  setToggle(`MODAL_DELETE_${conversion.strSnake(tableKey).toUpperCase()}`); 
                  setSelected(row)
                }
              }))
            }
          </div>
        ),
      };
    });
  }, [actionControl, data]);




  // ============================
  // ## Form preparation
  // ============================
  const forms = useMemo(() => {
    return formControl?.forms?.length ? formControl?.forms.map((form) => {
      return typeof form === "string" ? {
        col           :  12,
        type          :  "text",
        construction  :  {
          name   :  form,
          label  :  form,
        },
      } : { ...form };
    }) : data?.forms || data?.columns || columnControl?.map((col) => {
      return {
        col           :  12,
        type          :  "text",
        construction  :  {
          name         :  typeof col == "string" ? col                                 :  col?.selector,
          label        :  typeof col == "string" ? col                                 :  col?.label,
          placeholder  :  `Masukkan ${ typeof col == "string" ? col : col?.label}...`,
        },
      };
    }) || (data?.data?.at(0) ? Object.keys(data.data[0]).map((col) => {
        return {
          col           :  12,
          type          :  "text",
          construction  :  {
            name         :  col,
            label        :  col,
            placeholder  :  `Masukkan ${col}...`,
          },
        };
      })
    : []);
  }, [formControl, data]);



  return (
    <>
      {title && <h1 className="text-lg lg:text-xl font-bold mb-2 lg:mb-4">{title}</h1>}

      <TableComponent
        columns={columns as TableColumnType[]}
        data={dataTables}
        loading={loading}
        pagination={{
          totalRow  :  data?.total_row,
          page      :  params?.page || 1,
          paginate  :  params?.paginate || 10,
          onChange  :  (_, paginate, page) => {
            setParam('paginate', paginate);
            setParam('page', page);
          },
        }}
        sortBy={params?.sort}
        onChangeSortBy={(e) => setParam('sort', e)}
        search={params?.search}
        onChangeSearch={(e) => setParam('search', e)}
        onRefresh={() => reset()}
        onRowClick={onRowClick ? onRowClick : detailControl != false ? (e) => {
          setToggle(`MODAL_SHOW_${conversion.strSnake(tableKey).toUpperCase()}`)
          setSelected(e)
        } : undefined}
        controlBar={[...(!isSm ? ["CREATE"] : []), "SEARCH", , "FILTER", "SELECTABLE", "REFRESH"]}
      />

      <IconButtonComponent
        icon={faPlus}
        className="fixed bottom-4 right-4 w-12 h-12 lg:hidden"
        size="lg"
        onClick={() => setToggle(`MODAL_FORM_${conversion.strSnake(tableKey).toUpperCase()}`)}
      />


      <FloatingPageComponent
        show={!!toggle[`MODAL_SHOW_${conversion.strSnake(tableKey).toUpperCase()}`]}
        onClose={() => setToggle(`MODAL_SHOW_${conversion.strSnake(tableKey).toUpperCase()}`, false)}
        title="Detail"
        className="bg-white"
        footer={
          (actionControl !== false || (Array.isArray(actionControl) && actionControl?.length)) && (
            <div className="flex justify-end items-center gap-2">
              {(!Array.isArray(actionControl) || actionControl?.filter((ac) => typeof ac === "string").includes("edit")) && (
                <ButtonComponent
                  icon={faEdit}
                  label={"Ubah"}
                  variant="outline"
                  paint="warning"
                  size={"sm"}
                  rounded
                  onClick={() => {
                    setToggle(`MODAL_FORM_${conversion.strSnake(tableKey).toUpperCase()}`);
                  }}
                />
              )}

              {(!Array.isArray(actionControl) || actionControl?.filter((ac) => typeof ac === "string").includes("delete")) && (
                <ButtonComponent
                  icon={faTrash}
                  label={"Hapus"}
                  variant="outline"
                  paint="danger"
                  size={"sm"}
                  rounded
                  onClick={() => {
                    setToggle(`MODAL_DELETE_${conversion.strSnake(tableKey).toUpperCase()}`);
                  }}
                />
              )}

              {Array.isArray(actionControl) && 
                actionControl?.filter((ac) => typeof ac === "function").map((ac) => ac(selected, (type: "EDIT" | "DELETE") => {
                  if(type == "EDIT") {
                    setToggle(`MODAL_FORM_${conversion.strSnake(tableKey).toUpperCase()}`);
                  } 
                  
                  if (type == "DELETE") {
                    setToggle(`MODAL_DELETE_${conversion.strSnake(tableKey).toUpperCase()}`);
                  }
                }))
              }
            </div>
          )
        }
      >
        <div className="p-4">
          <div className={cn(
            "flex flex-col gap-y-4", 
            typeof detailControl === "object" ? detailControl.className : undefined
          )}>
            {!!selected && (typeof detailControl === "object" && detailControl?.columns?.length 
            ? detailControl?.columns?.map((column, key) => {
              if (typeof column === "string") {
                return (<TypographyColumnComponent
                  key={key}
                  title={columns?.find((c) => c.selector == column)?.label} 
                  content={selected[column]}
                />)
              } else {
                return column?.(selected)
              }
            }) : columns?.map((column, key) => (
              <TypographyColumnComponent
                key={key}
                title={column.label} 
                content={selected[column.selector]}
              />
            )))}
          </div>
        </div>
      </FloatingPageComponent>


      <FloatingPageComponent
        show={!!toggle[`MODAL_FORM_${conversion.strSnake(tableKey).toUpperCase()}`]}
        onClose={() => setToggle(`MODAL_FORM_${conversion.strSnake(tableKey).toUpperCase()}`, false)}
        title="Tambah Data"
        className="bg-white"
      >
        <div className="p-4">
          <FormSupervisionComponent
            submitControl={fetchControl.path 
              ? { path: `${fetchControl.path}/${(selected as { id: number })?.id || "" }`} 
              : { url: `${fetchControl.url}/${(selected as { id: number })?.id || ""}`}
            }
            forms={forms as FormType[]}
            defaultValue={formControl?.defaultValue ? formControl?.defaultValue(selected || null) : selected}
            payload={formControl?.payload}
            onSuccess={() => {
              reset();
              setToggle("MODAL_FORM", false);
            }}
          />
        </div>
      </FloatingPageComponent>


      <ModalConfirmComponent
        show={!!toggle[`MODAL_DELETE_${conversion.strSnake(tableKey).toUpperCase()}`]}
        onClose={() => setToggle(`MODAL_DELETE_${conversion.strSnake(tableKey).toUpperCase()}`, false)}
        icon={faQuestionCircle}
        title={`Menghapus Data?`}
        submitControl={{
          onSubmit: {
            ...(fetchControl.path 
              ? {path: `${fetchControl.path}/${(selected as { id: number })?.id || ""}`} 
              : {url: `${fetchControl.url}/${(selected as { id: number })?.id || ""}`}
            ),
            method: "DELETE",
          },
          onSuccess: () => {
            reset();
            setToggle(`MODAL_DELETE_${conversion.strSnake(tableKey).toUpperCase()}`, false);
          },
        }}
      >
        <p className="px-2 pb-2 text-sm text-center">Yakin yang dihapus sudah benar?</p>
      </ModalConfirmComponent>
    </>
  );
}
