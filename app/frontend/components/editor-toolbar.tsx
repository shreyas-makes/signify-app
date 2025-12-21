import type { Editor } from "@tiptap/react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorToolbarProps {
  editor: Editor | null
  className?: string
}

interface MarkAction {
  label: string
  ariaLabel: string
  action: () => void
  isActive?: () => boolean
}

export function EditorToolbar({ editor, className }: EditorToolbarProps) {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    if (!editor) return
    const handleUpdate = () => forceUpdate((value) => value + 1)
    editor.on("selectionUpdate", handleUpdate)
    editor.on("transaction", handleUpdate)
    return () => {
      editor.off("selectionUpdate", handleUpdate)
      editor.off("transaction", handleUpdate)
    }
  }, [editor])

  if (!editor) return null

  const inlineActions: MarkAction[] = [
    {
      label: "B",
      ariaLabel: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      label: "I",
      ariaLabel: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      label: "U",
      ariaLabel: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      label: "S",
      ariaLabel: "Strikethrough",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      label: "Mark",
      ariaLabel: "Highlight",
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
  ]

  const blockActions: MarkAction[] = [
    {
      label: "H1",
      ariaLabel: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      label: "H2",
      ariaLabel: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      label: "H3",
      ariaLabel: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      label: "Quote",
      ariaLabel: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
  ]

  const listActions: MarkAction[] = [
    {
      label: "• List",
      ariaLabel: "Bulleted list",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      label: "1. List",
      ariaLabel: "Numbered list",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
  ]

  const actionButtonClass = (active?: boolean) =>
    cn(
      "h-8 px-2 text-xs font-semibold text-[#5c4d35]",
      active && "bg-[#eadcc6]/70 text-[#2b2417]"
    )

  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-[#5c4d35]", className)}>
      {inlineActions.map((action) => (
        <Button
          key={action.ariaLabel}
          type="button"
          variant="ghost"
          size="sm"
          aria-label={action.ariaLabel}
          className={actionButtonClass(action.isActive?.())}
          onClick={action.action}
        >
          {action.label}
        </Button>
      ))}

      <span className="h-4 w-px bg-[#eadcc6]" aria-hidden />

      {blockActions.map((action) => (
        <Button
          key={action.ariaLabel}
          type="button"
          variant="ghost"
          size="sm"
          aria-label={action.ariaLabel}
          className={actionButtonClass(action.isActive?.())}
          onClick={action.action}
        >
          {action.label}
        </Button>
      ))}

      <span className="h-4 w-px bg-[#eadcc6]" aria-hidden />

      {listActions.map((action) => (
        <Button
          key={action.ariaLabel}
          type="button"
          variant="ghost"
          size="sm"
          aria-label={action.ariaLabel}
          className={actionButtonClass(action.isActive?.())}
          onClick={action.action}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}
