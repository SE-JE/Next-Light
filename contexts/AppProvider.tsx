import { ReactNode } from 'react'
import { AuthContextProvider } from './Auth.context'
import { ToggleContextProvider } from './Toggle.context'

const registerProviders = [
  AuthContextProvider,
  ToggleContextProvider,
]

export function ContextAppProvider({ children }: { children: ReactNode }) {
  return registerProviders.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)
}