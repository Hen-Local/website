import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createTranslator } from "next-intl";
import { localizedHref } from "../i18n/routing.ts";

const readExport = (path) => readFile(new URL(`../dist/client/${path}index.html`, import.meta.url), "utf8");

test("exports the matching desktop and mobile workflow artwork for each language", async () => {
  for (const [locale, suffix] of [["zh", "spaced"], ["en", "en"]]) {
    const html = await readExport(`${locale}/`);
    for (const format of ["desktop", "mobile"]) {
      const filename = `translation-flow-${format}-${suffix}.png`;
      assert.ok(html.includes(`/workflow/${filename}`), `${locale} must reference its ${format} illustration`);
      const png = await readFile(new URL(`../public/workflow/${filename}`, import.meta.url));
      assert.equal(png.subarray(1, 4).toString(), "PNG");
      const width = png.readUInt32BE(16);
      const height = png.readUInt32BE(20);
      const tag = html.match(new RegExp(`<${format === "desktop" ? "img" : "source"}[^>]+${filename.replaceAll(".", "\\.")}[^>]*>`))?.[0];
      assert.ok(tag);
      assert.match(tag, new RegExp(`width="${width}"`));
      assert.match(tag, new RegExp(`height="${height}"`));
    }
  }
});

test("exports both languages with localized content and SEO before hydration", async () => {
  for (const [locale, htmlLanguage, title, contactTitle] of [
    ["zh", "zh-CN", "会议实时翻译", "获取本地部署建议"],
    ["en", "en", "Live meeting translation", "local deployment plan"],
  ]) {
    for (const page of ["", "contact/"]) {
      const path = `${locale}/${page}`;
      const html = await readExport(path);
      assert.match(html, new RegExp(`<html lang="${htmlLanguage}"`));
      const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
      assert.ok(heading?.includes(page ? contactTitle : title));
      assert.match(html, new RegExp(`rel="canonical" href="https://henlocal.com/${path}"`));
      assert.match(html, new RegExp(`hrefLang="zh-CN" href="https://henlocal.com/zh/${page}"`, "i"));
      assert.match(html, new RegExp(`hrefLang="en" href="https://henlocal.com/en/${page}"`, "i"));
      assert.match(html, new RegExp(`property="og:locale" content="${locale === "zh" ? "zh_CN" : "en_US"}"`));
      assert.match(html, new RegExp(`href="/${locale}/${page ? "" : "contact/"}"`));
      assert.doesNotMatch(html, /id="legacy-locale-redirect"/);
    }
  }
});

test("translation files have matching keys and valid ICU messages", async () => {
  const catalogs = await Promise.all(["zh", "en"].map(async (locale) => JSON.parse(await readFile(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"))));
  function leaves(value, prefix = "") {
    return Object.entries(value).flatMap(([key, item]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof item === "string" ? [[path, item]] : leaves(item, path);
    });
  }
  assert.deepEqual(leaves(catalogs[0]).map(([key]) => key).sort(), leaves(catalogs[1]).map(([key]) => key).sort());
  for (const [index, messages] of catalogs.entries()) {
    const t = createTranslator({ locale: index ? "en" : "zh", messages, onError(error) { throw error; } });
    for (const [key, value] of leaves(messages)) {
      assert.ok(value.trim(), `${key} must not be empty`);
      assert.equal(t(key), value, `${key} must be valid translation text`);
    }
  }
});

test("locale URLs preserve page, query parameters, and anchor without legacy lang", () => {
  assert.equal(localizedHref("en", "home", "?lang=zh&utm_source=event", "#projects"), "/en/?utm_source=event#projects");
  assert.equal(localizedHref("zh", "contact", "?utm_source=event&lang=en"), "/zh/contact/?utm_source=event");
});

test("legacy URLs honor explicit language, preference, and browser languages in order", async () => {
  const home = await readExport("");
  const contact = await readExport("contact/");
  for (const html of [home, contact]) {
    const script = html.match(/<script id="legacy-locale-redirect">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(script, "legacy entry points must migrate before the body is painted");
    assert.ok(html.indexOf('id="legacy-locale-redirect"') < html.indexOf("</head>"));
    const pathname = html === contact ? "/contact/" : "/";
    const route = pathname === "/contact/" ? "contact/" : "";
    for (const entry of [
      { search: "?lang=en&utm_source=event", saved: "zh", languages: ["zh-CN"], expected: `/en/${route}?utm_source=event#projects` },
      { search: "?lang=zh", saved: "en", languages: ["en-US"], expected: `/zh/${route}#projects` },
      { search: "", saved: "en", languages: ["zh-CN"], expected: `/en/${route}#projects` },
      { search: "?lang=invalid", saved: "invalid", languages: ["fr-FR", "en-GB"], expected: `/en/${route}#projects` },
      { search: "", saved: null, languages: ["zh-TW"], expected: `/zh/${route}#projects` },
      { search: "", saved: null, languages: ["fr-FR"], expected: `/zh/${route}#projects` },
      { search: "?lang=en", blockedStorage: true, languages: ["zh-CN"], expected: `/en/${route}#projects` },
    ]) {
      let target;
      runInNewContext(script, {
        URLSearchParams,
        location: { pathname, search: entry.search, hash: "#projects", replace(value) { target = value; } },
        navigator: { languages: entry.languages, language: entry.languages[0] },
        localStorage: { getItem() { if (entry.blockedStorage) throw new Error("Storage disabled"); return entry.saved; } },
      });
      assert.equal(target, entry.expected);
    }
  }
});
