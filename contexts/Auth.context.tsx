import { api, middleware } from "@helpers/.";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextInterface {
  registerToken     :  string | null;
  setRegisterToken  :  (token: string | null) => void;
  accessToken       :  string | null;
  setAccessToken    :  (token: string | null) => void;
  user              :  Record<string, any> | null;
  setUser           :  (user: Record<string, any> | null) => void;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken]      =  useState<string | null>(null);
  const [registerToken, setRegisterToken]  =  useState<string | null>(null);
  const [user, setUser]                    =  useState<Record<string, any> | null>(null);

  const set_access_token =  (token: string | null) => {
    setAccessToken(token);

    if(token) {
      middleware.setAccessToken(token)
    } else {
      middleware.deleteAccessToken()
    }
  }

  const fetchUser = async () => {
    const fetch = await api({path: "me"});
    
    setUser(fetch?.data?.data)
  }

  useEffect(() => {
    const token = middleware.getAccessToken() || null;
    
    setAccessToken(token)

    fetchUser()
  }, []);

  return (
    <AuthContext.Provider value={{
      registerToken,
      setRegisterToken,
      accessToken,
      setAccessToken: (token) => set_access_token(token),
      user,
      setUser,
    }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextInterface => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContext.Provider");
  }
  return context;
};
