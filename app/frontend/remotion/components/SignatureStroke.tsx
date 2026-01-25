import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type SignatureStrokeProps = {
  color: string;
  startFrame?: number;
  durationFrames?: number;
};

const PATH_LENGTH = 480;

export const SignatureStroke = ({
  color,
  startFrame = 0,
  durationFrames,
}: SignatureStrokeProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = durationFrames ?? Math.round(2.8 * fps);
  const dashOffset = interpolate(frame, [startFrame, startFrame + duration], [PATH_LENGTH, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [startFrame, startFrame + duration * 0.3], [0.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg viewBox="0 0 260 60" style={{width: '100%', height: '100%', color, opacity}} aria-hidden="true">
      <path
        d="M10 40C30 20 46 52 64 38C82 24 92 20 108 34C124 48 140 18 156 32C172 46 186 14 202 28C218 42 232 24 248 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={PATH_LENGTH}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};
