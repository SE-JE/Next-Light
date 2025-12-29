import { PageSchema, NodeSchema } from './RenderPDF.component'

export type ExportColumn = {
  key: string
  label: string
  width?: number
}

export type ExportDataProps = {
  title?: string
  columns: ExportColumn[]
  data: Record<string, any>[]
  pageSize?: 'A4' | 'LETTER'
  margin?: number
}

export function PrintTable({
  title,
  columns,
  data,
  pageSize = 'A4',
  margin = 40,
}: ExportDataProps): PageSchema[] {
  const content: NodeSchema[] = []

  // ===== Title =====
  if (title) {
    content.push({
      type: 'text',
      content: title,
      style: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
      },
    })
  }

  // ===== Table Header =====
  const headerRow: NodeSchema = {
    type: 'tr',
    content: columns.map(col => ({
      type: 'th',
      content: col.label,
      style: {
        fontWeight: 'bold',
      },
    })),
  }

  // ===== Table Rows =====
  const rows: NodeSchema[] = data.map(row => ({
    type: 'tr',
    content: columns.map(col => ({
      type: 'td',
      content: String(row[col.key] ?? ''),
    })),
  }))

  // ===== Table =====
  content.push({
    type: 'table',
    content: [headerRow, ...rows],
  })

  return [
    {
      page: {
        size: pageSize,
        margin,
        content,
      },
    },
  ]
}
