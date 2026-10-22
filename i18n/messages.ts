import zh from "../messages/zh.json";
import en from "../messages/en.json";
import type { Locale } from "./routing";

export const messages = { zh, en } satisfies Record<Locale, typeof zh>;
export type Messages = typeof zh;
export function getMessages(locale: Locale) { return messages[locale]; }
