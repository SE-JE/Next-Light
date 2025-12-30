"use client";

import { useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { TableComponent, ButtonComponent, SelectComponent, ModalComponent, IconButtonComponent } from "@components";
import { useToggleContext } from "@contexts";



export type ImportExcelColumnControlType = {
  label: string;
  selector: string;
};

type ImportColumn = {
  selector  :  string;
  label     :  string;
  source    :  string | null;
};

type ImportExcelProps = {
  columnControl   :  ImportExcelColumnControlType[];
  onSubmit       ?:  (rows: any[]) => void;
};



function numberToExcelColumn(index: number): string {
  let column = "";
  let n = index;

  while (n >= 0) {
    column = String.fromCharCode((n % 26) + 65) + column;
    n = Math.floor(n / 26) - 1;
  }

  return column;
}



export function ImportExcel({ columnControl, onSubmit }: ImportExcelProps) {
  const { toggle, setToggle }  =  useToggleContext()

  const [columns, setColumns]  =  useState<ImportColumn[]>([]);
  const [rows, setRows]        =  useState<Record<string, any>[]>([]);
  const [loaded, setLoaded]    =  useState(false);


  const handleImportFile = async (file: File) => {
    const workbook  =  new ExcelJS.Workbook();
    const buffer    =  await file.arrayBuffer();

    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];

    const excelColumns: ImportColumn[] = [];
    sheet.getRow(1).eachCell((_, colIndex) => {
      const label = numberToExcelColumn(colIndex - 1);

      excelColumns.push({
        selector  :  label,
        label     :  label,
        source    :  null,
      });
    });

    const excelRows: Record<string, any>[] = [];
    sheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return;

      const item: Record<string, any> = {};
      excelColumns.forEach((col, i) => {
        item[col.selector] = row.getCell(i + 1).value;
      });

      excelRows.push(item);
    });

    setColumns(excelColumns);
    setRows(excelRows);
    setLoaded(true);
  };

  const getColumnLabel = (source: string | null) => {
    if (!source) return "";

    const found = columnControl?.find(c => c.selector === source);

    return found?.label ?? source;
  };


  const tableColumns = useMemo(() => {
    return columns?.map((c => ({
      ...c,
      label: <div className="w-full text-center">{c.label}</div>
    })));
  }, [columns]);


  const tableData = useMemo(() => {
    if (!loaded) return [];

    const mappingRow: Record<string, any> = {};

    columns.forEach(col => {
      mappingRow[col.selector] = (
        <>
          <div className="flex justify-between">
            <p>{getColumnLabel(col.source) || <p className="text-light-foreground">-- PILIH KOLOM --</p>}</p>

            <IconButtonComponent
              icon={faEdit}
              size="xs"
              paint="warning"
              variant="outline"
              disabled={columns.length <= 1}
              onClick={() => setToggle("MODAL_FIELD_IMPORT", {selector: col.selector, value: col.source})}
            />
          </div>
        </>
      );
    });

    return [mappingRow, ...rows];
  }, [columns, rows, loaded, columnControl]);


  const generatePayload = () => {
    return rows.map(row => {
      const payload: Record<string, any> = {};

      columns.forEach(col => {
        if (col.source) {
          payload[col.source] = row[col.selector];
        }
      });

      return payload;
    });
  };

  const handleSubmit = () => {
    const payload = generatePayload();
    onSubmit?.(payload);
  };

  return (
    <>
      
        {!loaded && (
          <div className="p-4 relative">
            <input
              type="file"
              accept=".xlsx"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleImportFile(file);
              }}
              className="text-transparent bg-background w-full aspect-video border border-dashed relative file:hidden placeholder:hidden rounded-md cursor-pointer"
            />

            <div className="absolute top-1/2 left-1/2 -translate-1/2 text-light-foreground">
              Pilih atau tarik file excel di sini
            </div>
          </div>
        )}

        {loaded && (
          <TableComponent
            controlBar={false}
            columns={tableColumns}
            data={tableData}
            pagination={false}
            noIndex
            className="p-4 bg-background row::bg-white row::border-0 row::gap-0 row::!hover:bg-white column::p-2 column::border head-column::p-2 head-column::border"
          />
        )}

        {loaded && (
          <div className="px-4 mt-8">
            <ButtonComponent
              label="Import Data"
              block
              onClick={handleSubmit}
            />
          </div>
        )}
      

      <ModalComponent
        show={!!toggle["MODAL_FIELD_IMPORT"]}
        onClose={() => setToggle("MODAL_FIELD_IMPORT", false)}
        title="Pilih Kolom"
        footer={
          <div className="flex justify-end">
            <ButtonComponent 
              label="Terapkan"
              onClick={() => {
                if(!!(toggle["MODAL_FIELD_IMPORT"] as { value: string })?.value) {
                  setColumns(prev =>
                    prev.map(c => c.selector === (toggle["MODAL_FIELD_IMPORT"] as { selector: string })?.selector
                        ? { ...c, source: String((toggle["MODAL_FIELD_IMPORT"] as { value: string })?.value) }
                        : c
                    )
                  )
                }
                setToggle("MODAL_FIELD_IMPORT", false)
              }}
            />
          </div>
        }
      >
        <div className="p-4">
          <SelectComponent
            name={`column_${(toggle["MODAL_FIELD_IMPORT"] as { selector: string })?.selector}`}
            placeholder="Pilih kolom data..."
            value={(toggle["MODAL_FIELD_IMPORT"] as { value: string })?.value ?? ""}
            onChange={e => setToggle("MODAL_FIELD_IMPORT", {...(toggle["MODAL_FIELD_IMPORT"] as object), value: e})}
            options={columnControl.map(c => ({
              label: c.label,
              value: c.selector,
            }))}
          />
        </div>
      </ModalComponent>
    </>
  );
}
