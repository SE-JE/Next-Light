import React, { ReactNode, useEffect, useMemo } from "react";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ApiType, cn, conversion, FetchControlType, useResponsive, useTable } from "@utils";
import { useToggleContext } from "@contexts";
import { FloatingPageComponent, FloatingPageProps, ButtonComponent, IconButtonComponent, TableColumnType, TableComponent, FormSupervisionComponent, FormType, ModalConfirmComponent, TypographyColumnComponent, ButtonProps, ModalConfirmProps, TableProps, ControlBarOptionType, BottomSheetComponent, SwipeActionType } from "@components";



export interface TableSupervisionColumnProps {
  selector     :  string;
  label       ?:  string;
  width       ?:  string;
  sortable    ?:  boolean;
  searchable  ?:  boolean;
  filterable  ?:  boolean | {
    type       :  "text" | "number" | "currency" | "date";
  } | {
    type       :  "select";
    options    :   { label: string; value: any }[];
  };
  accessCode  ?:  string;
  item        ?:  (data: any) => string | ReactNode;
  tip         ?:  string | ((data: any) => string);
};

export interface TableSupervisionFormProps {
  forms                :  string[] | (FormType & { visibility?: "*" | "create" | "update" })[];
  defaultValue        ?:  (item: Record<string, any> | null) => Record<string, any>;
  payload             ?:  (values: any) => object;
  modalControl        ?:  FloatingPageProps;
  contentType         ?:  "application/json" | "multipart/form-data";
};


export type TableSupervisionProps = {
  fetchControl     :  FetchControlType;
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
    | 'edit' | 'delete' | {
      label           :  string,
      modal          ?:  ModalConfirmProps,
      button         ?:  ButtonProps,
    } | ((
      row              :  object,
      setModal         :  (type: "EDIT" | "DELETE") => void,
      setDataSelected ?:  () => void
    ) => ReactNode[])
  )[];
  block                ?:  boolean,
  actionBulkingControl ?:  TableProps["actionBulking"],
  controlBar           ?:  ControlBarOptionType[];
  responsiveControl    ?:  {
    mobile                 ?:  boolean | {
      item                 ?:  (item: Record<string, any>, key: number) => ReactNode,
      leftActionControl    ?:  Omit<SwipeActionType, "onAction"> & { onAction?: (item: Record<string, any>, key?: number) => void },
      rightActionControl   ?:  Omit<SwipeActionType, "onAction"> & { onAction?: (item: Record<string, any>, key?: number) => void },
    }
  }
};



