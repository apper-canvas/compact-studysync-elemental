import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Dashboard Loading */}
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 rounded-xl h-24"></div>
          <div className="bg-gray-100 rounded-xl h-24"></div>
          <div className="bg-gray-100 rounded-xl h-24"></div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-40"></div>
            <div className="bg-gray-100 rounded-xl h-64"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;