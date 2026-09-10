import GlowButton from "./GlowButton";
const features = [
  [
    "01",
    "Authenticated encryption",
    "AES-256-GCM protects every saved password before database storage.",
  ],
  [
    "02",
    "Owner-isolated vaults",
    "Every read and write operation is restricted to the authenticated account.",
  ],
  [
    "03",
    "Expiring sessions",
    "Random session tokens expire automatically; only their hashes are stored.",
  ],
];
export default function Home({ onOpenVault }) {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(99,102,241,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,.055)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
        <div className="pointer-events-none absolute left-[12%] top-12 -z-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px] dark:bg-indigo-500/25" />
        <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-10 py-12 sm:py-16 lg:min-h-[calc(100vh-72px)] lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[.18em] text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-200">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_14px_#22d3ee]" />
              Private credential management
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.04] tracking-[-.045em] sm:text-6xl sm:leading-[.98] sm:tracking-[-.055em] text-slate-950 lg:text-[4.8rem] dark:text-white">
              Secure the keys to your{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
                digital life.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A focused encrypted vault built around private accounts,
              controlled access, and a clear credential workflow.
            </p>
            <div className="mt-7 grid gap-3 sm:mt-9 sm:flex sm:flex-wrap">
              <GlowButton onClick={onOpenVault} className="w-full sm:w-auto">
                Open your vault{" "}
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </GlowButton>
              <a
                href="#security"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl sm:w-auto border border-slate-300 bg-white/80 px-6 font-display font-bold text-slate-800 backdrop-blur transition hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                Explore security
              </a>
            </div>
            <div className="mt-7 grid gap-2 sm:mt-10 sm:flex sm:flex-wrap sm:gap-x-7 sm:gap-y-3 font-display text-sm text-slate-500 dark:text-slate-400">
              <span>✓ Encrypted at rest</span>
              <span>✓ Account isolated</span>
              <span>✓ Responsive vault</span>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[520px]">
            <div className="absolute inset-[8%] rounded-full border border-indigo-300/40 shadow-[0_0_64px_rgba(99,102,241,.16),inset_0_0_52px_rgba(99,102,241,.08)] dark:border-indigo-400/20" />
            <div className="absolute inset-[17%] animate-[spin_22s_linear_infinite] rounded-full border border-dashed border-violet-400/50 motion-reduce:animate-none" />
            <div className="absolute inset-[27%] animate-[spin_14s_linear_infinite_reverse] rounded-full border border-cyan-400/30 motion-reduce:animate-none" />
            <div className="absolute inset-[20%] rounded-[38%] bg-gradient-to-br from-indigo-500/14 via-violet-500/8 to-cyan-400/6 blur-2xl" />
            <div className="absolute inset-[29%] grid place-items-center rounded-[2.25rem] border border-white/60 bg-white/60 p-8 shadow-[0_0_44px_rgba(99,102,241,.24)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/88">
              <img
                src="/NexLockrLogo.svg"
                alt="NexLockr shield"
                className="h-full w-full drop-shadow-[0_0_18px_rgba(129,140,248,.55)]"
              />
            </div>
            {[
              ["top-[12%] left-[5%]", "AES-256-GCM"],
              ["right-0 top-[28%]", "OWNER VERIFIED"],
              ["bottom-[14%] left-[3%]", "SESSION ACTIVE"],
            ].map(([position, label]) => (
              <div
                key={label}
                className={`absolute ${position} rounded-xl border border-indigo-200 bg-white/85 px-4 py-2 font-display text-[.68rem] font-bold tracking-[.12em] text-indigo-700 shadow-xl backdrop-blur-xl dark:border-indigo-400/20 dark:bg-slate-950/75 dark:text-indigo-200`}
              >
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="security"
        className="relative scroll-mt-[72px] border-y border-slate-200/80 bg-white/65 py-14 sm:py-20 dark:border-indigo-400/10 dark:bg-slate-950/35"
      >
        <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
          <p className="font-display text-sm font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-300">
            The NexLockr security layer
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl sm:mt-4 sm:text-4xl font-bold tracking-[-.04em] text-slate-950 dark:text-white">
            Purpose-built protection, not decorative claims.
          </h2>
          <div className="mt-7 grid gap-4 sm:mt-9 sm:gap-5 md:grid-cols-3">
            {features.map(([number, title, text]) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/85 p-5 sm:rounded-[1.75rem] sm:p-7 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-indigo-400/30"
              >
                <div className="absolute right-0 top-0 h-28 w-28 bg-indigo-500/10 blur-3xl" />
                <span className="font-display text-sm font-bold text-cyan-600 dark:text-cyan-300">
                  {number}
                </span>
                <h3 className="mt-6 font-display text-xl font-bold text-slate-950 dark:text-white">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