export function TableSupervisionComponent({
  title,
  id,
  fetchControl,
  columnControl,
  formControl,
  onRowClick,
  detailControl,
  actionControl,
  actionBulkingControl,
  block,
  controlBar,
  responsiveControl,
  encodeParams,
}: TableSupervisionProps) {
  const { tableKey, tableControl, data, selected, setSelected, checks, setChecks, reset }  =  useTable(fetchControl, id, title, encodeParams)
  const { setToggle, toggle }                                                              =  useToggleContext()
  const { isSm }                                                                           =  useResponsive();


  const toggleKey = useMemo(() => conversion.strSnake(tableKey).toUpperCase(), [tableKey])


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



  const renderTableAction = (
    actions             :  TableSupervisionProps["actionControl"],
    item               ?:  Record<string,                          any>,
    options            ?:  {size?: ButtonProps['size'], className?: string}
  ) => {
    return (
      <>
        <div className={cn("flex items-center gap-2", options?.className)}>
          {(Array.isArray(actions) ? actions : (actions || actions == undefined) ? ['edit', "delete"] : [])?.map((action, key) => {
            if(action == "edit") {
              return (
                <ButtonComponent
                  key={key}
                  icon={faEdit}
                  label={"Ubah"}
                  variant="outline"
                  paint="warning"
                  size={options?.size || "xs"}
                  rounded
                  onClick={() => {
                    setToggle(`MODAL_FORM_${toggleKey}`);
                    item && setSelected?.(item);
                  }}
                />
              )
            }

            if(action == "delete") {
              return (
                <ButtonComponent
                  key={key}
                  icon={faTrash}
                  label={"Hapus"}
                  variant="outline"
                  paint="danger"
                  size={options?.size || "xs"}
                  rounded
                  onClick={() => {
                    setToggle(`MODAL_DELETE_${toggleKey}`);
                    item && setSelected?.(item);
                  }}
                />
              )
            }

            if(typeof action == "object") {
              <ButtonComponent
                key={key}
                label={action?.button?.label || action?.label}
                variant={action?.button?.variant || "outline"}
                paint={action?.button?.paint || "primary"}
                size={action?.button?.size || options?.size || "xs"}
                rounded={action?.button?.rounded || true}
                onClick={() => {
                  if (action?.button?.onClick) {
                    action?.button?.onClick(item)
                  } else {
                    setToggle(`MODAL_${conversion.strSnake(action?.label).toUpperCase()}_${toggleKey}`);
                    item && setSelected?.(item);
                  }
                }}
                {...action.button}
              />
            }

            if(typeof action == "function") {
              action(item || {}, (type: "EDIT" | "DELETE") => {
                if(type == "EDIT") {
                  setToggle(`MODAL_FORM_${toggleKey}`);
                  item && setSelected?.(item);
                } 
                
                if (type == "DELETE") {
                  setToggle(`MODAL_DELETE_${toggleKey}`);
                  item && setSelected?.(item);
                }
              })
            }
            
            return "";
          })}
        </div>
      </>
    )
  }


  // ============================
  // ## Data table preparation
  // ============================
  const dataTables = useMemo(() => {
    return data?.data?.map((row: object) => {
      return {
        ...row,
        action: renderTableAction(actionControl, row),
      };
    });
  }, [actionControl, data]);



  // ============================
  // ## Render detail page 
  // ============================
  const detailPage = useMemo(() => {
    return (
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
    )
  }, [selected, detailControl]);




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



  // ============================
  // ## Render form page 
  // ============================
  const formPage = useMemo(() => {
    return (
      <FormSupervisionComponent
        submitControl={fetchControl.path ? { 
            path: `${fetchControl.path}/${(selected as { id: number })?.id || "" }`,
            method: !(selected as { id: number })?.id ? "POST" : "PUT", 
          } : { 
            url: `${fetchControl.url}/${(selected as { id: number })?.id || ""}`,
            method: !(selected as { id: number })?.id ? "POST" : "PUT", 
          }
        }
        forms={forms as FormType[]}
        defaultValue={formControl?.defaultValue ? formControl?.defaultValue(selected || null) : selected}
        payload={formControl?.payload}
        onSuccess={() => {
          reset();
          setToggle(`MODAL_FORM_${toggleKey}`, false);
        }}
      />
    )
  }, [selected, fetchControl, formControl]);



  useEffect(() => {
    if(toggle[`REFRESH_${toggleKey}`] != undefined) reset();
  }, [toggle[`REFRESH_${toggleKey}`]]);


  return (
    <>
      {title && <h1 className="text-lg lg:text-xl font-bold mb-2 lg:mb-4">{title}</h1>}

      <TableComponent
        id={tableKey}
        controlBar={controlBar || [
          ...(!isSm ? [
            <div className="pl-1.5 pr-3 mr-2 border-r" key="button-add">
              <ButtonComponent
                icon={faPlus}
                label="Tambah Data"
                size="sm"
                onClick={() => {
                  setToggle(`MODAL_FORM_${toggleKey}`)
                  setSelected(null)
                }}
              />
            </div>
          ] : []), 
          "SEARCH", 
          ...(columns?.filter((c) => !!(c as { filterable?: any }).filterable)?.length ? ["FILTER"] : []),
          ...(columns?.filter((c) => !!(c as { sortable?: any }).sortable)?.length ? ["SORT"] : []),
          "SELECTABLE", "REFRESH"
        ]}
        columns={columns as TableColumnType[]}
        data={dataTables}
        onRowClick={onRowClick ? onRowClick : detailControl != false ? (e) => {
          setToggle(`MODAL_SHOW_${toggleKey}`)
          setSelected(e)
        } : undefined}
        actionBulking={actionBulkingControl}
        checks={checks || []}
        onChangeChecks={(e) => setChecks(e)}
        block={block}
        responsiveControl={responsiveControl ? {
          mobile: responsiveControl?.mobile == true ? {
            leftActionControl: (Array.isArray(actionControl) ? actionControl : (actionControl || actionControl == undefined) ? ['edit', "delete"] : []).includes('edit') ? {
              icon: faEdit,
              onAction: (item) => {
                setToggle(`MODAL_FORM_${toggleKey}`);
                item && setSelected?.(item);
              }
            } : undefined,
            rightActionControl: (Array.isArray(actionControl) ? actionControl : (actionControl || actionControl == undefined) ? ['edit', "delete"] : []).includes('delete') ? {
              icon: faTrash,
              onAction: (item) => {
                setToggle(`MODAL_DELETE_${toggleKey}`);
                item && setSelected?.(item);
              }
            } : undefined
          } : responsiveControl?.mobile || undefined,
        } : undefined}
        {...tableControl}
      />

      <IconButtonComponent
        icon={faPlus}
        className="fixed bottom-2 left-2 w-12 h-12 md:hidden"
        size="lg"
        rounded
        onClick={() => {
          setToggle(`MODAL_FORM_${toggleKey}`)
          setSelected(null)
        }}
      />


      {isSm ? (
        <BottomSheetComponent
          show={!!toggle[`MODAL_SHOW_${toggleKey}`]}
          onClose={() => setToggle(`MODAL_SHOW_${toggleKey}`, false)}
          className="bg-white"
          footer={renderTableAction(actionControl, undefined, {className: isSm ? "justify-end p-2 bg-background" : "justify-end", size: isSm ? "sm" : "md"})}
          size="98vh"
        >
          {detailPage}
        </BottomSheetComponent>
      ) : (
        <FloatingPageComponent
          show={!!toggle[`MODAL_SHOW_${toggleKey}`]}
          onClose={() => setToggle(`MODAL_SHOW_${toggleKey}`, false)}
          title="Detail"
          className="bg-white"
          footer={renderTableAction(actionControl, undefined, {className: isSm ? "justify-end p-2 bg-background" : "justify-end", size: isSm ? "sm" : "md"})}
        >
          {detailPage}
        </FloatingPageComponent>
      )}


      {isSm ? (
        <BottomSheetComponent
          show={!!toggle[`MODAL_FORM_${toggleKey}`]}
          onClose={() => setToggle(`MODAL_FORM_${toggleKey}`, false)}
          className="bg-white"
          size="98vh"
        >
          <div className="p-4 h-[110vh]">
            {formPage}
          </div>
        </BottomSheetComponent>
      ) : (
        <FloatingPageComponent
          show={!!toggle[`MODAL_FORM_${toggleKey}`]}
          onClose={() => setToggle(`MODAL_FORM_${toggleKey}`, false)}
          title={!!selected ? "Ubah Data" : "Tambah Data"}
          className="bg-white"
        >
          <div className="p-4">
            {formPage}
          </div>
        </FloatingPageComponent>
      )}


      <ModalConfirmComponent
        show={!!toggle[`MODAL_DELETE_${toggleKey}`]}
        onClose={() => setToggle(`MODAL_DELETE_${toggleKey}`, false)}
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
            setToggle(`MODAL_DELETE_${toggleKey}`, false);
          },
        }}
      >
        <p className="px-2 pb-2 text-sm text-center">Yakin yang dihapus sudah benar?</p>
      </ModalConfirmComponent>

      {actionControl && Array.isArray(actionControl) && actionControl.filter((ac) => typeof ac == "object")?.map((ac, acKey) => {
        const submitControl = ac.modal?.submitControl?.onSubmit as ApiType;
        return (
          <ModalConfirmComponent
            key={acKey}
            show={!!toggle[`MODAL_${conversion.strSnake(ac.label).toUpperCase()}_${toggleKey}`]}
            onClose={() => setToggle(`MODAL_${conversion.strSnake(ac.label).toUpperCase()}_${toggleKey}`, false)}
            icon={ac?.modal?.icon || faQuestionCircle}
            title={ac?.modal?.title || ac.label}
            submitControl={{
              onSubmit: {
                ...(submitControl?.path 
                  ? {path: `${submitControl?.path}/${(selected as { id: number })?.id || ""}`} 
                  : {url: `${submitControl?.url}/${(selected as { id: number })?.id || ""}`}
                ),
                method: submitControl?.method || "POST",
              },
              onSuccess: () => {
                reset();
                setToggle(`MODAL_${conversion.strSnake(ac.label).toUpperCase()}_${conversion.strSnake(tableKey).toUpperCase()}`, false);
                setSelected(null)
                ac.modal?.submitControl?.onSuccess?.()
              },
            }}
          >{ac.modal?.children}</ModalConfirmComponent>
        )
      })}
    </>
  );
}
