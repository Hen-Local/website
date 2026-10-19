import assert from "node:assert/strict";
import test from "node:test";
import { createInquiryPayload } from "../app/contact/inquiry.ts";

function inquiryForm(message = "2026 年深圳会议，需要中英双语字幕。") {
  const form = new FormData();
  form.set("name", " 测试用户 ");
  form.set("email", " visitor@example.com ");
  form.set("organization", " 测试机构 ");
  form.set("message", message);
  form.set("consent", "on");
  form.set("_gotcha", "");
  return form;
}

test("adapts the four-field form to the existing VPS JSON contract", () => {
  for (const locale of ["zh", "en"]) {
    const form = inquiryForm();
    const payload = JSON.parse(JSON.stringify(createInquiryPayload(form, locale)));

    // Mirrors CreateInquiry's required fields and validation in the Rust service.
    for (const name of ["name", "email", "organization", "event", "meeting_scale", "language_directions"]) {
      assert.equal(typeof payload[name], "string");
      assert.ok(payload[name].trim().length > 0);
      assert.ok(Buffer.byteLength(payload[name], "utf8") <= 1_000);
    }
    assert.equal(payload.name, "测试用户");
    assert.equal(payload.message, form.get("message"));
    assert.equal(payload.consent, true);
    assert.equal(payload.locale, locale);
    assert.equal(payload._gotcha, "");
    assert.match(payload.meeting_scale, /详见需求描述|See requirements/);
  }
});

test("preserves the unchecked consent state and bot trap", () => {
  const form = inquiryForm();
  form.delete("consent");
  form.set("_gotcha", "bot-filled field");
  const payload = createInquiryPayload(form, "en");
  assert.equal(payload.consent, false);
  assert.equal(payload._gotcha, "bot-filled field");
});

test("rejects multibyte messages over the Rust API's 5,000-byte limit", () => {
  assert.doesNotThrow(() => createInquiryPayload(inquiryForm("字".repeat(1_666)), "zh"));
  assert.throws(() => createInquiryPayload(inquiryForm("字".repeat(1_667)), "zh"), RangeError);
});
