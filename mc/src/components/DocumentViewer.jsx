import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { FiArrowLeft, FiDownload } from "react-icons/fi";

const inferFileType = (url) => {
  const extMatch = url.split("?")[0].match(/\.(\w+)$/);
  if (extMatch) return extMatch[1].toLowerCase();
  if (url.includes("cloudinary") && url.includes("/raw/")) return "pdf";
  return null;
};

const normalizeCloudinaryUrl = (url, fileType) => {
  if (url.includes("cloudinary") && !url.includes(".") && fileType === "pdf") {
    return `${url}.pdf`;
  }
  return url;
};

const extractFileName = (url) => {
  try {
    const cleanUrl = decodeURIComponent(url.split("?")[0]);
    const parts = cleanUrl.split("/");
    return parts[parts.length - 1] || "Unknown File";
  } catch {
    return "Untitled Document";
  }
};

const DocumentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawUrl = searchParams.get("url");
  const [loading, setLoading] = useState(true);

  if (!rawUrl) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600 font-semibold px-4 text-center">
        ❌ No document URL provided.
      </div>
    );
  }

  const fileType = inferFileType(rawUrl);
  const fileUrl = normalizeCloudinaryUrl(rawUrl, fileType);
  const fileName = extractFileName(fileUrl);
  const isOfficeFile = ["docx", "doc", "pptx", "ppt", "xlsx", "xls"].includes(fileType);
  const isPdf = fileType === "pdf";
  const docs = [{ uri: fileUrl, fileType: fileType || "pdf" }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black flex items-center justify-center px-2 sm:px-6 py-6">
      <div className="w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden relative">
        {/* Floating Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 px-4 py-2 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            <FiArrowLeft className="text-lg" />
            <span>Back</span>
          </button>
          <div className="text-xs sm:text-sm font-medium truncate text-center w-full text-gray-800 dark:text-white">
            {fileName}
          </div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs rounded-full shadow"
          >
            <FiDownload className="text-sm" />
            Download
          </a>
        </div>

        {/* Viewer Body */}
        <div className="mt-12 h-[75vh] sm:h-[85vh] relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-black/50 backdrop-blur">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-blue-700 dark:text-white">Loading document...</p>
            </div>
          )}

          {isPdf ? (
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
              className="w-full h-full rounded-b-2xl"
              frameBorder="0"
              title="PDF Viewer"
              onLoad={() => setLoading(false)}
            />
          ) : isOfficeFile ? (
            <iframe
              src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`}
              className="w-full h-full rounded-b-2xl"
              frameBorder="0"
              title="Office Viewer"
              onLoad={() => setLoading(false)}
            />
          ) : (
            <div className="w-full h-full rounded-b-2xl">
              <DocViewer
                documents={docs}
                pluginRenderers={DocViewerRenderers}
                style={{ height: "100%", width: "100%" }}
                config={{ header: { disableHeader: true } }}
                onDocumentLoad={() => setLoading(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
