"use client"

import { useRouter } from "next/navigation";
import { useAuthContext } from "@contexts";
import { ButtonComponent, CardComponent, FormSupervisionComponent } from "@components";

export default function EditProfile() {
  const router    =  useRouter();
  const { user }  =  useAuthContext();

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold italic">WELCOME TO NEXT-LIGHT v.3</h1>
        <p className="text-sm font-semibold mt-6">Edit account!</p>

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
                construction: {
                  type: "file",
                  name: "image",
                  label: "Picture",
                }
              },
            ]}
            defaultValue={user}
            submitControl={{
              path: "me/update"
            }}
            onSuccess={() => {
              router.push("/auth/me")
            }}
            footerControl={({loading}) => (
              <>
                <ButtonComponent
                  type="submit"
                  label="Save Changes"
                  block
                  className="mt-4"
                  loading={loading}
                />
              </>
            )}
          />
        </CardComponent>
      </div>
    </>
  );
}
