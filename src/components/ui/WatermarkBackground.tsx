import React from 'react';

interface WatermarkBackgroundProps {
  opacity?: string;
  className?: string;
}

export default function WatermarkBackground({ 
  opacity = 'opacity-5', 
  className = '' 
}: WatermarkBackgroundProps) {
  return (
    <div 
      className={`fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden ${opacity} ${className}`}
      aria-hidden="true"
    >
      {/* We use an img tag rather than CSS background to easily apply grayscale/blur if needed via Tailwind, 
          and to ensure the watermark image scales exactly as we want within the viewport */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img 
        src="/images/watermark.png" 
        alt="" 
        className="w-[80vw] h-[80vh] object-contain max-w-4xl opacity-50 grayscale mix-blend-multiply"
        draggable={false}
        />
      </div>
    </div>
  );
}
