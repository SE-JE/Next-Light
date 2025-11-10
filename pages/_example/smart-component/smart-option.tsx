import React, { ReactNode } from "react";
import ExampleLayout from "../_layout";
import { CardComponent, InputCheckboxComponent, InputRadioComponent, SelectComponent } from "@components";

export default function SmartOption() {
  return (
    <>
      <CardComponent>
        <div className="flex flex-col gap-4">
          <div className="w-[400px]">
            <SelectComponent
              name="select"
              label="Pilihan Dari API"
              placeholder="Pilih..."
              serverOptionControl={{
                path: "options",
              }}
            />
          </div>
          <div className="w-[400px]">
            <InputCheckboxComponent
              name="checkbox"
              label="Checkbox Dari API"
              serverOptionControl={{
                path: "options",
              }}
            />
          </div>
          <div className="w-[400px]">
            <InputRadioComponent
              name="radio"
              label="Radio Dari API"
              serverOptionControl={{
                path: "options",
              }}
            />
          </div>
        </div>
      </CardComponent>
    </>
  );
}

SmartOption.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
