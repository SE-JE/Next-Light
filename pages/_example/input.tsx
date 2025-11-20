import { ReactNode } from "react";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import ExampleLayout from "./_layout";
import { CardComponent, CheckboxComponent, InputCheckboxComponent, InputComponent, InputCurrencyComponent, InputDateComponent, InputDatetimeComponent, InputImageComponent, InputMapComponent, InputNumberComponent, InputRadioComponent, InputTimeComponent, RadioComponent, SelectComponent } from "@components";

export default function Input() {
  return (
    <>
      <CardComponent>
        <p className="text-xl">Input</p>

        <div className="grid grid-cols-4 md:grid-cols-12 gap-4 py-4">
          <div className="col-span-4">
            <InputComponent
              name=""
              className="label::text-purple-900"
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
              invalid="Nama tidak valid"
            />
          </div>
          <div className="col-span-4">
            <InputComponent
              leftIcon={faUserTag}
              name=""
              label="Nama Lengkap"
              placeholder="Contoh: Joko Gunawan..."
              invalid="Nama tidak valid"
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
            <InputComponent
              name=""
              label="Nama Lengkap"
              placeholder="Contoh: Joko Gunawan..."
              multiple
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
            <InputTimeComponent
              name="input_time"
              label="Input Time"
              placeholder="HH:MM"
            />
          </div>

          <div className="col-span-4">
            <InputDatetimeComponent
              name="input_datetime"
              label="Input Datetime"
              placeholder="YYYY-MM-DD hh:mm:ss"
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

          <div className="col-span-4">
            <InputMapComponent
              name="input_map"
              label="Input Map"
              placeholder="Choice option..."
            />
          </div>

          <div className="col-span-4">
            <InputImageComponent
              name="input_image"
              label="Input Image"
              
              // placeholder="Choice option..."
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
