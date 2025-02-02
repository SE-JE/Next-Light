import { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { CardComponent, InputComponent } from "@/components/base.components";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { CheckboxComponent } from "@/components/base.components/input/Checkbox.component";
import { InputCheckboxComponent } from "@/components/base.components/input/InputCheckbox.component";
import { RadioComponent } from "@/components/base.components/input/Radio.component";
import { InputRadioComponent } from "@/components/base.components/input/InputRadio.component";
import { InputCurrencyComponent } from "@/components/base.components/input/InputCurrency.component";
import { InputDateComponent } from "@/components/base.components/input/InputDate.component";
import { InputNumberComponent } from "@/components/base.components/input/InputNumber.component";
import { SelectComponent } from "@/components/base.components/input/Select.component";

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
          <div className="col-span-4">
            <div className="flex gap-4">
              <CheckboxComponent name="check" value="check" label="Checkbox" />
              <CheckboxComponent
                name="check"
                value="check"
                label="Checkbox"
                checked
              />
            </div>
            <div className="flex gap-4 mt-4">
              <RadioComponent name="check" value="check" label="Radio" />
              <RadioComponent
                name="check"
                value="check"
                label="Radio"
                checked
              />
            </div>
          </div>
          <div className="col-span-4">
            <InputCheckboxComponent
              name="input_check"
              label="Input Checkbox"
              options={[1, 2, 3, 4].map((i) => {
                return {
                  label: "Check " + i,
                  value: i,
                };
              })}
            />

            <InputRadioComponent
              name="input_radio"
              label="Input Radio"
              options={[1, 2, 3, 4].map((i) => {
                return {
                  label: "Radio " + i,
                  value: i,
                };
              })}
            />
          </div>
          <div className="col-span-4">
            <InputCheckboxComponent
              name="input_check"
              label="Input Checkbox"
              options={[1, 2, 3, 4].map((i) => {
                return {
                  label: "Check " + i,
                  value: i,
                };
              })}
              vertical
            />
          </div>

          <div className="col-span-4">
            <InputRadioComponent
              name="input_radio"
              label="Input Radio"
              options={[1, 2, 3, 4].map((i) => {
                return {
                  label: "Radio " + i,
                  value: i,
                };
              })}
              vertical
            />
          </div>

          <div className="col-span-4">
            <InputCurrencyComponent
              name="input_currency"
              label="Input Currency"
              placeholder="Contoh: Rp. 10.000"
            />
          </div>

          <div className="col-span-4">
            <InputDateComponent
              name="input_date"
              label="Input Date"
              placeholder="YYYY-MM-DD"
            />
          </div>

          <div className="col-span-4">
            <InputNumberComponent
              name="input_number"
              label="Input Number"
              placeholder="0000"
            />
          </div>

          <div className="col-span-4">
            <SelectComponent
              name="input_select"
              label="Select Option"
              placeholder="Choice option..."
              options={[1, 2, 3, 4, 5].map((i) => {
                return {
                  label: "Option " + i,
                  value: i,
                };
              })}
            />
          </div>

          <div className="col-span-4">
            <SelectComponent
              name="input_select"
              label="Select Option Searchable"
              placeholder="Choice option..."
              options={[1, 2, 3, 4, 5].map((i) => {
                return {
                  label: "Option " + i,
                  value: i,
                };
              })}
              searchable
            />
          </div>

          <div className="col-span-4">
            <SelectComponent
              name="input_select"
              label="Multiple Select Option"
              placeholder="Choice option..."
              options={[1, 2, 3, 4, 5].map((i) => {
                return {
                  label: "Option " + i,
                  value: i,
                };
              })}
              searchable
              multiple
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
