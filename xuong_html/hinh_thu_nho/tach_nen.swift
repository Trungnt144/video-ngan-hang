// Tách người hoặc vật chính khỏi nền ảnh bằng Vision của macOS (không cần cài thêm gì), ra PNG nền trong suốt.
// Dùng khi hình thu nhỏ cần ghép người, vật từ một ảnh thật lên ảnh khác (trường "phu_anh" của kê khai).
//
//   swift tach_nen.swift <ảnh vào> <ảnh ra .png>
//
// Ảnh ra cùng cỡ ảnh vào, cắt sát khung bao quanh phần giữ lại. Cần macOS 14 trở lên.
import AppKit
import CoreImage
import Vision

let doi = CommandLine.arguments
guard doi.count == 3 else { print("Cần: swift tach_nen.swift <ảnh vào> <ảnh ra .png>"); exit(1) }
guard let goc = CIImage(contentsOf: URL(fileURLWithPath: doi[1])) else { print("Không đọc được \(doi[1])"); exit(1) }

let yeuCau = VNGenerateForegroundInstanceMaskRequest()
let xuLy = VNImageRequestHandler(ciImage: goc)
try xuLy.perform([yeuCau])
guard let kq = yeuCau.results?.first else { print("Không tìm thấy người hoặc vật chính"); exit(1) }
let mat = try kq.generateMaskedImage(ofInstances: kq.allInstances, from: xuLy, croppedToInstancesExtent: true)

let ci = CIImage(cvPixelBuffer: mat)
let ctx = CIContext()
guard let cg = ctx.createCGImage(ci, from: ci.extent) else { print("Không dựng được ảnh ra"); exit(1) }
let rep = NSBitmapImageRep(cgImage: cg)
try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: doi[2]))
print("\(doi[2]) · \(cg.width)×\(cg.height)")
