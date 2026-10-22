import type { Locale } from "../../i18n/routing";

export function createInquiryPayload(form: FormData, locale: Locale) {
  const field = (name: string) => String(form.get(name) ?? "").trim();
  const message = field("message");

  // The existing Rust API limits UTF-8 bytes, rather than JavaScript characters.
  if (new TextEncoder().encode(message).length > 5_000) {
    throw new RangeError("Inquiry message exceeds the API byte limit");
  }

  // The VPS still requires these legacy fields. Keep all details in message;
  // these pointers do not claim that the visitor supplied separate answers.
  const detailsReference = locale === "zh"
    ? "详见需求描述；未提供的信息后续确认"
    : "See requirements; any missing details will be confirmed later";

  return {
    name: field("name"),
    email: field("email"),
    organization: field("organization"),
    event: detailsReference,
    meeting_scale: detailsReference,
    language_directions: detailsReference,
    message,
    consent: form.has("consent"),
    locale,
    _gotcha: field("_gotcha"),
  };
}
