import { ButtonComponent, CardComponent } from "@/components/base.components";
import FormSupervisionComponent from "@/components/base.components/supervision/FormSupervision.component";
import Link from "next/link";
import React from "react";

export default function Verify() {
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold italic">WELCOME TO NEXT-LIGHT v.3</h1>
        <p className="text-sm font-semibold mt-6">Verify your email!</p>

        <CardComponent className="mt-4 p-6 w-[400px] rounded-2xl">
          <FormSupervisionComponent 
            forms={[
              {
                type: "otp",
                construction: {
                  name: "token",
                }
              },
            ]}
            submitControl={{
              path: "/verify"
            }}
            footerControl={() => (
              <>
                <ButtonComponent
                  type="submit"
                  label="Submit"
                  block
                  className="mt-4"
                />

                <p className="mt-4 text-center">Already have an account? <Link href="/auth/login" className="text-primary underline">Login</Link></p>
              </>
            )}
          />
        </CardComponent>
      </div>
    </>
  );
}
