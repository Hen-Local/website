# Publish henlocal.com with GitHub Pages

## Hosting

- Repository: [Hen-Local/website](https://github.com/Hen-Local/website)
- Website: [henlocal.com](https://henlocal.com/)
- Static host: GitHub Pages, using the GitHub Actions source
- Inquiry API and admin console: the existing VPS service at
  [forms.pitun.cc](https://forms.pitun.cc/)

The Cloudflare Vite plugin and `worker/index.ts` are part of the vinext build
and preview scaffold. Production publishes only the exported `dist/client`
directory to Pages; it does not deploy a Cloudflare Worker.

## Automatic deployment

`.github/workflows/deploy-pages.yml` runs on pushes to `main` and manual
workflow dispatches. It installs Node.js 22 dependencies, runs lint and tests,
builds the static site, and deploys the Pages artifact.

The repository's **Settings → Pages → Build and deployment** must use
**GitHub Actions**. The configured custom domain is `henlocal.com`.
`public/CNAME` and `public/.nojekyll` are copied into the exported site.

No Cloudflare API token or account ID is required. Existing DNS and the custom
domain can remain in place when publishing updates.

## Inquiry form configuration

Under **Settings → Secrets and variables → Actions → Variables**, the public
repository variable is:

```text
CONTACT_FORM_ENDPOINT=https://forms.pitun.cc/api/inquiries
```

The workflow passes it to the build as `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT`.
The form defaults to this same public URL if the variable is absent or empty.
For local development, copy `.env.example` to `.env.local`, change the endpoint
if needed, and restart the dev server.

The API accepts `POST` requests with `Content-Type: application/json`.
The form has four content fields: name, email, organization, and a requirements
description. Optional prompts in the description cover event details, size,
languages, the Mac, microphone, and caption displays.

`app/contact/inquiry.ts` adapts these fields to the existing Rust API:

- Name, email, organization, and the full description are preserved.
- Required legacy `event`, `meeting_scale`, and `language_directions` fields
  point to the description and say that missing details need confirmation.
  They do not infer or invent answers.
- `consent` is a JSON boolean, `locale` is `zh` or `en`, and `_gotcha` retains
  the honeypot value.
- The description is checked against the API's 5,000-byte UTF-8 limit.

The VPS persists inquiries for its existing admin console. Administrator and
database credentials remain on the VPS and must not be added to the website.
The service's allowed origins must include `https://henlocal.com` and any
additional origins used for submission. Local frontend tests should intercept
the API request or use a local test API.

## Validation

```bash
npm run lint
npm test
curl https://forms.pitun.cc/healthz
```

The health endpoint should return `{"ok":true}`. Test form behavior with mocked
API responses so validation does not create fake production inquiries.
After pushing, confirm the **Deploy website to GitHub Pages** workflow succeeds
and verify the published contact page.
