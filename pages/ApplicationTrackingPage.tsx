import React, { useContext, useMemo } from 'react';
import { AppContext, AppContextType } from '../App';
import { ApplicationData } from '../types';
import { Icon } from '../components/icons';

interface ApplicationTrackingPageProps {
    trackingId: string;
}

const statusConfig: { [key in ApplicationData['status']]: { step: number; title: string; description: string; color: string; icon: string } } = {
    'Pending': { step: 1, title: 'Application Received', description: "We've received your application and it's in our queue.", color: 'text-yellow-400', icon: 'file-text' },
    'Shortlisted': { step: 2, title: 'Under Review', description: 'Our committee is carefully reviewing your profile.', color: 'text-blue-400', icon: 'logo' },
    'Interview Scheduled': { step: 3, title: 'Interview Scheduled', description: 'Your interview has been scheduled. Check your email for details.', color: 'text-purple-400', icon: 'calendar' },
    // FIX: Added 'Waitlisted' status to satisfy the complete mapping of ApplicationData['status'].
    'Waitlisted': { step: 3, title: 'Waitlisted', description: 'Your application has been placed on the waitlist for this cycle.', color: 'text-orange-400', icon: 'refresh' },
    'Selected': { step: 4, title: 'Decision Made: Selected', description: "Congratulations! You've been selected to join the A.I.M. Club.", color: 'text-green-400', icon: 'check' },
    'Rejected': { step: 4, title: 'Decision Made', description: 'Thank you for your interest. The position has been filled.', color: 'text-red-400', icon: 'close' },
};
const totalSteps = 4;

const ApplicationTrackingPage: React.FC<ApplicationTrackingPageProps> = ({ trackingId }) => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const application = useMemo(() => {
        return appContext?.applications.find(app => app.trackingId === trackingId) || null;
    }, [appContext?.applications, trackingId]);

    if (!application) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 text-white">
                <Icon name="logo" className="w-24 h-24 text-red-500 mb-4" />
                <h1 className="text-3xl font-bold font-orbitron mb-2">Tracking ID Not Found</h1>
                <p className="text-gray-400 max-w-md">The tracking ID is invalid or has expired. Please check the link from your email, or contact us if you believe this is an error.</p>
                <button
                    onClick={() => window.location.href = window.location.origin}
                    className="mt-8 px-6 py-3 rounded-lg font-semibold bg-neon-blue hover:opacity-90 transition-opacity"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const currentStatusInfo = statusConfig[application.status];
    const currentStep = currentStatusInfo.step;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4 text-white">
            <div className="w-full max-w-4xl mx-auto">
                 <header className="text-center mb-12 animate-fade-in">
                    <img src={appContext?.siteSettings.header.logoUrl} alt="A.I.M. Club Logo" className="h-24 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-cyan-400">Application Status</h1>
                    <p className="text-gray-300 mt-2">Tracking application for <span className="font-bold text-golden-yellow">{application.name}</span></p>
                    <p className="text-sm text-gray-500 font-mono">Applicant ID: {application.applicantId}</p>
                </header>
                
                {/* Stepper Timeline */}
                <div className="relative mb-12">
                    <div className="absolute left-1/2 -translate-x-1/2 top-5 h-full w-0.5 bg-gray-700" aria-hidden="true"></div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-5 h-full w-0.5 bg-gradient-to-b from-neon-blue to-neon-pink transition-all duration-1000" style={{ height: `calc(${(currentStep - 1) / (totalSteps - 1) * 100}% - 2.5rem)` }}></div>
                    
                    <div className="space-y-12">
                        {/* FIX: Filter out 'Waitlisted' from the linear progress steps to avoid duplicates in the visual vertical timeline */}
                        {Object.values(statusConfig).filter(s => s.step <= totalSteps && !['Selected', 'Rejected', 'Waitlisted'].includes(s.title)).map((statusInfo) => {
                            const isActive = currentStep === statusInfo.step;
                            const isCompleted = currentStep > statusInfo.step || application.status === 'Selected' || application.status === 'Rejected';
                             return (
                                <div key={statusInfo.step} className="relative flex items-center justify-center">
                                    <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-neon-blue border-neon-blue' : isActive ? 'bg-dark-bg border-neon-blue scale-110 shadow-lg shadow-neon-blue/50' : 'bg-gray-800 border-gray-600'}`}>
                                        {isCompleted ? <Icon name="check" className="w-5 h-5" /> : <Icon name={statusInfo.icon} className="w-5 h-5" />}
                                    </div>
                                    <div className={`absolute w-1/2 p-4 text-center ${statusInfo.step % 2 === 1 ? 'left-0 pr-10 text-right' : 'right-0 pl-10 text-left'}`}>
                                        <h3 className={`font-bold text-lg ${isActive ? statusInfo.color : isCompleted ? 'text-gray-200' : 'text-gray-500'}`}>{statusInfo.title}</h3>
                                        {isActive && <p className="text-sm text-gray-300">{statusInfo.description}</p>}
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </div>

                {/* Final Status Card */}
                <div className="mt-20 p-6 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl text-center animate-fade-in" style={{animationDelay: '0.5s'}}>
                    <h2 className="text-2xl font-bold mb-2">Current Status: <span className={currentStatusInfo.color}>{currentStatusInfo.title}</span></h2>
                    <p className="text-gray-300 mb-4">{currentStatusInfo.description}</p>
                    
                    {application.status === 'Interview Scheduled' && application.interviewDetails && (
                        <div className="p-4 bg-gray-900/50 rounded-lg border border-golden-yellow/30 space-y-2">
                             <p><strong>Date:</strong> {application.interviewDetails.date}</p>
                             <p><strong>Time:</strong> {application.interviewDetails.time}</p>
                             <p><strong>Link:</strong> <a href={application.interviewDetails.link} target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">Join Meeting</a></p>
                        </div>
                    )}
                </div>

                 <div className="text-center mt-8">
                     <button
                        onClick={() => window.location.href = window.location.origin}
                        className="px-6 py-2 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        Go to Home Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationTrackingPage;