const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
      <div
        className="bg-blue-600 h-full text-xs text-white text-center transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
