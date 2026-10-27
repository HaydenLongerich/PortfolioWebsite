# Deploy longerich.ca using Cloudflare Pages

Prepared October 26, 2026. The domain and Cloudflare account have NOT been changed.

## Upload exactly this release

`C:\Users\kooga\Downloads\PortfolioWebsite\outputs\cloudflare-pages.zip`

Or upload the contents of `outputs/cloudflare-pages`. The archive has `index.html` and `_headers` at its root. Do not upload the project root, `work`, the old `apex-garage` export, `.git`, or private documents. The source tree intentionally retains originals that are not public.

## 1. Find what serves the under-development page

Sign in at https://dash.cloudflare.com/ and select the account holding longerich.ca.

- Open Workers & Pages. If the existing site is a Pages project whose Custom domains includes longerich.ca, use that project and create a new production deployment. Preserve the previous production deployment so you can roll back.
- If it is a Worker, or the page is hosted elsewhere, create a new Pages project first. Do not remove the existing site, DNS records, Worker routes or redirects yet.
- Under the longerich.ca domain, review DNS Records and Rules > Redirect Rules (and legacy Page Rules, if used). Record the current root (@) and www website records and any Worker custom domains/routes. Do not change MX or email-related TXT records. Export your DNS records or take a screenshot before cutover.

I could not identify the existing host from the public URL: it returned HTTP 403 to the audit request. A 403 does not prove the host is broken or unsafe.

## 2. Deploy the new site on a Pages URL first

In Workers & Pages, choose Create application, the Pages option, and Drag and drop your files / Upload assets. Dashboard wording may vary. Select a project name such as `longerich-portfolio` and upload `outputs/cloudflare-pages.zip`. Select Deploy site.

If an existing Direct Upload Pages project already owns your domain, choose that project's Create a new deployment instead. If your existing Pages project is connected to Git, keep that workflow: update its source and configure the build command as `python work/package-dark.py` and output directory as `outputs/cloudflare-pages`, or use a separate Direct Upload project. Do not blindly replace unrelated repository contents.

The current release is below the dashboard's 1,000-file and 25 MiB-per-file limits. A Direct Upload project cannot later be changed into a Git-integrated project; a new project would be needed for that change.

Wait for the provided `https://<project>.pages.dev` deployment to succeed. Before changing your domain, test Home, Experience, Projects, Tooling, Photos and Contact. Check the car, photo globe, image lightboxes, audio controls and contact fields. Do not send a test message containing personal information.

In browser developer tools, inspect the main document's response headers. Confirm `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: no-referrer`. `_headers` is a Cloudflare configuration file, not a public web page. It applies to Pages static responses; it does not automatically protect a Worker or Pages Function.

## 3. Attach longerich.ca

Once the Pages URL works, select the Pages project > Custom domains > Set up a domain > enter `longerich.ca` > Continue. Follow Cloudflare's DNS confirmation. The apex domain must be a zone in the same Cloudflare account and use Cloudflare nameservers. Do not change nameservers if it is already correctly configured.

If there is a conflict with your under-development site, the exact action depends on the existing host:

- Existing Pages project: detach the domain from that project only at the cutover point, or deploy into the existing project instead.
- Worker custom domain or Worker route: remove only the binding/route serving this website hostname after recording it. Keep the Worker itself for rollback. A matching old Worker route can override the new Pages site.
- Another web host: replace only the website @/www records as directed by Pages. Preserve all mail, verification and unrelated subdomain records.
- A redirect rule sending visitors to the under-development page must be updated or disabled for this hostname when cutting over.

Add `www.longerich.ca` through Pages Custom domains as well if you want it supported. Then optionally create a Redirect Rule for hostname exactly `www.longerich.ca` to `https://longerich.ca` while preserving the path/query string. Check for loops. Do not invent the Pages CNAME target; use the one Cloudflare provides. Adding a DNS CNAME alone without attaching the custom domain in Pages is insufficient.

Wait until the domain and HTTPS certificate are Active, then test `https://longerich.ca` and every section again. If you move hosting, keep the original DNS values and old host available until this is verified.

## 4. Account, transport and privacy settings

