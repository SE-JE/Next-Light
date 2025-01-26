import { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { CardComponent, InputComponent } from "@/components/base.components";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
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
        </div>
      </CardComponent>
    </>
  );
}

Input.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
