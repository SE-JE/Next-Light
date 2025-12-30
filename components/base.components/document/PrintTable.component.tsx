"use client";

import { useEffect, useMemo, useState } from "react";
import { FetchControlType, useTable } from "@utils";
import { TableComponent, IconButtonComponent, FilterComponent, NodeSchema, PageSchema, RenderPDFPreview, ButtonComponent, RenderPDF } from "@components";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";


export type PrintColumn = {
  selector  :  string;
  source    :  string | null;
  width     :  number;
};

export type ColumnControl = {
  selector  :  string;
  label     :  string;
};



function usePrintColumns(data: any[], columnControl?: ColumnControl[]) {
  const fields = useMemo(() => {
    if (!data?.[0]) return [];
    return Object.keys(data[0]);
  }, [data]);

  const [columns, setColumns] = useState<PrintColumn[]>([]);

  useEffect(() => {
    if (!data?.[0] || columns.length) return;

    if (columnControl?.length) {
      setColumns(
        columnControl.map((c) => ({
          selector: c.label,
          source: c.selector,
          width: 120,
        }))
      );
      return;
    }

    setColumns(
      fields.map((f) => ({
        selector: f,
        source: f,
        width: 120,
      }))
    );
  }, [data, fields, columnControl]);

  const move = (selector: string, dir: "left" | "right") => {
    setColumns(prev => {
      const idx = prev.findIndex(c => c.selector === selector);
      const target = dir === "left" ? idx - 1 : idx + 1;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next.map((c) => ({ ...c, selector: c.selector }));
    });
  };

  return { columns, move };
}


function buildPrintSchema({ title, columns, data, columnControl }: {
  title          ?:  string;
  columns         :  PrintColumn[];
  data            :  any[];
  columnControl  ?:  ColumnControl[];
}) : PageSchema[] {
  const active = columns.filter(c => c.source);

  const getHeaderLabel = (source: string | null) => {
    if (!source) return "";

    const found = columnControl?.find(c => c.selector === source);

    return found?.label ?? source;
  };

  const content: NodeSchema[] = [];

  if (title) {
    content.push({
      type     :  "text",
      content  :  title,
      style    :  { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
    });
  }

  content.push({
    type     :  "table",
    content  :  [
      {
        type     :  "tr" as const,
        content  :  active.map<NodeSchema>(c => ({
          type     :  "th" as const,
          content  :  getHeaderLabel(c.source),
          style    :  { width: c.width },
        })),
      },
      ...data.map<NodeSchema>(row => ({
        type     :  "tr" as const,
        content  :  active.map<NodeSchema>(c => ({
          type     :  "td" as const,
          content  :  String(row[c.source!] ?? ""),
          style    :  { width: c.width },
        })),
      })),
    ],
  });

  return [{ page: { size: "A4", margin: 40, content } }];
}



export function PrintTable({ fetchControl, columnControl, title }: { fetchControl: FetchControlType; columnControl?: ColumnControl[]; title?: string; }) {
  const { data }  =  useTable(fetchControl, undefined, undefined, false);
  const rows      =  data?.data ?? [];

  const { columns, move } = usePrintColumns(rows, columnControl);

  const schema = useMemo(() => buildPrintSchema({
    title: title,
    columns,
    data: rows,
    columnControl,
  }), [columns, rows, columnControl]);

  return (
    <>
      <div className="p-4">
        <FilterComponent
          columns={data?.data[0] && Object.keys(data?.data[0])?.map((c) => ({ label: c, selector: c }))}
          onChange={() => {}}
          value={[]}
        />
      </div>

      <div className="p-4">
        <TableComponent
          controlBar={false}
          pagination={false}
          noIndex
          columns={columns.map(c => ({ selector: c.selector, label: c.selector }))}
          data={[
            Object.fromEntries(
              columns.map((c, key) => [
                c.selector,
                <div className="flex gap-1" key={key}>
                  {key > 0 && (
                    <IconButtonComponent
                      icon={faArrowLeft}
                      size="xs"
                      variant="outline"
                      className="!text-foreground"
                      onClick={() => move(c.selector, "left")}
                    />
                  )} 

                  {key < (columns.length - 1) && (
                    <IconButtonComponent
                      icon={faArrowRight}
                      size="xs"
                      variant="outline"
                      className="!text-foreground"
                      onClick={() => move(c.selector, "right")}
                    />
                  )}
                </div>,
              ])
            ),
          ]}
          className="row::bg-transparent row::border-0 row::gap-0 row::!hover:bg-white column::p-2 column::border-l head-column::p-2 head-column::border-l"
        />
      </div>

      <RenderPDFPreview schema={schema} className="w-full max-h-[400px] overflow-y-auto flex justify-center bg-background mt-4" />


      <div className="px-4 mt-8">
        <ButtonComponent label=" Download PDF" block onClick={async () => {
          const bytes = await RenderPDF({ content: schema });

          const arrayBuffer = bytes.buffer instanceof ArrayBuffer ? bytes.buffer : bytes.slice().buffer;

          const blob = new Blob([arrayBuffer], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = title ? `${title}.pdf` : "print.pdf";
          a.click();

          URL.revokeObjectURL(url);
        }} />
      </div>
    </>
  );
}
