import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(`/reset-password/${token}`, { password });
      setMessage(data.message || "Password reset successful");
      setTimeout(() => navigate("/login"), 1500);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-3xl border border-blue-700/40 bg-gradient-to-b from-slate-900 to-black p-8 shadow-2xl">
        <h1 className="mb-2 text-2xl font-bold text-amber-300">Reset Password</h1>
        <p className="mb-6 text-sm text-slate-300">Set your new password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-blue-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset Password"}
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

export default ResetPasswordPage;
