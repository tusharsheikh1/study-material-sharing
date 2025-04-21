import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../context/AuthContext";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ImSpinner8 } from "react-icons/im";
import api from "../utils/api";
import AuthFormFields from "./AuthFormFields";

const AuthForm = ({ type }) => {
  const initialState =
    type === "login"
      ? { emailOrId: "", password: "" }
      : {
          fullName: "",
          email: "",
          studentId: "",
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
        const loggedIn = await login(formData.emailOrId, formData.password);
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
          } else if (["cr", "student"].includes(role)) {
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
        const registrationData = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          semester: formData.semester,
          batch: formData.batch,
          studentId: formData.studentId,
        };

        const success = await register(registrationData);

        if (success) {
          toast.success("Registration successful! Please verify your OTP.");
          setSuccess(true);
          navigate("/verify-otp", {
            state: {
              email: formData.email,
              studentId: formData.studentId,
              redirectAfterVerify: "/waiting-approval",
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
  const semesterOptions = Array.from({ length: 10 }, (_, i) => i + 1);

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

        <AuthFormFields
          type={type}
          handleSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          loading={loading}
          batchOptions={batchOptions}
          semesterOptions={semesterOptions}
        />

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
