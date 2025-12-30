"use client"

import { PDFDocument, StandardFonts, PDFPage } from 'pdf-lib'
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
  marginBottom?: number
  fontSize?: number
  fontWeight?: 'normal' | 'bold',
  border?: string
}

export type NodeSchema =
  | { type: 'view'; style?: Style; content: NodeSchema[] }
  | { type: 'text'; content: string; style?: Style }
  | { type: 'image'; src: Uint8Array | ArrayBuffer; style?: Style }
  | { type: 'table'; content: NodeSchema[] }
  | { type: 'tr'; content: NodeSchema[] }
  | { type: 'td' | 'th'; content: string; style?: Style }

class LayoutContext {
  x: number
  y: number
  constructor(public width: number, public height: number, public margin: number) {
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

async function embedImage(pdf: PDFDocument, bytes: Uint8Array | ArrayBuffer) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  try {
    return await pdf.embedPng(data)
  } catch {
    return await pdf.embedJpg(data)
  }
}

export async function RenderPDF({ content }: RenderPDFProps): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Courier)

  for (const p of content) {
    const size = typeof p.page.size === 'string'
      ? PaperSize[p.page.size]
      : p.page.size ?? PaperSize.LETTER

    const margin = p.page.margin ?? 40

    let page: PDFPage = pdf.addPage([size.width, size.height])
    const ctx = new LayoutContext(size.width, size.height, margin)

    const draw = async (node: NodeSchema) => {
      if (node.type === 'view') {
        const pad = node.style?.padding ?? 0
        ctx.x += pad
        ctx.y -= pad
        for (const c of node.content) await draw(c)
        ctx.x -= pad
        ctx.y -= pad
        return
      }

      if (node.type === 'text') {
        const fs = node.style?.fontSize ?? 12
        const h = fs + 4
        if (ctx.needBreak(h)) {
          page = pdf.addPage([size.width, size.height])
          ctx.reset()
        }
        page.drawText(node.content, { x: ctx.x, y: ctx.y - fs, size: fs, font })
        ctx.y -= h + (node.style?.marginBottom ?? 0)
        return
      }

      if (node.type === 'image') {
        const img = await embedImage(pdf, node.src)
        const base = img.scale(1)
        let w = node.style?.width ?? base.width
        let h = node.style?.height ?? base.height
        if (node.style?.width && !node.style?.height) h = (base.height / base.width) * w
        if (node.style?.height && !node.style?.width) w = (base.width / base.height) * h
        if (ctx.needBreak(h)) {
          page = pdf.addPage([size.width, size.height])
          ctx.reset()
        }
        page.drawImage(img, { x: ctx.x, y: ctx.y - h, width: w, height: h })
        ctx.y -= h + (node.style?.marginBottom ?? 0)
        return
      }

      if (node.type === 'table') {
        for (const r of node.content) await draw(r)
        ctx.y -= 8
        return
      }

      if (node.type === 'tr') {
        const rowH = 18
        if (ctx.needBreak(rowH)) {
          page = pdf.addPage([size.width, size.height])
          ctx.reset()
        }
        let x = ctx.x
        for (const c of node.content) {
          if (c.type !== 'td' && c.type !== 'th') continue
          page.drawText(c.content, { x, y: ctx.y - 12, size: 10, font })
          x += 120
        }
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