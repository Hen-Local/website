# 很 Local 网站

Marketing website for [很 Local 实时翻译](https://github.com/Hen-Local/Hen-Local-Translator), an offline live translation app for macOS.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

The inquiry form uses the existing VPS service at
`https://forms.pitun.cc/api/inquiries`. To override the endpoint for local
development, copy `.env.example` to `.env.local` and restart the dev server.
This endpoint is public configuration, not a credential.

## Build and validation

```bash
npm run lint
npm test
```

`npm test` builds the site and checks the exported pages and inquiry payload.
The static site is written to `dist/client`.

## Deployment

Push `main` to [Hen-Local/website](https://github.com/Hen-Local/website).
GitHub Actions builds and publishes `dist/client` to GitHub Pages at
[henlocal.com](https://henlocal.com/).

Inquiries are submitted as JSON directly to the existing
[VPS inquiry service](https://github.com/Hen-Local/contact-inquiry-service)
and stored in its database. The website does not need Cloudflare deployment
tokens, an email Worker, or administrator/database credentials.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the Pages workflow and form contract.
