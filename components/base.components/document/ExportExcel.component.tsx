import { useMemo } from "react";
import { FetchControlType, useTable } from "@utils";
import { TableComponent, ButtonComponent, FilterColumnOption, FilterComponent, InputCheckboxComponent } from "@components";

type Props = {
  fetchControl: FetchControlType
};


export function ExportExcel({ fetchControl }: Props) {
  const { data, tableControl } = useTable(fetchControl, undefined, undefined, false);

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

  return (
    <div className="p-4">
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

        <TableComponent 
          controlBar={false}
          columns={columns}
          data={data?.data}
          {...tableControl}
          className="row::bg-white row::border-0 row::gap-0 column::py-2 column::border head-column::bg-slate-100 head-column::border"
        />

        <div className="mt-10">
          <ButtonComponent 
            label="Download Excel"
            block
            onClick={handleDownload}
          />
        </div>
      </div>
    </div>
  );
}
