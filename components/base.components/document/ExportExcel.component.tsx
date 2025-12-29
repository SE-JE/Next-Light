import { useMemo } from "react";
// import ExcelJS from "exceljs";
import { FetchControlType, useTable } from "@utils";
import { TableComponent } from "../table/Table.component";
import { ButtonComponent } from "../button/Button.component";
import { FilterColumnOption, FilterComponent } from "../table/FilterComponent";
import { InputCheckboxComponent } from "../input/InputCheckbox.component";

type Props = {
  fetchControl: FetchControlType
};


export function ExportExcel({ fetchControl }: Props) {
  // const [data, setData] = useState<any[]>([]);
  // const [columns, setColumns] = useState<string[]>([]);
  // const [selectedCols, setSelectedCols] = useState<string[]>([]);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const { data, tableControl } = useTable(fetchControl, undefined, undefined, false);

  // const fetchData = async () => {
  //   setLoading(true);
  //   const res = await fetch("/api/sample-data");
  //   const json = await res.json();
  //   setData(json);
  //   if (json.length > 0) {
  //     const cols = Object.keys(json[0]);
  //     setColumns(cols);
  //     setSelectedCols(cols);
  //   }
  //   setLoading(false);
  // };

  // const handleToggleCol = (col: string) => {
  //   setSelectedCols((prev) =>
  //     prev.includes(col)
  //       ? prev.filter((c) => c !== col)
  //       : [...prev, col]
  //   );
  // };

  // const moveColumn = (col: string, direction: "up" | "down") => {
  //   setColumns((prev) => {
  //     const index = prev.indexOf(col);
  //     const newCols = [...prev];

  //     if (direction === "up" && index > 0) {
  //       [newCols[index - 1], newCols[index]] = [newCols[index], newCols[index - 1]];
  //     } else if (direction === "down" && index < newCols.length - 1) {
  //       [newCols[index + 1], newCols[index]] = [newCols[index], newCols[index + 1]];
  //     }

  //     return newCols;
  //   });
  // };

  const columns = useMemo(() => {
    return data?.data?.at(0) ? Object.keys(data.data[0]).map((col) => {
      return {
        selector  :  col,
        label     :  col,
      };
    })
  : [];
  }, [data]);

  const handleDownload = async () => {
    // if (!data.length) return;

    // const workbook = new ExcelJS.Workbook();
    // const sheet = workbook.addWorksheet("Data Export");

    // const activeCols = columns.filter((c) => selectedCols.includes(c));

    // sheet.columns = activeCols.map((key) => ({
    //   header: key.toUpperCase(),
    //   key,
    //   width: 20,
    //   style: {
    //     font: { bold: true },
    //     alignment: { horizontal: "center" },
    //   },
    // }));

    // data?.data?.forEach((item: Record<string, any>) => {
    //   const row: Record<string, any> = {};
    //   activeCols.forEach((col) => (row[col] = item[col]));
    //   sheet.addRow(row);
    // });

    // sheet.getRow(1).eachCell((cell: Record<string, any>) => {
    //   cell.fill = {
    //     type: "pattern",
    //     pattern: "solid",
    //     fgColor: { argb: "FFDCE6F1" },
    //   };
    //   cell.border = {
    //     top: { style: "thin" },
    //     left: { style: "thin" },
    //     bottom: { style: "thin" },
    //     right: { style: "thin" },
    //   };
    // });

    // const buffer = await workbook.xlsx.writeBuffer();
    // const blob = new Blob([buffer], {
    //   type:
    //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // });

    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(blob);
    // link.download = "data-export.xlsx";
    // link.click();
  };

  // const activeCols = columns.filter((c) => selectedCols.includes(c));

  return (
    <div className="p-4">
      {/* {loading && <p>Loading data...</p>} */}

      {/* {!loading && data.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Pilih & Urutkan Kolom</h3>
            {columns.map((col) => (
              <div
                key={col}
                className="flex items-center justify-between border rounded p-2 mb-1 bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCols.includes(col)}
                    onChange={() => handleToggleCol(col)}
                  />
                  <span>{col}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    className="bg-gray-200 px-2 rounded text-xs"
                    onClick={() => moveColumn(col, "up")}
                  >
                    ↑
                  </button>
                  <button
                    className="bg-gray-200 px-2 rounded text-xs"
                    onClick={() => moveColumn(col, "down")}
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div> */}

          <div>
            <div className="w-full rounded-sm border mb-4 p-4">
              <p>Kolom Dipilih</p>
              <InputCheckboxComponent
                name="show_column"
                options={columns?.map((option) => {
                  return {
                    label: option.label,
                    value: option.selector,
                  };
                })}
                onChange={() => []}
                value={[]}
                className='px-4 border-0 gap-4 p-0 pt-2'
              />
            </div>

            <div className="mb-4">
              <FilterComponent 
                columns={columns?.map((c) => ({
                  label: c.label, 
                  selector: c.selector, 
                })) as FilterColumnOption[]}
                onChange={(e) => tableControl.onChangeFilter(e)}
                value={tableControl.filter}
              />
            </div>

            {/* <div className="bg-slate-100 p-4"> */}
              <TableComponent 
                controlBar={false}
                columns={columns}
                data={data?.data}
                {...tableControl}
                className="row::bg-white row::border-0 row::gap-0 column::py-2 column::border head-column::bg-slate-100 head-column::border"
              />
            {/* </div> */}
            {/* <div className="overflow-auto max-h-[300px] border rounded">
              <table className="border-collapse border border-gray-400 text-sm w-full">
                <thead>
                  <tr className="bg-gray-100">
                    {activeCols.map((key) => (
                      <th
                        key={key}
                        className="border border-gray-300 px-2 py-1"
                      >
                        {key.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.data.slice(0, 10).map((row, idx) => (
                    <tr key={idx}>
                      {activeCols.map((col) => (
                        <td
                          key={col}
                          className="border border-gray-300 px-2 py-1"
                        >
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Menampilkan 10 data pertama
            </p> */}

            <div className="mt-10">
              <ButtonComponent 
                label="Download Excel"
                block
                onClick={handleDownload}
              />
            </div>
          </div>
        {/* </div>
      )} */}
    </div>
  );
}
