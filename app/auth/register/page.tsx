"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ButtonComponent, CardComponent, FormSupervisionComponent } from "@components";
import { useAuthContext } from "@contexts";

export default function Register() {
  const router = useRouter();
  const {setRegisterToken} = useAuthContext();

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold italic">WELCOME TO NEXT-LIGHT v.3</h1>
        <p className="text-sm font-semibold mt-6">Create new account!</p>

        <CardComponent className="mt-4 p-6 w-[400px] rounded-2xl">
          <FormSupervisionComponent
            fields={[
              {
                construction: {
                  name: "name",
                  label: "Nama",
                  placeholder: "Ex: Joko Gunawan",
                }
              },
              {
                construction: {
                  name: "email",
                  label: "E-mail",
                  placeholder: "Ex: example@mail.com",
                }
              },
              {
                type: "enter-password",
                construction: {
                  name: "password",
                  label: "Password",
                  placeholder: "Ex: secret123",
                }
              },
            ]}
            submitControl={{
              path: "register"
            }}
            onSuccess={(res) => {
              setRegisterToken(res?.data?.token)
              router.push("/auth/verify")
            }}
            footerControl={({loading}) => (
              <>
                <ButtonComponent
                  type="submit"
                  label="Create Account"
                  block
                  className="mt-4"
                  loading={loading}
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
