
import React from 'react';
import { PersonalInfo, RoleConfig } from '../../types';
import { Icon } from '../../components/icons';

interface StepContentProps {
    currentStep: number;
    personalInfo: PersonalInfo;
    handlePersonalInfoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    availableRoles: string[];
    selectedRole: string;
    setSelectedRole: (role: string) => void;
    rolesConfig: RoleConfig;
    answers: { [key: string]: string };
    handleAnswerChange: (index: number, value: string) => void;
    isStep0Valid: boolean;
    isStep1Valid: boolean;
    nextStep: () => void;
    prevStep: () => void;
    handleSubmit: () => void;
}

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        {children}
    </div>
);

const StepContent: React.FC<StepContentProps> = (props) => {
    const {
        currentStep, personalInfo, handlePersonalInfoChange, availableRoles,
        selectedRole, setSelectedRole, rolesConfig, answers, handleAnswerChange,
        isStep0Valid, isStep1Valid, nextStep, prevStep, handleSubmit
    } = props;

    const renderContent = () => {
        switch (currentStep) {
            case 0: // Personal Info
                return (
                    <div className="space-y-6 animate-fade-in">
                        <FormField label="Full Name">
                            <input type="text" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} required className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:border-neon-pink focus:outline-none transition-colors" />
                        </FormField>
                        <FormField label="Roll Number">
                            <input type="text" name="rollNumber" value={personalInfo.rollNumber} onChange={handlePersonalInfoChange} required className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:border-neon-pink focus:outline-none transition-colors" />
                        </FormField>
                        <FormField label="Email Address">
                            <input type="email" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} required className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:border-neon-pink focus:outline-none transition-colors" />
                        </FormField>
                        <FormField label="Contact Number">
                            <input type="tel" name="contact" value={personalInfo.contact} onChange={handlePersonalInfoChange} required placeholder="10-digit number" pattern="\d{10}" title="Please enter a 10-digit contact number" className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:border-neon-pink focus:outline-none transition-colors" />
                        </FormField>
                        <FormField label="Year of Study">
                            <select name="yearOfStudy" value={personalInfo.yearOfStudy} onChange={handlePersonalInfoChange} required className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:border-neon-pink focus:outline-none transition-colors appearance-none">
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </FormField>
                    </div>
                );
            case 1: // Role & Questions
                return (
                    <div className="space-y-6 animate-fade-in">
                        <FormField label="Select Your Role">
                            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:border-neon-pink focus:outline-none transition-colors appearance-none">
                                <option value="">-- Choose an available role --</option>
                                {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                        </FormField>
                        {selectedRole && (
                            <>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-fade-in border-l-4 border-neon-blue">
                                    <h3 className="text-lg font-bold text-neon-blue mb-2">Role Responsibilities</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                        {rolesConfig[selectedRole].responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                                    </ul>
                                </div>
                                {rolesConfig[selectedRole].questions.map((q, i) => (
                                    <FormField key={i} label={`Q${i + 1}: ${q}`}>
                                        <textarea value={answers[`Q${i + 1}`] || ''} onChange={(e) => handleAnswerChange(i, e.target.value)} required rows={4} className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:border-neon-pink focus:outline-none transition-colors"></textarea>
                                    </FormField>
                                ))}
                            </>
                        )}
                    </div>
                );
            case 2: // Review
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-neon-blue">Review Your Application</h2>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                            <p><strong>Name:</strong> {personalInfo.name}</p>
                            <p><strong>Roll Number:</strong> {personalInfo.rollNumber}</p>
                            <p><strong>Email:</strong> {personalInfo.email}</p>
                            <p><strong>Contact:</strong> {personalInfo.contact}</p>
                            <p><strong>Year:</strong> {personalInfo.yearOfStudy}</p>
                            <p><strong>Role:</strong> {selectedRole}</p>
                            <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                                <h3 className="font-bold text-lg mb-2">Your Answers</h3>
                                {rolesConfig[selectedRole].questions.map((q, i) => (
                                    <div key={i} className="mb-2">
                                        <p className="font-semibold">{q}</p>
                                        <p className="pl-4 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{answers[`Q${i + 1}`]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto pr-2">
                {renderContent()}
            </div>
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                {currentStep > 0 ? (
                    <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-600 hover:opacity-90 transition-opacity">Back</button>
                ) : <div />}
                
                {currentStep < 2 ? (
                    <button type="button" onClick={nextStep} disabled={currentStep === 0 ? !isStep0Valid : !isStep1Valid} className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-neon-blue to-neon-pink hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        Next <Icon name="arrowRight" className="w-4 h-4" />
                    </button>
                ) : (
                    <button type="button" onClick={handleSubmit} className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90">
                        Confirm & Submit
                    </button>
                )}
            </div>
        </div>
    );
};

export default StepContent;