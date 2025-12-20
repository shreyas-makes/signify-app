import type { ImgHTMLAttributes } from "react"

type AppLogoIconProps = ImgHTMLAttributes<HTMLImageElement>

export default function AppLogoIcon({
  alt = "Signify logo",
  src = "/logo3.png",
  ...props
}: AppLogoIconProps) {
  return (
    <img alt={alt} src={src} {...props} />
  )
}
