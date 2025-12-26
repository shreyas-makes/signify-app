import { Head, router } from "@inertiajs/react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

import { googleSignInPath } from "@/routes"

declare global {
  interface Window {
    google?: {
      accounts?: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: { credential?: string }) => void
            ux_mode?: "popup" | "redirect"
            auto_select?: boolean
            cancel_on_tap_outside?: boolean
          }) => void
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; width?: string; text?: string },
          ) => void
        }
      }
    }
  }
}

type GoogleSignInButtonProps = {
  className?: string
}

export default function GoogleSignInButton({ className }: GoogleSignInButtonProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const googleInitialized = useRef(false)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

  useEffect(() => {
    if (!googleClientId || googleInitialized.current) {
      return
    }

    let attempts = 0
    const intervalId = window.setInterval(() => {
      attempts += 1
      const google = window.google?.accounts?.id
      if (google && googleButtonRef.current) {
        const buttonWidth = Math.max(
          320,
          Math.round(googleButtonRef.current.getBoundingClientRect().width),
        )
        google.initialize({
          client_id: googleClientId,
          callback: (response) => {
            if (!response.credential) {
              toast.error("Google sign-in failed")
              return
            }

            router.post(
              googleSignInPath(),
              { credential: response.credential },
              {
                onError: () => toast.error("Google sign-in failed"),
              },
            )
          },
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
        })
        google.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: buttonWidth,
          text: "continue_with",
        })
        googleInitialized.current = true
        window.clearInterval(intervalId)
      } else if (attempts > 100) {
        window.clearInterval(intervalId)
        console.warn("Google sign-in script did not load in time.")
      }
    }, 50)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [googleClientId])

  return (
    <>
      <Head>
        <script src="https://accounts.google.com/gsi/client" async defer />
      </Head>
      {googleClientId ? (
        <div
          ref={googleButtonRef}
          className={className ?? "google-signin-button min-h-[44px] w-full"}
        />
      ) : (
        <div className="rounded-md border border-dashed px-3 py-2 text-center text-xs text-muted-foreground">
          Google sign-in is not configured.
        </div>
      )}
    </>
  )
}
