export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <button
            onClick={() => onNavigate("home")}
            className="text-xl font-black text-slate-950 dark:text-white"
          >
            <span className="text-indigo-600">&lt;</span>Nex
            <span className="text-indigo-600">Lockr /&gt;</span>
          </button>
          <p className="mt-4 max-w-sm leading-7 text-slate-600 dark:text-slate-400">
            An encrypted credential vault with authenticated, owner-isolated
            storage.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-slate-950 dark:text-white">Product</h3>
          <div className="mt-4 grid gap-3 text-slate-600 dark:text-slate-400">
            <button className="text-left" onClick={() => onNavigate("home")}>
              Home
            </button>
            <button className="text-left" onClick={() => onNavigate("vault")}>
              Vault
            </button>
            <a href="https://github.com/NeerajSaini271/NexLockr-Secure-Password-Manager-MongoDB">
              Source code
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-950 dark:text-white">
            Built with
          </h3>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
            React, Tailwind CSS, Express, MongoDB and Node.js.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-sm text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} NexLockr. Built by Neeraj Kumar Saini.
      </div>
    </footer>
  );
}
