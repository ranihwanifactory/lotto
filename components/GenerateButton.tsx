import React from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ 
  onClick, 
  loading, 
  label, 
  subLabel,
  icon,
  variant = 'primary' 
}) => {
  const baseClasses = "relative w-full py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform active:scale-95 flex flex-col items-center justify-center border-2";
  
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white border-blue-400 hover:from-blue-400 hover:to-blue-500 shadow-blue-200"
    : "bg-gradient-to-b from-purple-500 to-purple-600 text-white border-purple-400 hover:from-purple-400 hover:to-purple-500 shadow-purple-200";

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${baseClasses} ${variantClasses} ${loading ? 'opacity-80 cursor-wait' : ''}`}
    >
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-2"></div>
          <span className="text-sm font-medium">번호 추첨 중...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-1">
            {icon && <span className="text-2xl">{icon}</span>}
            <span className="text-xl font-bold tracking-wide">{label}</span>
          </div>
          {subLabel && <span className="text-xs opacity-90 font-light">{subLabel}</span>}
        </>
      )}
    </button>
  );
};

export default GenerateButton;