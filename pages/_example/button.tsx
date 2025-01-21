import { ReactNode } from "react";
import ExampleLayout from "./_layout";

export default function Button() {
  return (
    <>
      <div></div>
    </>
  );
}

Button.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
