import { ButtonComponent, CardComponent } from "@/components/base.components";
import FormSupervisionComponent from "@/components/base.components/supervision/FormSupervision.component";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function Register() {
  const router = useRouter();

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold italic">WELCOME TO NEXT-LIGHT v.3</h1>
        <p className="text-sm font-semibold mt-6">Create new account!</p>

        <CardComponent className="mt-4 p-6 w-[400px] rounded-2xl">
          <FormSupervisionComponent 
            forms={[
              {
                construction: {
                  name: "name",
                  label: "Nama",
                  placeholder: "Ex: Joko Gunawan",
                  validations: { required: true }
                }
              },
              {
                construction: {
                  name: "email",
                  label: "E-mail",
                  placeholder: "Ex: example@mail.com",
                  validations: { required: true }
                }
              },
              {
                type: "enter-password",
                construction: {
                  name: "password",
                  label: "Password",
                  placeholder: "Ex: secret123",
                  validations: { required: true }
                }
              },
            ]}
            submitControl={{
              path: "/register"
            }}
            onSuccess={() => router.push("/auth/verify")}
            footerControl={() => (
              <>
                <ButtonComponent
                  type="submit"
                  label="Create Account"
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
