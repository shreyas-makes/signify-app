import {interpolate, spring} from 'remotion';

type SlideInOptions = {
  frame: number;
  fps: number;
  delayFrames?: number;
  distance?: number;
};

export const frames = (seconds: number, fps: number) => Math.round(seconds * fps);

export const typewriterText = ({
  frame,
  fps,
  text,
  charsPerSecond,
  delaySeconds = 0,
}: {
  frame: number;
  fps: number;
  text: string;
  charsPerSecond: number;
  delaySeconds?: number;
}) => {
  const startFrame = frames(delaySeconds, fps);
  const visibleChars = Math.max(0, frame - startFrame) * (charsPerSecond / fps);
  return text.slice(0, Math.floor(visibleChars));
};

export const slideInY = ({frame, fps, delayFrames = 0, distance = 24}: SlideInOptions) => {
  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: {
      damping: 200,
      mass: 0.8,
      stiffness: 120,
    },
  });
  return (1 - progress) * distance;
};

export const fadeIn = ({frame, fps, delayFrames = 0}: SlideInOptions) =>
  interpolate(frame, [delayFrames, delayFrames + frames(0.4, fps)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
