import { CardComponent } from "@/components/base.components";
import React from "react";

export default function Login() {
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold italic">WELCOME TO NEXT-LIGHT v.3</h1>
        <p className="text-sm font-semibold mt-6">Your account!</p>

        <CardComponent className="mt-4 p-6 w-[400px] rounded-2xl">
          <></>
        </CardComponent>
      </div>
    </>
  );
}
