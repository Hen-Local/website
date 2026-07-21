"use client";

/* eslint-disable @next/next/no-img-element -- local static brand assets do not need runtime optimization */

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Locale = "zh" | "en";

const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";

const copy = {
  zh: {
    brand: "很 Local",
    product: "实时翻译",
    back: "返回产品页",
    languageLabel: "语言",
    eyebrow: "获取会议方案",
    title: "告诉我们会议需求，获取适合现场的翻译方案。",
    intro: "填写会议时间、地点、规模、语言方向和音频条件。我们会评估需要的设备、字幕与语音输出方式，并通过邮件回复部署建议。",
    replyTitle: "回复方式",
    replyCopy: "提交后，我们会通过你填写的工作邮箱联系。",
    checklistTitle: "只需要三类信息",
    checklist: [
      "会议日期、城市和场地类型",
      "预计人数、会议室数量，以及最多同时开启几路翻译",
      "源语言、目标语言和字幕／耳机／扬声器需求",
    ],
    privacy: "请不要提交会议机密、参会者个人信息、录音或转录内容。我们只需要用于评估方案的概要信息。",
    fields: {
      name: "姓名",
      email: "工作邮箱",
      organization: "公司或机构",
      event: "会议日期与地点",
      scale: "会议规模与同时翻译数量",
      languages: "语言方向",
      message: "会议需求补充",
      consent: "我同意很 Local 团队使用以上信息回复本次咨询。",
    },
    placeholders: {
      event: "例如：2026 年 10 月，上海某酒店会议厅，为期 2 天",
      scale: "例如：约 150 人，3 个会议室，最多同时开启 2 路翻译",
      languages: "例如：中文 → 英语；部分场次需要英语 → 中文",
      message: "可选：会议类型、行业、讲者数量，以及需要大屏字幕、蓝牙耳机或现场扬声器。",
    },
    submit: "提交需求，获取方案",
    sending: "正在提交…",
    success: "信息已提交。我们会通过邮件与你联系。",
    missing: "在线提交正在配置中，目前暂时无法发送。",
    error: "提交没有成功，请稍后重试。",
  },
  en: {
    brand: "HEN LOCAL",
    product: "LIVE TRANSLATOR",
    back: "BACK TO PRODUCT",
    languageLabel: "LANGUAGE",
    eyebrow: "GET A MEETING PLAN",
    title: "Share your meeting needs and get a tailored translation setup.",
    intro: "Provide the date, location, scale, language directions, and venue audio conditions. We’ll recommend the devices, caption and audio outputs, and deployment approach.",
    replyTitle: "HOW WE REPLY",
    replyCopy: "We’ll respond using the work email entered in the form.",
    checklistTitle: "THREE THINGS TO PREPARE",
    checklist: [
      "Date, city, and venue type",
      "Attendance, room count, and maximum simultaneous translation sessions",
      "Language directions and caption, headphone, or speaker needs",
    ],
    privacy: "Do not include confidential meeting content, attendee personal information, recordings, or transcripts. We only need high-level details to assess the setup.",
    fields: {
      name: "NAME",
      email: "WORK EMAIL",
      organization: "COMPANY OR ORGANIZATION",
      event: "MEETING DATE + LOCATION",
      scale: "SCALE + SIMULTANEOUS TRANSLATION SESSIONS",
      languages: "LANGUAGE DIRECTIONS",
      message: "ADDITIONAL MEETING NEEDS",
      consent: "I agree that the HEN LOCAL team may use this information to respond to this inquiry.",
    },
    placeholders: {
      event: "Example: October 2026; hotel ballroom in Shanghai; two days",
      scale: "Example: 150 attendees, 3 rooms, up to 2 simultaneous translation sessions",
      languages: "Example: Mandarin → English; some sessions require English → Mandarin",
      message: "Optional: meeting type, industry, speakers, and whether you need screen captions, headphones, or venue speakers.",
    },
    submit: "GET A RECOMMENDED SETUP",
    sending: "SENDING…",
    success: "Your details were submitted. We’ll follow up by email.",
    missing: "Online submission is being configured and is temporarily unavailable.",
    error: "The form could not be submitted. Please try again later.",
  },
} as const;

export default function ContactPage() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "missing" | "error">("idle");
  const t = copy[locale];
  const serviceReady = Boolean(formEndpoint);
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

    if (!formEndpoint) {
      setStatus("missing");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Form submission failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const statusText = status === "sending" ? t.sending : status === "success" ? t.success : status === "missing" ? t.missing : status === "error" ? t.error : "";

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
          <span>01</span><h2>{t.checklistTitle}</h2>
          <ul>{t.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
          <p>{t.privacy}</p>
        </aside>

        <form className="inquiry-form" onSubmit={submitInquiry}>
          <input className="honeypot" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          <div className="form-grid">
            <label className="half-field"><span>{t.fields.name} *</span><input name="name" required autoComplete="name" /></label>
            <label className="half-field"><span>{t.fields.email} *</span><input type="email" name="email" required autoComplete="email" /></label>
            <label className="full-field"><span>{t.fields.organization} *</span><input name="organization" required autoComplete="organization" /></label>
            <label className="full-field"><span>{t.fields.event} *</span><input name="event" required placeholder={t.placeholders.event} /></label>
            <label className="full-field"><span>{t.fields.scale} *</span><input name="meeting_scale" required placeholder={t.placeholders.scale} /></label>
            <label className="full-field"><span>{t.fields.languages} *</span><input name="language_directions" required placeholder={t.placeholders.languages} /></label>
            <label className="full-field"><span>{t.fields.message}</span><textarea name="message" rows={5} placeholder={t.placeholders.message} /></label>
          </div>
          <label className="consent-field"><input type="checkbox" name="consent" required /><span>{t.fields.consent} *</span></label>
          {!serviceReady && <p className="form-config-note">{t.missing}</p>}
          <div className="submit-row"><button type="submit" disabled={status === "sending" || !serviceReady}>{status === "sending" ? t.sending : t.submit}<span aria-hidden="true">→</span></button>{statusText && status !== "missing" && <p role="status" className={`form-status status-${status}`}>{statusText}</p>}</div>
        </form>
      </section>
    </main>
  );
}
