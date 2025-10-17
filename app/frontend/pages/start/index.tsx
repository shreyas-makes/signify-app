import { Head, useForm } from "@inertiajs/react"
import { useMemo } from "react"

import InputError from "@/components/input-error"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { startPath } from "@/routes"

interface OnboardingUser {
  name: string
  display_name: string
  avatar_url?: string | null
  bio?: string | null
  email: string
}

interface Props {
  user: OnboardingUser
}

export default function Start({ user }: Props) {
  const { data, setData, patch, processing, errors } = useForm({
    name: user.name ?? "",
    display_name: user.display_name ?? "",
    avatar_url: user.avatar_url ?? "",
    bio: user.bio ?? "",
  })

  const avatarFallback = useMemo(() => {
    const base = data.display_name || data.name || user.email
    return base
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("")
  }, [data.display_name, data.name, user.email])

  const avatarPreview = data.avatar_url?.trim()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    patch(startPath(), {
      preserveScroll: true,
    })
  }

  return (
    <div className="min-h-screen bg-[#f4f1e8]">
      <Head title="Getting started" />

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-12 lg:px-12">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#a18963]">
            Welcome to Signify
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#2d2518] sm:text-[2.75rem]">
            Before you publish, let’s personalize your author profile.
          </h1>
          <p className="mt-4 text-base text-[#5c4d35] sm:text-lg">
            Add the details readers will see next to every verified proof of your writing.
          </p>
        </div>

        <Card className="rounded-[36px] border-[#eadcc6] bg-[#fdfaf2] shadow-[0_38px_68px_-44px_rgba(70,53,30,0.35)]">
          <form onSubmit={handleSubmit}>
            <CardHeader className="border-b border-[#eadcc6] bg-[#f7f1e5] px-8 py-6 sm:px-12">
              <CardTitle className="text-xl font-semibold text-[#2d2518]">
                Your public face
              </CardTitle>
              <p className="mt-2 text-sm text-[#5c4d35]">
                These details appear on your dashboard and your published keystroke-proven posts.
              </p>
            </CardHeader>

            <CardContent className="space-y-10 px-8 py-10 sm:px-12">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="lg:w-1/3">
                  <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#eadcc6] bg-white/70 px-6 py-8 text-center">
                    <Avatar className="h-24 w-24 overflow-hidden rounded-full border border-[#eadcc6] bg-[#efe4d1]">
                      {avatarPreview && (
                        <AvatarImage src={avatarPreview} alt={data.display_name || data.name || "Profile preview"} />
                      )}
                      <AvatarFallback className="rounded-full bg-[#e6d6bf] text-lg font-semibold text-[#43331c]">
                        {avatarFallback || "WR"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Label htmlFor="avatar_url" className="text-xs font-medium uppercase tracking-[0.28em] text-[#a18963]">
                        Profile picture URL
                      </Label>
                      <Input
                        id="avatar_url"
                        name="avatar_url"
                        type="url"
                        inputMode="url"
                        placeholder="https://"
                        value={data.avatar_url}
                        onChange={(event) => setData("avatar_url", event.currentTarget.value)}
                        className="text-center text-sm"
                      />
                      <p className="text-xs text-[#867456]">
                        Use a square image link. You can update it later in settings.
                      </p>
                      <InputError message={errors.avatar_url} className="text-center" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a18963]">
                      Full name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={data.name}
                      onChange={(event) => setData("name", event.currentTarget.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                      className="bg-white text-[#2d2518]"
                    />
                    <InputError message={errors.name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="display_name" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a18963]">
                      Pen name or display name
                    </Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      value={data.display_name}
                      onChange={(event) => setData("display_name", event.currentTarget.value)}
                      placeholder="How readers will see your name"
                      required
                      className="bg-white text-[#2d2518]"
                    />
                    <InputError message={errors.display_name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a18963]">
                      Author description
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={data.bio}
                      onChange={(event) => setData("bio", event.currentTarget.value)}
                      placeholder="Summarize your expertise, focus, or writing style (max 500 characters)"
                      rows={5}
                      className="bg-white text-[#2d2518]"
                      maxLength={500}
                    />
                    <div className="flex items-center justify-between text-xs text-[#867456]">
                      <span>Appears beneath your verification badge on published posts.</span>
                      <span>{data.bio.length}/500</span>
                    </div>
                    <InputError message={errors.bio} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-dashed border-[#d8c7a9] bg-[#fdf8ee] px-6 py-5 sm:flex-row">
                <div className="text-sm text-[#5c4d35]">
                  You can tweak any of these details later from <span className="font-semibold">Settings → Profile</span>.
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full bg-[#2d2518] px-8 text-white hover:bg-[#3a3020]"
                  disabled={processing}
                >
                  {processing ? "Saving…" : "Next → Dashboard"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}
