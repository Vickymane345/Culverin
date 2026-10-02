import { signInWithGoogle } from "@/app/(auth)/actions";

export default function SocialButtons({ next }: { next?: string }) {
  return (
    <div className="space-y-3">
      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next ?? "/dashboard"} />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition-colors hover:border-accent/50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.17v2.96h5.27c-.23 1.4-1.6 4.1-5.27 4.1a5.9 5.9 0 0 1 0-11.8c1.68 0 2.8.71 3.45 1.33l2.35-2.27C16.5 3.9 14.5 3 12.18 3a9 9 0 1 0 0 18c5.2 0 8.64-3.65 8.64-8.8 0-.6-.06-1.05-.15-1.5Z"
            />
          </svg>
          Continue with Google
        </button>
      </form>

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
