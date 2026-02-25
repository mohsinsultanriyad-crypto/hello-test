
import React from 'react';

const AdBanner: React.FC = () => {
  return (
    <div className="py-2">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100 rounded-2xl h-16 flex items-center justify-center overflow-hidden relative group">
        <div className="absolute top-0 left-0 bg-gray-200 text-[8px] font-bold px-1.5 py-0.5 rounded-br-lg text-gray-500">AD</div>
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black group-hover:text-green-600 transition-colors">Premium Ad Space Available</span>
      </div>
    </div>
  );
};

export default AdBanner;
