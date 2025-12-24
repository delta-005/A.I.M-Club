
import React from 'react';
import ApplicationForm from './ApplicationForm';

const ApplicationPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 py-12">
                <header className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight font-orbitron">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-pink to-golden-yellow">
                            Join The Mission
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mt-2">
                        Become a part of the A.I.M. Club and shape the future of technology with us.
                    </p>
                </header>
                <ApplicationForm />
            </div>
        </div>
    );
};

export default ApplicationPage;
