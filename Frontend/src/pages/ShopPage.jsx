import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/client";
import { showToast } from "../utils/toast";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartQtyMap, setCartQtyMap] = useState({});
  const [addingProductId, setAddingProductId] = useState("");

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");
      const qtyMap = {};
      for (const item of data.items || []) {
        qtyMap[item.productId?._id] = item.quantity;
      }
      setCartQtyMap(qtyMap);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      setCartQtyMap({});
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const addToCart = async (productId) => {
    setAddingProductId(productId);
    try {
      await api.post("/cart/items", { productId, quantity: 1 });
      setCartQtyMap((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      }));
      window.dispatchEvent(new Event("cart-updated"));
      showToast("Added to cart", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to add product", "error");
    } finally {
      setAddingProductId("");
    }
  };

  return (
    <DashboardLayout theme="dark">
      <div className="mb-7">
        <h2 className="text-3xl font-bold text-amber-300">Shop</h2>
        <p className="text-base text-slate-300">Browse products and add them to your cart</p>
      </div>

      {loading ? (
        <p className="text-slate-300">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-blue-800/40 bg-slate-900/70 p-10 text-center text-slate-300">
          No products available
        </div>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="overflow-hidden rounded-3xl border border-blue-800/40 bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-900 shadow-lg transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-cyan-900/30">
              <img
                src={product.imageUrl || "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80"}
                alt={product.name}
                className="h-64 w-full object-cover"
              />
              <div className="space-y-3 p-5">
                <h3 className="text-xl font-bold text-slate-100">{product.name}</h3>
                <p className="text-sm text-cyan-300">{product.category}</p>
                <p className="text-2xl font-extrabold text-amber-300">Rs. {product.price}</p>
                <p className="text-sm text-slate-300">In cart: {cartQtyMap[product._id] || 0}</p>
                <button
                  onClick={() => addToCart(product._id)}
                  disabled={addingProductId === product._id}
                  className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-cyan-400 disabled:opacity-60"
                >
                  {addingProductId === product._id
                    ? "Adding..."
                    : cartQtyMap[product._id]
                      ? "Add more +1"
                      : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ShopPage;
