import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute top-full mt-2 w-max px-2 py-1 text-xs text-white bg-gray-700 rounded">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
