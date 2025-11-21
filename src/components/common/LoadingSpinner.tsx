import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Cargando...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-purple-500 border-t-transparent`}></div>
      {message && (
        <p className="mt-4 text-gray-300 text-lg">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;