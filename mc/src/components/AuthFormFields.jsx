// 2️⃣ AuthFormFields.jsx
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import PasswordInput from "./PasswordInput";

const AuthFormFields = ({
  type,
  handleSubmit,
  formData,
  handleChange,
  showPassword,
  setShowPassword,
  loading,
  batchOptions,
}) => {
  const semesterOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
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

      <PasswordInput
        value={formData.password}
        onChange={handleChange}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

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

          {formData.role !== "faculty" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Semester
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <option value="">Select Semester</option>
                  {semesterOptions.map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
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
            </div>
          )}
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
  );
};

export default AuthFormFields;