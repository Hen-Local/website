import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("exports the 很 Local landing page", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");

  assert.match(html, /很 Local 实时翻译/);
  assert.match(html, /很 Local/);
  assert.match(html, /会议实时翻译/);
  assert.match(html, /在你自己的 Mac 上完成/);
  assert.match(html, /处理过程和默认数据存储均留在你的电脑里/);
  assert.match(html, /本地翻译隐私又安全/);
  assert.match(html, /音频不上传/);
  assert.match(html, /语音同传/);
  assert.match(html, /蓝牙耳机/);
  assert.match(html, /咨询方案/);
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
  assert.ok(html.indexOf("产品能力 · 实时字幕与语音翻译") < html.indexOf("会议开得越多"));
  assert.match(html, /越不该被按分钟收费/);
  assert.match(html, /¥4,080 \/ 100 小时起/);
  assert.match(html, /工作坊与培训/);
  assert.match(html, /href="\/contact\/?\?lang=zh"/);
  assert.doesNotMatch(html, /悬停即可查看|HOVER TO READ|<sup>品牌<\/sup>/);
  assert.doesNotMatch(html, /商业版本|商业授权/);
  assert.doesNotMatch(html, /GET THE BETA|DOWNLOAD FOR MAC|VIEW BETA RELEASES|github\.com\/Hen-Local\/Hen-Local-Translator\/releases/i);
  assert.match(html, /henlocal\.com/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("exports the meeting inquiry form", async () => {
  const html = await readFile(new URL("../dist/client/contact/index.html", import.meta.url), "utf8");
  const source = await readFile(new URL("../app/contact/page.tsx", import.meta.url), "utf8");

  assert.match(html, /获取本地部署建议/);
  assert.match(html, /简单说说就好/);
  assert.match(html, /需求描述/);
  assert.match(html, /现有 Mac 配置如何/);
  assert.match(html, /哪些语言之间的翻译/);
  assert.match(html, /提交需求，获取方案/);
  assert.match(source, /\/api\/inquiry/);
  assert.match(source, /name="message"/);
  assert.doesNotMatch(source, /name="(?:device|event|meeting_scale|language_directions)"/);
  assert.match(html, /href="\/?\?lang=zh"/);
  assert.doesNotMatch(html, /hzeng49@gmail\.com|mailto:/);
  assert.doesNotMatch(source, /formspree|NEXT_PUBLIC_CONTACT_FORM_ENDPOINT/i);
});
