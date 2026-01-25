import {useCurrentFrame, useVideoConfig} from 'remotion';
import {fadeIn, slideInY} from '../lib/animation';
import {remotionTheme} from '../lib/theme';

type SignatureBadgeProps = {
  label: string;
  accent: string;
};

export const SignatureBadge = ({label, accent}: SignatureBadgeProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeIn({frame, fps, delayFrames: 6});
  const translateY = slideInY({frame, fps, delayFrames: 6, distance: 16});

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 16px',
        borderRadius: 999,
        background: remotionTheme.paper,
        border: `1px solid ${accent}`,
        boxShadow: `0 18px 32px ${remotionTheme.shadow}`,
        fontFamily: remotionTheme.fontSans,
        fontSize: 20,
        letterSpacing: 0.4,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: accent,
          color: remotionTheme.paper,
          fontWeight: 700,
        }}
      >
        OK
      </span>
      <span style={{color: remotionTheme.ink}}>{label}</span>
    </div>
  );
};
