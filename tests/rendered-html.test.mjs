import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

test("exports the 很 Local landing page", async () => {
  const html = await readFile(new URL("../dist/client/zh/index.html", import.meta.url), "utf8");

  assert.match(html, /很 Local 实时翻译/);
  assert.match(html, /很 Local/);
  assert.match(html, /会议实时翻译/);
  assert.match(html, /就在你的 Mac 上/);
  assert.match(html, /音频在 Mac 上处理/);
  assert.match(html, /正式版即将上线/);
  assert.match(html, /国际论坛与发布会/);
  assert.match(html, /需要联网吗/);
  assert.match(html, /支持哪些 Mac/);
  const sections = ["product", "how-it-works", "projects", "why-local", "use-cases", "faq"];
  for (const [index, id] of sections.entries()) {
    assert.ok(html.includes(`id="${id}"`));
    if (index > 0) assert.ok(html.indexOf(`id="${sections[index - 1]}"`) < html.indexOf(`id="${id}"`));
  }
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

  assert.match(html, /试用问卷/);
  assert.match(html, /使用场景/);
  assert.match(html, /个人试用可填/);
  assert.match(html, /提交问卷/);
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
      const label = locale === "zh" ? "下载 beta" : "Download beta";
      const links = [...home.slice(start, end).matchAll(/<a\b([^>]*)>([^<]*)<\/a>/g)];
      assert.deepEqual(links.filter(([, attrs]) => attrs.includes(path)).map(([, , text]) => text), [label]);
    }
    assert.match(home, locale === "zh" ? /正式版即将上线/ : /Launching soon/);
    const surveyNote = locale === "zh" ? "提交问卷后即可免费下载 Mac 测试版。" : "Submit the survey to download the free Mac beta.";
    assert.ok(home.includes(surveyNote));
    assert.ok(form.includes(surveyNote));
    for (const html of [home, form]) {
      assert.doesNotMatch(html, /modelscope\.cn|href="[^"]*\.dmg|Stripe|US\$20|¥|特惠价|成本方式|询价|订阅版下载准备中|special monthly offer|120 free minutes/i);
    }
  }
});
