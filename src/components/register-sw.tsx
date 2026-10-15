"use client";

import { useEffect } from "react";

/** Registers public/sw.js (production only; a caching worker in dev just gets in the way). */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => console.warn("sw registration failed", err));
  }, []);
  return null;
}
