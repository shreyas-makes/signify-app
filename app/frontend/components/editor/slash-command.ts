import { Extension } from "@tiptap/core"
import Suggestion, {
  type SuggestionKeyDownProps,
  type SuggestionProps,
} from "@tiptap/suggestion"

type CommandItem = {
  title: string
  description: string
  keywords: string[]
  command: (props: { editor: SuggestionProps["editor"]; range: SuggestionProps["range"] }) => void
}

const commandItems: CommandItem[] = [
  {
    title: "Bold",
    description: "Toggle bold text",
    keywords: ["bold", "strong"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBold().run()
    },
  },
  {
    title: "Italic",
    description: "Toggle italic text",
    keywords: ["italic", "emphasis", "em"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleItalic().run()
    },
  },
  {
    title: "Underline",
    description: "Toggle underline",
    keywords: ["underline", "u"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleUnderline().run()
    },
  },
  {
    title: "Strikethrough",
    description: "Toggle strikethrough",
    keywords: ["strike", "strikethrough", "s"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleStrike().run()
    },
  },
  {
    title: "Highlight",
    description: "Toggle highlight",
    keywords: ["highlight", "mark"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHighlight().run()
    },
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    keywords: ["h1", "heading1", "heading 1", "title"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run()
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    keywords: ["h2", "heading2", "heading 2"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run()
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    keywords: ["h3", "heading3", "heading 3"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run()
    },
  },
  {
    title: "Blockquote",
    description: "Quote block",
    keywords: ["quote", "blockquote"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: "Bulleted list",
    description: "Start a bullet list",
    keywords: ["bullet", "list", "unordered"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: "Numbered list",
    description: "Start a numbered list",
    keywords: ["numbered", "ordered", "list"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
]

const getFilteredItems = (query: string) => {
  if (!query) return commandItems
  const normalized = query.toLowerCase()
  return commandItems.filter((item) =>
    [item.title, item.description, ...item.keywords].some((value) =>
      value.toLowerCase().includes(normalized)
    )
  )
}

const createMenu = () => {
  const container = document.createElement("div")
  container.className =
    "slash-menu z-50 w-64 rounded-lg border border-border bg-background/95 p-1 text-sm shadow-lg backdrop-blur"
  container.style.position = "fixed"
  container.style.left = "0px"
  container.style.top = "0px"
  container.style.visibility = "hidden"
  container.setAttribute("role", "listbox")
  document.body.appendChild(container)
  return container
}

const renderItems = (
  container: HTMLDivElement,
  items: CommandItem[],
  selectedIndex: number,
  onSelect: (index: number) => void
) => {
  container.innerHTML = ""
  if (!items.length) {
    const empty = document.createElement("div")
    empty.className = "px-3 py-2 text-xs text-muted-foreground"
    empty.textContent = "No commands found"
    container.appendChild(empty)
    return
  }

  items.forEach((item, index) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className =
      "flex w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left text-sm transition-colors"
    button.classList.add(index === selectedIndex ? "bg-muted/70" : "hover:bg-muted/60")
    button.setAttribute("role", "option")
    button.setAttribute("aria-selected", index === selectedIndex ? "true" : "false")

    const title = document.createElement("span")
    title.className = "font-medium text-foreground"
    title.textContent = item.title

    const description = document.createElement("span")
    description.className = "text-xs text-muted-foreground"
    description.textContent = item.description

    button.appendChild(title)
    button.appendChild(description)
    button.addEventListener("click", () => onSelect(index))
    container.appendChild(button)
  })
}

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addProseMirrorPlugins() {
    let menu: HTMLDivElement | null = null
    let selectedIndex = 0
    let items: CommandItem[] = []
    let latestProps: SuggestionProps | null = null

    const selectItem = (index: number, props: SuggestionProps) => {
      const item = items[index]
      if (!item) return
      item.command({ editor: props.editor, range: props.range })
    }

    const positionMenu = (props: SuggestionProps) => {
      if (!menu) return
      const clientRect = props.clientRect?.()
      if (!clientRect) return
      const menuHeight = menu.getBoundingClientRect().height
      const viewportHeight = window.innerHeight
      const bottomSpace = viewportHeight - clientRect.bottom
      const top = bottomSpace < menuHeight + 12
        ? Math.max(8, clientRect.top - menuHeight - 8)
        : clientRect.bottom + 6
      menu.style.left = `${clientRect.left}px`
      menu.style.top = `${top}px`
      menu.style.visibility = "visible"
    }

    const handleSelect = (index: number) => {
      if (!latestProps) return
      selectItem(index, latestProps)
    }

    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        startOfLine: false,
        items: ({ query }) => getFilteredItems(query),
        command: (props) => {
          selectItem(selectedIndex, props)
        },
        render: () => {
          return {
            onStart: (props) => {
              latestProps = props
              menu = createMenu()
              items = props.items as CommandItem[]
              selectedIndex = 0
              renderItems(menu, items, selectedIndex, handleSelect)
              positionMenu(props)
            },
            onUpdate: (props) => {
              latestProps = props
              if (!menu) return
              items = props.items as CommandItem[]
              selectedIndex = Math.min(selectedIndex, Math.max(items.length - 1, 0))
              renderItems(menu, items, selectedIndex, handleSelect)
              positionMenu(props)
            },
            onKeyDown: (props: SuggestionKeyDownProps) => {
              if (!menu) return false
              if (props.event.key === "ArrowDown") {
                props.event.preventDefault()
                selectedIndex = (selectedIndex + 1) % Math.max(items.length, 1)
                renderItems(menu, items, selectedIndex, handleSelect)
                return true
              }
              if (props.event.key === "ArrowUp") {
                props.event.preventDefault()
                selectedIndex = (selectedIndex - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1)
                renderItems(menu, items, selectedIndex, handleSelect)
                return true
              }
              if (props.event.key === "Enter") {
                props.event.preventDefault()
                handleSelect(selectedIndex)
                return true
              }
              if (props.event.key === "Escape") {
                props.event.preventDefault()
                return true
              }
              return false
            },
            onExit: () => {
              if (!menu) return
              menu.remove()
              menu = null
              latestProps = null
            },
          }
        },
      }),
    ]
  },
})
