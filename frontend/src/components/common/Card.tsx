import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
}

const Card = ({ 
  title, 
  children, 
  className = '',
  hoverable = false,
  bordered = true
}: CardProps) => {
  return (
    <div 
      className={clsx(
        'bg-white rounded-lg overflow-hidden',
        bordered ? 'border border-gray-200' : '',
        hoverable ? 'transition-all duration-200 hover:shadow-md' : 'shadow-sm',
        className
      )}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;