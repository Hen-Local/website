import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

test("exports the 很 Local landing page", async () => {
  const html = await readFile(new URL("../dist/client/zh/index.html", import.meta.url), "utf8");

  assert.match(html, /很 Local 实时翻译/);
  assert.match(html, /很 Local/);
  assert.match(html, /会议实时翻译/);
  assert.match(html, /在你自己的 Mac 上完成/);
  assert.match(html, /处理过程和默认数据存储均留在你的电脑里/);
  assert.match(html, /本地翻译隐私又安全/);
  assert.match(html, /音频不上传/);
  assert.match(html, /语音同传/);
  assert.match(html, /蓝牙耳机/);
  assert.match(html, /正式版即将上线/);
  assert.match(html, /国际论坛与发布会/);
  assert.match(html, /优势一 · 会议数据不出本机/);
  assert.match(html, /工作原理 · 使用现有 Mac/);
  assert.match(html, /产品能力 · 实时字幕与语音翻译/);
  assert.match(html, /真的不需要联网吗/);
  assert.match(html, /哪些 Mac 可以运行/);
  assert.doesNotMatch(html, /为什么不直接拿语音 API 单价/);
  assert.ok(html.indexOf('id="product"') < html.indexOf('id="how-it-works"'));
  assert.ok(html.indexOf('id="how-it-works"') < html.indexOf('id="projects"'));
  assert.ok(html.indexOf('id="projects"') < html.indexOf('id="why-local"'));
  assert.ok(html.indexOf("工作原理 · 使用现有 Mac") < html.indexOf("产品能力 · 实时字幕与语音翻译"));
  assert.match(html, /工作坊与培训/);
  assert.match(html, /href="\/zh\/contact\/"/);
  assert.doesNotMatch(html, /悬停即可查看|HOVER TO READ|<sup>品牌<\/sup>/);
  assert.doesNotMatch(html, /商业版本|商业授权/);
  assert.match(html, /henlocal\.com/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("exports the meeting inquiry form", async () => {
  const html = await readFile(new URL("../dist/client/zh/contact/index.html", import.meta.url), "utf8");
  const source = await readFile(new URL("../app/components/ContactPage.tsx", import.meta.url), "utf8");

  assert.match(html, /填写问卷，获取免费 Beta 版/);
  assert.match(html, /简单说说就好/);
  assert.match(html, /需求描述/);
  assert.match(html, /现有 Mac 配置如何/);
  assert.match(html, /哪些语言之间的翻译/);
  assert.match(html, /提交问卷，获取下载链接/);
  assert.match(source, /NEXT_PUBLIC_CONTACT_FORM_ENDPOINT/);
  assert.match(source, /https:\/\/forms\.pitun\.cc\/api\/inquiries/);
  assert.match(source, /JSON\.stringify\(payload\)/);
  assert.match(source, /"Content-Type": "application\/json"/);
  assert.match(source, /name="message"/);
  assert.doesNotMatch(source, /name="(?:device|event|meeting_scale|language_directions)"/);
  assert.match(html, /href="\/zh\/"/);
  assert.doesNotMatch(html, /hzeng49@gmail\.com|mailto:/);
  assert.doesNotMatch(source, /formspree|fetch\("\/api\/inquiry"/i);
});

test("includes the GitHub Pages custom-domain files", async () => {
  const domain = await readFile(new URL("../dist/client/CNAME", import.meta.url), "utf8");
  assert.equal(domain.trim(), "henlocal.com");
  await readFile(new URL("../dist/client/.nojekyll", import.meta.url));
});

test("keeps same-document history out of the static host's RSC navigation loop", async () => {
  const html = await readFile(new URL("../dist/client/zh/index.html", import.meta.url), "utf8");
  const match = html.match(/<script id="static-page-navigation">([\s\S]*?)<\/script>/);
  assert.ok(match, "the static export must initialize native anchor handling before hydration");
  assert.ok(match.index < html.indexOf("</head>"));

  const window = new EventTarget();
  const location = { pathname: "/", search: "?lang=zh", hash: "" };
  const history = { scrollRestoration: "manual" };
  runInNewContext(match[1], { window, location, history });
  let routerRequests = 0;
  window.addEventListener("popstate", () => { routerRequests += 1; });

  // Native anchors and browser back/forward must not refetch the current page.
  for (const hash of ["#how-it-works", "#projects", "#faq", "#projects", ""]) {
    location.hash = hash;
    window.dispatchEvent(new Event("popstate"));
    assert.equal(routerRequests, 0);
    assert.equal(history.scrollRestoration, "auto");
  }

  // Actual page/query navigation still reaches the router.
  location.pathname = "/contact/";
  window.dispatchEvent(new Event("popstate"));
  assert.equal(routerRequests, 1);
  location.pathname = "/";
  location.search = "?lang=en";
  window.dispatchEvent(new Event("popstate"));
  assert.equal(routerRequests, 2);

  history.scrollRestoration = "manual";
  window.dispatchEvent(new Event("pageshow"));
  assert.equal(history.scrollRestoration, "auto");
});


test("both homepages send visitors to the survey and keep installer links off the public pages", async () => {
  for (const locale of ["zh", "en"]) {
    const page = (path) => readFile(new URL(`../dist/client/${locale}/${path}index.html`, import.meta.url), "utf8");
    const home = await page("");
    const form = await page("contact/");
    const path = `href="/${locale}/contact/"`;
    for (const section of ["header", 'section class="hero"', 'section class="access-section"', "footer"]) {
      const start = home.indexOf(`<${section}`);
      assert.notEqual(start, -1);
      const end = home.indexOf(`</${section.split(" ")[0]}>`, start);
      assert.ok(home.slice(start, end).includes(path), `${section} needs the localized survey link`);
    }
    assert.match(home, locale === "zh" ? /正式版即将上线/ : /Launching soon/);
    assert.match(home, locale === "zh" ? /提交后即可免费下载/ : /survey to download the free Mac beta/);
    assert.match(form, locale === "zh" ? /提交后，下载链接会直接显示在本页/ : /download link will appear here as soon as you submit/);
    for (const html of [home, form]) {
      assert.doesNotMatch(html, /modelscope\.cn|href="[^"]*\.dmg|Stripe|US\$20|¥|特惠价|成本方式|询价|订阅版下载准备中|special monthly offer|120 free minutes/i);
    }
  }
});
