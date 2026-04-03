import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/client";

const statusTone = {
  payment_pending: "bg-amber-500/20 text-amber-300",
  processing: "bg-cyan-500/20 text-cyan-300",
  shipped: "bg-indigo-500/20 text-indigo-300",
  delivered: "bg-emerald-500/20 text-emerald-300",
  cancelled: "bg-rose-500/20 text-rose-300",
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } catch (error) {
        alert(error.response?.data?.message || "Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <DashboardLayout theme="dark">
      <div className="mb-7">
        <h2 className="text-3xl font-bold text-amber-300">My Orders</h2>
        <p className="text-base text-slate-300">Track all your purchases and order status</p>
      </div>

      {loading ? (
        <p className="text-slate-300">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-blue-800/40 bg-slate-900/70 p-10 text-center text-slate-300">
          No orders found
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="rounded-3xl border border-blue-800/40 bg-gradient-to-br from-slate-900 to-blue-950/60 p-6 shadow-md">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-100">Order ID: {order._id}</p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold uppercase text-slate-100">
                    Payment: {order.paymentStatus}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusTone[order.orderStatus] || "bg-slate-700 text-slate-100"}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full ${
                    order.orderStatus === "delivered"
                      ? "w-full bg-emerald-500"
                      : order.orderStatus === "shipped"
                        ? "w-3/4 bg-indigo-500"
                        : order.orderStatus === "processing"
                          ? "w-1/2 bg-cyan-500"
                          : order.orderStatus === "payment_pending"
                            ? "w-1/4 bg-amber-500"
                            : "w-full bg-rose-500"
                  }`}
                />
              </div>

              <div className="space-y-3">
                {order.products.map((item) => (
                  <div key={item.productId?._id || `${order._id}-${item.price}`} className="flex items-center justify-between rounded-2xl border border-blue-900/40 bg-slate-900/70 px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-slate-100">{item.productId?.name || "Deleted Product"}</p>
                      <p className="text-xs text-slate-400">Qty {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-amber-300">Rs. {item.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-right text-lg font-bold text-amber-300">Total: Rs. {order.totalAmount}</div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyOrdersPage;
