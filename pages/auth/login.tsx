import { ButtonComponent, CardComponent } from "@/components/base.components";
import FormSupervisionComponent from "@/components/base.components/supervision/FormSupervision.component";
import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold italic">WELCOME TO NEXT-LIGHT v.3</h1>
        <p className="text-sm font-semibold mt-6">Sign in with your account!</p>

        <CardComponent className="mt-4 p-6 w-[400px] rounded-2xl">
          <FormSupervisionComponent 
            forms={[
              {
                construction: {
                  name: "email",
                  label: "E-mail",
                  placeholder: "Ex: example@mail.com",
                }
              },
              {
                construction: {
                  type: "password",
                  name: "password",
                  label: "Password",
                  placeholder: "Ex: secret123",
                }
              }
            ]}
            submitControl={{
              path: "/login"
            }}
            footerControl={() => (
              <>
                <ButtonComponent
                  type="submit"
                  label="Login Now"
                  block
                  className="mt-4"
                />

                <p className="mt-4 text-center">Don&apos;t have an account yet? <Link href="/auth/register" className="text-primary underline">Create Account</Link></p>
              </>
            )}
          />
        </CardComponent>
      </div>
    </>
  );
}
