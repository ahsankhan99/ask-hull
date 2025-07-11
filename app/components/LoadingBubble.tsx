import React from "react";

const LoadingBubble = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex space-x-2 animate-pulse">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingBubble;