- Use a passkey or two-factor authentication on Cloudflare and your registrar. Keep recovery codes private. Never commit API tokens or put them in frontend JavaScript.
- For the longerich.ca zone, enable SSL/TLS > Edge Certificates > Always Use HTTPS after the HTTPS site works. Keep Universal SSL enabled. Use at least TLS 1.2 if that option is available. Do not use Flexible mode for an external origin.
- The supplied HSTS policy is 30 days for this hostname only. It deliberately omits `includeSubDomains` and `preload` so unrelated subdomains are not forced into a long-lived policy.
- Leave Cloudflare Web Analytics injection, Browser Insights, Zaraz and other injected scripts disabled unless you intentionally decide to collect that data and review the privacy disclosures. The supplied CSP currently blocks third-party scripts and connections.
- Keep the site static. There are no Functions, server-side form handlers, logins, secrets or databases to configure. You do not need an API token, email password or form-service key for this release.
- Cloudflare still processes technical requests (including visitors' IP addresses) to host and protect the site. The site cannot guarantee provider-level log deletion or retention settings. Review the account settings yourself.
- Preview URLs are not private simply because they are unlisted or noindexed. Never put private drafts or originals into a Pages deployment. Use Cloudflare Access for genuinely private previews if needed.

## 5. Verify production

From PowerShell:

```powershell
curl.exe -I https://longerich.ca/
curl.exe -I https://longerich.ca/photos
curl.exe -I https://longerich.ca/this-page-does-not-exist
curl.exe -I https://longerich.ca/private/resume.pdf
```

Expect successful pages over HTTPS with the security headers. The last two paths should return 404. A 200 home page for arbitrary missing files indicates a fallback or rewrite that needs review. Check browser Console for CSP errors. No security policy should be weakened just to silence an error without understanding the blocked resource.

This project includes a real `404.html`, so Pages should not treat every unknown path as a single-page app route. Clean routes such as `/work` are supported by Pages.

## Future updates and local testing

Run commands from the project folder:

```powershell
cd "C:\Users\kooga\Downloads\PortfolioWebsite"
python work/package-dark.py
python work/performance/test-release.py
node --test work/performance/test-contact.mjs work/performance/test-audio.mjs
python work/preview-secure.py 8767
```

Open http://127.0.0.1:8767/. The secure preview serves the exact release and applies the same security headers. Keep PowerShell open; Ctrl+C stops it. The test suite needs Pillow; it is already available in the current Python environment. The deployment itself needs no Python or Node runtime.

If editing the React photo wall, rebuild it first with `npm ci` then `npm run build` inside `work/photo-wall`, then rebuild the release. Run `npm audit --omit=dev` after dependency changes. Do not run an unattended major-version dependency upgrade.

Each release build recreates only the exact generated `outputs/cloudflare-pages` and `outputs/hayden-portfolio-dark` folders. It does not publish source, private originals, maps, build tools or old exports. It strips EXIF/XMP/text metadata from image copies without recompressing their image pixels. `outputs/release-manifest.json` contains hashes for verification and is not uploaded.

Upload the new ZIP using Pages > Create a new deployment. If the update fails, use Deployments > the previous successful production deployment > Rollback to this deployment. A preview deployment is not a production rollback target. If you moved from another host, restoring its recorded DNS/routing is a separate rollback and may need propagation time.

## Public content review

The portfolio deliberately publishes your name, work history, university, contact email and selected photos. Browser-visible content can be downloaded; CSP and robots.txt cannot make it private. Before publishing, confirm you are comfortable with faces, places, vehicle plates, company information, and project screenshots being public. Obtain any needed permission from other people. The owner confirmed that the academic information is demo data and explicitly approved keeping all project screenshots public, with the email address now blurred in every affected image. The two subsequently selected sunset photos are removed and the truck unit numbers are blurred. All responsive copies use the same redacted content. Confirm you have permission to distribute the music and other third-party assets; technical checks cannot establish those rights.

## Official references

- Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Security headers: https://developers.cloudflare.com/pages/configuration/headers/
- Rollbacks: https://developers.cloudflare.com/pages/configuration/rollbacks/
- HTTPS: https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/

## Git privacy note

The local repository had the private résumé PDF tracked. It has been removed from the current Git index without deleting the local document, and ignore rules now protect private documents and future generated outputs/dependencies. Existing Git history can still contain the résumé, older exports, or original image metadata. No history was rewritten, no commits were made, and no remote was pushed. Keep this repository private. If it has ever been public, treat the résumé as already exposed and review the remote/history separately before publishing that repository. The approved Cloudflare upload ZIP contains no Git history or private PDF. Existing tracked generated files are not retroactively removed by .gitignore.
