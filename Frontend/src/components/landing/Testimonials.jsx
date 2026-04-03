import Reveal from "./Reveal";

const testimonials = [
  {
    quote:
      "InventoryFlow cut our stock mismatch issues by almost 40% in just one quarter. The dashboard is incredibly clear.",
    name: "Ritika Sharma",
    role: "Retail Manager",
  },
  {
    quote:
      "The order and inventory flow is smooth and fast. My team finally has one source of truth for daily operations.",
    name: "Manav Gupta",
    role: "Shop Owner",
  },
  {
    quote:
      "We now track low-stock patterns before they become urgent problems. The analytics section is my favorite part.",
    name: "Aarav Mehta",
    role: "Operations Lead",
  },
];

const Testimonials = () => {
  return (
    <section className="mx-auto w-[min(1120px,calc(100%-1.5rem))] py-12">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">Testimonials</p>
        <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold text-white sm:text-4xl">
          Trusted by teams running fast-moving inventory.
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((item, index) => (
          <Reveal key={item.name} delay={index * 70}>
            <article className="h-full rounded-2xl border border-blue-800/40 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40">
              <p className="text-sm leading-7 text-slate-200">"{item.quote}"</p>
              <div className="mt-5 border-t border-slate-700 pt-4">
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-xs uppercase tracking-wide text-cyan-300">{item.role}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
