"use client";

/* eslint-disable @next/next/no-img-element -- local static brand assets do not need runtime optimization */

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import SpotIllustration from "../components/SpotIllustration";
import { createInquiryPayload } from "./inquiry";

type Locale = "zh" | "en";

const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?.trim()
  || "https://forms.pitun.cc/api/inquiries";

const copy = {
  zh: {
    brand: "很 Local",
    product: "实时翻译",
    back: "返回产品页",
    languageLabel: "语言",
    eyebrow: "获取会议方案",
    title: "告诉我们你的需求，获取本地部署建议。",
    intro: "留下联系方式，简单描述你的活动或使用场景，我们会通过邮件与你沟通方案。",
    replyTitle: "回复方式",
    replyCopy: "提交后，我们会通过你填写的邮箱联系。",
    guideTitle: "简单说说就好",
    guideCopy: "活动还在筹备也没关系，先写下已知的需求，设备和会场细节可以之后一起确认。",
    needsHint: "按已知情况填写即可，不必逐项回答。",
    privacy: "请不要提交会议机密、参会者个人信息、录音或转录内容。我们只需要用于评估方案的概要信息。",
    fields: {
      name: "姓名",
      email: "邮箱",
      organization: "公司或机构",
      message: "需求描述",
      consent: "我同意很 Local 团队使用以上信息回复本次咨询。",
    },
    placeholders: {
      message: "简单介绍需求，可参考这些问题：\n• 活动时间、地点、人数和会场数量？\n• 需要哪些语言之间的翻译？\n• 现有 Mac 配置如何？\n• 麦克风怎样接入？字幕显示在哪里？",
    },
    submit: "提交需求，获取方案",
    sending: "正在提交…",
    success: "信息已提交。我们会通过邮件与你联系。",
    error: "提交没有成功，请稍后重试。",
    messageTooLong: "需求描述较长，请适当精简后再提交。",
  },
  en: {
    brand: "HEN LOCAL",
    product: "LIVE TRANSLATOR",
    back: "BACK TO PRODUCT",
    languageLabel: "LANGUAGE",
    eyebrow: "GET A MEETING PLAN",
    title: "Tell us what you need for a local deployment plan.",
    intro: "Leave your contact details and briefly describe your event or use case. We’ll follow up by email to discuss a setup.",
    replyTitle: "HOW WE REPLY",
    replyCopy: "We’ll respond using the email entered in the form.",
    guideTitle: "A brief description is enough",
    guideCopy: "Still planning? Share what you know so far. We can work out device and venue details together later.",
    needsHint: "Share what you know; you don’t need to answer every question.",
    privacy: "Do not include confidential meeting content, attendee personal information, recordings, or transcripts. We only need high-level details to assess the setup.",
    fields: {
      name: "NAME",
      email: "EMAIL",
      organization: "COMPANY OR ORGANIZATION",
      message: "YOUR NEEDS",
      consent: "I agree that the HEN LOCAL team may use this information to respond to this inquiry.",
    },
    placeholders: {
      message: "Some prompts to help describe your needs:\n• When and where? How many attendees/rooms?\n• Which languages need translation?\n• What Mac do you have?\n• Microphone input and caption displays?",
    },
    submit: "GET A RECOMMENDED SETUP",
    sending: "SENDING…",
    success: "Your details were submitted. We’ll follow up by email.",
    error: "The form could not be submitted. Please try again later.",
    messageTooLong: "Please shorten your description and submit it again.",
  },
} as const;

export default function ContactPage() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "too-long">("idle");
  const t = copy[locale];
  const homeHref = `/?lang=${locale}`;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const requested = new URLSearchParams(window.location.search).get("lang");
      const saved = window.localStorage.getItem("hen-local-locale");
      const nextLocale = requested === "zh" || requested === "en"
        ? requested
        : saved === "zh" || saved === "en"
          ? saved
          : navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
      setLocale(nextLocale);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  function chooseLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    window.localStorage.setItem("hen-local-locale", nextLocale);
    setLanguageOpen(false);
  }

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setStatus("sending");
    try {
      const payload = createInquiryPayload(new FormData(form), locale);
      const response = await fetch(formEndpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { Accept: "application/json", "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Form submission failed");
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus(error instanceof RangeError ? "too-long" : "error");
    }
  }

  const statusText = status === "sending" ? t.sending : status === "success" ? t.success : status === "error" ? t.error : status === "too-long" ? t.messageTooLong : "";

  return (
    <main className="contact-page" data-locale={locale}>
      <header className="contact-header">
        <Link className="brand" href={homeHref} aria-label={t.back}>
          <span className="brand-mark" aria-hidden="true"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span>
          <span className="brand-copy"><strong>{t.brand}</strong><small>{t.product}</small></span>
        </Link>
        <div className="header-actions">
          <Link className="back-link" href={homeHref}>← {t.back}</Link>
          <div className="language-menu">
            <button className="language-trigger" type="button" aria-label={t.languageLabel} aria-expanded={languageOpen} onClick={() => setLanguageOpen((open) => !open)}>{locale === "zh" ? "中" : "EN"}<span aria-hidden="true">⌄</span></button>
            {languageOpen && <div className="language-popover"><button type="button" aria-pressed={locale === "zh"} onClick={() => chooseLocale("zh")}>中文</button><button type="button" aria-pressed={locale === "en"} onClick={() => chooseLocale("en")}>English</button></div>}
          </div>
        </div>
      </header>

      <section className="contact-intro">
        <div><span className="section-tag">{t.eyebrow}</span><h1>{t.title}</h1><p>{t.intro}</p></div>
        <aside><strong>{t.replyTitle}</strong><span>{t.replyCopy}</span></aside>
      </section>

      <section className="contact-content">
        <aside className="inquiry-guide">
          <SpotIllustration name="consultation-planning" className="inquiry-illustration" />
          <h2>{t.guideTitle}</h2>
          <div className="inquiry-guide-copy">{t.guideCopy}</div>
          <p>{t.privacy}</p>
        </aside>

        <form className="inquiry-form" onSubmit={submitInquiry}>
          <input className="honeypot" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          <div className="form-grid">
            <label className="half-field"><span>{t.fields.name} *</span><input name="name" required maxLength={120} autoComplete="name" /></label>
            <label className="half-field"><span>{t.fields.email} *</span><input type="email" name="email" required maxLength={254} autoComplete="email" /></label>
            <label className="full-field"><span>{t.fields.organization} *</span><input name="organization" required maxLength={180} autoComplete="organization" /></label>
            <label className="full-field"><span>{t.fields.message} *</span><textarea name="message" required rows={8} maxLength={2000} aria-describedby="needs-hint" placeholder={t.placeholders.message} /><small className="field-hint" id="needs-hint">{t.needsHint}</small></label>
          </div>
          <label className="consent-field"><input type="checkbox" name="consent" required /><span>{t.fields.consent} *</span></label>
          <div className="submit-row"><button type="submit" disabled={status === "sending"}>{status === "sending" ? t.sending : t.submit}<span aria-hidden="true">→</span></button>{statusText && <p role="status" className={`form-status status-${status === "too-long" ? "error" : status}`}>{statusText}</p>}</div>
        </form>
      </section>
    </main>
  );
}
