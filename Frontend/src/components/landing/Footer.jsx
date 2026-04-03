import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="border-t border-blue-900/60 bg-slate-950/80">
      <div className="mx-auto grid w-[min(1120px,calc(100%-1.5rem))] gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.7fr]">
        <div>
          <p className="font-['Space_Grotesk'] text-xl font-bold text-amber-300">InventoryFlow</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
            Modern inventory operations for fast-moving retail and warehouse teams.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">Links</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <a href="#features" className="transition hover:text-cyan-200">
              Features
            </a>
            <a href="#analytics" className="transition hover:text-cyan-200">
              Pricing
            </a>
            <a href="#footer" className="transition hover:text-cyan-200">
              Contact
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">Connect</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-700 bg-slate-900/70 p-2 text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-700 bg-slate-900/70 p-2 text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        Copyright {new Date().getFullYear()} InventoryFlow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
