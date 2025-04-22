import React from 'react';
import Lottie from 'lottie-react';
import spinnerAnimation from '../assets/lottie/spinner.json';

const GlobalSpinner = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
      <div className="w-24 h-24">
        <Lottie animationData={spinnerAnimation} loop autoplay />
      </div>
    </div>
  );
};

export default GlobalSpinner;
