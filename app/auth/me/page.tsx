"use client"

import { useRouter } from "next/navigation";
import { auth } from "@utils";
import { useAuthContext } from "@contexts";
import { ButtonComponent, CardComponent, ImageComponent } from "@components";

export default function Login() {
  const router = useRouter();
  const {user} = useAuthContext();
  
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold italic">WELCOME TO NEXT-LIGHT v.3</h1>
        <p className="text-sm font-semibold mt-6">Your account!</p>

        <CardComponent className="mt-4 p-6 w-[400px] rounded-2xl">
          <div className="flex gap-4">
            {user?.image && (

              <div className="bg-slate-200 aspect-[3/4] w-full rounded flex justify-center items-center">
                <ImageComponent src={process.env.NEXT_PUBLIC_STORAGE_HOST + user?.image} width={400} height={600} alt="" />
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-light-foreground">
                  Name
                </p>
                <p>{user?.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-light-foreground">
                  Email
                </p>
                <p>{user?.email}</p>
              </div>

              <ButtonComponent href="/auth/edit" label="Change" variant="light" block className="py-1.5" />
              <ButtonComponent 
                label="Logout" 
                variant="outline" 
                paint="danger" 
                className="py-1.5" 
                block 
                onClick={() => {
                  auth.deleteAccessToken()
                  router.push("/auth/login")
                }}
              />
            </div>
          </div>
        </CardComponent>
      </div>
    </>
  );
}
