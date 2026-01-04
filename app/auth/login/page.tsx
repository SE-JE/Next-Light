"use client"

import { useRouter } from "next/navigation";
import { ButtonComponent, CardComponent, FormSupervisionComponent } from "@components";
import { useAuthContext } from "@contexts";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const {setAccessToken,setUser} = useAuthContext();

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold italic">WELCOME TO NEXT-LIGHT v.3</h1>
        <p className="text-sm font-semibold mt-6">Sign in with your account!</p>

        <CardComponent className="mt-4 p-6 w-[400px] rounded-2xl">
          <FormSupervisionComponent
            fields={[
              {
                construction: {
                  name: "email",
                  label: "E-mail",
                  placeholder: "Ex: example@mail.com",
                  validations: "required|min:10|max:50|email"
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
              path: "login"
            }}
            onSuccess={(res) => {
              setAccessToken(res?.data?.token)
              setUser(res?.data?.user)
              router.push("/auth/me")
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
