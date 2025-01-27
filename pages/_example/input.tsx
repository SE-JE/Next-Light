import { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { CardComponent, InputComponent } from "@/components/base.components";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { CheckboxComponent } from "@/components/base.components/input/Checkbox.component";
import { InputCheckboxComponent } from "@/components/base.components/input/InputCheckbox.component";
type ClassNamePrefix = "label" | "tip" | "error" | "input";

export default function Input() {
  return (
    <>
      <CardComponent>
        <p className="text-xl">Input</p>

        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="col-span-4">
            <InputComponent
              name=""
              label="Nama Lengkap"
              placeholder="Contoh: Joko Gunawan..."
            />
          </div>
          <div className="col-span-4">
            <InputComponent
              leftIcon={faUserTag}
              name=""
              label="Nama Lengkap"
              placeholder="Contoh: Joko Gunawan..."
            />
          </div>
          <div className="col-span-4">
            <InputComponent
              rightIcon={faUserTag}
              name=""
              label="Nama Lengkap"
              placeholder="Contoh: Joko Gunawan..."
            />
          </div>
          <div className="col-span-4">
            <InputComponent
              name=""
              label="Nama Lengkap"
              placeholder="Contoh: Joko Gunawan..."
              tip="Nama lengkap sesuai ktp"
            />
          </div>
          <div className="col-span-4">
            <InputComponent
              name=""
              label="Nama Lengkap"
              placeholder="Contoh: Joko Gunawan..."
              disabled
            />
          </div>
          <div className="col-span-4">
            <InputComponent
              name=""
              label="Nama Lengkap"
              placeholder="Contoh: Joko Gunawan..."
              error="Nama tidak valid"
            />
          </div>
          <div className="col-span-4">
            <InputComponent
              leftIcon={faUserTag}
              name=""
              label="Nama Lengkap"
              placeholder="Contoh: Joko Gunawan..."
              error="Nama tidak valid"
            />
          </div>
          <div className="col-span-4">
            <InputComponent
              name=""
              label="Nama Lengkap"
              placeholder="Contoh: Joko Gunawan..."
              suggestions={["Joko", "Gunawan", "Joko Gunawan"]}
            />
          </div>
          <div className="col-span-4 flex gap-4">
            <CheckboxComponent name="check" value="check" label="Checkbox" />
            <CheckboxComponent
              name="check"
              value="check"
              label="Checkbox"
              checked
            />
          </div>
          <div className="col-span-4 flex gap-4">
            <InputCheckboxComponent
              name="input_check"
              label="Input Checkbox"
              options={[1, 2, 3, 4, 5, 6].map((i) => {
                return {
                  label: "Check " + i,
                  value: i,
                };
              })}
            />
          </div>
          <div className="col-span-4 flex gap-4">
            <InputCheckboxComponent
              name="input_check"
              label="Input Checkbox"
              options={[1, 2, 3, 4, 5, 6].map((i) => {
                return {
                  label: "Check " + i,
                  value: i,
                };
              })}
              vertical
            />
          </div>
        </div>
      </CardComponent>
    </>
  );
}

Input.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
