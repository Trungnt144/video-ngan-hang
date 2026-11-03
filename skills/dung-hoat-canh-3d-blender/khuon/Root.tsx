import { Composition } from "remotion";
import { FPS, TONG, Video } from "./Video";

export const Root = () => (
  <Composition id="CanhThuD11LRV" component={Video} durationInFrames={TONG} fps={FPS} width={1920} height={1080} />
);
