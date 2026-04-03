import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/client";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInput = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handlePay = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post(`/orders/${orderId}/pay`, { paymentMethod: "card" });
      alert("Payment successful");
      navigate("/my-orders");
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout theme="dark">
      <div className="mx-auto max-w-xl rounded-3xl border border-blue-800/40 bg-gradient-to-br from-slate-900 to-blue-950/70 p-6 shadow-lg">
        <h2 className="mb-2 text-2xl font-bold text-amber-300">Payment</h2>
        <p className="mb-6 text-sm text-slate-300">Simulate card payment to complete your order</p>

        <form onSubmit={handlePay} className="space-y-4">
          <input
            name="cardName"
            value={formData.cardName}
            onChange={handleInput}
            required
            placeholder="Card Holder Name"
            className="w-full rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100"
          />
          <input
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInput}
            required
            placeholder="Card Number"
            className="w-full rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="expiry"
              value={formData.expiry}
              onChange={handleInput}
              required
              placeholder="MM/YY"
              className="w-full rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100"
            />
            <input
              name="cvv"
              value={formData.cvv}
              onChange={handleInput}
              required
              placeholder="CVV"
              className="w-full rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-2 font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;
