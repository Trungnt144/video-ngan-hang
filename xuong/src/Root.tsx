import "./index.css";
import { Composition } from "remotion";
import { MyComponent } from "./Composition";
import { BanDoMau } from "./ban-do/BanDoMau";
import { BanDoVeTinh } from "./ban-do/BanDoVeTinh";
import { VideoNgan } from "./video-ngan/VideoNgan";
import { KHUNG } from "./video-ngan/bo_mau";
import type { DuLieuVideo } from "./video-ngan/kieu_du_lieu";
import duLieu from "../public/du_lieu_video.json";

/**
 * Cảnh của xưởng.
 *
 * `VideoNgan` là cảnh chính của giai đoạn 1. Thời lượng và nội dung lấy từ
 * `public/du_lieu_video.json`, sinh bằng `scripts/chuan_bi_video.mjs` —
 * xem `01_quy_trinh_chung.md` và `09_video_doc_ngan.md` mục 5.
 *
 * `TestDoc` là cảnh trắng mặc định của Remotion, giữ lại để thử render nhanh
 * khi nghi ngờ trục trặc môi trường chứ không phải trục trặc mã dựng.
 */
export const RemotionRoot: React.FC = () => {
  const dl = duLieu as unknown as DuLieuVideo;

  return (
    <>
      <Composition
        id="VideoNgan"
        component={VideoNgan}
        durationInFrames={Math.ceil(dl.thoi_luong_giay * KHUNG.fps) + KHUNG.fps}
        fps={KHUNG.fps}
        width={KHUNG.rong}
        height={KHUNG.cao}
        defaultProps={{ duLieu: dl }}
      />

      <Composition id="BanDoMau" component={BanDoMau} durationInFrames={240} fps={30} width={1920} height={1080} />

      <Composition id="BanDoVeTinh" component={BanDoVeTinh} durationInFrames={240} fps={30} width={1920} height={1080} />

      <Composition id="TestDoc" component={MyComponent} durationInFrames={120} fps={30} width={1080} height={1920} />
    </>
  );
};
