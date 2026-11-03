import { Composition } from "remotion";
import { Video } from "./Video";
import { FPS, TONG } from "./KichBan";

export const Root = () => (
  <>
    <Composition id="DienMatTroiMaiNha" component={Video} durationInFrames={TONG} fps={FPS} width={1920} height={1080} />
  </>
);
