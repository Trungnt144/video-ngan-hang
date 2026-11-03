"""Ghép các ảnh kiểm, giữ tên từng ảnh; xem từng ô rồi mở ảnh gốc khi nghi lỗi."""
from pathlib import Path
from PIL import Image, ImageDraw
import sys
D=Path(sys.argv[1]); files=sorted(D.glob('n302_*.png'))
for k in range(0,len(files),9):
 group=files[k:k+9]; out=Image.new('RGB',(1560,3*318),'#ffffff');d=ImageDraw.Draw(out)
 for j,p in enumerate(group):
  im=Image.open(p).convert('RGB');im.thumbnail((516,290));x=(j%3)*520;y=(j//3)*318
  out.paste(im,(x,y));d.text((x+5,y+294),p.name,fill='black')
 dest=D/f'luoi_{k//9+1:02d}.jpg';out.save(dest,quality=94);print(dest)
