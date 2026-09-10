export default function ThemeToggle({ theme, onToggle }) {
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      aria-pressed={dark}
      title={`Switch to ${dark ? "light" : "dark"} mode`}
      className="group relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-300/80 bg-white/90 text-slate-700 shadow-sm transition hover:border-indigo-400 hover:text-indigo-600 dark:border-indigo-400/20 dark:bg-slate-900/90 dark:text-indigo-200"
    >
      <span className="absolute inset-0 bg-indigo-500/0 transition group-hover:bg-indigo-500/10" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="relative h-5 w-5"
        aria-hidden="true"
      >
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
          </>
        ) : (
          <path d="M20.8 15.2A8.5 8.5 0 0 1 8.8 3.2 8.5 8.5 0 1 0 20.8 15.2Z" />
        )}
      </svg>
    </button>
  );
}
