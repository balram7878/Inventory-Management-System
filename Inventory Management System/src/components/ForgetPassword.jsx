import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Enter a valid email").max(50, "Email too long"),
});

const EmailIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
  >
    <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.708 2.825L15 11.105V5.383zM1 5.383v5.722l4.708-2.897L1 5.383z" />
  </svg>
);

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    console.log("Sending reset email to:", data.email);
  };

  return (
    <div className="min-h-screen bg-[#1b1b1b] flex items-center justify-center px-4 font-inter">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full max-w-sm bg-[#121212] border border-gray-800 rounded-2xl px-8 py-10"
      >
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-semibold text-white">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email to reset your password
          </p>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-sm">Email</label>
          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-xl px-3 py-2 focus-within:border-gray-400 transition-all duration-200">
            <EmailIcon />
            <input
              type="email"
              placeholder="Enter your registered email"
              {...register("email")}
              className="w-full bg-transparent text-gray-200 outline-none text-sm placeholder-gray-500"
              autoComplete="off"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-[#2a2a2a] text-white text-sm font-medium hover:bg-[#333] transition-all duration-200 disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Back to Login */}
        <div className="flex flex-col items-center gap-2 text-center mt-2">
          <p className="text-gray-400 text-sm">Remember your password?</p>
          <Link
            to="/login"
            className="w-full py-2.5 rounded-xl bg-[#2a2a2a] text-white text-sm font-medium hover:bg-[#333] transition-all duration-200"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
