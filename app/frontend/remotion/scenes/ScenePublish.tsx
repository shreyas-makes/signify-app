import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {SignatureBadge} from '../components/SignatureBadge';
import {fadeIn, slideInY} from '../lib/animation';
import {remotionTheme} from '../lib/theme';

const LOGO_SRC = staticFile('signify-logo.png');
const POST = {
  title: 'Prophetic future tense',
  subtitle: 'Writing your narrative in a future past tense',
  metaLeft: 'Keystroke activity',
  metaRight: 'View timeline ->',
  excerpt: [
    'We lack frequent usage of the future past tense in modern discourse.',
    "When I was recently drafting my new year resolutions, I noticed the use of 'I can', and 'I will', and found myself questioning the format, especially when I see that I'm good at making promises, but end up being miserable at keeping them.",
    "I also observed that when I write 'I achieved...' instead of 'I will achieve...', I can bypass any doubt and uncertainty that often comes with future planning.",
  ],
};

export const ScenePublish = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeIn({frame, fps});
  const translateY = slideInY({frame, fps, distance: 18});
  const cardLift = interpolate(frame, [0, fps * 1.1], [26, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardScale = interpolate(frame, [0, fps * 1.2], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <Background accent={remotionTheme.accentBlue} />
      <div
        style={{
          position: 'absolute',
          top: 64,
          right: 80,
          opacity,
          transform: `translateY(${translateY * 0.4}px)`,
        }}
      >
        <Img
          src={LOGO_SRC}
          style={{
            height: 56,
            width: 240,
            objectFit: 'contain',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 26,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 980,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontFamily: remotionTheme.fontSans,
              fontSize: 16,
              letterSpacing: 2.2,
              textTransform: 'uppercase',
              color: remotionTheme.inkMuted,
            }}
          >
            Published post
          </div>
          <SignatureBadge label="Proof-of-human signature" accent={remotionTheme.accent} />
        </div>
          <div
            style={{
              width: '100%',
              maxWidth: 980,
              borderRadius: 32,
              background: remotionTheme.paper,
              border: `1px solid ${remotionTheme.border}`,
              boxShadow: `0 30px 70px ${remotionTheme.shadow}`,
              padding: '44px 48px',
              transform: `translateY(${cardLift}px) scale(${cardScale})`,
              transformOrigin: 'center',
            }}
          >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: remotionTheme.fontSans,
                fontSize: 16,
                color: remotionTheme.inkMuted,
              }}
            >
              {POST.metaLeft}
            </div>
            <div
              style={{
                fontFamily: remotionTheme.fontSans,
                fontSize: 16,
                color: remotionTheme.accent,
              }}
            >
              {POST.metaRight}
            </div>
          </div>
          <div
            style={{
              fontSize: 50,
              lineHeight: 1.05,
              color: remotionTheme.ink,
              marginBottom: 12,
              fontFamily: remotionTheme.fontSerif,
            }}
          >
            {POST.title}
          </div>
          <div
            style={{
              fontFamily: remotionTheme.fontSans,
              fontSize: 22,
              color: remotionTheme.inkMuted,
              marginBottom: 26,
            }}
          >
            {POST.subtitle}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              fontFamily: remotionTheme.fontSans,
              fontSize: 20,
              lineHeight: 1.6,
              color: remotionTheme.ink,
            }}
          >
            {POST.excerpt.map((paragraph) => (
              <div key={paragraph}>{paragraph}</div>
            ))}
          </div>
        </div>
        <div
          style={{
            fontFamily: remotionTheme.fontSans,
            fontSize: 18,
            color: remotionTheme.inkMuted,
          }}
        >
          Published on Signify with a cryptographic signature attached.
        </div>
      </div>
    </AbsoluteFill>
  );
};
