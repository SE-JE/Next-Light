"use client"

import { PDFDocument, StandardFonts, PDFPage, rgb } from 'pdf-lib'
import { useEffect, useRef } from 'react'

export const PaperSize = {
  LETTER: { width: 612, height: 792 },
  A4: { width: 595, height: 842 },
}

export type RenderPDFProps = {
  content: PageSchema[]
}

export type PageSchema = {
  page: {
    size?: keyof typeof PaperSize | { width: number; height: number }
    margin?: number
    content: NodeSchema[]
  }
}

export type Style = {
  width?: number
  height?: number

  padding?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingX?: number
  paddingY?: number

  marginTop?: number
  marginBottom?: number

  fontSize?: number
  fontWeight?: "normal" | "bold"
  lineHeight?: number
  letterSpacing?: number
  color?: string
  opacity?: number
  align?: "left" | "center" | "right"
  textTransform?: "uppercase" | "lowercase" | "capitalize"

  backgroundColor?: string
  borderColor?: string
  borderWidth?: number

  underline?: boolean

  textAlign?: "left" | "center" | "right"
}

export type NodeSchema =
  | { type: "view"; style?: Style; content: NodeSchema[] }
  | { type: "text"; content: string; style?: Style }
  | { type: "image"; src: string | Uint8Array | ArrayBuffer; style?: Style }
  | { type: "table"; content: NodeSchema[] }
  | { type: "tr"; content: NodeSchema[], style?: Style }
  | { type: 'td' | 'th'; content: NodeSchema[] | string; style?: Style }

// ==================================================
// Layout Context
// ==================================================

class LayoutContext {
  x: number
  y: number
  constructor(
    public width: number,
    public height: number,
    public margin: number
  ) {
    this.x = margin
    this.y = height - margin
  }

  needBreak(h: number) {
    return this.y - h < this.margin
  }

  reset() {
    this.x = this.margin
    this.y = this.height - this.margin
  }
}

// ==================================================
// Helpers
// ==================================================

function resolvePadding(style?: Style) {
  const p = style?.padding ?? 0
  const px = style?.paddingX ?? p
  const py = style?.paddingY ?? p

  return {
    top: style?.paddingTop ?? py,
    bottom: style?.paddingBottom ?? py,
    left: style?.paddingLeft ?? px,
    right: style?.paddingRight ?? px,
  }
}

function resolveText(text: string, style?: Style) {
  if (!style?.textTransform) return text
  if (style.textTransform === "uppercase") return text.toUpperCase()
  if (style.textTransform === "lowercase") return text.toLowerCase()
  if (style.textTransform === "capitalize")
    return text.replace(/\b\w/g, c => c.toUpperCase())
  return text
}

function hexToRgb(hex?: string) {
  if (!hex) return undefined
  const h = hex.replace("#", "")
  return rgb(
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255
  )
}

async function embedImage(pdf: PDFDocument, bytes: Uint8Array | ArrayBuffer) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  try {
    return await pdf.embedPng(data)
  } catch {
    return await pdf.embedJpg(data)
  }
}

async function resolveImageSource(
  src: string | Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  if (src instanceof Uint8Array) return src
  if (src instanceof ArrayBuffer) return new Uint8Array(src)

  const res = await fetch(src)
  if (!res.ok) {
    throw new Error(`Failed to load image: ${src}`)
  }

  const buffer = await res.arrayBuffer()
  return new Uint8Array(buffer)
}


function normalizeContent(
  content: string | NodeSchema[]
): NodeSchema[] {
  if (typeof content === "string") {
    return [
      {
        type: "text",
        content
      }
    ]
  }
  return content
}


// ==================================================
// Render Engine
// ==================================================

