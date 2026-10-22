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

## Internationalization

Chinese and English use `next-intl`, with statically exported pages at `/zh/`,
`/en/`, `/zh/contact/`, and `/en/contact/`. These URLs render the correct text,
HTML language, page metadata, canonical URL, and language alternatives before
JavaScript loads. The locale in the URL is authoritative.

Edit translated UI text in `messages/zh.json` and `messages/en.json`. Both files
must contain the same keys; translation calls are checked by TypeScript and the
test suite checks key parity. Event dates, links, and artwork stay in
`app/data/events.ts`; their translated names, descriptions, and alt text live
under `events` in the message files. Event dates use locale-aware formatting.
The workflow illustration also selects localized desktop and mobile assets from
`public/workflow/`; its example screen intentionally shows bilingual captions.

The shared language switcher preserves the page, anchor, and other query
parameters. `/`, `/contact/`, and old `?lang=zh` / `?lang=en` links redirect to
locale URLs on the client, because GitHub Pages has no request-time middleware.
Detection checks an explicit legacy language, the saved preference, browser
languages, then Chinese. Blocked browser storage does not prevent navigation.

To add another language, add its message file, register it in `i18n/messages.ts`
and `i18n/routing.ts`, and extend the HTML-language and metadata mappings. Locale
routes are generated from the registered locales during the build.

## English font preview

English pages use self-hosted variable Manrope (weights 200–800), preloaded only
for English routes. The Chinese font stack remains locale-specific.

Open `/en/font-preview/` to compare Inter, DM Sans, Manrope, and Space Grotesk
against the previous Arial font. The preview includes the real homepage, desktop
and mobile viewports, a comparison grid, and full-size previews. A `?font=` query
parameter makes the chosen preview shareable. Preview choices do not change the
website's default font.

Manrope and its SIL Open Font License are in `public/fonts/`. Other comparison
fonts and their licenses are in `public/fonts/preview/`; source URLs are in
`public/fonts/sources.json`. Preview routes are marked `noindex`.

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
