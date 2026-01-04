"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ButtonComponent, CardComponent, FormSupervisionComponent } from "@components";
import { useAuthContext } from "@contexts/.";

export default function Verify() {
  const router = useRouter();
  const {registerToken} = useAuthContext();  

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold italic">WELCOME TO NEXT-LIGHT v.3</h1>
        <p className="text-sm font-semibold mt-6">Verify your email!</p>

        <CardComponent className="mt-4 p-6 w-[400px] rounded-2xl">
          <FormSupervisionComponent
            fields={[
              {
                type: "otp",
                construction: {
                  name: "token",
                }
              },
            ]}
            submitControl={{
              path: "verify",
              bearer: registerToken || "",
            }}
            onSuccess={() => {
              router.push("/auth/login")
            }}
            footerControl={({loading}) => (
              <>
                <ButtonComponent
                  type="submit"
                  label="Submit"
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
