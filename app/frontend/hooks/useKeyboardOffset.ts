import { useEffect, useState } from "react"

export function useKeyboardOffset() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return

    const viewport = window.visualViewport
    const updateOffset = () => {
      const visualBottom = viewport.height + viewport.offsetTop
      const nextOffset = Math.max(0, window.innerHeight - visualBottom)
      setOffset((prev) => (prev === nextOffset ? prev : nextOffset))
    }

    updateOffset()
    viewport.addEventListener("resize", updateOffset)
    viewport.addEventListener("scroll", updateOffset)

    return () => {
      viewport.removeEventListener("resize", updateOffset)
      viewport.removeEventListener("scroll", updateOffset)
    }
  }, [])

  return offset
}
