import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (isResendDisabled) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isResendDisabled]);

  const handleResendOtp = async () => {
    try {
      await api.post("/auth/send-otp", { email });
      toast.success("OTP resent successfully!");
      setIsResendDisabled(true);
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Enter the OTP sent to your email and set a new password.
        </p>
        {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className={`px-4 py-2 text-white rounded-lg ${
              isResendDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
