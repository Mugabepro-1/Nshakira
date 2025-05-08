import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  fullScreen = false,
  message = 'Loading...'
}: LoadingSpinnerProps) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
        <Loader className={`${sizeClass[size]} text-primary-600 animate-spin`} />
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader className={`${sizeClass[size]} text-primary-600 animate-spin`} />
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;