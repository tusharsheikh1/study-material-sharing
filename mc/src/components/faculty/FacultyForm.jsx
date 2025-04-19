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
      className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md shadow-xl rounded-3xl p-8 max-w-2xl mx-auto space-y-8 border border-gray-200 dark:border-gray-700 transition-all duration-300"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2 tracking-tight">
        {isEditing ? "Edit Faculty Info" : "Add New Faculty"}
      </h2>

      {/* Input with floating labels and icons */}
      {[
        { name: "name", label: "Full Name", icon: MdPerson },
        { name: "designation", label: "Designation", icon: MdWork },
        { name: "email", label: "Email", icon: MdEmail },
        { name: "phone", label: "Phone", icon: MdPhone },
      ].map(({ name, label, icon: Icon }) => (
        <div key={name} className="relative">
          <input
            type={name === "email" ? "email" : "text"}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            required
            placeholder=" "
            className="peer w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <label
            className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 dark:peer-focus:text-blue-400 transition-all"
          >
            {label}
          </label>
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl" />
        </div>
      ))}

      {/* Image upload */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Upload Profile Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 file:px-4 file:py-2 file:font-semibold hover:file:bg-blue-200 transition w-full"
        />
        {uploading && (
          <p className="text-sm text-blue-500 mt-2 animate-pulse">
            Uploading image...
          </p>
        )}
        {formData.photoUrl && (
          <div className="mt-4">
            <img
              src={formData.photoUrl}
              alt="Uploaded"
              className="w-24 h-24 rounded-full border shadow object-cover"
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
