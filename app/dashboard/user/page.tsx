import { TableSupervisionComponent} from "@components";
import { Suspense } from "react";

export default function Table() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TableSupervisionComponent
        title="User"
        fetchControl={{
          path: "users",
        }}
        columnControl={[
          {
            selector: "name",
            label: "Nama",
            sortable: true,
            filterable: true,
            width: "350px",
          },
          {
            selector: "email",
            label: "Email",
            sortable: true,
            width: "250px",
          },
        ]}
        detailControl={[
          {
            label: "Nama",
            item: "name",
          },
          {
            label: "Email",
            item: "email",
          }
        ]}
        formControl={{
          fields: [
            {
              construction: {
                name: "email",
                label: "E-mail",
                placeholder: "Ex: example@mail.com",
                validations: ["required"],
              },
            },
            {
              construction: {
                name: "name",
                label: "Name",
                placeholder: "Ex: Joko Gunawan",
              },
            },
            {
              construction: {
                name: "password",
                label: "Password",
                placeholder: "Ex: secret123",
              }
            },
            {
              construction: {
                type: "file",
                name: "image",
                label: "Picture",
              }
            },
          ],
        }}
        controlBar={["CREATE", "FILTER", "SEARCH", "SORT", "SELECTABLE", "IMPORT", "EXPORT", "PRINT", "REFRESH"]}
        responsiveControl={{
          mobile: true,
        }}
      />
    </Suspense>
  );
}