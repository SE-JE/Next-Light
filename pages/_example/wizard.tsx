import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { WizardComponent } from "@/components/base.components/wizard";

export default function Table() {
  return (
    <>
      <WizardComponent
        items={[
          {
            label: "Item 1",
            circle_content: "1",
          },
          {
            label: "Item 2",
            circle_content: "2",
          },
          {
            label: "Item 3",
            circle_content: "3",
          },
        ]}
        active={0}
      />
    </>
  );
}

Table.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
