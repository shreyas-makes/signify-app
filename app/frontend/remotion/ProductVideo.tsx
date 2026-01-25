import {AbsoluteFill, Series} from 'remotion';
import {SceneDraft} from './scenes/SceneDraft';
import {SceneProof} from './scenes/SceneProof';
import {ScenePublish} from './scenes/ScenePublish';

const SCENES = {
  draft: 140,
  publish: 90,
  proof: 60,
};

export const ProductVideo = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={SCENES.draft} premountFor={20}>
          <SceneDraft />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.publish} premountFor={20}>
          <ScenePublish />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.proof} premountFor={20}>
          <SceneProof />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
