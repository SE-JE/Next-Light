import { ReactNode } from 'react'

export interface TypographyTipsProps {
  title     :  string | ReactNode;
  content   :  string | ReactNode;
}

export function TypographyTipsComponent({
  title,
  content,
} : TypographyTipsProps) {
  return (
    <>
      <div className="pl-3 py-1 border-l-2 border-light-primary">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-light-foreground">{content}</p>
      </div>
    </>
  )
}
