import {loadFont as loadSpectral} from '@remotion/google-fonts/Spectral';
import {loadFont as loadSourceSans3} from '@remotion/google-fonts/SourceSans3';
import {Composition, Folder} from 'remotion';
import {ProductVideo} from './ProductVideo';

loadSourceSans3();
loadSpectral();

export const RemotionRoot = () => {
  return (
    <Folder name="Marketing">
      <Composition
        id="ProductVideo"
        component={ProductVideo}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </Folder>
  );
};
