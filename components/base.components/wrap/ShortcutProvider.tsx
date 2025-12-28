"use client"

import { useEffect } from "react"
import { shortcut } from "@utils"
import { useToggleContext } from "@contexts"
import { ModalComponent } from "@components";

export function ShortcutProvider() {
  const { setToggle, toggle } = useToggleContext();
  const shortcuts = shortcut.list()

  useEffect(() => {
    shortcut.init()
  }, [])

  useEffect(() => {
    shortcut.register("ctrl+/", () => {
      setToggle("MODAL_SHORTCUT_HELP")
    }, "List Shortcut")
  }, [])

  function formatShortcutKey(key: string) {
    return key
      .split("+")
      .map(k => {
        if (k === "ctrl") return "Ctrl"
        if (k === "shift") return "Shift"
        if (k === "alt") return "Alt"
        if (k === "arrowup") return "↑"
        if (k === "arrowdown") return "↓"
        if (k === " ") return "SPACE"
        return k.toUpperCase()
      })
      .join(" + ")
  }

  return (
    <>
      <ModalComponent 
        show={!!toggle["MODAL_SHORTCUT_HELP"]}
        onClose={() => setToggle("MODAL_SHORTCUT_HELP")}
        title="Shortcut"
      >
        <div className="p-4 grid grid-cols-2 gap-4">
          {shortcuts.map(({ key, description }) => (
            <>
              <kbd className="px-2 py-1 border rounded bg-gray-100 w-max">
                {formatShortcutKey(key)}
              </kbd>
              <span>: {description}</span>
            </>
          ))}
        </div>
      </ModalComponent>
    </>
  )
}
