import { ReactNode } from "react";
import ExampleLayout from "../_layout";
import FormSupervisionComponent from "@/components/base.components/supervision/FormSupervision.component";
import { CardComponent } from "@/components/base.components";

export default function Form() {
  return (
    <>
      <CardComponent>
        <FormSupervisionComponent
          title="Generated Form Supervision"
          forms={[
            {
              col: "3",
              construction: {
                label: "Your Name",
                placeholder: "Input your name...",
              },
            },
          ]}
          submitControl={{
            path: "/",
          }}
        />
      </CardComponent>
    </>
  );
}

Form.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
