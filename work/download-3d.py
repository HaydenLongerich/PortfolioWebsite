import urllib.request,pathlib,concurrent.futures
base=pathlib.Path('work/apex/dist/assets');base.mkdir(exist_ok=True)
urls={
 'three.module.js':'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js',
 'three.core.js':'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.core.js',
 'GLTFLoader.js':'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js',
 'DRACOLoader.js':'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/DRACOLoader.js',
 'BufferGeometryUtils.js':'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/utils/BufferGeometryUtils.js',
 'RoomEnvironment.js':'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/environments/RoomEnvironment.js',
 'ferrari.glb':'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ferrari.glb',
 'draco_wasm_wrapper.js':'https://www.gstatic.com/draco/versioned/decoders/1.5.7/draco_wasm_wrapper.js',
 'draco_decoder.wasm':'https://www.gstatic.com/draco/versioned/decoders/1.5.7/draco_decoder.wasm',
 'car-reference.html':'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/webgl_materials_car.html'}
def get(item):
 name,url=item;urllib.request.urlretrieve(url,base/name);return name
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: print(list(pool.map(get,urls.items())))
p=base/'GLTFLoader.js';p.write_text(p.read_text().replace('../utils/BufferGeometryUtils.js','./BufferGeometryUtils.js'))
