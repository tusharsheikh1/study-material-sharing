// 3️⃣ PasswordInput.jsx
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, showPassword, setShowPassword }) => {
  return (
    <div className="relative">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Password
      </label>
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        value={value}
        onChange={onChange}
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
  );
};

export default PasswordInput;
