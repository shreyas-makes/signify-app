import { cn } from "@/lib/utils"

import AppLogoIcon from "./app-logo-icon"

interface AppLogoProps {
  iconClassName?: string
  labelWrapperClassName?: string
  labelClassName?: string
}

export default function AppLogo({
  iconClassName,
  labelWrapperClassName,
  labelClassName,
}: AppLogoProps = {}) {
  return (
    <>
      <AppLogoIcon className={cn("size-8 object-contain", iconClassName)} />
      <div className={cn("ml-2 grid flex-1 text-left", labelWrapperClassName)}>
        <span
          className={cn(
            "truncate text-sm font-semibold leading-tight",
            labelClassName,
          )}
        >
          Signify
        </span>
      </div>
    </>
  )
}
