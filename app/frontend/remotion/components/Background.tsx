import {AbsoluteFill} from 'remotion';
import {remotionTheme} from '../lib/theme';

type BackgroundProps = {
  accent: string;
};

export const Background = ({accent}: BackgroundProps) => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(140deg, ${remotionTheme.background} 0%, ${remotionTheme.paperWarm} 55%, ${remotionTheme.background} 100%), radial-gradient(${remotionTheme.border} 0.6px, transparent 0.6px)`,
        backgroundSize: '100% 100%, 10px 10px',
        color: remotionTheme.ink,
        fontFamily: remotionTheme.fontSerif,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 80,
          width: 260,
          height: 260,
          borderRadius: '38%',
          background: `radial-gradient(circle at 30% 30%, ${accent}22, transparent 70%)`,
          border: `1px solid ${accent}33`,
          filter: 'blur(0.2px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 90,
          width: 300,
          height: 240,
          borderRadius: 48,
          background: `linear-gradient(135deg, ${accent}22, transparent 70%)`,
          border: `1px solid ${remotionTheme.border}`,
          transform: 'rotate(-6deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(rgba(15, 23, 42, 0.05) 0.6px, transparent 0.6px)',
          backgroundSize: '8px 8px',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
