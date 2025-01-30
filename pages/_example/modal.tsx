import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";

export default function Modal() {
  return (
    <>
      <div></div>
    </>
  );
}

Modal.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
