"use client";

export default function SetupCard() {
  return (
    <div className="w-full max-w-2xl bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-indigo-500/5 dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/60 dark:border-slate-700/50">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-[0.2em]">
        Setup Needed
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
        Supabase environment variables are missing
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300 leading-7">
        Add your Supabase project URL and anon key, then run the SQL in
        <code className="mx-1 rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-sm">
          supabase/schema.sql
        </code>
        before using Google sign-in.
      </p>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Required env vars
          </p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            <code>NEXT_PUBLIC_SUPABASE_URL</code>
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
          After that, enable Google in the Supabase Auth providers screen and
          add your local/Vercel site URLs to the allowed redirect list.
        </div>
      </div>
    </div>
  );
}
