import { Form, Head, router } from "@inertiajs/react"
import { LoaderCircle } from "lucide-react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/layouts/auth-layout"
import { newIdentityPasswordResetPath, signInPath, signUpPath } from "@/routes"

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

export default function Login() {
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
              "/google_sign_in",
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
    <AuthLayout
      title="Log in to your account"
      description="Enter your email and password below to log in"
    >
      <Head title="Log in">
        <script src="https://accounts.google.com/gsi/client" async defer />
      </Head>
      <Form
        method="post"
        action={signInPath()}
        resetOnSuccess={["password"]}
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  placeholder="email@example.com"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <TextLink
                    href={newIdentityPasswordResetPath()}
                    className="ml-auto text-sm"
                    tabIndex={5}
                  >
                    Forgot password?
                  </TextLink>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  placeholder="Password"
                />
                <InputError message={errors.password} />
              </div>

              <Button
                type="submit"
                className="mt-4 w-full"
                tabIndex={4}
                disabled={processing}
              >
                {processing && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                Log in
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              {googleClientId ? (
                <div
                  ref={googleButtonRef}
                  className="google-signin-button min-h-[44px] w-full"
                />
              ) : (
                <div className="rounded-md border border-dashed px-3 py-2 text-center text-xs text-muted-foreground">
                  Google sign-in is not configured.
                </div>
              )}
            </div>

            <div className="text-muted-foreground text-center text-sm">
              Don&apos;t have an account?{" "}
              <TextLink href={signUpPath()} tabIndex={5}>
                Sign up
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  )
}
