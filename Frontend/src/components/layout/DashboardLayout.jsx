import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/client";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShoppingCart,
  ReceiptText,
} from "lucide-react";

const DashboardLayout = ({ children, theme = "light" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [animateCartBadge, setAnimateCartBadge] = useState(false);
  const [toasts, setToasts] = useState([]);
  const userMenuRef = useRef(null);
  const previousCartCountRef = useRef(0);

  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    currentUser = null;
  }

  const userName = currentUser?.name || "User";
  const userEmail = currentUser?.email || "-";
  const userRole = currentUser?.role || "customer";
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (userRole !== "customer") {
      setCartCount(0);
      return;
    }

    const fetchCartCount = async () => {
      try {
        const { data } = await api.get("/cart");
        const total = (data.items || []).reduce((sum, item) => {
          if (!item?.productId?._id) {
            return sum;
          }
          return sum + (Number(item.quantity) || 0);
        }, 0);
        setCartCount(total);
      } catch (error) {
        setCartCount(0);
      }
    };

    fetchCartCount();

    const handleCartUpdated = () => {
      fetchCartCount();
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, [userRole]);

  useEffect(() => {
    if (cartCount !== previousCartCountRef.current) {
      setAnimateCartBadge(true);
      const timer = setTimeout(() => setAnimateCartBadge(false), 450);
      previousCartCountRef.current = cartCount;
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [cartCount]);

  useEffect(() => {
    const onToast = (event) => {
      const detail = event.detail || {};
      const id = Date.now() + Math.random();
      const toast = {
        id,
        message: detail.message || "Done",
        type: detail.type || "info",
      };

      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 2600);
    };

    window.addEventListener("app-toast", onToast);
    return () => window.removeEventListener("app-toast", onToast);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems =
    userRole === "customer"
      ? [
          { label: "Shop", path: "/shop", icon: ShoppingBag },
          {
            label: "Cart",
            path: "/cart",
            badge: cartCount,
            icon: ShoppingCart,
          },
          { label: "My Orders", path: "/my-orders", icon: ReceiptText },
        ]
      : [
          { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { label: "Products", path: "/products", icon: Package },
        ];

  const isDarkSurface = theme === "dark";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100">
      <header className="border-b border-blue-800/40 bg-slate-950/90 text-white backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 py-4">
          <h1 className="text-xl font-semibold tracking-wide text-amber-300">Inventory Management</h1>
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/70 bg-slate-900 text-sm font-bold text-amber-300 shadow-md hover:bg-black"
              title="User details"
            >
              {initials}
            </button>

            {showUserMenu ? (
              <div className="absolute right-0 z-20 mt-3 w-64 rounded-2xl border border-blue-700/40 bg-gradient-to-b from-slate-900 to-black p-4 text-slate-100 shadow-xl">
                <p className="text-sm font-semibold text-amber-300">{userName}</p>
                <p className="text-xs text-slate-400">{userEmail}</p>
                <p className="mt-2 inline-block rounded-full bg-blue-900/70 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
                  {userRole}
                </p>
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-5 py-8 md:flex-row">
        <aside className="w-full rounded-3xl border border-blue-800/40 bg-gradient-to-b from-slate-900 to-slate-950 p-3 shadow-xl md:sticky md:top-5 md:h-[calc(100vh-2.5rem)] md:w-72">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-amber-400 text-slate-900"
                      : "text-slate-200 hover:bg-blue-900/40"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {Icon ? <Icon size={16} /> : null}
                    {item.label}
                  </span>
                  {typeof item.badge === "number" ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive ? "bg-slate-900 text-amber-300" : "bg-blue-800 text-white"
                      } ${animateCartBadge && item.path === "/cart" ? "scale-110" : "scale-100"} transition-transform`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main
          className={`flex-1 rounded-3xl border p-5 shadow-xl md:min-h-[calc(100vh-2.5rem)] md:p-8 ${
            isDarkSurface
              ? "border-blue-700/40 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100"
              : "border-blue-700/30 bg-slate-50 text-slate-900"
          }`}
        >
          <div className="min-h-[calc(100vh-11rem)]">{children}</div>
          <footer
            className={`mt-8 border-t pt-4 text-center text-xs font-medium ${
              isDarkSurface ? "border-blue-900/60 text-slate-400" : "border-slate-200 text-slate-500"
            }`}
          >
            Inventory Management MVP · Built with MERN
          </footer>
        </main>
      </div>

      <div className="fixed right-5 top-20 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-64 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === "error"
                ? "bg-rose-600 text-white"
                : toast.type === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 text-amber-300"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLayout;
