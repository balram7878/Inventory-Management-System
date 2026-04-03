import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/client";
import { showToast } from "../utils/toast";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/items/${productId}`);
      setCart(data);
      window.dispatchEvent(new Event("cart-updated"));
      showToast("Item removed from cart", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to remove item", "error");
    }
  };

  const updateItemQuantity = async (productId, nextQuantity) => {
    if (nextQuantity < 1) {
      return removeFromCart(productId);
    }

    try {
      const { data } = await api.patch(`/cart/items/${productId}`, { quantity: nextQuantity });
      setCart(data);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update quantity", "error");
    }
  };

  const validCartItems = useMemo(() => {
    return cart.items.filter((item) => item?.productId?._id);
  }, [cart.items]);

  const unavailableItemsCount = cart.items.length - validCartItems.length;

  const totalItems = useMemo(() => {
    return validCartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }, [validCartItems]);

  const total = useMemo(() => {
    return validCartItems.reduce((sum, item) => {
      const price = Number(item.productId?.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);
  }, [validCartItems]);

  const checkout = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post("/cart/checkout");
      window.dispatchEvent(new Event("cart-updated"));
      showToast("Checkout successful. Proceed to payment.", "success");
      navigate(`/payment/${data.order._id}`);
    } catch (error) {
      showToast(error.response?.data?.message || "Checkout failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout theme="dark">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-300">My Cart</h2>
          <p className="text-base text-slate-300">Review your selected products and proceed to checkout</p>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-300">Loading cart...</p>
      ) : validCartItems.length === 0 ? (
        <div className="rounded-3xl border border-blue-800/40 bg-slate-900/70 p-12 text-center text-slate-300">
          {unavailableItemsCount > 0
            ? "Cart items are unavailable because those products no longer exist"
            : "Your cart is empty"}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {validCartItems.map((item) => (
              <div key={item.productId._id} className="rounded-3xl border border-blue-800/40 bg-gradient-to-br from-slate-900 to-blue-950/60 p-5 shadow-md">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.productId.imageUrl ||
                        "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={item.productId.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold text-slate-100">{item.productId.name}</p>
                      <p className="text-sm text-cyan-300">Category: {item.productId.category}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item.productId._id, item.quantity - 1)}
                          className="h-7 w-7 rounded-full bg-slate-700 text-sm font-bold text-slate-100 hover:bg-slate-600"
                        >
                          -
                        </button>
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-sm font-semibold text-slate-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItemQuantity(item.productId._id, item.quantity + 1)}
                          className="h-7 w-7 rounded-full bg-cyan-500 text-sm font-bold text-slate-900 hover:bg-cyan-400"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-base font-semibold text-amber-300">Rs. {item.productId.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId._id)}
                    className="rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-3xl border border-blue-800/40 bg-gradient-to-br from-slate-900 to-black p-5 text-white shadow-lg">
            <p className="text-lg font-semibold">Order Summary</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Amount</span>
                <span className="text-lg font-bold text-white">Rs. {total}</span>
              </div>
            </div>
            <button
              onClick={checkout}
              disabled={processing || validCartItems.length === 0}
              className="mt-5 w-full rounded-xl bg-cyan-500 px-4 py-2.5 font-semibold text-white hover:bg-cyan-400 disabled:opacity-60"
            >
              {processing ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CartPage;
