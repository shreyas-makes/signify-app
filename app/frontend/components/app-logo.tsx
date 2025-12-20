import { cn } from "@/lib/utils"

import AppLogoIcon from "./app-logo-icon"

interface AppLogoProps {
  showIcon?: boolean
  iconClassName?: string
  labelWrapperClassName?: string
  labelClassName?: string
}

export default function AppLogo({
  showIcon = true,
  iconClassName,
  labelWrapperClassName,
  labelClassName,
}: AppLogoProps = {}) {
  return (
    <>
      {showIcon ? (
        <AppLogoIcon className={cn("size-8 object-contain", iconClassName)} />
      ) : null}
      <div
        className={cn(
          "grid flex-1 text-left",
          showIcon ? "ml-2" : null,
          labelWrapperClassName,
        )}
      >
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
