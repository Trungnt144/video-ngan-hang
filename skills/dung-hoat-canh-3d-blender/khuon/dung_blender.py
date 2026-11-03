# Cảnh thử D-11 lần 2: xe tự hành Mặt Trăng (LRV) trên nền phòng chụp, Blender Cycles.
# Mô hình: "NASA Lunar Rover for Blender" của OldSchool3D, hình khối CC0 (tai_san/mo_hinh_3d/lrv_oldschool3d/, ngoài git).
# Mở thẳng file .blend của mô hình rồi thay trời, đèn, máy quay, thêm sàn bắt bóng và hoạt cảnh:
#   bộ phận bay vào lắp thành xe -> bánh trước trái tách ra lộ động cơ -> hai bộ pin nhấc lên rồi hạ xuống
#   -> cận lốp lưới thép có độ sâu trường ảnh -> bánh lắp lại.
# Mốc lấy từ src/thoi_gian.json (tao_thoi_gian.py) nên viền và nhãn trong Remotion khớp lời đọc.
# Chạy (không mở giao diện, chặn mã Python nhúng trong file mô hình):
#   ~/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec <MO_HINH> -P canh3d/dung_blender.py -- \
#       [--luot mau|mat_na] [--ti-le 50] [--mau 24] [--thu-muc blender_nhap] [--khung 0,120] [--tu A --den B] [--luu]
#   mau   : ảnh màu Cycles, nền trong suốt, có nhòe chuyển động và độ sâu trường ảnh -> public/<thu_muc>/f_####.png
#   mat_na: ảnh Workbench màu phẳng: đỏ = bánh trước trái, lục = động cơ bánh, lam = hai bộ pin, vật khác đen
import bpy, json, math, os, sys, time
from mathutils import Vector

DIR = os.path.dirname(os.path.abspath(__file__))
DU_AN = os.path.dirname(DIR)
TG = json.load(open(os.path.join(DU_AN, "src", "thoi_gian.json")))
TONG, TU, FPS = TG["tong"], TG["tu"], TG["fps"]

ts = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
def doi(ten, mac=None):
    return ts[ts.index(ten) + 1] if ten in ts else mac
LUOT = doi("--luot", "mau")
THU_MUC = doi("--thu-muc", "blender_nhap")

def hex_tt(h):
    def kenh(c):
        c = int(c, 16) / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (kenh(h[1:3]), kenh(h[3:5]), kenh(h[5:7]), 1.0)
def muot(t):
    t = min(1, max(0, t)); return t * t * (3 - 2 * t)
def nhanh(t):  # tăng tốc rồi hãm gấp, kiểu lướt máy quay của video mẫu
    t = min(1, max(0, t)); return 16 * t ** 5 if t < 0.5 else 1 - (-2 * t + 2) ** 5 / 2
def ra_dan(t):  # bay tới rồi chậm dần khi vào chỗ
    t = min(1, max(0, t)); return 1 - (1 - t) ** 3

sc = bpy.context.scene
O = bpy.data.objects
# ---------- dọn đèn, máy quay của tác giả; trời xám phòng chụp ----------
for o in list(sc.objects):
    if o.type in ("LIGHT", "CAMERA"):
        bpy.data.objects.remove(o)
the_gioi = bpy.data.worlds.new("PhongChup")
sc.world = the_gioi
the_gioi.use_nodes = True
the_gioi.node_tree.nodes["Background"].inputs["Color"].default_value = hex_tt("#8a8f9e")
the_gioi.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.6

def den_vung(ten, vt, dich, nang, co, mau=(1, 1, 1)):
    d = bpy.data.lights.new(ten, "AREA"); d.energy = nang; d.size = co; d.color = mau
    o = bpy.data.objects.new(ten, d); sc.collection.objects.link(o)
    o.location = Vector(vt); o.rotation_mode = "QUATERNION"
    o.rotation_quaternion = (Vector(dich) - Vector(vt)).to_track_quat("-Z", "Y")
den_vung("DenChinh", (1.4, -1.8, 1.9), (0, -0.05, 0.2), 160, 1.6, (1.0, 0.97, 0.93))
den_vung("DenPhu", (-1.9, -0.9, 0.9), (0, 0, 0.2), 45, 1.4, (0.9, 0.94, 1.0))
den_vung("DenVien", (-0.6, 1.8, 1.4), (0, 0, 0.25), 90, 1.0)

SAN_Z = 0.02  # đáy bánh xe
bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, SAN_Z))
san = bpy.context.active_object; san.name = "San"; san.is_shadow_catcher = True

# ---------- nhóm bộ phận ----------
def nhom(ten_bo):
    c = bpy.data.collections.get(ten_bo)
    return list(c.all_objects) if c else []
