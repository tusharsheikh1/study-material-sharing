import React, { useState, useEffect } from "react";
import MediaUpload from "./MediaUpload";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from "../utils/api"; // Axios instance for API calls

const LogoUpload = () => {
  const [logoUrl, setLogoUrl] = useState("");
  const [submittedLogoUrl, setSubmittedLogoUrl] = useState("");
  const [logoText, setLogoText] = useState("");
  const [submittedLogoText, setSubmittedLogoText] = useState("");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoRes = await api.get("/logos/logo");
        setLogoUrl(logoRes.data.value);
        setSubmittedLogoUrl(logoRes.data.value);

        const textRes = await api.get("/logos/logoText");
        setLogoText(textRes.data.value);
        setSubmittedLogoText(textRes.data.value);
      } catch (error) {
        console.error("Error fetching logo data:", error);
      }
    };
    fetchLogo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logoUrl) {
      toast.error("Please enter a valid logo URL.");
      return;
    }

    try {
      await api.post("/logos", { key: "logo", value: logoUrl });
      await api.post("/logos", { key: "logoText", value: logoText });
      setSubmittedLogoUrl(logoUrl);
      setSubmittedLogoText(logoText);
      toast.success("Logo and text submitted successfully!");
    } catch (error) {
      console.error("Error saving logo data:", error);
      toast.error("Failed to save logo or text.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Logo Upload */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Logo Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="logoUrl" className="block text-lg font-medium mb-2">
                Logo URL:
              </label>
              <input
                type="url"
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Enter logo URL"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Submit
            </button>
          </form>

          {/* Display the submitted logo and text */}
          {(submittedLogoUrl || submittedLogoText) && (
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Preview:</h3>
              <div className="flex items-center justify-center space-x-4">
                {submittedLogoUrl && (
                  <img
                    src={submittedLogoUrl}
                    alt="Logo Preview"
                    className="w-16 h-16 object-contain"
                  />
                )}
                {submittedLogoText && (
                  <span className="text-2xl font-semibold">{submittedLogoText}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Media Upload */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Media Upload</h2>
          <MediaUpload />
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;
