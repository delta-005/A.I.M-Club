
import React, { useEffect, useState } from 'react';
import { Alert } from '../types';
import { Icon } from './icons';

interface AlertBoxProps extends Alert {
    onClose: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            handleClose();
        }, 4500);
        return () => clearTimeout(timer);
    }, [message, type]);
    
    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const baseClasses = "fixed bottom-5 right-5 z-[100] max-w-sm w-full p-4 rounded-lg shadow-2xl flex items-center gap-4 transition-all duration-300 ease-in-out transform";

    const typeClasses = {
        success: 'bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 text-green-800 dark:text-green-200',
        error: 'bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-800 dark:text-red-200',
        info: 'bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200',
    };
    
    const visibilityClasses = visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0';

    return (
        <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`} role="alert">
            <div className="flex-1">
                <p className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                <p className="text-sm">{message}</p>
            </div>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                <Icon name="close" className="w-5 h-5" />
            </button>
        </div>
    );
};

export default AlertBox;
