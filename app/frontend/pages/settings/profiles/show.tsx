import { Transition } from "@headlessui/react"
import { Form, Head, usePage } from "@inertiajs/react"

import DeleteUser from "@/components/delete-user"
import HeadingSmall from "@/components/heading-small"
import InputError from "@/components/input-error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import AppLayout from "@/layouts/app-layout"
import SettingsLayout from "@/layouts/settings/layout"
import { settingsProfilePath } from "@/routes"
import type { SharedData } from "@/types"

const pageTitle = "Profile settings"

export default function Profile() {
  const { auth } = usePage<SharedData>().props

  return (
    <AppLayout>
      <Head title={pageTitle} />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Profile information"
            description="Update the details that appear on your public profile"
          />

          <Form
            method="patch"
            action={settingsProfilePath()}
            options={{
              preserveScroll: true,
            }}
            className="space-y-6"
          >
            {({ errors, processing, recentlySuccessful }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      name="name"
                      className="mt-1 block w-full"
                      defaultValue={auth.user.name}
                      required
                      autoComplete="name"
                      placeholder="Full name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="display_name">Display name</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      className="mt-1 block w-full"
                      defaultValue={auth.user.display_name}
                      required
                      autoComplete="nickname"
                      placeholder="How readers see your name"
                    />
                    <InputError className="mt-2" message={errors.display_name} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="avatar_url">Gravatar image URL</Label>
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    className="mt-1 block w-full"
                    defaultValue={auth.user.avatar_url ?? ""}
                    inputMode="url"
                    placeholder="https://www.gravatar.com/avatar/..."
                  />
                  <p className="text-sm text-muted-foreground">
                    Paste your Gravatar image URL to keep your profile picture in sync.
                  </p>
                  <InputError className="mt-2" message={errors.avatar_url} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Author description</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    className="mt-1 block w-full"
                    defaultValue={auth.user.bio ?? ""}
                    placeholder="Summarize your expertise, focus, or writing style"
                    maxLength={500}
                    rows={4}
                  />
                  <div className="text-sm text-muted-foreground">
                    Appears beneath your verification badge on published posts.
                  </div>
                  <InputError className="mt-2" message={errors.bio} />
                </div>

                <div className="flex items-center gap-4">
                  <Button disabled={processing}>Save</Button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-muted-foreground">Saved</p>
                  </Transition>
                </div>
              </>
            )}
          </Form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  )
}
