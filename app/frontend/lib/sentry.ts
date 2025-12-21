import * as Sentry from "@sentry/react"

const sentryDsn = import.meta.env.VITE_SENTRY_DSN

const parseSampleRate = (value: string | undefined, fallback: number) => {
  if (!value) return fallback
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

export const initializeSentry = () => {
  if (!sentryDsn) return

  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: parseSampleRate(
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE,
      0.1,
    ),
  })
}
