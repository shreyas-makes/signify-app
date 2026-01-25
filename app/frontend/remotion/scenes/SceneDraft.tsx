import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {fadeIn, slideInY, typewriterText} from '../lib/animation';
import {remotionTheme} from '../lib/theme';

const DRAFT_TITLE = 'Prophetic future tense';
const DRAFT_SUBTITLE = 'Writing your narrative in a future past tense';
const DRAFT_BODY = `We lack frequent usage of the future past tense in modern discourse.
When I was recently drafting my new year resolutions, I noticed the use of 'I can', and 'I will', and found myself questioning the format, especially when I see that I'm good at making promises, but end up being miserable at keeping them.
I also observed that when I write 'I achieved...' instead of 'I will achieve...', I can bypass any doubt and uncertainty that often comes with future planning.`;

export const SceneDraft = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeIn({frame, fps});
  const translateY = slideInY({frame, fps, distance: 20});
  const clickProgress = interpolate(frame, [fps * 3.2, fps * 4.0], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const buttonPress = 1 - clickProgress * 0.08;
  const ringScale = 1 + clickProgress * 0.9;
  const ringOpacity = 1 - clickProgress;
  const cursorAppear = interpolate(frame, [fps * 2.8, fps * 3.1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorMove = interpolate(frame, [fps * 3.1, fps * 3.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorClick = interpolate(frame, [fps * 3.6, fps * 3.9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const typedBody = typewriterText({
    frame,
    fps,
    text: DRAFT_BODY,
    charsPerSecond: 36,
    delaySeconds: 0.2,
  });
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill>
      <Background accent={remotionTheme.accentTeal} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <div
          style={{
            width: 980,
            borderRadius: 28,
            background: remotionTheme.paper,
            border: `1px solid ${remotionTheme.border}`,
            padding: '36px 44px',
            boxShadow: `0 30px 60px ${remotionTheme.shadow}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: remotionTheme.fontSans,
              color: remotionTheme.inkMuted,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 14px',
                borderRadius: 999,
                border: `1px solid ${remotionTheme.border}`,
                background: remotionTheme.paperCool,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Draft post
            </span>
            <span
              style={{
                fontSize: 12,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Writing now
            </span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            <div
              style={{
                fontFamily: remotionTheme.fontSerif,
                fontSize: 46,
                lineHeight: 1.1,
                color: remotionTheme.ink,
              }}
            >
              {DRAFT_TITLE}
            </div>
            <div
              style={{
                fontFamily: remotionTheme.fontSans,
                fontSize: 20,
                color: remotionTheme.inkMuted,
              }}
            >
              {DRAFT_SUBTITLE}
            </div>
            <div
              style={{
                fontFamily: remotionTheme.fontSerif,
                fontSize: 30,
                lineHeight: 1.45,
                color: remotionTheme.ink,
                whiteSpace: 'pre-line',
                backgroundImage:
                  'linear-gradient(transparent 0, transparent 72%, rgba(15, 23, 42, 0.06) 74%)',
                backgroundSize: '100% 1.9rem',
              }}
            >
              {typedBody}
              <span style={{opacity: cursorVisible ? 1 : 0}}>|</span>
            </div>
          </div>
          <div style={{marginTop: 28, display: 'flex', justifyContent: 'flex-end'}}>
            <div style={{position: 'relative'}}>
              <div
                style={{
                  padding: '12px 30px',
                  borderRadius: 999,
                  background: `linear-gradient(120deg, ${remotionTheme.accentSoft}, #f5e4d3)`,
                  color: remotionTheme.ink,
                  fontFamily: remotionTheme.fontSans,
                  fontSize: 18,
                  fontWeight: 700,
                  border: `1px solid ${remotionTheme.border}`,
                  boxShadow: `0 18px 40px ${remotionTheme.shadow}`,
                  transform: `scale(${buttonPress})`,
                }}
              >
                Publish
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: -16,
                  borderRadius: 999,
                  border: `2px solid ${remotionTheme.accent}`,
                  transform: `scale(${ringScale})`,
                  opacity: ringOpacity,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 18,
                  top: -42,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: remotionTheme.ink,
                  opacity: cursorAppear,
                  transform: `translate(${cursorMove * -80}px, ${cursorMove * 40}px) scale(${
                    1 - cursorClick * 0.2
                  })`,
                  boxShadow: `0 6px 14px ${remotionTheme.shadow}`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 18,
                  top: -42,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: `2px solid ${remotionTheme.accent}`,
                  opacity: cursorClick,
                  transform: `translate(${cursorMove * -80}px, ${cursorMove * 40}px) scale(${
                    0.6 + cursorClick * 0.6
                  })`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
