import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-0"
        onClick={handleBackdropClick}
      >
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-90 backdrop-blur-sm" />

        <div 
          className={`
            inline-block align-middle bg-white text-left 
            border-4 border-black shadow-[12px_12px_0px_0px_rgba(59,130,246,1)] 
            transform transition-all sm:my-8 sm:w-full 
            ${sizes[size]}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b-4 border-black bg-yellow-400">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-black italic">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 border-2 border-black hover:bg-black hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5"
              type="button"
            >
              <X className="h-6 w-6 stroke-[3px]" />
            </button>
          </div>
          
          <div className="p-8">
            <div className="mt-2 text-black font-bold">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;