export async function RenderPDF(
  { content }: RenderPDFProps
): Promise<Uint8Array> {

  const pdf = await PDFDocument.create()

  const fontRegular = await pdf.embedFont(StandardFonts.Courier)
  const fontBold = await pdf.embedFont(StandardFonts.CourierBold)

  for (const p of content) {
    const size =
      typeof p.page.size === "string"
        ? PaperSize[p.page.size]
        : p.page.size ?? PaperSize.A4

    const margin = p.page.margin ?? 40

    let page: PDFPage = pdf.addPage([size.width, size.height])
    const ctx = new LayoutContext(size.width, size.height, margin)

    const draw = async (node: NodeSchema) => {

      // ===================== VIEW =====================
      if (node.type === "view") {
        const pad = resolvePadding(node.style)
        const startY = ctx.y

        ctx.y -= pad.top
        ctx.x += pad.left

        for (const c of node.content) await draw(c)

        const endY = ctx.y
        const boxHeight = startY - endY

        if (node.style?.backgroundColor) {
          page.drawRectangle({
            x: ctx.margin,
            y: endY,
            width: size.width - ctx.margin * 2,
            height: boxHeight,
            color: hexToRgb(node.style.backgroundColor),
          })
        }

        if (node.style?.borderWidth && node.style?.borderColor) {
          page.drawRectangle({
            x: ctx.margin,
            y: endY,
            width: size.width - ctx.margin * 2,
            height: boxHeight,
            borderColor: hexToRgb(node.style.borderColor),
            borderWidth: node.style.borderWidth,
          })
        }

        ctx.x -= pad.left
        ctx.y -= pad.bottom
        return
      }

      // ===================== TEXT =====================
      if (node.type === "text") {
        const style = node.style
        const fs = style?.fontSize ?? 12
        const lh = style?.lineHeight ?? fs + 4

        if (ctx.needBreak(lh)) {
          page = pdf.addPage([size.width, size.height])
          ctx.reset()
        }

        const font =
          style?.fontWeight === "bold"
            ? fontBold
            : fontRegular

        const text = resolveText(node.content, style)
        const color = hexToRgb(style?.color)

        let x = ctx.x
        if (style?.align === "center") {
          const w = font.widthOfTextAtSize(text, fs)
          x = (size.width - w) / 2
        }
        if (style?.align === "right") {
          const w = font.widthOfTextAtSize(text, fs)
          x = size.width - ctx.margin - w
        }

        page.drawText(text, {
          x,
          y: ctx.y - fs,
          size: fs,
          font,
          color,
          opacity: style?.opacity,
        })

        if (style?.underline) {
          const w = font.widthOfTextAtSize(text, fs)
          page.drawLine({
            start: { x, y: ctx.y - fs - 2 },
            end: { x: x + w, y: ctx.y - fs - 2 },
            thickness: 1,
          })
        }

        ctx.y -= lh + (style?.marginBottom ?? 0)
        return
      }

      // ===================== IMAGE =====================
      if (node.type === "image") {
        const bytes = await resolveImageSource(node.src)
        const img = await embedImage(pdf, bytes)
        const base = img.scale(1)

        let w = node.style?.width ?? base.width
        let h = node.style?.height ?? base.height

        if (node.style?.width && !node.style?.height)
          h = (base.height / base.width) * w

        if (node.style?.height && !node.style?.width)
          w = (base.width / base.height) * h

        if (ctx.needBreak(h)) {
          page = pdf.addPage([size.width, size.height])
          ctx.reset()
        }

        page.drawImage(img, {
          x: ctx.x,
          y: ctx.y - h,
          width: w,
          height: h,
        })

        ctx.y -= h + (node.style?.marginBottom ?? 0)
        return
      }


      // ===================== TABLE =====================
      if (node.type === "table") {
        for (const r of node.content) await draw(r)
        ctx.y -= 8
        return
      }

      if (node.type === "tr") {
        const rowH = node.style?.height || 20;

        if (ctx.needBreak(rowH)) {
          page = pdf.addPage([size.width, size.height])
          ctx.reset()
        }

        const tableWidth = size.width - ctx.margin * 2
        const colCount = node.content.length
        const colWidth = tableWidth / colCount

        const originalX = ctx.x
        let x = ctx.margin

        for (const cell of node.content) {
          if (cell.type !== "td" && cell.type !== "th") continue

          const children = normalizeContent(cell.content)
          const pad = resolvePadding(cell.style)
          const startY = ctx.y

          ctx.x = x + pad.left
          ctx.y -= pad.top

          for (const child of children) {
            await draw(child)
          }

          ctx.y = startY
          x += colWidth
        }

        ctx.x = originalX
        ctx.y -= rowH
        return
      }




    }

    for (const n of p.page.content) await draw(n)
  }

  return await pdf.save()
}

export function RenderPDFPreview({ schema, className }: { schema: PageSchema[], className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const bytes = await RenderPDF({ content: schema });
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const pdf = await pdfjs.getDocument({ data: bytes }).promise;
      if (cancelled) return;

      const page = await pdf.getPage(1);
      const dpr = 1;
      const viewport = page.getViewport({ scale: 1 });

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const scaledViewport = page.getViewport({ scale: dpr });

      const renderTask = page.render({
        canvas,
        canvasContext: ctx,
        viewport: scaledViewport,
      });

      await renderTask.promise;
    })();

    return () => {
      cancelled = true;
    };
  }, [schema]);

  return <>
    <div className={className}>
      <canvas ref={canvasRef} className="w-full border" />
    </div>
  </>
}