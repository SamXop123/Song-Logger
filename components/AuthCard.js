"use client";

export default function AuthCard({ onSignIn, isLoading, error }) {
  return (
    <div className="w-full max-w-xl bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-indigo-500/5 dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/60 dark:border-slate-700/50">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-[0.2em]">
        Cloud Sync Ready
      </div>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-300">
        Song Logger
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300 leading-7">
        Sign in with Google to keep your songs synced across Windows, Fedora,
        and every browser where you use the same account.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          What changes after sign-in?
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>Your log becomes private to your account.</li>
          <li>Your songs sync across devices and operating systems.</li>
          <li>Your old local data can be imported after you sign in.</li>
        </ul>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onSignIn}
        disabled={isLoading}
        className="mt-6 w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3.5 font-semibold shadow-lg shadow-slate-900/10 dark:shadow-white/10 hover:translate-y-[-1px] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 dark:bg-slate-950 dark:text-white font-bold">
          G
        </span>
        {isLoading ? "Redirecting..." : "Continue with Google"}
      </button>
    </div>
  );
}
