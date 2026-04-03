import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

const CTASection = ({ token, homePath }) => {
  return (
    <section className="mx-auto w-[min(1120px,calc(100%-1.5rem))] py-12">
      <Reveal>
        <div className="rounded-3xl border border-cyan-300/30 bg-[linear-gradient(120deg,rgba(34,211,238,0.18),rgba(245,158,11,0.16),rgba(15,23,42,0.95))] p-8 shadow-2xl shadow-cyan-950/30 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">Ready to scale?</p>
          <h2 className="mt-3 max-w-2xl font-['Space_Grotesk'] text-3xl font-bold text-white sm:text-4xl">
            Start managing your inventory smarter today
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            Join teams using InventoryFlow to reduce stock errors, speed up fulfillment, and gain clearer insight into growth.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={token ? homePath : "/signup"}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.45)] transition hover:scale-[1.03] hover:bg-cyan-300"
            >
              {token ? "Open Workspace" : "Start Free"}
              <ArrowRight size={16} />
            </Link>
            <Link
              to={token ? "/shop" : "/login"}
              className="rounded-xl border border-slate-500/70 bg-slate-900/65 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-amber-300 hover:text-amber-200"
            >
              View Demo
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default CTASection;
