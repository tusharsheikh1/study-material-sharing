import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const studentId = location.state?.studentId;
  const redirectTo = location.state?.redirectAfterVerify || "/";

  useEffect(() => {
    if (!email && !studentId) {
      navigate("/register");
    } else {
      toast.success("OTP sent successfully! Please check your email or student portal.");
    }
  }, [email, studentId, navigate]);

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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    console.log("Verifying OTP with:", {
      email,
      studentId: studentId?.toLowerCase(),
      otp,
    });

    try {
      const response = await api.post("/auth/verify-otp", {
        email,
        studentId: studentId?.toLowerCase(),
        otp,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("OTP verified successfully! Redirecting...");
        setTimeout(() => navigate(redirectTo), 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      console.error("Verify OTP Error →", msg);
      setError(msg);
      toast.error(msg);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/auth/send-otp", {
        email,
        studentId: studentId?.toLowerCase(),
      });
      toast.success("OTP resent successfully!");
      setIsResendDisabled(true);
      setTimer(60);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP";
      toast.error(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">
          Verify OTP
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Enter the OTP sent to your email or student ID to verify your account.
        </p>
        {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}

        <form onSubmit={handleVerifyOtp} className="mt-6 space-y-6">
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
              placeholder="Enter the OTP"
              required
              className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg hover:from-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Verify OTP
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

export default VerifyOtp;
