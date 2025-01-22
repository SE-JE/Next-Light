import { ReactNode } from "react";
import ExampleLayout from "../_layout";

export default function Form() {
  return (
    <>
      <div>
        <p className="text-xl">Form</p>
      </div>
    </>
  );
}

Form.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
