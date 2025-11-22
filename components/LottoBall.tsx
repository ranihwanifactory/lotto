import React from 'react';
import { getBallColor } from '../utils/lottoUtils';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const LottoBall: React.FC<LottoBallProps> = ({ number, size = 'md', animate = false }) => {
  const colorClass = getBallColor(number);
  
  let sizeClass = 'w-10 h-10 text-lg';
  if (size === 'sm') sizeClass = 'w-7 h-7 text-xs font-medium';
  if (size === 'lg') sizeClass = 'w-12 h-12 sm:w-14 sm:h-14 text-xl font-bold';

  return (
    <div 
      className={`
        relative flex items-center justify-center rounded-full 
        ${colorClass} ${sizeClass} 
        ball-shadow border-b-2
        ${animate ? 'animate-bounce' : ''}
        transition-transform duration-300 hover:scale-110
      `}
    >
      {/* Shine effect */}
      <div className="absolute top-1 left-1 w-1/2 h-1/2 rounded-full shine opacity-50 pointer-events-none"></div>
      <span className="drop-shadow-md z-10">{number}</span>
    </div>
  );
};

export default LottoBall;