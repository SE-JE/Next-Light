import { ReactNode } from 'react'

export interface TypographyContentProps {
  title     :  string | ReactNode;
  content   :  string | ReactNode;
}

export function TypographyContentComponent({
  title,
  content,
} : TypographyContentProps) {
  return (
    <>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-light-foreground">{content}</p>
      </div>
    </>
  )
}
