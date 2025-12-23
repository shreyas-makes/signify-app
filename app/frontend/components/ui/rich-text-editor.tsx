import Highlight from "@tiptap/extension-highlight"
import Underline from "@tiptap/extension-underline"
import type { Editor } from "@tiptap/react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  textareaClassName?: string
  placeholderClassName?: string
  onEditorReady?: (editor: Editor) => void
}

export interface RichTextEditorRef {
  getContent: () => string
  setContent: (content: string) => void
  focus: () => void
  getElement: () => HTMLElement | null
  getEditor: () => Editor | null
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (
    {
      value = '',
      onChange,
      placeholder = "Start writing...",
      className,
      disabled,
      textareaClassName,
      placeholderClassName,
      onEditorReady,
    },
    ref
  ) => {
    const [isEmpty, setIsEmpty] = useState(!value.trim())

    const editorAttributes = useMemo(() => {
      return {
        class: cn(
          "w-full min-h-[500px] border-0 bg-transparent p-6 text-lg leading-relaxed outline-none focus:outline-none",
          disabled ? "pointer-events-none opacity-50" : "",
          textareaClassName,
        ),
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        spellcheck: "true",
        inputmode: "text",
        style: [
          "font-family: ui-serif, Georgia, Cambria, \"Times New Roman\", Times, serif",
          "font-size: 18px",
          "line-height: 1.75",
          "outline: none",
        ].join("; "),
      }
    }, [disabled, textareaClassName])

    const editor = useEditor({
      content: value,
      editable: !disabled,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
        Underline,
        Highlight,
      ],
      editorProps: {
        attributes: editorAttributes,
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        onChange?.(html)
        setIsEmpty(editor.isEmpty)
      },
      onCreate: ({ editor }) => {
        setIsEmpty(editor.isEmpty)
        onEditorReady?.(editor)
      },
      onFocus: ({ editor }) => {
        setIsEmpty(editor.isEmpty)
      },
      onBlur: ({ editor }) => {
        setIsEmpty(editor.isEmpty)
      },
    })

    useImperativeHandle(ref, () => ({
      getContent: () => {
        return editor?.getHTML() ?? ''
      },
      setContent: (content: string) => {
        if (editor) {
          editor.commands.setContent(content, { emitUpdate: false })
        }
      },
      focus: () => {
        editor?.commands.focus()
      },
      getElement: () => {
        return editor?.view.dom ?? null
      },
      getEditor: () => {
        return editor ?? null
      },
    }))

    useEffect(() => {
      if (!editor) return
      const current = editor.getHTML()
      if (value !== current) {
        editor.commands.setContent(value, { emitUpdate: false })
      }
    }, [editor, value])

    useEffect(() => {
      if (!editor) return
      editor.setEditable(!disabled)
      editor.setOptions({
        editorProps: {
          attributes: editorAttributes,
        },
      })
    }, [disabled, editor, editorAttributes])

    return (
      <div className={cn("relative", className)}>
        {isEmpty && placeholder && (
          <div
            className={cn(
              "pointer-events-none absolute left-6 top-6 text-lg text-muted-foreground/50",
              placeholderClassName
            )}
          >
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'
