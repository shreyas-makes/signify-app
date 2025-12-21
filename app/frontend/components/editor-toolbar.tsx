import type { Editor } from "@tiptap/react"
import type { LucideIcon } from "lucide-react"
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorToolbarProps {
  editor: Editor | null
  className?: string
}

interface MarkAction {
  icon: LucideIcon
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
      icon: Bold,
      ariaLabel: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: Italic,
      ariaLabel: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: Underline,
      ariaLabel: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      icon: Strikethrough,
      ariaLabel: "Strikethrough",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: Highlighter,
      ariaLabel: "Highlight",
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
  ]

  const blockActions: MarkAction[] = [
    {
      icon: Heading1,
      ariaLabel: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: Heading2,
      ariaLabel: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: Heading3,
      ariaLabel: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      icon: Quote,
      ariaLabel: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
  ]

  const listActions: MarkAction[] = [
    {
      icon: List,
      ariaLabel: "Bulleted list",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      ariaLabel: "Numbered list",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
  ]

  const actionButtonClass = (active?: boolean) =>
    cn(
      "h-8 w-8 p-0 text-[#5c4d35]",
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
          <action.icon className="h-4 w-4" aria-hidden />
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
          <action.icon className="h-4 w-4" aria-hidden />
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
          <action.icon className="h-4 w-4" aria-hidden />
        </Button>
      ))}
    </div>
  )
}
