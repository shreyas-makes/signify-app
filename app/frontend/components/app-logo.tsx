import { cn } from "@/lib/utils"

import AppLogoIcon from "./app-logo-icon"

interface AppLogoProps {
  iconClassName?: string
  iconInnerClassName?: string
  labelWrapperClassName?: string
  labelClassName?: string
}

export default function AppLogo({
  iconClassName,
  iconInnerClassName,
  labelWrapperClassName,
  labelClassName,
}: AppLogoProps = {}) {
  return (
    <>
      <AppLogoIcon
        className={cn("size-8", iconClassName)}
        iconClassName={cn("h-4 w-4", iconInnerClassName)}
      />
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
