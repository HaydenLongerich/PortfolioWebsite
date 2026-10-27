# Portfolio deployment security review

Reviewed locally on October 26, 2026. No public deployment, DNS, Cloudflare account, or existing host was changed. This is a focused application/release review, not a penetration test or a guarantee of zero vulnerabilities.

## Changes

- Built a fresh allowlisted Cloudflare Pages release, removing stale exported files. Only that folder/ZIP is intended for upload. Source, dependency folders, old site versions, private resume PDF, local paths and source maps are excluded.
- Added Content-Security-Policy allowing only local scripts and background connections. No inline scripts or eval allowed. Dynamic inline CSS is retained for the photo globe and animation libraries; that is the deliberate style-only exception. No third-party frames, objects, base URLs or native form submissions allowed.
- Added frame protection, MIME sniffing prevention, no-referrer, same-origin resource/opener policy, restricted browser permissions and 30-day hostname-only HSTS. Removed Pages' default permissive CORS header via `_headers`.
- Kept contact entirely client-side, with the form disabled until the draft handler is attached. No accidental fallback GET exposes names/messages in query strings. No database, server-side message handling, captcha, account or secret is introduced.
- Added a real 404 page and made transitions understand Cloudflare clean URLs. The privacy page and its links were removed at the owner’s request.
- Reviewed project screenshots showing grades/timetables and an email address. The owner confirmed the academic data is demo data and explicitly requested keeping all project screenshots public. All project screenshots remain, with the subsequently requested email blurs. The two selected sunset photos are removed and both truck unit numbers are blurred, including responsive copies and downloadable images.
- Stripped EXIF/XMP/comment/text chunks from release image copies without re-encoding pixels. Original source images remain unchanged. Metadata stripping is not a substitute for reviewing visible image content.
- Added noreferrer to outbound HTML links and guarded predefined modal content lookup.

## Verification

- `python work/performance/test-release.py`: validates exact release/ZIP membership, file sizes, secret-pattern/private-path checks, security policy, linked resources, contact fallback, SVG and external CSS checks, metadata removal, unchanged image pixels, owner-confirmed screenshots and SHA-256 manifest.
- `node --test work/performance/test-contact.mjs work/performance/test-audio.mjs`: checks mail draft encoding/header safety and audio state/volume continuity.
- `npm audit --omit=dev` inside `work/photo-wall`: zero reported production dependency vulnerabilities at review time. This does not prove dependencies are vulnerability-free.
- Browser smoke checks run against the exact generated release with the real response headers enabled, not just the ordinary development server. The contact draft handler enabled correctly, About Me modal opened, all eight investing screenshots remained available, Tooling modal opened, the 17-photo globe and original-image lightbox worked, and the 3D car reported ready. No CSP warnings/errors were reported during these checks. Nine release-audit tests and ten contact/audio tests passed. Production response headers and Cloudflare account settings still need verification after deployment.

## Boundaries

All intended public images remain downloadable. Your public contact email can be scraped. There are no website-set tracking cookies or analytics scripts; temporary playback and transition settings use sessionStorage. Cloudflare itself processes visitor request data; account-level logs, cookies or script injection are outside local code verification. No Cloudflare credentials or dashboard configuration were accessed. The current live domain returned HTTP 403 to the audit request, so existing host/routing could not be identified externally. See DEPLOY-CLOUDFLARE.md for safe cutover steps and post-deployment header checks.

Keep the root/private source tree off hosting. Any future external service or form endpoint requires revisiting the security policy and privacy disclosures. Do not disable the entire CSP to add a resource.

## Git privacy note

The local repository had the private résumé PDF tracked. It has been removed from the current Git index without deleting the local document, and ignore rules now protect private documents and future generated outputs/dependencies. Existing Git history can still contain the résumé, older exports, or original image metadata. No history was rewritten, no commits were made, and no remote was pushed. Keep this repository private. If it has ever been public, treat the résumé as already exposed and review the remote/history separately before publishing that repository. The approved Cloudflare upload ZIP contains no Git history or private PDF. Existing tracked generated files are not retroactively removed by .gitignore.
