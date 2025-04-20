import { useState } from "react";
import axios from "../../utils/api";
import { ImSpinner8 } from "react-icons/im";
import { MdEmail, MdPhone, MdPerson, MdWork } from "react-icons/md";

const FacultyForm = ({ initialData = {}, onSuccess, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    email: "",
    phone: "",
    photoUrl: "",
    ...initialData,
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post("/media/upload", form);
      setFormData({ ...formData, photoUrl: res.data.url });
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await axios.put(`/faculty/${initialData._id}`, formData);
      } else {
        await axios.post("/faculty", formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving faculty:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 space-y-6 transition-all duration-300"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEditing ? "Edit Faculty Details" : "Add New Faculty"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Please fill in the required fields below
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          { name: "name", label: "Full Name", icon: MdPerson },
          { name: "designation", label: "Designation", icon: MdWork },
          { name: "email", label: "Email", icon: MdEmail },
          { name: "phone", label: "Phone", icon: MdPhone },
        ].map(({ name, label, icon: Icon }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {label}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Icon className="text-xl" />
              </span>
              <input
                type={name === "email" ? "email" : "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Upload Profile Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 file:px-4 file:py-2 file:font-semibold hover:file:bg-blue-200 transition w-full"
        />
        {uploading && (
          <p className="text-sm text-blue-500 animate-pulse mt-1">Uploading image...</p>
        )}
        {formData.photoUrl && (
          <div className="mt-3 flex justify-center">
            <img
              src={formData.photoUrl}
              alt="Uploaded"
              className="w-24 h-24 rounded-full border-4 border-blue-400 shadow hover:scale-105 transition-transform object-cover"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-all duration-200 shadow-md"
      >
        {submitting && <ImSpinner8 className="animate-spin text-lg" />}
        {isEditing ? "Update Faculty" : "Add Faculty"}
      </button>
    </form>
  );
};

export default FacultyForm;
