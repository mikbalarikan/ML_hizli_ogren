import {Composition} from 'remotion';
import {FPS, TOPLAM_KARE} from './zamanlama';
import {Video} from './Video';

export const Root: React.FC = () => (
  <Composition id="MLOzet" component={Video} durationInFrames={TOPLAM_KARE} fps={FPS} width={1920} height={1080} />
);
