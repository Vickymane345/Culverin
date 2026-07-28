export default function SocialButtons() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition-colors hover:border-accent/50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.17v2.96h5.27c-.23 1.4-1.6 4.1-5.27 4.1a5.9 5.9 0 0 1 0-11.8c1.68 0 2.8.71 3.45 1.33l2.35-2.27C16.5 3.9 14.5 3 12.18 3a9 9 0 1 0 0 18c5.2 0 8.64-3.65 8.64-8.8 0-.6-.06-1.05-.15-1.5Z"
            />
          </svg>
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition-colors hover:border-accent/50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.36 12.79c.02 2.6 2.28 3.47 2.31 3.48-.02.06-.36 1.24-1.19 2.45-.72 1.05-1.47 2.1-2.65 2.12-1.16.02-1.53-.69-2.85-.69-1.32 0-1.74.67-2.83.71-1.14.04-2-1.13-2.73-2.18-1.49-2.15-2.62-6.08-1.1-8.73a4.24 4.24 0 0 1 3.58-2.17c1.11-.02 2.16.75 2.85.75.68 0 1.96-.93 3.31-.79.56.02 2.14.23 3.16 1.71-.08.05-1.88 1.1-1.86 3.34ZM14.4 4.9c.6-.73 1.01-1.75.9-2.76-.87.03-1.92.58-2.55 1.31-.56.64-1.05 1.68-.92 2.67.97.07 1.96-.49 2.57-1.22Z"
            />
          </svg>
          Apple
        </button>
      </div>

      <div className="flex items-center gap-4 py-2">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          or
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}
