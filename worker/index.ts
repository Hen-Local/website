/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  CONTACT_EMAIL: {
    send(message: {
      to: string;
      from: string;
      replyTo?: string;
      subject: string;
      text: string;
      html: string;
    }): Promise<unknown>;
  };
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const MAX_FORM_BYTES = 20_000;
const MAX_FIELD_LENGTH = 2_000;

function field(form: FormData, name: string, maxLength = MAX_FIELD_LENGTH): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}

async function handleInquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== requestUrl.host) {
    return jsonResponse({ ok: false, error: "Invalid origin" }, 403);
  }

  const contentLength = Number(request.headers.get("Content-Length") ?? "0");
  if (contentLength > MAX_FORM_BYTES) {
    return jsonResponse({ ok: false, error: "Request too large" }, 413);
  }

  if (!env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return jsonResponse({ ok: false, error: "Email service is not configured" }, 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid form data" }, 400);
  }

  // Quietly accept bot submissions without sending mail.
  if (field(form, "_gotcha", 200)) {
    return jsonResponse({ ok: true });
  }

  const name = field(form, "name", 120);
  const email = field(form, "email", 254);
  const organization = field(form, "organization", 180);
  const message = field(form, "message");
  const locale = field(form, "page_locale", 8) === "en" ? "en" : "zh";
  const consent = form.get("consent");

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[\r\n]/.test(email);
  if (!name || !emailIsValid || !organization || !message || !consent) {
    return jsonResponse({ ok: false, error: "Required fields are missing or invalid" }, 400);
  }

  const rows = [
    ["姓名 / Name", name],
    ["邮箱 / Email", email],
    ["公司或机构 / Organization", organization],
    ["需求描述 / Your needs", message],
    ["页面语言 / Page language", locale],
  ] as const;

  const text = rows.map(([label, value]) => `${label}\n${value}`).join("\n\n");
  const html = `<h1 style="font-size:20px">新的很 Local 会议方案咨询</h1>${rows
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`)
    .join("")}`;

  try {
    await env.CONTACT_EMAIL.send({
      to: env.CONTACT_TO_EMAIL,
      from: env.CONTACT_FROM_EMAIL,
      replyTo: email,
      subject: `[很 Local 咨询] ${organization} — ${name}`.slice(0, 180),
      text,
      html,
    });
    return jsonResponse({ ok: true });
  } catch {
    return jsonResponse({ ok: false, error: "Email delivery failed" }, 502);
  }
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === "www.henlocal.com") {
      url.hostname = "henlocal.com";
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname === "/api/inquiry") {
      return handleInquiry(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
