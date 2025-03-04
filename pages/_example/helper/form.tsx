import React, { ReactNode } from "react";
import ExampleLayout from "../_layout";

export default function Form() {
  return (
    <>
      <div></div>
    </>
  );
}

Form.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
