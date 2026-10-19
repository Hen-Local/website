# 很 Local 网站

Marketing website for [很 Local 实时翻译](https://github.com/Hen-Local/Hen-Local-Translator), an offline live translation app for macOS and the first product in the 很 Local product family.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The production Worker and static assets are written to `dist/server` and
`dist/client`.

## Cloudflare deployment

```bash
npx wrangler login
npm run deploy
```

The Cloudflare Worker serves the website and the `/api/inquiry` email endpoint.
The email destination is stored in encrypted Cloudflare Worker secrets and is
not exposed to the browser.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for domain, email, GitHub Actions, and
custom-domain setup.
