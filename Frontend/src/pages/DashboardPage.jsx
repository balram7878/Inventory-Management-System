import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/client";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    totalOrders: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/stats");
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      tone: "border-cyan-400/25 bg-cyan-500/10 text-cyan-200",
    },
    {
      title: "Low Stock",
      value: stats.lowStockCount,
      tone: "border-amber-400/25 bg-amber-500/10 text-amber-200",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      tone: "border-emerald-400/25 bg-emerald-500/10 text-emerald-200",
    },
    {
      title: "Total Sales",
      value: `Rs. ${stats.totalSales}`,
      tone: "border-indigo-400/25 bg-indigo-500/10 text-indigo-200",
    },
  ];

  return (
    <DashboardLayout theme="dark">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-amber-300">Dashboard</h2>
        <p className="text-sm text-slate-300">Quick summary of your inventory performance</p>
      </div>

      {loading ? (
        <p className="text-slate-300">Loading stats...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className={`rounded-2xl border p-5 shadow-md ${card.tone}`}>
              <p className="text-sm font-medium">{card.title}</p>
              <p className="mt-2 text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
