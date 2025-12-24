
import React, { ReactNode } from 'react';
import { Icon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-gray-900 border border-white/10 rounded-[2.5rem] shadow-2xl w-full ${sizeClasses[size]} flex flex-col max-h-[90vh] animate-slide-in overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed at top */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-gray-900/50 backdrop-blur-xl z-20">
          <h3 className="text-2xl font-black font-orbitron text-white uppercase tracking-tighter">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close modal"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content - Scrollable */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
            <div className="animate-fade-in delay-100">
                {children}
            </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default Modal;
