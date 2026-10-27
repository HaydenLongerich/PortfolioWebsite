"""Remove descriptive image metadata without re-encoding image pixels."""
import struct

def strip_image_metadata(data, suffix):
    suffix=suffix.lower()
    if suffix=='.png' and data.startswith(b'\x89PNG\r\n\x1a\n'):
        out=bytearray(data[:8]);pos=8
        keep={b'IHDR',b'PLTE',b'IDAT',b'IEND',b'tRNS',b'gAMA',b'cHRM',b'sRGB',b'iCCP',b'pHYs',b'acTL',b'fcTL',b'fdAT'}
        while pos<len(data):
            size=struct.unpack('>I',data[pos:pos+4])[0];kind=data[pos+4:pos+8];end=pos+12+size
            if end>len(data):raise ValueError('Invalid PNG chunk')
            if kind in keep:out.extend(data[pos:end])
            pos=end
        return bytes(out)
    if suffix in ('.jpg','.jpeg') and data[:2]==b'\xff\xd8':
        out=bytearray(data[:2]);pos=2
        while pos<len(data):
            start=pos
            if data[pos]!=255:raise ValueError('Invalid JPEG marker')
            while data[pos]==255:pos+=1
            marker=data[pos];pos+=1
            if marker in (0xDA,0xD9):out.extend(data[start:]);break
            if marker in range(0xD0,0xD9) or marker==1:out.extend(data[start:pos]);continue
            size=int.from_bytes(data[pos:pos+2],'big');end=pos+size
            if end>len(data) or size<2:raise ValueError('Invalid JPEG segment')
            # EXIF/XMP, Photoshop/IPTC and comments contain descriptive metadata.
            if marker not in (0xE1,0xED,0xFE):out.extend(data[start:end])
            pos=end
        return bytes(out)
    if suffix=='.webp' and data[:4]==b'RIFF' and data[8:12]==b'WEBP':
        out=bytearray(b'WEBP');pos=12
        while pos<len(data):
            kind=data[pos:pos+4];size=int.from_bytes(data[pos+4:pos+8],'little');end=pos+8+size+(size%2)
            if end>len(data):raise ValueError('Invalid WebP chunk')
            if kind not in (b'EXIF',b'XMP '):
                chunk=bytearray(data[pos:end])
                if kind==b'VP8X':chunk[8]&=~0x0c
                out.extend(chunk)
            pos=end
        return b'RIFF'+len(out).to_bytes(4,'little')+bytes(out)
    return data
