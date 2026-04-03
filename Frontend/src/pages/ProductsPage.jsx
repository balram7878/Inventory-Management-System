import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/client";

const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Groceries",
  "Furniture",
  "Books",
  "Beauty",
  "Sports",
  "Toys",
  "Automotive",
  "Health",
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80";

const initialForm = {
  name: "",
  price: "",
  quantity: "",
  category: "",
  imageUrl: "",
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    currentUser = null;
  }

  const currentRole = currentUser?.role || "customer";
  const canManageProducts = currentRole === "admin" || currentRole === "staff";
  const canDeleteProducts = currentRole === "admin" || currentRole === "staff";

  const fetchProducts = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      const statusCode = error.response?.status;
      if (statusCode === 401 || statusCode === 403) {
        setErrorMessage("Session expired or unauthorized. Please login again.");
      } else {
        setErrorMessage(error.response?.data?.message || "Unable to load products");
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInput = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId("");
    setImageFile(null);
    setImagePreview("");
  };

  const uploadImageIfNeeded = async () => {
    if (!imageFile) {
      return formData.imageUrl || "";
    }

    const imageBase64 = await fileToBase64(imageFile);
    const { data } = await api.post("/products/upload-image", { imageBase64 });
    return data.imageUrl;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canManageProducts) {
      alert("You do not have permission to add or update products");
      return;
    }

    if (!PRODUCT_CATEGORIES.includes(formData.category)) {
      alert("Please choose a valid category from the dropdown");
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrl = await uploadImageIfNeeded();

      const payload = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        imageUrl,
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    if (!canManageProducts) {
      alert("You do not have permission to edit products");
      return;
    }

    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: String(product.price),
      quantity: String(product.quantity),
      category: product.category,
      imageUrl: product.imageUrl || "",
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || "");
  };

  const handleDelete = async (id) => {
    if (!canDeleteProducts) {
      alert("Only admin or staff can delete products");
      return;
    }

    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleSearch = async () => {
    setErrorMessage("");
    if (!query.trim()) {
      fetchProducts();
      return;
    }

    try {
      const { data } = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
      setProducts(data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Search failed");
      setProducts([]);
    }
  };

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  return (
    <DashboardLayout theme="dark">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-300">Product Gallery</h2>
          <p className="text-sm text-slate-300">Showcase, search, and manage products with image cards</p>
        </div>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name/category"
            className="rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400"
          >
            Search
          </button>
        </div>
      </div>

      {canManageProducts ? (
        <form onSubmit={handleSubmit} className="mb-8 grid gap-3 rounded-2xl border border-blue-800/40 bg-gradient-to-r from-slate-900 to-blue-950/70 p-4 md:grid-cols-7">
          <input
            name="name"
            value={formData.name}
            onChange={handleInput}
            placeholder="Product name"
            required
            className="rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100"
          />
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleInput}
            placeholder="Price"
            required
            className="rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100"
          />
          <input
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleInput}
            placeholder="Quantity"
            required
            className="rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleInput}
            required
            className="rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100"
          >
            <option value="">Select category</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-blue-600 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 hover:border-cyan-500">
            {imageFile ? "Image selected" : "Choose image"}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400"
          >
            Clear
          </button>

          {imagePreview ? (
            <div className="md:col-span-7">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-36 w-36 rounded-xl border border-blue-800 object-cover"
              />
            </div>
          ) : null}
        </form>
      ) : (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/15 p-4 text-sm font-medium text-amber-200">
          You can view products, but only Admin or Staff can add or edit products.
        </div>
      )}

      {errorMessage ? (
        <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/15 p-4 text-sm font-medium text-rose-200">
          {errorMessage}
        </div>
      ) : null}

      {loading ? (
        <p className="text-slate-300">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-blue-800/40 bg-slate-900/70 p-10 text-center text-slate-300">
          No products found
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="overflow-hidden rounded-3xl border border-blue-800/40 bg-gradient-to-br from-slate-900 via-blue-950/70 to-slate-900 shadow-sm transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl"
            >
              <img
                src={product.imageUrl || FALLBACK_IMAGE}
                alt={product.name}
                className="h-56 w-full object-cover"
              />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{product.name}</h3>
                    <p className="text-sm text-cyan-300">Category: {product.category}</p>
                  </div>
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                    Qty {product.quantity}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <p className="text-2xl font-extrabold text-amber-300">Rs. {product.price}</p>
                  {canManageProducts ? (
                    <button
                      onClick={() => handleEdit(product)}
                      className="rounded-lg border border-amber-400/50 bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-200 hover:bg-amber-500/30"
                    >
                      Edit
                    </button>
                  ) : null}
                </div>

                {canDeleteProducts ? (
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="w-full rounded-xl bg-rose-500/25 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/35"
                  >
                    Delete Product
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProductsPage;
