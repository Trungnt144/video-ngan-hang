// Đọc chữ và đếm mặt người trên các hình thu nhỏ bằng Vision của macOS (không cần cài thêm gì).
//
//   swift doc_hinh.swift <ảnh 1> [<ảnh 2> ...]     in mỗi ảnh một dòng JSON
//
// Mỗi dòng: tep, chu (các dòng chữ đọc được, tiếng Việt và tiếng Anh), dien_tich_chu (tỉ lệ diện tích khung chữ
// trên cả hình), mat (số mặt người), mat_lon (tỉ lệ diện tích mặt lớn nhất).
import Foundation
import Vision

for tep in CommandLine.arguments.dropFirst() {
  let url = URL(fileURLWithPath: tep)
  let chu = VNRecognizeTextRequest()
  chu.recognitionLevel = .accurate
  chu.recognitionLanguages = ["vi-VT", "en-US"]
  chu.usesLanguageCorrection = true
  let mat = VNDetectFaceRectanglesRequest()
  var kq: [String: Any] = ["tep": tep]
  do {
    try VNImageRequestHandler(url: url).perform([chu, mat])
    let dong = (chu.results ?? []).filter { $0.confidence > 0.3 }
    kq["chu"] = dong.compactMap { $0.topCandidates(1).first?.string }
    kq["dien_tich_chu"] = dong.reduce(0.0) { $0 + Double($1.boundingBox.width * $1.boundingBox.height) }
    let m = mat.results ?? []
    kq["mat"] = m.count
    kq["mat_lon"] = m.map { Double($0.boundingBox.width * $0.boundingBox.height) }.max() ?? 0
  } catch { kq["loi"] = "\(error)" }
  let d = try! JSONSerialization.data(withJSONObject: kq)
  print(String(data: d, encoding: .utf8)!)
}
