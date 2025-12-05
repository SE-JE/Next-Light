import { ReactNode } from 'react'

export interface TypographyArticleProps {
  title     :  string | ReactNode;
  content   :  string | ReactNode;
  header   ?:  string | ReactNode;
  footer   ?:  string | ReactNode;
}

export function TypographyArticleComponent({
  title,
  content,
  header,
  footer,
} : TypographyArticleProps) {
  return (
    <>
      <h4 className="text-light-foreground">{header}</h4>
      <h1 className="text-2xl font-bold mt-2">{title}</h1>
      <div className="text-justify mt-2">{content}</div>
      <div className="text-sm text-light-foreground mt-4">
        {footer}
      </div>
    </>
  )
}
