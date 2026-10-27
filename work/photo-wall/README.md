# Real-photo globe

The Photos page uses React, Tailwind CSS and Framer Motion, bundled locally with no runtime CDN dependency. `src/PhotoWall.jsx` exports `PhotoGlobe`; `src/Lightbox.jsx` contains the native-dialog viewer; `src/wall-geometry.js` contains the sphere distribution and projection functions.

## Edit the collection

Change `PHOTO_ITEMS` at the top of `src/photos.js`. The list contains thirteen uploaded life photos plus four real SOON photos. App screenshots are deliberately excluded. `src/image-meta.json` supplies local URLs, dimensions, responsive srcsets and tiny placeholders. To use an external image, add an item without `file`, supplying `src`, `width`, `height`, `alt`, `title`, `collection`, and optionally `thumbnail`, `srcSet`, `placeholder`, `date`, and a stable `id`. Dates are omitted when unknown.

Original uploaded PNG files in `assets/life-photos` are byte-for-byte copies of the uploads, at 2880 x 2160 or 2160 x 2880. No generated details, retouching, fake sharpening or upscaling is applied. Responsive WebP previews use high-quality Lanczos resizing at quality 93; the lightbox loads the full-resolution original. Higher resolution cannot recreate information absent from the supplied photo.

## Interaction

Vertical scroll/drag spins around X; horizontal trackpad scrolling or dragging spins around Y. Both axes support full revolutions. Arrow keys rotate on their corresponding axes. Release adds gentle spring inertia. Scrolling never changes zoom. Zoom buttons and two-finger pinch support 50–250% magnification. Canvas arrow keys rotate and 0 resets. Browse all provides direct access to each image. The lightbox supports next/previous buttons, arrow keys and Escape, traps focus, and makes the background inert. Reduced motion uses immediate rotation rather than spring motion.

The globe uses Fibonacci sphere positions, perspective projection, depth ordering and a CSS 3D wireframe. Motion values update transforms without React rerendering every frame. Rendering settles at rest; there is no perpetual animation loop. The mobile version uses smaller photo frames so the globe fits the viewport. Physical-device pinch testing is recommended.

## Build and verify

In `work/photo-wall`, run `npm ci`, `node --test test.mjs`, then `npm run build`. This writes `photo-wall.js` and `photo-wall.css` to `work/apex/dist`.

From the workspace root, `python work/photo-wall/prepare-images.py` refreshes responsive variants from the retained local originals and updates metadata without overwriting an existing photo list. `python work/package-dark.py` updates the static export and ZIP.

Tests cover image membership, local assets, unique sphere positions, projection periodicity and front/back depth. Browser checks cover spinning without zoom, desktop/mobile layout, full-resolution loading and lightbox controls. Target performance is 60fps; it is not a guarantee across all devices.
