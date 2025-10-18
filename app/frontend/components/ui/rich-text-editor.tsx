import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  textareaClassName?: string
}

export interface RichTextEditorRef {
  getContent: () => string
  setContent: (content: string) => void
  focus: () => void
  getElement: () => HTMLTextAreaElement | null
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value = '', onChange, placeholder = "Start writing...", className, disabled, textareaClassName }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      getContent: () => {
        return textareaRef.current?.value ?? ''
      },
      setContent: (content: string) => {
        if (textareaRef.current) {
          textareaRef.current.value = content
          autoResize()
        }
      },
      focus: () => {
        textareaRef.current?.focus()
      },
      getElement: () => {
        return textareaRef.current
      }
    }))

    const autoResize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }

    useEffect(() => {
      autoResize()
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value)
      }
      autoResize()
    }

    return (
      <div className={className}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full min-h-[500px] resize-none border-0 bg-transparent p-6 text-lg leading-relaxed outline-none ring-0 placeholder:text-muted-foreground/50 focus:border-transparent focus:outline-none focus:ring-0",
            disabled ? "pointer-events-none opacity-50" : "",
            textareaClassName,
          )}
          style={{
            fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
            fontSize: '18px',
            lineHeight: '1.75',
            overflow: 'hidden',
            outline: 'none',
            border: 'none',
            boxShadow: 'none'
          }}
        />
      </div>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'
