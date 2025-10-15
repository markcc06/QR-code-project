/**
 * Lightweight helpers to update Google consent mode.
 * Fixes TS errors by typing `window.gtag` and guards for SSR.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/** Internal helper */
const updateConsent = (granted: boolean) => {
  const mode = granted ? "granted" : "denied";

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: mode,
      analytics_storage: mode,
      ad_user_data: mode,
      ad_personalization: mode,
    });
  }

  // Best-effort persist to localStorage (guard for SSR / restricted mode)
  try {
    if (typeof window !== "undefined" && "localStorage" in window) {
      localStorage.setItem("cookieConsent", mode);
    }
  } catch {
    // ignore
  }
};

export const grantConsent = () => updateConsent(true);
export const denyConsent = () => updateConsent(false);

/** Read persisted consent value ("granted" | "denied" | null) on client */
export const readConsent = (): "granted" | "denied" | null => {
  if (typeof window === "undefined" || !("localStorage" in window)) return null;
  try {
    const v = localStorage.getItem("cookieConsent");
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
};