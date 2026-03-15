import struct, zlib, math

def create_icon(size, fname):
    img = [[[124,58,237,255]]*size for _ in range(size)]
    cx, cy = size//2, size//2
    r = size//2 - int(4*size/192)
    s = size/192

    def clamp(v): return max(0, min(255, int(v)))
    def blend(base, over, a):
        return [clamp(base[i]*(1-a)+over[i]*a) for i in range(3)] + [255]
    def fill_circle(x0, y0, rad, color):
        for y in range(max(0,int(y0-rad-2)), min(size,int(y0+rad+2))):
            for x in range(max(0,int(x0-rad-2)), min(size,int(x0+rad+2))):
                dist = math.sqrt((x-x0)**2+(y-y0)**2)
                if dist <= rad:
                    a = min(1.0, rad-dist+1)
                    img[y][x] = blend(img[y][x][:3], color, a)

    # Gradient bg
    for y in range(size):
        for x in range(size):
            dx, dy = x-cx, y-cy
            dist = math.sqrt(dx*dx+dy*dy)
            if dist > r:
                img[y][x] = [0,0,0,0]
            else:
                t = dist/r
                c = [clamp(124*(1-t*0.7)+30*t*0.7), clamp(58*(1-t*0.7)+10*t*0.7), clamp(237*(1-t*0.7)+80*t*0.7)]
                img[y][x] = c + [255]

    w = [255,255,255]
    fill_circle(cx, cy+s*10, s*32, w)
    fill_circle(cx-s*30, cy-s*18, s*16, w)
    fill_circle(cx-s*12, cy-s*38, s*16, w)
    fill_circle(cx+s*12, cy-s*38, s*16, w)
    fill_circle(cx+s*30, cy-s*18, s*16, w)

    def write_chunk(t, d):
        c = t+d
        return struct.pack('>I',len(d))+c+struct.pack('>I',zlib.crc32(c)&0xffffffff)
    raw = b''
    for row in img:
        raw += b'\x00'
        for px in row:
            raw += bytes(px)
    png = b'\x89PNG\r\n\x1a\n'
    png += write_chunk(b'IHDR', struct.pack('>IIBBBBB',size,size,8,6,0,0,0))
    png += write_chunk(b'IDAT', zlib.compress(raw))
    png += write_chunk(b'IEND', b'')
    with open(fname,'wb') as f: f.write(png)
    print(f'Created {fname}')

create_icon(192, '/Users/wangjunfeng/Dropbox/wordgame/wordgame-cc/icon-192.png')
create_icon(512, '/Users/wangjunfeng/Dropbox/wordgame/wordgame-cc/icon-512.png')
