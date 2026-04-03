import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

const Hero = ({ token, homePath }) => {
  return (
    <section className="mx-auto grid w-[min(1120px,calc(100%-1.5rem))] gap-10 pb-14 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <Reveal>
        <p className="mb-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
          Inventory Management SaaS
        </p>
        <h1 className="font-['Space_Grotesk'] text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Inventory clarity, sales confidence, and operational speed in one workspace.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
          InventoryFlow helps teams manage products, stock movement, and orders with a modern dashboard that turns complexity into clean daily execution.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={token ? homePath : "/signup"}
            className="group inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.45)] transition hover:scale-[1.03] hover:bg-cyan-300"
          >
            Start Free
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#product-preview"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-500/70 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:scale-[1.02] hover:border-amber-300 hover:text-amber-200"
          >
            <PlayCircle size={16} />
            View Demo
          </a>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="relative rounded-3xl border border-cyan-300/25 bg-gradient-to-br from-slate-900/95 via-blue-950/90 to-slate-900 p-4 shadow-2xl shadow-cyan-950/30">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3">
            <p className="text-sm font-semibold text-slate-100">InventoryFlow Dashboard</p>
            <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Live</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-900/60 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400">Revenue</p>
              <p className="mt-1 text-2xl font-bold text-amber-300">Rs. 3.8L</p>
              <p className="text-xs text-emerald-300">+12.4% this month</p>
            </div>
            <div className="rounded-2xl border border-blue-900/60 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400">Low Stock Alerts</p>
              <p className="mt-1 text-2xl font-bold text-rose-300">08</p>
              <p className="text-xs text-slate-300">Needs immediate restock</p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-blue-900/60 bg-slate-900/70 p-4">
            <p className="mb-3 text-xs text-slate-400">Weekly Sales Trend</p>
            <div className="flex h-24 items-end gap-2">
              {[35, 48, 44, 67, 72, 65, 84].map((value) => (
                <div key={value} className="flex-1 rounded-md bg-gradient-to-t from-cyan-500/60 to-cyan-300" style={{ height: `${value}%` }} />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default Hero;
