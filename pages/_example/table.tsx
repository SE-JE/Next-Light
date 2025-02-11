import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { TableComponent } from "@/components/base.components/table/Table.component";
import { ButtonComponent } from "@/components/base.components";

export default function Table() {
  return (
    <>
      <div>
        <TableComponent
          controlBar
          columns={[
            {
              label: "Column 1",
              selector: "col1",
            },
            {
              label: "Column 2",
              selector: "col2",
            },
            {
              label: "Column 3",
              selector: "col3",
            },
            {
              label: "Column 4",
              selector: "col4",
            },
            {
              label: "Column 5",
              selector: "col5",
            },
            {
              label: "Column 6",
              selector: "col6",
            },
          ]}
          data={[
            {
              col1: "data column 1",
              col2: "data column 2",
              col3: "data column 3",
              action: (
                <>
                  <ButtonComponent label="test" size="sm" />
                </>
              ),
            },
            {
              col1: "data column 1",
              col2: "data column 2",
              col3: "data column 3",
            },
            {
              col1: "data column 1",
              col2: "data column 2",
              col3: "data column 3",
            },
            {
              col1: "data column 1",
              col2: "data column 2",
              col3: "data column 3",
            },
            {
              col1: "data column 1",
              col2: "data column 2",
              col3: "data column 3",
              action: (
                <>
                  <ButtonComponent label="test" size="sm" />
                </>
              ),
            },
          ]}
          onRowClick={() => {}}
          pagination={{
            page: 1,
            paginate: 10,
            totalRow: 100,
          }}
        />
      </div>
    </>
  );
}

Table.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
