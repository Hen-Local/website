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

The static website is written to `dist/client` and is ready for GitHub Pages. The workflow in `.github/workflows/deploy-pages.yml` deploys every push to `main`.

The custom domain is declared in `public/CNAME` as `henlocal.com`.

The meeting inquiry form submits JSON to the self-hosted inquiry service. Set
the GitHub Actions repository variable `CONTACT_FORM_ENDPOINT` to the public
API URL, for example:

```text
https://forms.pitun.cc/api/inquiries
```
