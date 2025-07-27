import React from 'react';

interface ResponsiveModalProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ResponsiveModal({ trigger, title, children, isOpen, onOpenChange, size = 'md' }: ResponsiveModalProps) {
  const sizeClasses = {
    sm: 'sm:max-w-[425px]',
    md: 'sm:max-w-[600px]',
    lg: 'sm:max-w-[800px]',
    xl: 'sm:max-w-[1200px]'
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className={`bg-white rounded-lg p-6 w-full mx-4 ${sizeClasses[size]}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={() => onOpenChange?.(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="mb-4">
          {children}
        </div>
      </div>
    </div>
  );
} 