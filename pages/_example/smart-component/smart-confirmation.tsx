import React, { ReactNode } from "react";
import ExampleLayout from "../_layout";

export default function SmartConfirmation() {
  return (
    <>
      <div></div>
    </>
  );
}

SmartConfirmation.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
