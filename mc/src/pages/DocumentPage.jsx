// pages/DocumentPage.jsx
import React from "react";
import DocumentViewer from "../components/DocumentViewer";

const DocumentPage = () => {
  const fileUrl =
    "https://file-examples-com.github.io/uploads/2017/02/file-sample_100kB.docx"; // Change to dynamic or query-based

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-2 sm:px-6 py-6">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
            Document Viewer
          </h1>
        </div>
        <div className="p-2 sm:p-4 h-[80vh] overflow-hidden">
          <DocumentViewer fileUrl={fileUrl} />
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
