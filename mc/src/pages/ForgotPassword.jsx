import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [useEmail, setUseEmail] = useState(true); // Toggle between email and phone
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (useEmail && !email) {
        setError("Please provide an email address.");
        toast.error("Please provide an email address.");
        return;
      }
      if (!useEmail && !phoneNumber) {
        setError("Please provide a phone number.");
        toast.error("Please provide a phone number.");
        return;
      }

      await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: useEmail ? email : undefined,
        phoneNumber: !useEmail ? phoneNumber : undefined,
      });

      setSuccess(true);
      toast.success("OTP sent successfully! Redirecting...");
      setTimeout(() => {
        navigate("/reset-password", { state: { email, phoneNumber } });
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
      toast.error(err.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Enter your email address or phone number to receive a one-time password (OTP) to reset your password.
        </p>
        {error && (
          <p className="mt-4 text-sm text-center text-red-500">{error}</p>
        )}
        {success && (
          <p className="mt-4 text-sm text-center text-green-500">
            OTP sent successfully! Redirecting...
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setUseEmail(true)}
              className={`px-4 py-2 rounded-lg ${
                useEmail
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Use Email
            </button>
            <button
              type="button"
              onClick={() => setUseEmail(false)}
              className={`px-4 py-2 rounded-lg ${
                !useEmail
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Use Phone
            </button>
          </div>
          {useEmail ? (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send OTP
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Remembered your password?{" "}
          <a
            href="/login"
            className="font-medium text-blue-500 hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;