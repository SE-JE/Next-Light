import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";

export default function Table() {
  return (
    <>
      <div></div>
    </>
  );
}

Table.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
