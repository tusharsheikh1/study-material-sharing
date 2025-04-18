import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60); // 1-minute timer
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email and phoneNumber from the location state (passed from registration)
  const email = location.state?.email;
  const phoneNumber = location.state?.phoneNumber;

  useEffect(() => {
    if (!email && !phoneNumber) {
      // Redirect to registration if neither email nor phone number is provided
      navigate("/register");
    } else {
      // Notify the user that the OTP has been sent
      toast.success("OTP sent successfully! Please check your email or phone.");
    }
  }, [email, phoneNumber, navigate]);

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

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, phoneNumber, otp }
      );
      // Redirect to home page after successful verification
      if (response.data.token) {
        // Save the token to localStorage for session persistence
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("OTP verified successfully! Redirecting...");
        setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        email,
        phoneNumber,
      });
      toast.success("OTP resent successfully!");
      setIsResendDisabled(true);
      setTimer(60); // Reset the timer
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
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
          Enter the OTP sent to your email or phone to verify your account.
        </p>
        {error && (
          <p className="mt-4 text-sm text-center text-red-500">{error}</p>
        )}
        <form onSubmit={handleVerifyOtp} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
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