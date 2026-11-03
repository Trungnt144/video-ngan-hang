import { Composition } from "remotion";
import { V1BayVung, V1VungS2, V3BayXuong } from "./MauBanDo";

// Độ dài cảnh truyền bằng --props='{"giay":12.5}' (khớp độ dài giọng chương 1).
const kich = { fps: 30, width: 1920, height: 1080, durationInFrames: 300, defaultProps: { giay: 10 } } as const;
const theoGiay = ({ props }: { props: { giay: number } }) => ({ durationInFrames: Math.round(props.giay * 30) });

export const MauRoot: React.FC = () => (
  <>
    <Composition id="V1BayVung" component={V1BayVung} {...kich} calculateMetadata={theoGiay} />
    <Composition id="V1VungS2" component={V1VungS2} {...kich} calculateMetadata={theoGiay} />
    <Composition id="V3BayXuong" component={V3BayXuong} {...kich} calculateMetadata={theoGiay} />
  </>
);
