"use client";

import { useEffect, useRef, useState } from "react";

function getUserInitial(user) {
  const source = user?.email || user?.user_metadata?.full_name || "U";
  return source.trim().charAt(0).toUpperCase();
}

export default function UserMenu({
  user,
  theme,
  onToggleTheme,
  onImportLocalData,
  onSignOut,
  isMigrating,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative z-40" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold shadow-sm cursor-pointer transition-all duration-300 ease-out ${
          isOpen
            ? "scale-[1.03] ring-4 ring-violet-500/20 dark:ring-violet-400/20"
            : "hover:scale-[1.02]"
        }`}
        title="Open account menu"
      >
        <span className="relative z-10">{getUserInitial(user)}</span>
        <span
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/15 via-indigo-500/10 to-cyan-400/10 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-400 transition-transform duration-300 ${
            isOpen ? "scale-110" : "scale-100"
          }`}
        />
      </button>

      <div
        className={`absolute left-full top-0 ml-3 w-72 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.18)] dark:shadow-[0_28px_80px_rgba(2,6,23,0.72)] p-3 z-[120] origin-top-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] max-[1180px]:left-auto max-[1180px]:right-0 max-[1180px]:top-full max-[1180px]:mt-3 max-[1180px]:ml-0 max-[1180px]:origin-top-right ${
          isOpen
            ? "pointer-events-auto translate-x-0 translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-x-2 -translate-y-1 scale-95 opacity-0 max-[1180px]:translate-x-0 max-[1180px]:-translate-y-2"
        }`}
      >
        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />
        <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700/60">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Signed in
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100 break-all">
                {user?.email}
              </p>
            </div>
            <span
              className={`mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-300 transition-transform duration-300 ${
                isOpen ? "rotate-12" : "rotate-0"
              }`}
            >
              {getUserInitial(user)}
            </span>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              onToggleTheme();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>Theme</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {theme === "light" ? "Switch to dark" : "Switch to light"}
            </span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await onImportLocalData();
              setIsOpen(false);
            }}
            disabled={isMigrating}
            className="w-full flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Import local data</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isMigrating ? "Working..." : "One-time sync"}
            </span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await onSignOut();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <span>Sign out</span>
            <span className="text-xs text-red-400 dark:text-red-500">
              End session
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
