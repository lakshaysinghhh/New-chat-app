
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MessageSquare, User, Mail, Lock, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";

const SignUpPage = () => {
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await signup(formData);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center items-center w-full px-6 py-12 lg:px-16 xl:px-24">

        <div className="w-full max-w-lg xl:max-w-xl space-y-6 sm:space-y-8">

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className="flex flex-col items-center gap-2">

              <div className="size-10 sm:size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-5 sm:size-6 text-primary" />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold mt-2">
                Create Account
              </h1>

              <p className="text-sm sm:text-base text-base-content/60">
                Get started with your free account
              </p>

            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

            {/* Full Name */}
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Lakshay Singh"
                className="input input-bordered w-full pl-10"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="lakshaysingh@gmail.com"
                className="input input-bordered w-full pl-10"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full pl-10"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="text-center text-sm sm:text-base">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex items-center justify-center bg-base-200">

        <AuthImagePattern
          title="Join our community"
          subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
        />

      </div>

    </div>
  );
};

export default SignUpPage;
