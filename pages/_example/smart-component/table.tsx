import { ReactNode } from "react";
import ExampleLayout from "../_layout";
import TableSupervisionComponent from "@/components/base.components/supervision/TableSupervision.component";

export default function Table() {
  return (
    <>
      <div>
        <TableSupervisionComponent
          title="Table Supervision"
          fetchControl={{
            url: "http://localhost:8000/api/features",
          }}
          columnControl={[
            {
              selector: "name",
              label: "Nama",
              sortable: true,
              width: "300px",
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
