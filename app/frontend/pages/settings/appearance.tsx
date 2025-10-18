import { Head } from "@inertiajs/react"

import AppearanceTabs from "@/components/appearance-tabs"
import HeadingSmall from "@/components/heading-small"
import AppLayout from "@/layouts/app-layout"
import SettingsLayout from "@/layouts/settings/layout"

const pageTitle = "Appearance settings"

export default function Appearance() {
  return (
    <AppLayout>
      <Head title={pageTitle} />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Appearance settings"
            description="Signify now ships with a single refined light theme for clarity."
          />
          <AppearanceTabs />
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
