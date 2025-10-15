export type Appearance = "light"

export function initializeTheme() {
  if (typeof document === "undefined") {
    return
  }

  document.documentElement.classList.remove("dark")
}

export function useAppearance() {
  const updateAppearance = () => {
    /* no-op: light mode is always active */
  }

  return { appearance: "light" as const, updateAppearance } as const
}
