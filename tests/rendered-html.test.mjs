import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("exports the 很 Local landing page", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");

  assert.match(html, /很 Local 实时翻译/);
  assert.match(html, /很 Local/);
  assert.match(html, /让每个人都听得懂、跟得上/);
  assert.match(html, /音频不上传/);
  assert.match(html, /语音同传/);
  assert.match(html, /蓝牙耳机/);
  assert.match(html, /咨询方案/);
  assert.match(html, /国际论坛与发布会/);
  assert.match(html, /优势一 · 实时字幕与语音同传/);
  assert.match(html, /优势二 · 会议数据不出本机/);
  assert.match(html, /优势三 · 成本可控/);
  assert.match(html, /优势四 · 快速部署/);
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

  assert.match(html, /咨询会议方案/);
  assert.match(html, /只需要三类信息/);
  assert.match(html, /会议日期与地点/);
  assert.match(html, /会议规模与同时翻译数量/);
  assert.match(html, /最多同时开启几路翻译/);
  assert.match(html, /语言方向/);
  assert.match(html, /提交需求，获取方案/);
  assert.match(html, /href="\/?\?lang=zh"/);
  assert.doesNotMatch(html, /hzeng49@gmail\.com|mailto:/);
});
