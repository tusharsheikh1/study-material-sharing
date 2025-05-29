import React from 'react';
import { X, Play, FileText } from 'lucide-react';

const MediaUploadPreview = ({ media, onRemove }) => {
  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaGrid = () => {
    const count = media.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-2 grid-rows-2';
    return 'grid-cols-2 grid-rows-2';
  };

  return (
    <div className="mb-4">
      <div className={`grid ${getMediaGrid()} gap-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 p-2`}>
        {media.map((item, index) => (
          <div
            key={item.id}
            className={`relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 ${
              media.length === 3 && index === 0 ? 'row-span-2' : ''
            }`}
          >
            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Media Content */}
            {item.type === 'image' ? (
              <div className="relative h-full min-h-32 max-h-64">
                <img
                  src={item.preview}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
                {/* File Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-xs font-medium truncate">
                    {item.file.name}
                  </p>
                  <p className="text-white/80 text-xs">
                    {getFileSize(item.file.size)}
                  </p>
                </div>
              </div>
            ) : item.type === 'video' ? (
              <div className="relative h-full min-h-32 max-h-64 bg-black">
                <video
                  src={item.preview}
                  className="w-full h-full object-cover"
                  muted
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                  </div>
                </div>
                {/* File Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-xs font-medium truncate">
                    {item.file.name}
                  </p>
                  <p className="text-white/80 text-xs">
                    {getFileSize(item.file.size)}
                  </p>
                </div>
              </div>
            ) : (
              // Document/Other file types
              <div className="h-32 flex flex-col items-center justify-center p-4 text-center">
                <FileText className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium truncate w-full">
                  {item.file.name}
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">
                  {getFileSize(item.file.size)}
                </p>
              </div>
            )}

            {/* Upload Progress (if needed) */}
            {item.uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Media Counter */}
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
        <span>{media.length} file{media.length !== 1 ? 's' : ''} selected</span>
        <span>Max 4 files</span>
      </div>
    </div>
  );
};

export default MediaUploadPreview;