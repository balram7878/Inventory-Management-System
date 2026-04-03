import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ token, homePath }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`mx-auto mt-4 flex w-[min(1120px,calc(100%-1.5rem))] items-center justify-between rounded-2xl border px-4 py-3 transition-all sm:px-6 ${
          scrolled
            ? "border-cyan-400/30 bg-slate-950/75 shadow-xl shadow-cyan-950/30 backdrop-blur-xl"
            : "border-slate-700/60 bg-slate-950/45 backdrop-blur-md"
        }`}
      >
        <Link to="/" className="font-['Space_Grotesk'] text-xl font-bold tracking-wide text-amber-300">
          InventoryFlow
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-cyan-300">
            Features
          </a>
          <a href="#analytics" className="transition hover:text-cyan-300">
            Pricing
          </a>
          <a href="#footer" className="transition hover:text-cyan-300">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {token ? (
            <Link
              to={homePath}
              className="rounded-xl border border-cyan-300/50 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-200 transition hover:scale-[1.02] hover:border-cyan-200 hover:bg-cyan-400/20"
            >
              Open App
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:scale-[1.03] hover:bg-amber-400"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
