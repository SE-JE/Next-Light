import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { TableComponent } from "@/components/base.components/table/Table.component";

export default function Table() {
  return (
    <>
      <div>
        <TableComponent
          columns={[
            {
              label: "Column 1",
              selector: "col1",
            },
            {
              label: "Column 2",
              selector: "col3",
            },
            {
              label: "Column 2",
              selector: "col3",
            },
          ]}
          data={[
            {
              col1: "data column 1",
              col2: "data column 2",
              col3: "data column 3",
            },
          ]}
        />
      </div>
    </>
  );
}

Table.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
