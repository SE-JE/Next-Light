"use client";

import { useState } from "react";
import ExcelJS from "exceljs";

type FieldOption = {
  key: string;
  label: string;
};

const FIELD_OPTIONS: FieldOption[] = [
  { key: "name", label: "Nama" },
  { key: "email", label: "Email" },
  { key: "phone", label: "No HP" },
];

export default function ExcelImportMapper() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const handleFile = async (file: File) => {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(await file.arrayBuffer());

    const sheet = wb.worksheets[0];

    const headerRow = sheet.getRow(1).values as string[];
    const cleanHeaders = headerRow.slice(1); // skip index 0

    const dataRows: any[] = [];
    sheet.eachRow((row, idx) => {
      if (idx === 1) return;
      const obj: any = {};
      cleanHeaders.forEach((h, i) => {
        obj[h] = row.getCell(i + 1).value;
      });
      dataRows.push(obj);
    });

    setHeaders(cleanHeaders);
    setRows(dataRows);
  };

  const buildPayload = () => {
    return rows.map((row) => {
      const obj: any = {};
      Object.entries(mapping).forEach(([excelCol, field]) => {
        if (field) obj[field] = row[excelCol];
      });
      return obj;
    });
  };

  const handleSubmit = async () => {
    const payload = buildPayload();

    await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="p-4">
      <h2 className="font-bold mb-3">Import Excel</h2>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />

      {headers.length > 0 && (
        <>
          <h3 className="mt-4 font-semibold">Mapping Kolom</h3>

          {headers.map((h) => (
            <div key={h} className="flex gap-2 items-center mb-2">
              <span className="w-48">{h}</span>
              <select
                className="border p-1"
                onChange={(e) =>
                  setMapping((m) => ({ ...m, [h]: e.target.value }))
                }
              >
                <option value="">-- Abaikan --</option>
                {FIELD_OPTIONS.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <h3 className="mt-4 font-semibold">Preview</h3>
          <pre className="bg-gray-100 p-2 text-xs max-h-40 overflow-auto">
            {JSON.stringify(buildPayload().slice(0, 3), null, 2)}
          </pre>

          <button
            className="mt-4 bg-blue-500 text-white px-3 py-1 rounded"
            onClick={handleSubmit}
          >
            Kirim ke Backend
          </button>
        </>
      )}
    </div>
  );
}
