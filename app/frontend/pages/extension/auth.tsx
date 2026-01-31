import { Head, useForm } from "@inertiajs/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { extensionAuthPath } from "@/routes"

interface Props {
  state?: string | null
  redirect_uri?: string | null
  error?: string | null
}

export default function ExtensionAuth({ state, redirect_uri, error }: Props) {
  const { data, setData, post, processing } = useForm({
    state: state ?? "",
    redirect_uri: redirect_uri ?? "",
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    post(extensionAuthPath())
  }

  return (
    <div className="min-h-screen bg-[#f4f1e8]">
      <Head title="Connect Signify Extension" />

      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-12">
        <Card className="rounded-[32px] border-[#eadcc6] bg-[#fdfaf2] shadow-[0_30px_70px_-50px_rgba(70,53,30,0.35)]">
          <CardHeader className="border-b border-[#eadcc6] bg-[#f7f1e5] px-8 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#a18963]">
              Signify Extension
            </p>
            <CardTitle className="mt-3 text-2xl font-semibold text-[#2d2518]">
              Connect your account
            </CardTitle>
            <p className="mt-3 text-sm text-[#5c4d35]">
              This will link your Signify account to the Chrome extension so it can generate verification links.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-8 py-8">
            {error ? (
              <div className="rounded-2xl border border-[#e6c9b5] bg-[#fff4ee] px-4 py-3 text-sm text-[#8a4b2d]">
                {error}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#eadcc6] bg-white/70 px-5 py-4 text-sm text-[#5c4d35]">
                You will be redirected back to the extension after confirming.
              </div>
            )}

            {!error && (
              <dl className="grid gap-3 text-sm text-[#5c4d35]">
                <div className="flex items-center justify-between rounded-2xl border border-[#eadcc6] bg-white/80 px-4 py-3">
                  <dt className="font-medium">Extension redirect</dt>
                  <dd className="max-w-[55%] truncate text-right text-xs text-[#7a6749]" title={redirect_uri || ""}>
                    {redirect_uri}
                  </dd>
                </div>
              </dl>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-3 border-t border-[#eadcc6] bg-[#f7f1e5] px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#7a6749]">
              You can revoke this token later in Settings.
            </p>
            {!error && (
              <form onSubmit={handleSubmit}>
                <input
                  type="hidden"
                  name="state"
                  value={data.state}
                  onChange={(event) => setData("state", event.currentTarget.value)}
                />
                <input
                  type="hidden"
                  name="redirect_uri"
                  value={data.redirect_uri}
                  onChange={(event) => setData("redirect_uri", event.currentTarget.value)}
                />
                <Button type="submit" className="rounded-full px-6" disabled={processing}>
                  {processing ? "Authorizing..." : "Authorize Extension"}
                </Button>
              </form>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
