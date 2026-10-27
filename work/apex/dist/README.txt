HAYDEN LONGERICH / REAL-TIME 3D PORTFOLIO
Serve this directory using any static website host.
Local preview: python -m http.server 8765 --bind 127.0.0.1
Open http://127.0.0.1:8765/

Real Three.js LEGO McLaren: 296,654 triangles in 33 material/layer meshes,
reduced from 4,500,159 visible triangles. Small details are simplified.
Model payload: approximately 2.8 MB gzip. Model loads near the viewport.
Damped drag and release inertia; vertical mouse drag or up/down keys tilt.
Horizontal touch drag rotates; vertical touch scroll remains native.
Full chassis, Exterior, reveal lock, rotation slider and Reset are available.

Adaptive pixel ratio 0.65-1.25 and a one-million-pixel framebuffer budget.
One analytic screen-space reveal; no raycasting, shadow maps, environment
convolution or postprocessing. Shader compilation runs before reveal.
The render loop stops at rest and when hidden/offscreen. Runtime frame time,
triangle count and draw calls are exposed on #carViewport data attributes.
60 FPS is the target, not a verified guarantee on every GPU.

Original model: Jens Bruehl / jb70, CC BY 4.0. Attribution and LDraw credits
are linked in the footer and assets/LDRAW-CREDITS.txt. Three.js license is
in assets/THREE-LICENSE.txt. Separate Work, About, Tools and Contact pages.
