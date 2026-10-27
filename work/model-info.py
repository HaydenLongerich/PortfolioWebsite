import struct,json
b=open('work/apex/dist/assets/ferrari.glb','rb').read();n=struct.unpack_from('<I',b,12)[0];g=json.loads(b[20:20+n]);nodes=g['nodes']
def walk(i,depth=0):
 v=nodes[i];print(' '*depth,i,v.get('name'), 'mesh',v.get('mesh'), 'pos',v.get('translation'))
 for child in v.get('children',[]):walk(child,depth+2)
for s in g['scenes']:
 for n in s['nodes']:walk(n)
