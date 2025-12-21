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

const defaultPreviewContent: PostPreviewContent = {
  title: 'On the soundness of good writing',
  meta: 'Essay draft · Signify Studio',
  paragraphs: [
    "There are two senses in which writing can be good: it can sound good, and the ideas can be right. It can have nice, flowing sentences, and it can draw correct conclusions about important things. It might seem as if these two kinds of good would be unrelated, like the speed of a car and the color it's painted. And yet I don't think they are. I think writing that sounds good is more likely to be right.",
    'So here we have the most exciting kind of idea: one that seems both preposterous and true. Let\'s examine it. How can this possibly be true?',
    "I know it's true from writing. You can't simultaneously optimize two unrelated things; when you push one far enough, you always end up sacrificing the other. And yet no matter how hard I push, I never find myself having to choose between the sentence that sounds best and the one that expresses an idea best. If I did, it would be frivolous to care how sentences sound. But in practice it feels the opposite of frivolous. Fixing sentences that sound bad seems to help get the ideas right. [1]",
    'By right I mean more than just true. Getting the ideas right means developing them well — drawing the conclusions that matter most, and exploring each one to the right level of detail. So getting the ideas right is not just a matter of saying true things, but saying the right true things.',
    'How could trying to make sentences sound good help you do that? The clue to the answer is something I noticed 30 years ago when I was doing the layout for my first book. Sometimes when you’re laying out text you have bad luck. For example, you get a section that runs one line longer than the page. I don’t know what ordinary typesetters do in this situation, but what I did was rewrite the section to make it a line shorter. You’d expect such an arbitrary constraint to make the writing worse. But I found, to my surprise, that it never did. I always ended up with something I liked better.',
    "I don't think this was because my writing was especially careless. I think if you pointed to a random paragraph in anything written by anyone and told them to make it slightly shorter (or longer), they'd probably be able to come up with something better.",
    'The best analogy for this phenomenon is when you shake a bin full of different objects. The shakes are arbitrary motions. Or more precisely, they\'re not calculated to make any two specific objects fit more closely together. And yet repeated shaking inevitably makes the objects discover brilliantly clever ways of packing themselves. Gravity won\'t let them become less tightly packed, so any change has to be a change for the better. [2]',
    "So it is with writing. If you have to rewrite an awkward passage, you'll never do it in a way that makes it less true. You couldn't bear it, any more than gravity could bear things floating upward. So any change in the ideas has to be a change for the better.",
    "It's obvious once you think about it. Writing that sounds good is more likely to be right for the same reason that a well-shaken bin is more likely to be tightly packed. But there's something else going on as well. Sounding good isn't just a random external force that leaves the ideas in an essay better off. It actually helps you to get them right.",
    "The reason is that it makes the essay easier to read. It's less work to read writing that flows well. How does that help the writer? Because the writer is the first reader. When I'm working on an essay, I spend far more time reading than writing. I'll reread some parts 50 or 100 times, replaying the thoughts in them and asking myself, like someone sanding a piece of wood, does anything catch? Does anything feel wrong? And the easier the essay is to read, the easier it is to notice if something catches.",
    "So yes, the two senses of good writing are connected in at least two ways. Trying to make writing sound good makes you fix mistakes unconsciously, and also helps you fix them consciously; it shakes the bin of ideas, and also makes mistakes easier to see. But now that we've dissolved one layer of preposterousness, I can't resist adding another. Does sounding good do more than just help you get the ideas right? Is writing that sounds good inherently more likely to be right? Crazy as it may seem, I think that's true too.",
    "Obviously there's a connection at the level of individual words. There are lots of words in English that sound like what they mean, often in wonderfully subtle ways. Glitter. Round. Scrape. Prim. Cavalcade. But the sound of good writing depends even more on the way you put words together, and there's a connection at that level too.",
    "When writing sounds good, it's mostly because it has good rhythm. But the rhythm of good writing is not the rhythm of music, or the meter of verse. It's not so regular. If it were, it wouldn't be good, because the rhythm of good writing has to match the ideas in it, and ideas have all kinds of different shapes. Sometimes they're simple and you just state them. But other times they're more subtle, and you need longer, more complicated sentences to tease out all the implications.",
    "An essay is a cleaned up train of thought, in the same way dialogue is cleaned up conversation, and a train of thought has a natural rhythm. So when an essay sounds good, it's not merely because it has a pleasing rhythm, but because it has its natural one. Which means you can use getting the rhythm right as a heuristic for getting the ideas right. And not just in principle: good writers do both simultaneously as a matter of course. Often I don't even distinguish between the two problems. I just think Ugh, this doesn't sound right; what do I mean to say here? [3]",
    "The sound of writing turns out to be more like the shape of a plane than the color of a car. If it looks good, as Kelly Johnson used to say, it will fly well.",
    "This is only true of writing that's used to develop ideas, though. It doesn't apply when you have ideas in some other way and then write about them afterward — for example, if you build something, or conduct an experiment, and then write a paper about it. In such cases the ideas often live more in the work than the writing, so the writing can be bad even though the ideas are good. The writing in textbooks and popular surveys can be bad for the same reason: the author isn't developing the ideas, merely describing other people's. It's only when you're writing to develop ideas that there's such a close connection between the two senses of doing it well.",
    "Ok, many people will be thinking, this seems plausible so far, but what about liars? Is it not notoriously possible for a smooth-tongued liar to write something beautiful that's completely false?",
    "It is, of course. But not without method acting. The way to write something beautiful and false is to begin by making yourself almost believe it. So just like someone writing something beautiful and true, you're presenting a perfectly formed train of thought. The difference is the point where it attaches to the world. You're saying something that would be true if certain false premises were. If for some bizarre reason the number of jobs in a country were fixed, then immigrants really would be taking our jobs.",
    "So it's not quite right to say that better sounding writing is more likely to be true. Better sounding writing is more likely to be internally consistent. If the writer is honest, internal consistency and truth converge.",
    "But while we can't safely conclude that beautiful writing is true, it's usually safe to conclude the converse: something that seems clumsily written will usually have gotten the ideas wrong too.",
    "Indeed, the two senses of good writing are more like two ends of the same thing. The connection between them is not a rigid one; the goodness of good writing is not a rod but a rope, with multiple overlapping connections running through it. But it's hard to move one end without moving the other. It's hard to be right without sounding right.",
  ],
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
  previewContent = defaultPreviewContent,
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
