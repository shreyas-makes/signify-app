import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {SignatureBadge} from '../components/SignatureBadge';
import {SignatureStroke} from '../components/SignatureStroke';
import {fadeIn, slideInY} from '../lib/animation';
import {remotionTheme} from '../lib/theme';

export const SceneProof = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeIn({frame, fps});
  const translateY = slideInY({frame, fps, distance: 18});
  const sealScale = spring({
    frame,
    fps,
    config: {
      damping: 180,
      mass: 0.7,
      stiffness: 140,
    },
  });

  return (
    <AbsoluteFill>
      <Background accent={remotionTheme.accentRose} />
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
            width: 900,
            padding: '36px 42px',
            borderRadius: 26,
            background: remotionTheme.paper,
            border: `1px solid ${remotionTheme.border}`,
            boxShadow: `0 24px 50px ${remotionTheme.shadow}`,
          }}
        >
          <div style={{fontSize: 34, lineHeight: 1.4, color: remotionTheme.ink}}>
            Readers see a proof-of-human signature attached to every published piece.
          </div>
          <div style={{marginTop: 24}}>
            <SignatureBadge label="Proof-of-human signature" accent={remotionTheme.accent} />
          </div>
          <div
            style={{
              marginTop: 24,
              borderRadius: 18,
              border: `1px solid ${remotionTheme.border}`,
              background: remotionTheme.background,
              padding: '14px 16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                textTransform: 'uppercase',
                fontSize: 11,
                letterSpacing: 2.4,
                color: remotionTheme.inkMuted,
              }}
            >
              <span>Signature</span>
              <span>Verified</span>
            </div>
            <div
              style={{
                marginTop: 10,
                borderRadius: 14,
                border: `1px solid ${remotionTheme.border}`,
                background: remotionTheme.paper,
                padding: '10px 12px',
              }}
            >
              <div style={{height: 36}}>
                <SignatureStroke color={`${remotionTheme.ink}B3`} startFrame={10} />
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 10,
                  fontFamily: remotionTheme.fontSans,
                  letterSpacing: 2.2,
                  textTransform: 'uppercase',
                  color: remotionTheme.inkMuted,
                }}
              >
                Human proof attached
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            border: `2px solid ${remotionTheme.accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: remotionTheme.fontSans,
            fontSize: 20,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: remotionTheme.accent,
            transform: `scale(${0.85 + sealScale * 0.15})`,
            boxShadow: `0 0 24px ${remotionTheme.accent}40`,
          }}
        >
          Signed
        </div>
      </div>
    </AbsoluteFill>
  );
};
