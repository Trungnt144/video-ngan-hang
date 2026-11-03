import { Composition } from "remotion";
import { KcnBayXuong, KcnKetNoi, KcnRanhGioi, KcnSoSanh, KcnVung } from "./KcnBanDo";

const kich = { durationInFrames: 300, fps: 30, width: 1920, height: 1080 } as const;

export const KcnRoot: React.FC = () => (
  <>
    <Composition id="KcnKetNoi" component={KcnKetNoi} {...kich} />
    <Composition id="KcnBayXuong" component={KcnBayXuong} {...kich} />
    <Composition id="KcnBayXuong60" component={KcnBayXuong} durationInFrames={600} fps={60} width={1920} height={1080} />
    <Composition id="KcnBayXuongVeTinh" component={KcnBayXuong} defaultProps={{ nen: "ve_tinh" as const }} {...kich} />
    <Composition id="KcnRanhGioi" component={KcnRanhGioi} defaultProps={{ nen: "liberty" as const }} {...kich} />
    <Composition id="KcnRanhGioiVeTinh" component={KcnRanhGioi} {...kich} />
    <Composition id="KcnSoSanh" component={KcnSoSanh} {...kich} />
    <Composition id="KcnVungS2" component={KcnVung} {...kich} />
    <Composition id="KcnVungVector" component={KcnVung} defaultProps={{ nen: "liberty" as const }} {...kich} />
  </>
);
