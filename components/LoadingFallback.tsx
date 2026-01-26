import React from 'react';
import { Zap } from 'lucide-react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
      <div className="w-20 h-20 border-4 border-[#ccff00] rounded-full flex items-center justify-center animate-[spin_3s_linear_infinite]">
        <Zap className="w-10 h-10 text-[#ccff00] fill-current animate-pulse" />
      </div>
      <h2 className="font-oswald italic font-black text-xl text-[#ccff00] uppercase tracking-ultra mt-6 animate-pulse">
        LOADING_NEURAL_NET...
      </h2>
    </div>
  );
};

export default LoadingFallback;
