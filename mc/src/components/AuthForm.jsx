import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../context/AuthContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ImSpinner8 } from "react-icons/im";
import api from "../utils/api";

const AuthForm = ({ type }) => {
  const initialState =
    type === "login"
      ? { emailOrPhone: "", password: "" }
      : {
          fullName: "",
          email: "",
          password: "",
          phoneNumber: "",
          role: "",
          semester: "",
          batch: "",
        };

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { login, register, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const response = await api.get("/logos/logo");
        setLogoUrl(response.data.value);
      } catch (error) {
        console.error("Error fetching logo URL:", error);
      }
    };
    fetchLogoUrl();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      if (type === "login") {
        const loggedIn = await login(formData.emailOrPhone, formData.password);
        if (loggedIn) {
          toast.success("Login successful!");
          const storedUserRaw = localStorage.getItem("user");
          if (!storedUserRaw) {
            toast.error("User data not found.");
            return;
          }
          const storedUser = JSON.parse(storedUserRaw);
          setUser(storedUser);
          if (!storedUser.approved) {
            navigate("/waiting-approval");
            return;
          }
          const role = storedUser?.role;
          const sem = storedUser?.semester;
          const batch = storedUser?.batch;
          if (role === "admin") {
            navigate("/admin/dashboard");
          } else if (["faculty", "cr"].includes(role)) {
            if (!sem || !batch) {
              navigate("/user/profile");
            } else {
              navigate("/user/dashboard");
            }
          } else if (role === "student") {
            if (!sem || !batch) {
              navigate("/user/profile");
            } else {
              navigate("/user/dashboard");
            }
          } else {
            navigate("/");
          }
        }
      } else {
        const success = await register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          semester: formData.semester,
          batch: formData.batch,
        });

        if (success) {
          toast.success("Registration successful! Please verify your OTP.");
          setSuccess(true);
          navigate("/verify-otp", {
            state: {
              email: formData.email,
              phoneNumber: formData.phoneNumber,
            },
          });
        }
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const batchOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 bg-white dark:bg-gray-900 transition-colors duration-300">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl transition-all duration-300">
        {logoUrl && (
          <div className="flex justify-center mb-6">
            <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
          </div>
        )}

        <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white">
          {type === "login" ? "Welcome Back!" : "Create an Account"}
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
          {type === "login"
            ? "Sign in to continue to your account."
            : "Join us and start your journey today!"}
        </p>

        {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
        {success && (
          <div className="flex justify-center mt-4 animate-bounce text-green-500">
            <AiOutlineCheckCircle size={36} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {type !== "login" && (
            <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
            </>
          )}

          {type === "login" && (
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email or Phone
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
          )}

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-blue-500 transition duration-200"
            >
              {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
            </button>
          </div>

          {type !== "login" && (
            <>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Role
                  </label>
                  <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="cr">CR</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Semester
                  </label>
                  <input
                    type="number"
                    name="semester"
                    id="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    min={1}
                    max={12}
                    className="w-full px-4 py-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Batch
                </label>
                <select
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <option value="">Select Batch</option>
                  {batchOptions.map((b) => (
                    <option key={b} value={b}>
                      Batch {b}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading && <ImSpinner8 className="animate-spin text-lg" />}
            {type === "login" ? "Sign In" : "Sign Up"}
          </button>

          {type === "login" && (
            <div className="text-center text-sm mt-4">
              <a href="/forgot-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>
          )}
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          {type === "login" ? (
            <>
              Don’t have an account?{" "}
              <a href="/register" className="font-medium text-blue-500 hover:underline">
                Sign Up
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/login" className="font-medium text-blue-500 hover:underline">
                Sign In
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
