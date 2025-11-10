import { ReactNode } from "react";
import ExampleLayout from "../_layout";
import { TableSupervisionComponent } from "@components";

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
          formControl={{
            forms: [
              {
                col: "12 lg:4",
                construction: {
                  name: "code",
                  label: "Kode",
                  placeholder: "Masukkan kode...",
                },
              },
              {
                col: "12 lg:8",
                construction: {
                  name: "name",
                  label: "Nama",
                  placeholder: "Masukkan nama...",
                },
              },
            ],
          }}
        />
      </div>
    </>
  );
}

Table.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
