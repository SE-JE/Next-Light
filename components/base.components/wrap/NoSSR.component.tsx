import dynamic from 'next/dynamic'
import React, { ReactNode } from 'react'

const NoSSR = ({ children }: { children: ReactNode }) => <>{children}</>;

export const NoSSRComponent = dynamic(() => Promise.resolve(NoSSR), { ssr: false })