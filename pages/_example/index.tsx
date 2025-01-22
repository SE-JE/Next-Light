import { ReactNode } from "react";
import ExampleLayout from "./_layout";

export default function Example() {
  return (
    <>
      <div>
        <p className="text-xl">Dashboard</p>
      </div>
    </>
  );
}

Example.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
