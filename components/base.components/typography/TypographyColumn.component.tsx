import { ReactNode } from 'react'

export interface TypographyColumnProps {
  title     :  string | ReactNode;
  content   :  string | ReactNode;
}

export function TypographyColumnComponent({
  title,
  content,
} : TypographyColumnProps) {
  return (
    <>
      <div>
        <div className="text-xs font-semibold text-light-foreground">{title}</div>
        <div>{content}</div>
      </div>
    </>
  )
}
