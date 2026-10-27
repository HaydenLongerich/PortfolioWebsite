# Hayden Longerich portfolio

Website source: `work/apex/dist`. React photo-wall source: `work/photo-wall`.

## Safe public deployment

Build with `python work/package-dark.py`. Upload **only** `outputs/cloudflare-pages.zip` or the contents of `outputs/cloudflare-pages` to Cloudflare Pages. Never upload this project root: it contains non-public original material and development files.

Follow [DEPLOY-CLOUDFLARE.md](DEPLOY-CLOUDFLARE.md) for domain setup and [SECURITY-REVIEW.md](SECURITY-REVIEW.md) for audit scope and limits.

## Preview the deployable site with security headers

```powershell
python work/package-dark.py
python work/preview-secure.py 8767
```

Open http://127.0.0.1:8767/ and leave PowerShell running. Ctrl+C stops the preview.
