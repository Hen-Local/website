"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("font-study-change", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("font-study-change", callback);
  };
}

export function useFontPreviewQuery() {
  const search = useSyncExternalStore(subscribe, () => location.search, () => "");
  return new URLSearchParams(search);
}

export function updateFontPreviewQuery(values: Record<string, string>) {
  const url = new URL(location.href);
  for (const [key, value] of Object.entries(values)) url.searchParams.set(key, value);
  history.replaceState(history.state, "", url);
  window.dispatchEvent(new Event("font-study-change"));
}
