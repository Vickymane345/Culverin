/** Only allow same-site relative redirects, so ?next= cannot send users elsewhere. */
export function safeNext(value: unknown, fallback = "/dashboard") {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}
