import { useState } from "react";
import GlowButton from "./GlowButton";
import ThemeToggle from "./ThemeToggle";
export default function Navbar({
  page,
  onNavigate,
  theme,
  onToggleTheme,
  signedIn,
  onSignOut,
}) {
  const [open, setOpen] = useState(false);
  const go = (next) => {
    setOpen(false);
    onNavigate(next);
  };
  const link = (active) =>
    `relative rounded-xl px-4 py-2 font-display text-sm font-bold transition ${active ? "text-indigo-600 after:absolute after:inset-x-4 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-indigo-500 after:via-cyan-400 after:to-violet-500 after:shadow-[0_0_12px_rgba(34,211,238,.85)] dark:text-white" : "text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white"}`;
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl dark:border-indigo-400/10 dark:bg-[#050816]/78">
      <nav className="mx-auto flex h-[72px] w-[min(1180px,calc(100%-2rem))] items-center justify-between">
        <button
          onClick={() => go("home")}
          className="cursor-pointer font-display text-xl font-bold tracking-[-.04em] text-slate-950 dark:text-white"
        >
          <span className="text-indigo-600 dark:text-indigo-400">&lt;</span>Nex
          <span className="text-indigo-600 dark:text-indigo-400">
            Lockr /&gt;
          </span>
        </button>
        <div className="hidden items-center gap-1 md:flex">
          <button onClick={() => go("home")} className={link(page === "home")}>
            Home
          </button>
          <button
            onClick={() => go("security")}
            className={link(page === "security")}
          >
            Security
          </button>
          <button
            onClick={() => go("vault")}
            className={link(page === "vault")}
          >
            Vault
          </button>
          <a
            href="https://github.com/NeerajSaini271/NexLockr-Secure-Password-Manager-MongoDB"
            target="_blank"
            rel="noreferrer"
            className={link(false)}
          >
            GitHub
          </a>
          <div className="ml-3 flex items-center gap-4">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <GlowButton
              onClick={signedIn ? onSignOut : () => go("vault")}
              className="min-h-11 min-w-[132px]"
            >
              {signedIn ? "Sign out" : "Sign in"}
            </GlowButton>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-300 bg-white font-display text-xl dark:border-slate-700 dark:bg-slate-900 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          ☰
        </button>
      </nav>
      {open && (
        <div className="absolute inset-x-4 top-[72px] z-50 grid gap-1.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-[#080d22] md:hidden">
          <button
            className={link(page === "home") + " w-full text-left"}
            onClick={() => go("home")}
          >
            Home
          </button>
          <button
            className={link(page === "security") + " w-full text-left"}
            onClick={() => go("security")}
          >
            Security
          </button>
          <button
            className={link(page === "vault") + " w-full text-left"}
            onClick={() => go("vault")}
          >
            Vault
          </button>
          <a
            className="rounded-xl px-4 py-2 text-left font-display text-sm font-bold text-slate-600 dark:text-slate-300"
            href="https://github.com/NeerajSaini271/NexLockr-Secure-Password-Manager-MongoDB"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <div className="mt-1 flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
            <span className="font-display text-sm font-bold text-slate-600 dark:text-slate-300">
              Theme
            </span>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
          <GlowButton
            onClick={() => {
              setOpen(false);
              if (signedIn) onSignOut();
              else go("vault");
            }}
            className="mt-1 w-full"
          >
            {signedIn ? "Sign out" : "Sign in"}
          </GlowButton>
        </div>
      )}
    </header>
  );
}
