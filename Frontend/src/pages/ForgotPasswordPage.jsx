import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setResetUrl("");
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/forgot-password", { email });
      setMessage(data.message || "Request submitted");
      setResetUrl(data.resetUrl || "");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-3xl border border-blue-700/40 bg-gradient-to-b from-slate-900 to-black p-8 shadow-2xl">
        <h1 className="mb-2 text-2xl font-bold text-amber-300">Forgot Password</h1>
        <p className="mb-6 text-sm text-slate-300">Enter your email to request a reset link</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          {resetUrl ? (
            <p className="text-sm text-slate-300">
              Reset link: <a href={resetUrl} className="font-medium text-cyan-700 hover:text-cyan-600">Open Reset Page</a>
            </p>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-300">
          Back to{" "}
          <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
