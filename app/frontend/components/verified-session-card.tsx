import { Fingerprint } from 'lucide-react'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TimelineMilestone {
  label: string
  value: string
  accent?: string
}

interface VerifiedSessionCardProps {
  initials: string
  sessionStatus?: string
  sessionMeta?: string
  authenticityLabel?: string
  className?: string
  snippetTitle?: string
  snippetIcon?: ReactNode
  snippetLines?: ReactNode[]
  snippetFooter?: ReactNode
  excerpt?: string
  excerptLabel?: string
  timeline?: TimelineMilestone[]
}

const defaultTimeline: TimelineMilestone[] = [
  { label: 'Draft authored', value: '12:34:08', accent: 'from-primary to-chart-2' },
  { label: 'Edits verified', value: '12:37:44', accent: 'from-accent to-chart-4' },
  { label: 'Proof shared', value: '12:39:02', accent: 'from-secondary to-chart-3' },
]

export function VerifiedSessionCard({
  initials,
  sessionStatus = 'Session verified',
  sessionMeta,
  authenticityLabel = 'Authentic',
  className,
  snippetTitle = 'Proof of authorship summary',
  snippetIcon,
  snippetLines = [
    <>
      <span className="text-sm font-medium text-foreground/90">Session hash</span>
      <span className="font-mono text-sm text-muted-foreground">7f3c-29ab-441e</span>
    </>,
    <>
      <span className="text-sm font-medium text-foreground/90">Keystrokes captured</span>
      <span className="font-semibold text-primary">1,348</span>
    </>,
    <>
      <span className="text-sm font-medium text-foreground/90">Integrity checks</span>
      <span className="font-semibold text-chart-3">Passed</span>
    </>,
  ],
  snippetFooter = 'Verified 3 minutes ago · Signed by Signify Integrity Network',
  excerpt = '“This piece keeps creative intent intact from first draft through publication.”',
  excerptLabel = 'Post excerpt',
  timeline = defaultTimeline,
}: VerifiedSessionCardProps) {
  return (
    <Card className={cn('overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-xl backdrop-blur', className)}>
      <CardContent className="space-y-6 p-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-muted text-sm font-semibold text-foreground">
              {initials}
            </span>
            <div>
              <p className="font-semibold text-foreground">{sessionStatus}</p>
              {sessionMeta ? (
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{sessionMeta}</p>
              ) : null}
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-xs font-semibold text-primary"
          >
            {authenticityLabel}
          </Badge>
        </div>

        <div className="rounded-2xl border border-border bg-muted/60 p-5 text-left shadow-inner">
          {excerpt ? (
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{excerptLabel}</span>
              <div className="rounded-xl border border-border/60 bg-background/80 p-4 text-sm leading-relaxed text-foreground shadow-sm">
                {excerpt}
              </div>
            </div>
          ) : null}

          <div
            className={cn(
              'mt-4 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground',
              excerpt ? 'border-t border-border/60 pt-4' : ''
            )}
          >
            {snippetIcon ?? <Fingerprint className="h-4 w-4 text-primary" />}
            <span>{snippetTitle}</span>
          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            {snippetLines.map((line, index) => (
              <div
                key={index}
                className="flex w-full flex-wrap items-center justify-between gap-2 rounded-xl bg-background/60 px-3 py-2"
              >
                {line}
              </div>
            ))}
            {snippetFooter ? (
              <p className="text-xs text-muted-foreground">{snippetFooter}</p>
            ) : null}
          </div>
        </div>

        {timeline.length > 0 ? (
          <div className="space-y-3">
            {timeline.map(({ label, value, accent }, index) => (
              <TimelineItem key={`${label}-${index}`} label={label} value={value} accent={accent} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function TimelineItem({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-sm">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className={cn('h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent', accent)} />
        <span>{label}</span>
      </div>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}
