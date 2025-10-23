import React, { ReactNode } from 'react'
import { AuthContextProvider } from './Auth.context'
import { ToggleContextProvider } from './ToggleContext'

export default function ContextProvider({children}: {children: ReactNode}) {
  return (
    <>
      <AuthContextProvider>
      <ToggleContextProvider>
        {children}
      </ToggleContextProvider>
      </AuthContextProvider>
    </>
  )
}
