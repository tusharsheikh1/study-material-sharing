import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from "../utils/api";
import ProgressBar from "./ProgressBar";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ImSpinner8 } from "react-icons/im";

const LogoUpload = () => {
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [logoText, setLogoText] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchLogoText = async () => {
      try {
        const textRes = await api.get("/logos/logoText");
        setLogoText(textRes.data.value || "");
      } catch (error) {
        console.error("Error fetching logo text:", error);
      }
    };
    fetchLogoText();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    if (!logoFile) {
      toast.error("Please upload a logo image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", logoFile);

      setUploading(true);
      setUploadProgress(0);

      const uploadRes = await api.post("/media/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      const uploadedUrl = uploadRes.data.url;

      await api.post("/logos", { key: "logo", value: uploadedUrl });
      await api.post("/logos", { key: "logoText", value: logoText });

      toast.success("Logo and text submitted successfully!");
      setSuccess(true);
      setUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error saving logo data:", error);
      toast.error("Failed to save logo or text.");
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 text-gray-800 dark:text-gray-100">
      <ToastContainer />
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Logo Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="logoFile" className="block text-lg font-medium mb-2">
              Upload Logo Image:
            </label>
            <input
              type="file"
              id="logoFile"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="logoText" className="block text-lg font-medium mb-2">
              Logo Text:
            </label>
            <input
              type="text"
              id="logoText"
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              placeholder="Enter logo text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {uploading && <ProgressBar progress={uploadProgress} />}

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? <ImSpinner8 className="animate-spin text-lg" /> : null}
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </form>

        {(previewUrl || logoText) && (
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Preview:</h3>
            <div className="flex items-center justify-center space-x-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Logo Preview"
                  className="w-16 h-16 object-contain"
                />
              )}
              {logoText && (
                <span className="text-2xl font-semibold">{logoText}</span>
              )}
            </div>
          </div>
        )}

        {success && (
          <div className="mt-6 text-center animate-bounce">
            <AiOutlineCheckCircle className="mx-auto text-green-500 text-4xl" />
            <p className="text-green-600 dark:text-green-400 font-medium mt-2">Upload Successful!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoUpload;