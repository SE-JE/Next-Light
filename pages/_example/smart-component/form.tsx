import { ReactNode } from "react";
import ExampleLayout from "../_layout";
import FormSupervisionComponent from "@/archive/FormSupervision.component";
import { CardComponent } from "@/components/base.components";

export default function Form() {
  return (
    <>
      <CardComponent>
        <FormSupervisionComponent
          title="Generated Form Supervision"
          forms={[
            {
              col: "9",
              construction: {
                label: "Your Name",
                placeholder: "Input your name...",
                name: "name",
              },
            },
          ]}
          submitControl={{
            path: "/",
          }}
          confirmation
        />
      </CardComponent>
    </>
  );
}

Form.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
