
import React from 'react';

interface StepIndicatorProps {
    currentStep: number;
}

const steps = ['Mission Briefing', 'Role Assignment', 'Final Confirmation'];
const stepInfo = [
    'Start by providing your basic details. This helps us know who you are.',
    'Select your desired role and showcase your skills and passion.',
    'Review your application carefully before launching it to our committee.'
];


const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
    return (
        <div>
            <div className="mb-8">
                <img src="https://i.ibb.co/GQd9PbgN/Aim-AA-removebg-preview.png" alt="A.I.M. Club Logo" className="h-20 w-auto" />
                <h2 className="text-2xl font-bold mt-2 font-orbitron text-golden-yellow">A.I.M. Enlistment</h2>
            </div>
            <div className="relative">
                <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-600"></div>
                {steps.map((step, index) => {
                    const isCompleted = currentStep > index;
                    const isActive = currentStep === index;
                    return (
                        <div key={index} className="flex items-start mb-10 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all duration-300 ${isCompleted ? 'bg-green-500' : isActive ? 'bg-neon-blue scale-110 shadow-lg shadow-neon-blue/50' : 'bg-gray-700 border-2 border-gray-500'}`}>
                                {isCompleted ? '✓' : index + 1}
                            </div>
                            <div className="ml-6">
                                <h3 className={`font-bold ${isActive ? 'text-neon-blue' : 'text-white'}`}>{step}</h3>
                                <p className="text-sm text-gray-400">{stepInfo[index]}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
