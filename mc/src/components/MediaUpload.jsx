import React, { useState } from "react";
import api from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const MediaUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [failedFiles, setFailedFiles] = useState([]);
  const [progress, setProgress] = useState({});

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];

    selectedFiles.forEach((file) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File too large (max 5MB): ${file.name}`);
        return;
      }
      validFiles.push(file);
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = [];

    droppedFiles.forEach((file) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File too large (max 5MB): ${file.name}`);
        return;
      }
      validFiles.push(file);
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRetry = async (file) => {
    setFailedFiles((prev) => prev.filter((f) => f.name !== file.name));
    await uploadFile(file);
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setProgress((prev) => ({
            ...prev,
            [file.name]: percentCompleted,
          }));
        },
      });

      const uploaded = { name: file.name, url: response.data.url };
      setUploadedFiles((prev) => [...prev, uploaded]);
      toast.success(`Uploaded: ${file.name}`);
    } catch (error) {
      console.error(`Error uploading ${file.name}`, error);
      setFailedFiles((prev) => [...prev, file]);
      toast.error(`Failed to upload: ${file.name}`);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.warning("Please select files to upload.");
      return;
    }

    setUploading(true);
    setProgress({});

    for (const file of files) {
      await uploadFile(file);
    }

    setFiles([]);
    setUploading(false);
  };

  const handleClear = () => {
    setFiles([]);
    setUploadedFiles([]);
    setFailedFiles([]);
    setProgress({});
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Media</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
          >
            <p className="text-gray-600 mb-2">Drag and drop files here</p>
            <input type="file" multiple onChange={handleFileChange} id="fileInput" className="hidden" />
            <label htmlFor="fileInput" className="text-blue-600 font-medium hover:underline cursor-pointer">
              Or click to browse files
            </label>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              disabled={uploading || files.length === 0}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Selected Files:</h3>
            <ul className="space-y-4">
              {files.map((file, index) => (
                <li key={index} className="bg-gray-100 rounded-md p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {file.type.startsWith("image/") ? (
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-2xl">📄</span>
                    )}
                    <span>{file.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                    {progress[file.name] && (
                      <div className="w-40 mt-2 h-2 bg-gray-300 rounded">
                        <div
                          style={{ width: `${progress[file.name]}%` }}
                          className="h-full bg-green-500 rounded"
                        ></div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Uploaded Files:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="bg-green-50 p-4 rounded-md shadow flex flex-col">
                  <strong className="mb-1">{file.name}</strong>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm truncate hover:underline"
                  >
                    {file.url}
                  </a>
                  <button
                    onClick={() => handleCopy(file.url)}
                    className="mt-2 w-fit bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Copy Link
                  </button>
                  {!file.url.endsWith(".pdf") && (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="mt-4 w-full max-h-48 object-cover rounded-md"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Failed Files */}
        {failedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-red-600 mb-3">Failed Uploads:</h3>
            <ul className="space-y-3">
              {failedFiles.map((file, index) => (
                <li key={index} className="bg-red-50 p-4 rounded flex justify-between items-center">
                  <span>{file.name}</span>
                  <button
                    onClick={() => handleRetry(file)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Retry
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