BANH_TT = [O["Wheel - Front Left"], O["Dust Guard Front Left"], O["Dust Guard Front Left Inner"]]
PIN = [O["Solar Battery Bank 01"], O["Solar Battery Bank 02"], O["Solar Panel Large 01"], O["Solar Panel Large 02"],
       O["Solar Cover 01"], O["Solar Cover 02"], O["Battery Cable 1"], O["Battery Cable 2"]]
MAT_NA = {"banh": [O["Wheel - Front Left"]], "dong_co": [O["Drive Motors"]],
          "pin": [O["Solar Battery Bank 01"], O["Solar Battery Bank 02"]]}
MAU_NA = {"banh": (1, 0, 0, 1), "dong_co": (0, 1, 0, 1), "pin": (0, 0, 1, 1)}

# Lắp ráp mở đầu: (danh sách vật, hướng bay tới, khung bắt đầu); mỗi nhóm bay 22 khung rồi vào chỗ
LAP = [
    (nhom("Floor") + nhom("Suspension"), (0, 0, 0.0), 0),
    (nhom("Front Left"), (0.7, 0, 0.15), 6), (nhom("Front Right"), (-0.7, 0, 0.15), 9),
    (nhom("Rear Left"), (0.7, 0, 0.15), 12), (nhom("Rear Right"), (-0.7, 0, 0.15), 15),
    (nhom("Solar Panels - Main") + nhom("Electronics - Front"), (0, -0.6, 0.4), 20),
    (nhom("Chair - Left") + nhom("Chair - Right") + nhom("UnderSeat Box - Left") + nhom("UnderSeat Box - Right"), (0, 0, 0.7), 25),
    (nhom("Console"), (0, 0, 0.8), 30),
    (nhom("Front Camera") + nhom("Front Science Kit") + nhom("Large Antenna"), (0, -0.9, 0.6), 36),
    (nhom("Rear ToolSet") + nhom("Rock Samples") + nhom("Small ToolKit") + nhom("Tool Holder - Side"), (0, 0.9, 0.5), 42),
]
DAI_LAP = 22

# ---------- mốc hoạt cảnh (khung toàn cục) ----------
F_BAY1 = TU["apollo"] + 40          # lướt từ toàn cảnh tới bánh trước trái
F_TACH = TU["banh"]                 # bánh tách ra
F_PIN = TU["pin"] - 10              # hai bộ pin nhấc lên
F_PIN_VE = TU["lop"] - 14           # pin hạ về chỗ
F_BAY2 = TU["lop"] - 8              # lướt tới cận lốp
F_LAP = TU["vau"] + 20              # bánh lắp lại
TACH_X = 0.24                       # bánh dời ra ngoài theo trục X
PIN_Z = 0.13                        # pin nhấc lên

# máy quay: (khung, vị trí, điểm nhìn, ống kính mm, f-stop, kiểu nối tới mốc sau)
DICH_BANH = (0.272 + TACH_X, -0.29, 0.145)
MOC_MQ = [
    (0,              (2.05, -2.15, 1.15), (0.0, 0.03, 0.24), 45, 6.0, "em"),
    (F_BAY1,         (2.55, -0.65, 0.92), (0.0, 0.03, 0.24), 45, 6.0, "nhanh"),
    (F_BAY1 + 18,    (1.55, -1.55, 0.90), (0.24, -0.25, 0.19), 45, 4.5, "em"),
    (F_BAY2,         (1.35, -1.65, 0.82), (0.22, -0.25, 0.19), 45, 4.5, "nhanh"),
    (F_BAY2 + 16,    (1.42, -0.78, 0.34), DICH_BANH, 70, 2.4, "em"),
    (F_LAP - 6,      (1.32, -0.86, 0.32), DICH_BANH, 70, 2.4, "em"),
    (TONG - 1,       (1.85, -1.45, 0.72), (0.18, -0.20, 0.19), 50, 4.5, None),
]
def may_quay(f):
    for (f0, p0, d0, l0, s0, kieu), (f1, p1, d1, l1, s1, _) in zip(MOC_MQ, MOC_MQ[1:]):
        if f0 <= f <= f1:
            t = (f - f0) / (f1 - f0)
            s = nhanh(t) if kieu == "nhanh" else muot(t)
            return Vector(p0).lerp(Vector(p1), s), Vector(d0).lerp(Vector(d1), s), l0 + (l1 - l0) * s, s0 + (s1 - s0) * s
    m = MOC_MQ[-1]
    return Vector(m[1]), Vector(m[2]), m[3], m[4]

cam_data = bpy.data.cameras.new("MayQuay"); cam_data.sensor_width = 36
cam = bpy.data.objects.new("MayQuay", cam_data); sc.collection.objects.link(cam); sc.camera = cam
cam.rotation_mode = "QUATERNION"
diem_net = bpy.data.objects.new("DiemNet", None); sc.collection.objects.link(diem_net)
cam_data.dof.use_dof = True; cam_data.dof.focus_object = diem_net

