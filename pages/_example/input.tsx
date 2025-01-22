import { ReactNode } from "react";
import ExampleLayout from "./_layout";

export default function Input() {
  return (
    <>
      <div>
        <p className="text-xl">Input</p>
      </div>
    </>
  );
}

Input.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
