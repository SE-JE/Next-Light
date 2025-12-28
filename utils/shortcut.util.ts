export type ShortcutHandler = (e: KeyboardEvent) => void

export type ShortcutType = {
  key: string
  description?: string
  handler: ShortcutHandler
}

const handlers = new Map<string, ShortcutType>()

export const shortcut = {
  register: (key: string, handler: ShortcutHandler, description?: string) => {
    handlers.set(key, { key, handler, description })
  },

  unregister: (key: string) => handlers.delete(key),

  list: () => Array.from(handlers.values()),

  init: () => {
    window.addEventListener("keydown",(e) => {
      const target = e.target as HTMLElement
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return

      const combo = [e.ctrlKey && "ctrl", e.shiftKey && "shift", e.altKey && "alt", e.key.toLowerCase()].filter(Boolean).join("+")

      const meta = handlers.get(combo)
      if (meta) {
        e.preventDefault()
        e.stopPropagation()
        meta.handler(e)
      }
    },true)
  }

}