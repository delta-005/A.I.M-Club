


import React, { useState, useMemo, useContext } from 'react';
import { AppContext, AppContextType } from '../../App';
import { PersonalInfo, RoleConfig, ApplicationData } from '../../types';
import StepIndicator from './StepIndicator';
import StepContent from './StepContent';
import SuccessView from './SuccessView';
import { sendApplicationConfirmationEmail } from '../../services/emailService';

const ApplicationForm: React.FC = () => {
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [submittedApplicantId, setSubmittedApplicantId] = useState<string | null>(null);
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        name: '', rollNumber: '', email: '', contact: '', yearOfStudy: '1'
    });
    const [selectedRole, setSelectedRole] = useState('');
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const roles = appContext?.roles || [];

    const rolesConfig = useMemo((): RoleConfig => {
        return roles.reduce((acc, role) => {
            acc[role.name] = {
                eligibleYears: role.eligibleYears,
                questions: role.questions,
                responsibilities: role.responsibilities
            };
            return acc;
        }, {} as RoleConfig);
    }, [roles]);

    const isStep0Valid = useMemo(() => 
        personalInfo.name.trim() !== '' && 
        personalInfo.rollNumber.trim() !== '' && 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email.trim()) &&
        /^\d{10}$/.test(personalInfo.contact.trim())
    , [personalInfo]);

    const isStep1Valid = useMemo(() => {
        if (!selectedRole) return false;
        const questions = rolesConfig[selectedRole]?.questions || [];
        return questions.every((_, i) => (answers[`Q${i + 1}`] || '').trim() !== '');
    }, [selectedRole, answers, rolesConfig]);

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({ ...prev, [name]: value }));
        if (name === 'yearOfStudy') {
            setSelectedRole('');
            setAnswers({});
        }
    };
    
    const handleAnswerChange = (index: number, value: string) => {
        setAnswers(prev => ({ ...prev, [`Q${index + 1}`]: value }));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 2));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    const handleSubmit = async () => {
        if (!appContext) return;

        // Generate unique IDs
        const applicantId = `AIM-${Date.now().toString().slice(-6)}`;
        const trackingId = `track_${Math.random().toString(36).substring(2, 12)}`;
        setSubmittedApplicantId(applicantId);

        const newApplication: Omit<ApplicationData, 'id' | 'submittedAt'> = {
            ...personalInfo,
            applicantId,
            trackingId,
            role: selectedRole,
            answers: answers,
            status: 'Pending',
            viewed: false,
        };

        // Send confirmation and tracking email
        try {
            const trackingLink = `${window.location.origin}${window.location.pathname}?track=${trackingId}`;
            await sendApplicationConfirmationEmail(newApplication, trackingLink, appContext.siteSettings.adminPage.adminEmail);
            appContext.setAlert({ message: 'Application submitted! A tracking link has been sent to your email.', type: 'success' });
        } catch (error) {
            console.error("Failed to send tracking email:", error);
            appContext.setAlert({ 
                message: "Application submitted, but we couldn't send the confirmation email. Please check your email later or contact us.", 
                type: 'error' 
            });
        }
        
        appContext.addApplication(newApplication);
        setSubmitted(true);
    };

    if (submitted) {
        return <SuccessView applicantId={submittedApplicantId} />;
    }
    
    const progress = (step / 2) * 100;

    return (
        <div className="relative max-w-6xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4 shadow-inner">
                <div className="bg-gradient-to-r from-neon-blue to-neon-pink h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 min-h-[600px]">
                {/* Left Panel */}
                <div className="lg:col-span-4 bg-dark-bg text-white rounded-2xl p-8 flex flex-col justify-between shadow-2xl animate-slide-in-left">
                    <StepIndicator currentStep={step} />
                </div>
                
                {/* Right Panel */}
                <div className="lg:col-span-8 bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-2xl flex flex-col backdrop-blur-md border border-gray-200 dark:border-gray-700/50">
                    <StepContent
                        currentStep={step}
                        personalInfo={personalInfo}
                        handlePersonalInfoChange={handlePersonalInfoChange}
                        availableRoles={Object.keys(rolesConfig).filter(role => rolesConfig[role].eligibleYears.includes(personalInfo.yearOfStudy))}
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                        rolesConfig={rolesConfig}
                        answers={answers}
                        handleAnswerChange={handleAnswerChange}
                        isStep0Valid={isStep0Valid}
                        isStep1Valid={isStep1Valid}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        handleSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;