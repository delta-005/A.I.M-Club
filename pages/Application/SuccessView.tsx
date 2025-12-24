

import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { Icon } from '../../components/icons';

interface SuccessViewProps {
    applicantId: string | null;
}

const SuccessView: React.FC<SuccessViewProps> = ({ applicantId }) => {
    const appContext = useContext(AppContext);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-dark-bg rounded-2xl shadow-2xl animate-fade-in min-h-[600px]">
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-6">
                <Icon name="logo" className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
                Mission Accepted!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                Your application has been successfully transmitted. A confirmation with a **secure tracking link** has been sent to your email.
            </p>
            
            {applicantId && (
                <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your unique Applicant ID is:</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white tracking-widest">{applicantId}</p>
                </div>
            )}

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p>You can also join our applicants' channel for general updates:</p>
                <a href="https://chat.whatsapp.com/C6HN0V8Nfiu7SFmv3V4GZS?mode=wwt" target="_blank" rel="noopener noreferrer" className="text-neon-blue font-bold hover:underline">
                    A.I.M. Club WhatsApp Group
                </a>
            </div>
            <button
                onClick={() => appContext?.setPage('home')}
                className="mt-8 px-8 py-3 rounded-full font-semibold text-white bg-neon-blue hover:opacity-90 transition-opacity"
            >
                Return to Home Base
            </button>
        </div>
    );
};

export default SuccessView;