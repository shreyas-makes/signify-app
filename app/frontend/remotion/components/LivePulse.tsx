import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type LivePulseProps = {
  color: string;
};

export const LivePulse = ({color}: LivePulseProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const period = Math.round(1.2 * fps);
  const local = frame % period;
  const scale = interpolate(local, [0, period], [1, 2.2], {
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(local, [0, period * 0.6, period], [0.7, 0, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: 10,
        height: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color,
          transform: `scale(${scale})`,
          opacity,
        }}
      />
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}88`,
        }}
      />
    </span>
  );
};
