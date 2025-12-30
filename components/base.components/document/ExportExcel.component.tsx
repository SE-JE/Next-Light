"use client";

import { useEffect, useMemo, useState } from "react";
import { faArrowLeft, faArrowRight, faEdit, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import ExcelJS from "exceljs";
import { api, FetchControlType, useTable } from "@utils";
import { TableComponent, ButtonComponent, IconButtonComponent, SelectComponent, ModalComponent, FilterComponent } from "@components";
import { useToggleContext } from "@contexts";



type ExportColumn = {
  selector  :  string;
  label     :  string;
  source    :  string | null;
};

export type ExportExcelColumnControlType = {
  label     :  string;
  selector  :  string;
};

type ExportExcelProps = {
  fetchControl    :  FetchControlType;
  columnControl  ?:  ExportExcelColumnControlType[];
  filename       ?:  string;
};



const ADD_COLUMN_KEY = "__add_column__";

function numberToExcelColumn(index: number): string {
  let column  =  "";
  let n       =  index;

  while (n >= 0) {
    column = String.fromCharCode((n % 26) + 65) + column;
    n = Math.floor(n / 26) - 1;
  }

  return column;
}



export function ExportExcel({ fetchControl, columnControl, filename }: ExportExcelProps) {
  const { toggle, setToggle } = useToggleContext()

  const { data, tableControl } = useTable(fetchControl, undefined, undefined, false);

  const fields = useMemo(() => {
    if (columnControl?.length) {
      return columnControl.map(c => c.selector);
    }

    if (!data?.data?.[0]) return [];
    return Object.keys(data.data[0]);
  }, [data, columnControl]);

  const [columns, setColumns] = useState<ExportColumn[]>([]);


  useEffect(() => {
    if (!data?.data?.[0]) return;

    setColumns(prev => {
      if (prev.length) return prev;

      const baseFields = columnControl?.length ? columnControl.map(c => c.selector) : Object.keys(data.data[0]);

      return baseFields.map((field, i) => {
        const label = numberToExcelColumn(i);

        return {
          selector  :  label,
          label     :  label,
          source    :  field,
        };
      });
    });
  }, [data, columnControl]);


  const addColumn = (selector: string, source: string) => {
    setColumns(prev => [...prev, { selector, label: selector, source }]);
  };

  const removeColumn = (selector: string) => {
    setColumns(prev => prev.filter(c => c.selector !== selector).map((c, i) => {
      const label = numberToExcelColumn(i);
      return { ...c, selector: label, label };
    }));
  };

  const moveColumn = (selector: string, dir: "left" | "right") => {
    setColumns(prev => {
      const idx = prev.findIndex(c => c.selector === selector);
      if (idx === -1) return prev;

      const target = dir === "left" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;

      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];

      return next.map((c, i) => {
        const label = numberToExcelColumn(i);
        return { ...c, selector: label, label };
      });
    });
  };

  const setSource = (selector: string, source: string | null) => setColumns(prev => prev.map(c => (c.selector === selector ? { ...c, source } : c)));

  const getColumnLabel = (source: string | null) => {
    if (!source) return "";

    const found = columnControl?.find(c => c.selector === source);

    return found?.label ?? source;
  };


  const tableColumns = useMemo(() => {
    return [
      ...columns?.map((c => ({
        ...c,
        label: <div className="w-full text-center">{c.label}</div>
      }))),
      { selector: ADD_COLUMN_KEY, label: "" } as any,
    ];
  }, [columns]);

  const tableData = useMemo(() => {
    if (!data?.data || !columns.length) return [];

    const controlRow: Record<string, any> = {};

    columns.forEach((col, iCol) => {
      controlRow[col.selector] = (
        <div className="flex justify-between">
          <p>{getColumnLabel(col.source)}</p>

          <div className="flex gap-1">
            {iCol > 0 && (
              <IconButtonComponent
                icon={faArrowLeft}
                size="xs"
                variant="outline"
                className="!text-foreground"
                onClick={() => moveColumn(col.selector, "left")}
              />
            )} 

            {iCol < (columns.length - 1) && (
              <IconButtonComponent
                icon={faArrowRight}
                size="xs"
                variant="outline"
                className="!text-foreground"
                onClick={() => moveColumn(col.selector, "right")}
              />
            )}

            <IconButtonComponent
              icon={faEdit}
              size="xs"
              paint="warning"
              variant="outline"
              disabled={columns.length <= 1}
              onClick={() => setToggle("MODAL_FIELD_EXPORT", {selector: col.selector, value: col.source})}
            />

            <IconButtonComponent
              icon={faTimes}
              size="xs"
              paint="danger"
              variant="outline"
              disabled={columns.length <= 1}
              onClick={() => removeColumn(col.selector)}
            />
          </div>

          
        </div>
      );
    });

    controlRow[ADD_COLUMN_KEY] = (
      <div className="flex justify-center">
        <ButtonComponent
          icon={faPlus}
          label="Tambah Kolom"
          size="xs"
          variant="outline"
          onClick={() => {
            const idx = columns.length;
            const label = numberToExcelColumn(idx);
            setToggle("MODAL_FIELD_EXPORT", { selector: label, value: "", add: true })
          }}
        />
      </div>
    );

    const excelRows = data.data.map((item: Record<string, any>) => {
      const row: Record<string, any> = {};

      row[ADD_COLUMN_KEY] = "-"
      columns.forEach(col => {
        row[col.selector] = col.source ? item[col.source] : "";
      });

      return row;
    });

    return [controlRow, ...excelRows];
  }, [data, columns, fields]);

  
  const handleDownloadExcel = async () => {
    const record  =  await api({...fetchControl, params: {...fetchControl.params, page: 1, paginate: 9999}});
    if (!record?.data?.data?.length || !columns.length) return;

    const workbook     =  new ExcelJS.Workbook();
    const worksheet    =  workbook.addWorksheet("Export");

    worksheet.columns  =  columns.map(col => ({
      header  :  getColumnLabel(col.source),
      key     :  col.selector,
      width   :  20,
    }));

    worksheet.getRow(1).eachCell(cell => {
      cell.font       =  { bold: true };
      cell.alignment  =  { horizontal: "center", vertical: "middle" };
    });

    record.data.data.forEach((item: Record<string, any>) => {
      const row: Record<string, any> = {};

      columns.forEach(col => {
        row[col.selector] = col.source ? item[col.source] : "";
      });

      worksheet.addRow(row);
    });

    const buffer         =  await workbook.xlsx.writeBuffer();
    const blob           =  new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const link           =  document.createElement("a");
    link.href            =  URL.createObjectURL(blob);
    link.download        =  filename ? filename + ".xlsx" : "export.xlsx";
    link.click();

    URL.revokeObjectURL(link.href);
  };

  

  return (
    <>
      <div className="p-4">
        <FilterComponent 
          columns={data?.data[0] && Object.keys(data?.data[0])?.map((c) => ({ label: c, selector: c }))}
          onChange={() => {}}
          value={[]}
        />
      </div>

      <TableComponent
        controlBar={false}
        columns={tableColumns}
        data={tableData}
        {...tableControl}
        pagination={false}
        className="p-4 bg-background row::bg-transparent row::border-0 row::gap-0 row::!hover:bg-white column::p-2 column::border head-column::p-2 head-column::border"
      />

      <div className="px-4 mt-8">
        <ButtonComponent label="Download Excel" block onClick={() => handleDownloadExcel()} />
      </div>

      <ModalComponent 
        show={!!toggle["MODAL_FIELD_EXPORT"]}
        onClose={() => setToggle("MODAL_FIELD_EXPORT", false)}
        title="Pilih Kolom"
        footer={
          <div className="flex justify-end">
            <ButtonComponent 
              label="Terapkan"
              onClick={() => {
                if(!!(toggle["MODAL_FIELD_EXPORT"] as { value: string })?.value) {
                  if((toggle["MODAL_FIELD_EXPORT"] as { add: boolean })?.add) {
                    addColumn((toggle["MODAL_FIELD_EXPORT"] as { selector: string })?.selector, (toggle["MODAL_FIELD_EXPORT"] as { value: string })?.value)
                  } else {
                    setSource((toggle["MODAL_FIELD_EXPORT"] as { selector: string })?.selector, (toggle["MODAL_FIELD_EXPORT"] as { value: string })?.value)
                  }
                }
                setToggle("MODAL_FIELD_EXPORT", false)
              }}
            />
          </div>
        }
      >
        <div className="p-4">
          <SelectComponent
            name={`column_${(toggle["MODAL_FIELD_EXPORT"] as { selector: string })?.selector}`}
            placeholder="Pilih kolom data..."
            value={(toggle["MODAL_FIELD_EXPORT"] as { value: string })?.value ?? ""}
            onChange={e => setToggle("MODAL_FIELD_EXPORT", {...(toggle["MODAL_FIELD_EXPORT"] as object), value: e})}
            options={fields.map((f: string) => ({
              label: f,
              value: f,
            }))}
          />
        </div>
      </ModalComponent>
    </>
  );
}
