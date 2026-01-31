import { Fingerprint } from 'lucide-react'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PostPreviewContent {
  title: string
  paragraphs: string[]
  meta?: string
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
  previewHeading?: string
  previewContent?: PostPreviewContent
}

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
  previewHeading = 'Post preview',
  previewContent,
}: VerifiedSessionCardProps) {
  return (
    <Card className={cn('overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-xl backdrop-blur', className)}>
      <CardContent className="space-y-5 p-6 sm:space-y-6 sm:p-7 lg:p-8">
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

        <div className="space-y-3 text-left sm:space-y-4">
          {previewContent?.paragraphs.length ? (
            <div className="space-y-2 sm:space-y-3">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground sm:text-xs">
                {previewHeading}
              </span>
              <div className="scroll-preview rounded-xl border border-border/60 bg-white p-0.5 shadow-sm">
                <div className="scroll-preview-inner rounded-lg bg-white p-3 shadow-inner sm:p-4">
                  {[0, 1].map(loop => (
                    <div
                      key={`preview-loop-${loop}`}
                      className="scroll-preview-segment space-y-2 sm:space-y-3"
                      aria-hidden={loop === 1}
                    >
                      <h4 className="text-xs font-semibold text-foreground/90 sm:text-sm">
                        {previewContent.title}
                      </h4>
                      {previewContent.meta ? (
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground sm:text-xs">
                          {previewContent.meta}
                        </p>
                      ) : null}
                      {previewContent.paragraphs.map((paragraph, index) => (
                        <p
                          key={`preview-paragraph-${loop}-${index}`}
                          className="text-xs leading-relaxed text-muted-foreground sm:text-sm"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div
            className={cn(
            'mt-3 flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground sm:mt-4 sm:gap-3 sm:text-xs',
              previewContent?.paragraphs.length ? 'border-t border-border/60 pt-3 sm:pt-4' : ''
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
      </CardContent>
    </Card>
  )
}
