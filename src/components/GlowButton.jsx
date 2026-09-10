export default function GlowButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`group relative inline-flex min-h-12 overflow-hidden rounded-2xl p-px font-display font-bold shadow-[0_0_28px_rgba(99,102,241,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(124,58,237,.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#050816] ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-[-800%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c4b5fd_0%,#4f46e5_36%,#22d3ee_55%,#7c3aed_72%,#c4b5fd_100%)] motion-reduce:animate-none"
      />
      <span className="relative inline-flex h-full w-full items-center justify-center rounded-[15px] bg-white/92 px-6 py-3 text-indigo-700 backdrop-blur-xl transition group-hover:bg-indigo-50 dark:bg-[#080d22]/95 dark:text-white dark:group-hover:bg-[#0d1532]">
        {children}
      </span>
    </button>
  );
}
