import Navbar from "../components/landing/Navbar";
import Testimonials from "../components/landing/Testimonials";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    user = null;
  }

  const token = localStorage.getItem("token");
  const homePath = user?.role === "customer" ? "/shop" : "/dashboard";

  return (
    <div className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_8%_12%,rgba(6,182,212,0.28),transparent_28%),radial-gradient(circle_at_92%_8%,rgba(245,158,11,0.28),transparent_23%),linear-gradient(145deg,#020617,#0b1124_45%,#172554)] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.1),transparent_35%),radial-gradient(circle_at_80%_65%,rgba(245,158,11,0.08),transparent_30%)]" />
      <div className="relative z-10">
        <Navbar token={token} homePath={homePath} />

        <Testimonials />
        <CTASection token={token} homePath={homePath} />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
