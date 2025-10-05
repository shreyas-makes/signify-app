import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"

interface RichTextEditorProps {
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export interface RichTextEditorRef {
  getContent: () => string
  setContent: (content: string) => void
  focus: () => void
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value = '', onChange, placeholder = "Start writing...", className, disabled }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      getContent: () => {
        return textareaRef.current?.value || ''
      },
      setContent: (content: string) => {
        if (textareaRef.current) {
          textareaRef.current.value = content
          autoResize()
        }
      },
      focus: () => {
        textareaRef.current?.focus()
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
          className={`
            w-full 
            min-h-[500px] 
            p-6 
            border-0 
            bg-transparent 
            text-lg 
            leading-relaxed 
            resize-none 
            focus:outline-none 
            placeholder:text-muted-foreground/50
            ${disabled ? 'opacity-50 pointer-events-none' : ''}
          `}
          style={{
            fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
            fontSize: '18px',
            lineHeight: '1.75',
            overflow: 'hidden'
          }}
        />
      </div>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'