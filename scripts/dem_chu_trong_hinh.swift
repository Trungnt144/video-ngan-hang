// Đọc chữ trong ảnh bằng Vision của macOS, in mỗi ảnh một dòng JSON kèm vị trí từng dòng chữ.
// Dùng bởi scripts/dem_chu_trong_hinh.py (quy tắc ít chữ của tai_san/so_tay_gu/mau_kich_ban.json).
//
//   swift dem_chu_trong_hinh.swift <ảnh 1> [<ảnh 2> ...]
//
// Mỗi dòng: tep, dong [{chu, y_tren, y_duoi}] — y tính từ mép trên, theo tỉ lệ 0–1 của chiều cao ảnh.
import Foundation
import Vision

for tep in CommandLine.arguments.dropFirst() {
  let yeuCau = VNRecognizeTextRequest()
  yeuCau.recognitionLevel = .accurate
  yeuCau.recognitionLanguages = ["vi-VN", "en-US"]
  yeuCau.usesLanguageCorrection = false
  var kq: [String: Any] = ["tep": tep]
  do {
    try VNImageRequestHandler(url: URL(fileURLWithPath: tep)).perform([yeuCau])
    kq["dong"] = (yeuCau.results ?? []).filter { $0.confidence > 0.3 }.compactMap { r -> [String: Any]? in
      guard let chu = r.topCandidates(1).first?.string else { return nil }
      let b = r.boundingBox
      return ["chu": chu, "y_tren": Double(1 - b.maxY), "y_duoi": Double(1 - b.minY)]
    }
  } catch { kq["loi"] = "\(error)" }
  print(String(data: try! JSONSerialization.data(withJSONObject: kq), encoding: .utf8)!)
}