def dat_khoa():
    """Khoá từng khung: máy quay, điểm nét, vị trí lệch của bộ phận (delta_location) để Cycles tính nhòe chuyển động."""
    q_truoc = None
    for f in range(TONG):
        p, d, lens, fs = may_quay(f)
        q = (d - p).to_track_quat("-Z", "Y")
        if q_truoc is not None and q.dot(q_truoc) < 0:
            q.negate()
        q_truoc = q
        cam.location = p; cam.rotation_quaternion = q; cam_data.lens = lens; cam_data.dof.aperture_fstop = fs
        diem_net.location = d
        cam.keyframe_insert("location", frame=f); cam.keyframe_insert("rotation_quaternion", frame=f)
        cam_data.keyframe_insert("lens", frame=f); cam_data.dof.keyframe_insert("aperture_fstop", frame=f)
        diem_net.keyframe_insert("location", frame=f)
    # lắp ráp
    for ds, huong, f0 in LAP:
        for f in range(0, f0 + DAI_LAP + 1):
            k = 1 - ra_dan((f - f0) / DAI_LAP)
            for o in ds:
                o.delta_location = Vector(huong) * k
                o.keyframe_insert("delta_location", frame=f)
    # bánh trước trái tách ra rồi lắp lại
    for f in range(F_TACH - 1, TONG):
        k = muot((f - F_TACH) / 20) - muot((f - F_LAP) / 24)
        for o in BANH_TT:
            o.delta_location = Vector((TACH_X * k, 0, 0)); o.keyframe_insert("delta_location", frame=f)
    # hai bộ pin nhấc lên rồi hạ xuống
    for f in range(F_PIN - 1, F_PIN_VE + 20):
        k = muot((f - F_PIN) / 16) - muot((f - F_PIN_VE) / 16)
        for o in PIN:
            o.delta_location = Vector((0, 0, PIN_Z * k)); o.keyframe_insert("delta_location", frame=f)
dat_khoa()

def thiet_lap_mau():
    sc.render.engine = "CYCLES"
    pr = bpy.context.preferences.addons["cycles"].preferences
    pr.compute_device_type = "METAL"; pr.get_devices()
    for dv in pr.devices:
        dv.use = True
    sc.cycles.device = "GPU"
    sc.cycles.samples = int(doi("--mau", 24))
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.use_denoising = True
    sc.render.film_transparent = True
    sc.render.use_motion_blur = True
    sc.render.motion_blur_shutter = 0.5
    sc.view_settings.view_transform = "AgX"
    if hasattr(sc.render.image_settings, "media_type"):
        sc.render.image_settings.media_type = "IMAGE"  # file mô hình để sẵn kiểu xuất EXR nhiều lớp
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    sc.render.image_settings.compression = 30

def thiet_lap_mat_na():
    sc.render.engine = "BLENDER_WORKBENCH"
    sc.display.shading.light = "FLAT"
    sc.display.shading.color_type = "OBJECT"
    sc.display.render_aa = "8"
    sc.render.film_transparent = False
    sc.render.use_motion_blur = False
    cam_data.dof.use_dof = False
    sc.world.color = (0, 0, 0)
    sc.view_settings.view_transform = "Standard"
    if hasattr(sc.render.image_settings, "media_type"):
        sc.render.image_settings.media_type = "IMAGE"  # file mô hình để sẵn kiểu xuất EXR nhiều lớp
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGB"
    san.hide_render = True
    for o in sc.objects:
        if o.type in ("MESH", "CURVE"):
            o.color = (0, 0, 0, 1)
    for ten, ds in MAT_NA.items():
        for o in ds:
            o.color = MAU_NA[ten]

sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
sc.render.resolution_percentage = int(doi("--ti-le", 50))
sc.render.fps = FPS
sc.frame_start, sc.frame_end = 0, TONG - 1
if "--luu" in ts:
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(DIR, "canh_thu_lrv.blend"), relative_remap=False)

if LUOT == "mat_na":
    thiet_lap_mat_na(); thu_muc = os.path.join(DU_AN, "public", THU_MUC + "_mat_na"); tien_to = "m_"
else:
    thiet_lap_mau(); thu_muc = os.path.join(DU_AN, "public", THU_MUC); tien_to = "f_"
os.makedirs(thu_muc, exist_ok=True)
ds_khung = [int(x) for x in doi("--khung").split(",")] if doi("--khung") else range(int(doi("--tu", 0)), int(doi("--den", TONG - 1)) + 1)
bat_dau = time.time()
for f in ds_khung:
    duong = os.path.join(thu_muc, f"{tien_to}{f:04d}.png")
    if os.path.exists(duong) and not doi("--khung"):
        continue
    sc.frame_set(f)
    t0 = time.time()
    sc.render.filepath = duong
    bpy.ops.render.render(write_still=True)
    print(f"khung {f}: {time.time() - t0:.2f} giây", flush=True)
print(f"XONG {LUOT} {len(list(ds_khung))} khung sau {time.time() - bat_dau:.1f} giây", flush=True)
