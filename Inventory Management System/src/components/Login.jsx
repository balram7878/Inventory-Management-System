import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";

const schema = z.object({
  email: z.string().email("Invalid email").max(50, "Email too long"),
  password: z.string().min(6, "Password too short").max(100, "Password too long"),
});

const EmailIcon = () => ( <svg className="w-5 h-5 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" > <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" /> </svg> );
const LockIcon = () => ( <svg className="w-5 h-5 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" > <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /> </svg> );

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const formSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-[#1b1b1b] flex items-center justify-center px-4 font-inter">
      <form
        onSubmit={handleSubmit(formSubmit)}
        className="flex flex-col gap-4 w-full max-w-sm bg-[#121212] border border-gray-800 rounded-2xl px-8 py-10"
      >
        {/* Heading */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-semibold text-white ">Login</h1>
          <p className="text-gray-500 text-sm mt-1">Access your account</p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-sm">Email</label>
          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-xl px-3 py-2 focus-within:border-gray-400 transition-all duration-200">
            <EmailIcon />
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full bg-transparent text-gray-200 outline-none text-sm placeholder-gray-500"
              autoComplete="off"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-sm">Password</label>
          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-xl px-3 py-2 focus-within:border-gray-400 transition-all duration-200">
            <LockIcon />
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full bg-transparent text-gray-200 outline-none text-sm placeholder-gray-500"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link
            to="/reset-password"
            className="text-gray-500 text-sm hover:text-gray-300 transition-all duration-200"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-[#2a2a2a] text-white text-sm font-medium hover:bg-[#333] transition-all duration-200"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-2">
          <div className="h-px bg-gray-700 w-1/4" />
          <span className="text-gray-500 text-xs">or</span>
          <div className="h-px bg-gray-700 w-1/4" />
        </div>

        {/* Sign up */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-gray-400 text-sm">Don’t have an account?</p>
          <Link
            to="/signup"
            className="w-full py-2.5 rounded-xl bg-[#2a2a2a] text-white text-sm font-medium hover:bg-[#333] transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
