
import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { AppContext, AppContextType } from '../App';
import { ApplicationData, Event, GalleryItem, CommitteeMember, ApplicationRole, FAQItem, SiteSettings, FacultyMember, PaymentData, ApplicationLog, Pillar, Testimonial, ArchiveHighlight, JourneyEvent, DeptStat } from '../types';
import Modal from '../components/Modal';
import { Icon } from '../components/icons';
import { sendStatusUpdateEmail, sendInterviewEmail, sendAdminOTP } from '../services/emailService';

type AdminView = 'dashboard' | 'applications' | 'calendar' | 'content' | 'events' | 'gallery' | 'payments' | 'faqs';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

// ===================================================================================
// LOGIN COMPONENTS (DELEGATED ACCESS PROTOCOL)
// ===================================================================================

const AdminLoginPage: React.FC<{ onLogin: () => void; logoUrl: string; onGoHome: () => void }> = ({ onLogin, logoUrl, onGoHome }) => {
    const { siteSettings, setAlert } = useContext(AppContext as React.Context<AppContextType>);
    const [password, setPassword] = useState('');
    const [staffName, setStaffName] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
    
    const [status, setStatus] = useState('Awaiting Secure Authorization...');
    const [loginMethod, setLoginMethod] = useState<'master' | 'delegated'>('master');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // FIX: Using any or number instead of NodeJS.Timeout as it is not available in browser environments.
    const typewriterRef = useRef<any>(null);

    const updateStatus = (text: string) => {
        if (typewriterRef.current) clearInterval(typewriterRef.current);
        setStatus('');
        let i = 0;
        typewriterRef.current = setInterval(() => {
            if (i < text.length) {
                setStatus(prev => prev + text.charAt(i));
                i++;
            } else {
                if (typewriterRef.current) clearInterval(typewriterRef.current);
            }
        }, 30);
    };

    const handleMasterLogin = () => {
        if (password === 'superadmin@aim') {
            triggerSuccess();
        } else {
            triggerFailure('Invalid Master Protocol Key. Access Denied.');
        }
    };

    const handleRequestOtp = async () => {
        if (!staffName.trim()) {
            triggerFailure('Identify yourself before requesting uplink.');
            return;
        }

        setIsLoading(true);
        updateStatus('Generating Secure Session OTP...');
        
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);

        try {
            updateStatus(`Transmitting code to Primary Admin...`);
            await sendAdminOTP(newOtp, staffName, siteSettings.adminPage.adminEmail);
            setIsOtpSent(true);
            setIsLoading(false);
            updateStatus('Uplink Complete. Enter the 6-digit code provided by the Admin.');
            setAlert({ message: "Request sent to Primary Admin.", type: 'info' });
        } catch (e) {
            setIsLoading(false);
            triggerFailure('Signal Interference. Communication Uplink Failed.');
        }
    };

    const handleVerifyOtp = () => {
        if (otpInput === generatedOtp) {
            triggerSuccess();
        } else {
            triggerFailure('OTP Mismatch. Authorization Nullified.');
            setOtpInput('');
        }
    };

    const triggerSuccess = () => {
        setIsLoading(true);
        updateStatus('Authorization Granted. Decrypting Command Modules...');
        setTimeout(onLogin, 2000);
    };

    const triggerFailure = (msg: string) => {
        setAccessDenied(true);
        updateStatus(msg);
        setTimeout(() => setAccessDenied(false), 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-dark-bg relative overflow-hidden font-montserrat">
            <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
            <div className={`absolute inset-0 transition-colors duration-500 ${accessDenied ? 'bg-red-500/10' : 'bg-transparent'}`}></div>
            
            <div className={`w-full max-w-lg p-10 space-y-10 bg-gray-900/60 backdrop-blur-3xl border ${accessDenied ? 'border-red-500 animate-bounce shadow-red-500/20' : 'border-white/10'} rounded-[3.5rem] relative z-10 transition-all shadow-3xl`}>
                
                <div className="text-center space-y-4">
                    <div className="relative inline-block group">
                        <div className="absolute -inset-4 bg-neon-blue/20 blur-2xl rounded-full group-hover:bg-neon-blue/40 transition-all"></div>
                        <img src={logoUrl} alt="Logo" className="h-28 mx-auto relative drop-shadow-glow-blue animate-float" />
                    </div>
                    <h2 className="text-3xl font-black font-orbitron text-white uppercase tracking-tighter">
                        Command <span className="text-neon-blue">Sentinel</span>
                    </h2>
                    <div className="flex items-center justify-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/5 mx-auto w-fit">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${accessDenied ? 'bg-red-500' : isOtpSent ? 'bg-blue-400' : 'bg-green-500'}`}></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 font-mono min-w-[200px]">
                            {status}
                        </span>
                    </div>
                </div>

                {/* Protocol Selector */}
                {!isOtpSent && (
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                        <button 
                            onClick={() => { setLoginMethod('master'); updateStatus('Switching to Master Key protocol...'); }}
                            className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${loginMethod === 'master' ? 'bg-white/10 text-white border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Icon name="lock-closed" className="w-4 h-4" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Master Bypass</span>
                        </button>
                        <button 
                            onClick={() => { setLoginMethod('delegated'); updateStatus('Switching to Delegated OTP protocol...'); }}
                            className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${loginMethod === 'delegated' ? 'bg-white/10 text-white border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Icon name="megaphone" className="w-4 h-4" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Request OTP</span>
                        </button>
                    </div>
                )}

                <div className="min-h-[160px] flex flex-col justify-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-6 animate-fade-in">
                            <Icon name="refresh" className="w-12 h-12 text-neon-blue animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neon-blue">Processing Uplink...</p>
                        </div>
                    ) : isOtpSent ? (
                        <div className="space-y-4 animate-fade-in">
                            <FormInput 
                                type="text" 
                                value={otpInput} 
                                onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0,6))} 
                                placeholder="ENTER 6-DIGIT CODE" 
                                className="bg-black/40 border-neon-blue/30 text-center text-2xl font-black tracking-[1em] h-16 rounded-[1.5rem]"
                            />
                            <button 
                                onClick={handleVerifyOtp} 
                                className="w-full py-5 bg-neon-blue text-white font-black rounded-2xl uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-neon-blue/20"
                            >
                                Verify Authorization
                            </button>
                            <button onClick={() => { setIsOtpSent(false); setOtpInput(''); updateStatus('Session Reset.'); }} className="w-full text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-gray-300">Abort & Restart</button>
                        </div>
                    ) : loginMethod === 'master' ? (
                        <div className="space-y-4 animate-fade-in">
                            <FormInput 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleMasterLogin()}
                                placeholder="MASTER COMMAND KEY" 
                                className="bg-black/40 border-white/10 text-center text-lg font-bold tracking-[0.5em] h-16 rounded-[1.5rem] focus:border-neon-blue"
                            />
                            <button 
                                onClick={handleMasterLogin} 
                                className="w-full py-5 bg-neon-blue text-white font-black rounded-2xl uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-neon-blue/20"
                            >
                                Initiate Master Bypass
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fade-in">
                            <FormInput 
                                type="text" 
                                value={staffName} 
                                onChange={e => setStaffName(e.target.value)} 
                                placeholder="STAFF NAME / ROLE" 
                                className="bg-black/40 border-white/10 text-center font-bold h-16 rounded-[1.5rem] focus:border-neon-pink"
                            />
                            <button 
                                onClick={handleRequestOtp} 
                                className="w-full py-5 bg-neon-pink text-white font-black rounded-2xl uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-neon-pink/20"
                            >
                                Request Verification Uplink
                            </button>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <button onClick={onGoHome} className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors">
                        Terminal Exit
                    </button>
                    <span className="text-[9px] font-mono text-gray-700">V.3.1.0-DELEGATED</span>
                </div>
            </div>
        </div>
    );
};

// ===================================================================================
// SIMPLIFIED UI COMPONENTS
// ===================================================================================
const FormInput = (props: React.ComponentProps<'input'>) => (
    <input 
        {...props} 
        value={props.value ?? ''} // Ensure controlled component
        className={`w-full p-4 bg-gray-900/60 text-gray-100 border border-white/10 rounded-2xl focus:border-neon-blue focus:ring-4 focus:ring-neon-blue/5 focus:outline-none transition-all font-medium placeholder:text-gray-600 ${props.className}`} 
    />
);

const FormTextarea = (props: React.ComponentProps<'textarea'>) => (
    <textarea 
        {...props} 
        value={props.value ?? ''} // Ensure controlled component
        className="w-full p-4 bg-gray-900/60 text-gray-100 border border-white/10 rounded-2xl focus:border-neon-blue focus:ring-4 focus:ring-neon-blue/5 focus:outline-none transition-all min-h-[120px] font-medium placeholder:text-gray-600" 
    />
);

const FormSelect = (props: React.ComponentProps<'select'>) => (
    <div className="relative">
        <select 
            {...props} 
            value={props.value ?? ''} // Ensure controlled component
            className="w-full p-4 bg-gray-900/60 text-gray-100 border border-white/10 rounded-2xl focus:border-neon-blue focus:outline-none transition-all appearance-none font-medium pr-12 cursor-pointer" 
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <Icon name="chevronDown" className="w-5 h-5" />
        </div>
    </div>
);

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">{label}</label>
        {children}
    </div>
);

const ImageUploadField: React.FC<{ label?: string; currentImageUrl: string; onImageChange: (base64: string) => void }> = ({ label, currentImageUrl, onImageChange }) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                onImageChange(base64);
            } catch (error) {
                console.error("Upload error", error);
            }
        }
    };

    return (
        <div className="space-y-3">
            {label && <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">{label}</label>}
            <div className="flex flex-col items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md group hover:border-white/20 transition-all text-center">
                <div className="w-24 h-24 rounded-2xl border border-white/10 overflow-hidden flex-shrink-0 bg-gray-900 shadow-inner">
                    {currentImageUrl ? (
                        <img src={currentImageUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <Icon name="image" className="w-8 h-8 opacity-20" />
                        </div>
                    )}
                </div>
                <div className="w-full">
                    <label className="cursor-pointer block">
                        <span className="inline-flex items-center justify-center gap-3 w-full px-4 py-3 bg-neon-blue text-white font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-neon-blue/80 transition-all shadow-lg shadow-neon-blue/20">
                            <Icon name="image" className="w-4 h-4" /> Change Asset
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
            </div>
        </div>
    );
};

const CrudManager: React.FC<{
    title: string;
    items: any[];
    columns: { header: string; accessor: (item: any) => React.ReactNode; className?: string }[];
    onAdd?: () => void;
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
    extraActions?: React.ReactNode;
}> = ({ title, items, columns, onAdd, onEdit, onDelete, extraActions }) => (
    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 shadow-xl rounded-[2.5rem] overflow-hidden animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-center p-8 border-b border-white/10 gap-6">
            <h3 className="text-2xl font-black font-orbitron text-white uppercase tracking-tighter">{title}</h3>
            <div className="flex items-center gap-4">
                {extraActions}
                {onAdd && (
                    <button onClick={onAdd} className="px-6 py-3.5 flex items-center gap-3 bg-neon-blue text-white font-black rounded-2xl hover:opacity-90 transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-neon-blue/20">
                        <Icon name="logo" className="w-5 h-5" /> Add New Entry
                    </button>
                )}
            </div>
        </div>
        <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full">
                <thead className="bg-black/20">
                    <tr>
                        {columns.map(col => <th key={col.header} className="px-8 py-4 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">{col.header}</th>)}
                        <th className="px-8 py-4 text-right text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {items.map((item, index) => (
                        <tr key={item.id || index} className="group hover:bg-white/[0.02] transition-colors">
                            {columns.map(col => <td key={col.header} className={`px-8 py-5 whitespace-nowrap text-sm text-gray-300 align-middle ${col.className}`}>{col.accessor(item)}</td>)}
                            <td className="px-8 py-5 whitespace-nowrap text-right space-x-2">
                                <button onClick={() => onEdit(item)} className="text-gray-500 hover:text-neon-blue p-2.5 rounded-xl hover:bg-neon-blue/5 transition-all"><Icon name="edit" className="w-5 h-5"/></button>
                                <button onClick={() => onDelete(item)} className="text-gray-500 hover:text-red-400 p-2.5 rounded-xl hover:bg-red-400/5 transition-all"><Icon name="trash" className="w-5 h-5"/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// ===================================================================================
// APPLICATION MODULE
// ===================================================================================

const ApplicationDrawer: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    application: ApplicationData; 
    onUpdate: (app: ApplicationData) => void;
    initialTab?: 'info' | 'interview' | 'logs';
}> = ({ isOpen, onClose, application, onUpdate, initialTab = 'info' }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'interview' | 'logs'>(initialTab);
    const [interviewForm, setInterviewForm] = useState(application.interviewDetails || { date: '', time: '', link: '' });
    const { siteSettings, setAlert, roles } = useContext(AppContext as React.Context<AppContextType>);

    useEffect(() => {
        setActiveTab(initialTab);
        if (application.interviewDetails) {
            setInterviewForm(application.interviewDetails);
        } else {
            setInterviewForm({ date: '', time: '', link: '' });
        }
    }, [initialTab, application]);

    const handleStatusChange = async (status: ApplicationData['status']) => {
        const log = { date: new Date().toISOString(), action: `Status: ${status}`, note: 'Updated by admin' };
        const updatedApp: ApplicationData = { ...application, status, viewed: true, logs: [...(application.logs || []), log] };
        onUpdate(updatedApp);
        try {
            const trackingLink = `${window.location.origin}${window.location.pathname}?track=${application.trackingId}`;
            await sendStatusUpdateEmail(updatedApp, trackingLink, siteSettings.adminPage.adminEmail);
            setAlert({ message: `Applicant notified of ${status} status.`, type: 'success' });
        } catch (e) { setAlert({ message: "Updated, but notification failed.", type: 'info' }); }
    };

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedApp: ApplicationData = { 
            ...application, 
            status: 'Interview Scheduled', 
            interviewDetails: interviewForm, 
            logs: [...(application.logs || []), { date: new Date().toISOString(), action: 'Interview Scheduled', note: `Scheduled for ${interviewForm.date} at ${interviewForm.time}` }] 
        };
        onUpdate(updatedApp);
        try {
            await sendInterviewEmail(updatedApp, siteSettings.adminPage.adminEmail);
            setAlert({ message: "Interview scheduled and sent.", type: 'success' });
        } catch (e) { setAlert({ message: "Scheduled, but email failed.", type: 'error' }); }
    };

    if (!isOpen) return null;

    // Find full question text based on the role definition
    const roleDef = roles.find(r => r.name === application.role);

    return (
        <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-xl bg-dark-bg border-l border-white/10 shadow-2xl flex flex-col h-full animate-slide-in-right">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                    <div>
                        <h2 className="text-xl font-bold font-orbitron text-white uppercase">{application.name}</h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{application.role} • {application.applicantId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white"><Icon name="close" className="w-5 h-5" /></button>
                </div>
                <div className="flex bg-black/10 border-b border-white/10">
                    {(['info', 'interview', 'logs'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-neon-blue' : 'text-gray-500'}`}>
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-blue"></div>}
                        </button>
                    ))}
                </div>
                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            {/* Basic Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">Full Name</p>
                                    <p className="text-xs text-white truncate">{application.name}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">Roll Number</p>
                                    <p className="text-xs text-white">{application.rollNumber}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">Year of Study</p>
                                    <p className="text-xs text-white">{application.yearOfStudy} Year</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">Contact</p>
                                    <p className="text-xs text-white">{application.contact}</p>
                                </div>
                                <div className="col-span-2 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">Email Address</p>
                                    <p className="text-xs text-white break-all">{application.email}</p>
                                </div>
                            </div>

                            {/* Application Answers */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mt-4">Mission Responses</h3>
                                {Object.entries(application.answers).map(([key, value]) => {
                                    const index = parseInt(key.replace('Q', '')) - 1;
                                    const questionText = roleDef?.questions[index] || key;
                                    return (
                                        <div key={key} className="p-5 bg-black/40 rounded-xl border border-white/5">
                                            <p className="text-[10px] font-bold text-neon-blue uppercase mb-2">{questionText}</p>
                                            <p className="text-xs text-gray-300 leading-relaxed">{value}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {activeTab === 'interview' && (
                        <form onSubmit={handleSchedule} className="space-y-4">
                            <FormField label="Mission Date"><FormInput type="date" value={interviewForm.date} onChange={e => setInterviewForm({...interviewForm, date: e.target.value})} required /></FormField>
                            <FormField label="Extraction Time"><FormInput type="text" placeholder="e.g. 10:00 AM" value={interviewForm.time} onChange={e => setInterviewForm({...interviewForm, time: e.target.value})} required /></FormField>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Meeting Link</label>
                                <div className="flex gap-2">
                                    <FormInput type="url" placeholder="Paste Link Here" value={interviewForm.link} onChange={e => setInterviewForm({...interviewForm, link: e.target.value})} required />
                                    <button 
                                        type="button" 
                                        onClick={() => window.open('https://meet.google.com/new', '_blank')}
                                        className="px-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-neon-blue hover:text-white transition-all"
                                        title="Generate New Google Meet"
                                    >
                                        <Icon name="external-link" className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest pl-1">Tip: Click the icon to create a fresh link.</p>
                            </div>
                            <button type="submit" className="w-full py-4 mt-4 bg-neon-blue text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-neon-blue/20">Transmit & Schedule</button>
                        </form>
                    )}
                    {activeTab === 'logs' && (
                        <div className="space-y-4">
                            {application.logs?.slice().reverse().map((log, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] font-black text-neon-blue uppercase">{log.action}</span>
                                        <span className="text-[8px] text-gray-500">{new Date(log.date).toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">{log.note}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-white/10 bg-black/40">
                    <p className="text-[9px] font-bold text-gray-500 uppercase mb-3">Change Application Status</p>
                    <div className="flex flex-wrap gap-2">
                        {(['Pending', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Waitlisted', 'Rejected'] as ApplicationData['status'][]).map(s => (
                            <button key={s} onClick={() => handleStatusChange(s)} className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${application.status === s ? 'bg-neon-blue border-neon-blue text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>{s}</button>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`@keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }.animate-slide-in-right { animation: slide-in-right 0.4s ease-out forwards; }`}</style>
        </div>
    );
};

// ===================================================================================
// SITE CONTENT MANAGER
// ===================================================================================

const ContentManager: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const { siteSettings, setSiteSettings, setAlert } = appContext;
    
    // Staged settings to hold changes before saving
    const [stagedSettings, setStagedSettings] = useState<SiteSettings>(siteSettings);
    const [pageTab, setPageTab] = useState<'home' | 'about-aim' | 'about-dept' | 'contact' | 'general'>('home');

    // Sync staged settings if siteSettings updates from external source (rare)
    useEffect(() => {
        setStagedSettings(siteSettings);
    }, [siteSettings]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(stagedSettings) !== JSON.stringify(siteSettings);
    }, [stagedSettings, siteSettings]);

    const handleSave = () => {
        setSiteSettings(stagedSettings);
        setAlert({ message: 'Mission Parameters Saved Successfully.', type: 'success' });
    };

    const handleDiscard = () => {
        if(window.confirm('Discard all unsaved changes?')) {
            setStagedSettings(siteSettings);
            setAlert({ message: 'Changes discarded.', type: 'info' });
        }
    };

    const updateValue = (path: string, value: any) => {
        const keys = path.split('.');
        const n = JSON.parse(JSON.stringify(stagedSettings));
        let c = n;
        for (let i = 0; i < keys.length - 1; i++) c = c[keys[i]];
        c[keys[keys.length - 1]] = value;
        setStagedSettings(n);
    };

    const addListItem = (path: string, item: any) => {
        const keys = path.split('.');
        const n = JSON.parse(JSON.stringify(stagedSettings));
        let c = n;
        for (let i = 0; i < keys.length - 1; i++) c = c[keys[i]];
        c[keys[keys.length - 1]].push(item);
        setStagedSettings(n);
    };

    const removeListItem = (path: string, index: number) => {
        const keys = path.split('.');
        const n = JSON.parse(JSON.stringify(stagedSettings));
        let c = n;
        for (let i = 0; i < keys.length - 1; i++) c = c[keys[i]];
        c[keys[keys.length - 1]].splice(index, 1);
        setStagedSettings(n);
    };

    const updateListItem = (path: string, index: number, item: any) => {
        const keys = path.split('.');
        const n = JSON.parse(JSON.stringify(stagedSettings));
        let c = n;
        for (let i = 0; i < keys.length - 1; i++) c = c[keys[i]];
        c[keys[keys.length - 1]][index] = item;
        setStagedSettings(n);
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* STICKY ACTION BAR */}
            <div className="sticky top-0 z-[40] -mx-10 px-10 py-6 bg-dark-bg/80 backdrop-blur-xl border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-black font-orbitron uppercase text-white">Site Editor</h2>
                    {hasChanges && <span className="text-[10px] font-bold text-neon-pink uppercase tracking-widest animate-pulse mt-1">Unsaved Configuration Changes Detected</span>}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 mr-4 overflow-x-auto no-scrollbar">
                        {(['home', 'about-aim', 'about-dept', 'contact', 'general'] as const).map(t => (
                            <button key={t} onClick={() => setPageTab(t)} className={`px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase transition-all whitespace-nowrap ${pageTab === t ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                                {t.replace('-', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>
                    {hasChanges && (
                        <div className="flex gap-2 animate-fade-in">
                            <button onClick={handleDiscard} className="px-6 py-3.5 bg-white/5 text-gray-400 font-black rounded-2xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest">
                                Discard
                            </button>
                            <button onClick={handleSave} className="px-8 py-3.5 bg-neon-blue text-white font-black rounded-2xl hover:opacity-90 transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-neon-blue/20 flex items-center gap-3">
                                <Icon name="check" className="w-5 h-5" /> Save Mission Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {pageTab === 'home' && (
                <div className="grid gap-10">
                    {/* Scrolling Text Editor */}
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold font-orbitron text-white uppercase">Scrolling Live Updates</h3>
                            <button onClick={() => addListItem('liveUpdates', 'New mission update entry...')} className="text-neon-blue text-[10px] font-bold uppercase">+ Add Update</button>
                        </div>
                        <div className="space-y-3">
                            {stagedSettings.liveUpdates.map((update, i) => (
                                <div key={i} className="flex gap-3">
                                    <FormInput value={update} onChange={e => updateListItem('liveUpdates', i, (e.target as HTMLInputElement).value)} placeholder="Enter update text..." />
                                    <button onClick={() => removeListItem('liveUpdates', i)} className="px-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Icon name="trash" className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Archives Section */}
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold font-orbitron text-white uppercase">Archives Section</h3>
                            <button onClick={() => addListItem('homePage.archiveHighlights', { icon: 'trophy', title: 'New Highlight', description: 'Brief description' })} className="text-neon-blue text-[10px] font-bold uppercase">+ Add Highlight</button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stagedSettings.homePage.archiveHighlights.map((h, i) => (
                                <div key={i} className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                                    <div className="flex justify-between">
                                        <FormField label="Icon Name">
                                            <FormInput value={h.icon} onChange={e => updateListItem('homePage.archiveHighlights', i, { ...h, icon: (e.target as HTMLInputElement).value })} className="text-xs py-1 px-2" />
                                        </FormField>
                                        <button onClick={() => removeListItem('homePage.archiveHighlights', i)} className="text-red-400 text-[10px] font-bold uppercase">Remove</button>
                                    </div>
                                    <FormInput value={h.title} onChange={e => updateListItem('homePage.archiveHighlights', i, { ...h, title: (e.target as HTMLInputElement).value })} placeholder="Title" />
                                    <FormTextarea value={h.description} onChange={e => updateListItem('homePage.archiveHighlights', i, { ...h, description: (e.target as HTMLTextAreaElement).value })} placeholder="Description" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Why A.I.M Pillars */}
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <h3 className="text-xl font-bold font-orbitron text-white uppercase">Why A.I.M. Pillars</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {stagedSettings.homePage.pillars.map((p, i) => (
                                <div key={i} className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField label="Icon Name">
                                            <FormInput value={p.icon} onChange={e => updateListItem('homePage.pillars', i, { ...p, icon: (e.target as HTMLInputElement).value })} />
                                        </FormField>
                                        <FormField label="Title">
                                            <FormInput value={p.title} onChange={e => updateListItem('homePage.pillars', i, { ...p, title: (e.target as HTMLInputElement).value })} />
                                        </FormField>
                                    </div>
                                    <FormField label="Description">
                                        <FormTextarea value={p.description} onChange={e => updateListItem('homePage.pillars', i, { ...p, description: (e.target as HTMLTextAreaElement).value })} />
                                    </FormField>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonials Editor */}
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold font-orbitron text-white uppercase">Testimonials</h3>
                            <button onClick={() => addListItem('homePage.testimonials', { quote: 'New testimonial...', name: 'Full Name', role: 'Year / Role', image: 'https://picsum.photos/seed/new/100' })} className="text-neon-blue text-[10px] font-bold uppercase">+ Add Testimonial</button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {stagedSettings.homePage.testimonials.map((t, i) => (
                                <div key={i} className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <img src={t.image} className="w-10 h-10 rounded-full border border-white/10" />
                                        <button onClick={() => removeListItem('homePage.testimonials', i)} className="text-red-400 text-[10px] font-bold uppercase">Remove</button>
                                    </div>
                                    <FormTextarea value={t.quote} onChange={e => updateListItem('homePage.testimonials', i, { ...t, quote: (e.target as HTMLTextAreaElement).value })} placeholder="Testimonial Quote" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormInput value={t.name} onChange={e => updateListItem('homePage.testimonials', i, { ...t, name: (e.target as HTMLInputElement).value })} placeholder="Name" />
                                        <FormInput value={t.role} onChange={e => updateListItem('homePage.testimonials', i, { ...t, role: (e.target as HTMLInputElement).value })} placeholder="Role" />
                                    </div>
                                    <ImageUploadField currentImageUrl={t.image} onImageChange={v => updateListItem('homePage.testimonials', i, { ...t, image: v })} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                         <h3 className="text-xl font-bold font-orbitron text-white uppercase">Branding</h3>
                         <div className="grid md:grid-cols-2 gap-6">
                            <ImageUploadField label="Hero Logo" currentImageUrl={stagedSettings.homePage.heroLogoUrl} onImageChange={v => updateValue('homePage.heroLogoUrl', v)} />
                            <ImageUploadField label="Section Logo" currentImageUrl={stagedSettings.homePage.whyAimLogoUrl} onImageChange={v => updateValue('homePage.whyAimLogoUrl', v)} />
                        </div>
                    </div>
                </div>
            )}

            {pageTab === 'about-aim' && (
                <div className="grid gap-10">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <h3 className="text-xl font-bold font-orbitron text-white uppercase">About Section Text</h3>
                        <div className="grid gap-6">
                            <FormField label="Club Mission">
                                <FormTextarea value={stagedSettings.aboutPage.mission} onChange={e => updateValue('aboutPage.mission', (e.target as HTMLTextAreaElement).value)} />
                            </FormField>
                            <FormField label="Club Vision">
                                <FormTextarea value={stagedSettings.aboutPage.vision} onChange={e => updateValue('aboutPage.vision', (e.target as HTMLTextAreaElement).value)} />
                            </FormField>
                        </div>
                    </div>

                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <h3 className="text-xl font-bold font-orbitron text-white uppercase">Hero Background Slideshow</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stagedSettings.aboutPage.heroImageUrls.map((url, i) => (
                                <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
                                    <img src={url} className="w-full h-full object-cover" />
                                    <button onClick={() => removeListItem('aboutPage.heroImageUrls', i)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Icon name="close" className="w-4 h-4" /></button>
                                </div>
                            ))}
                            <label className="aspect-video rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5">
                                <Icon name="camera" className="w-8 h-8 text-gray-500" />
                                <input type="file" className="hidden" accept="image/*" onChange={async e => {
                                    const file = e.target.files?.[0];
                                    if(file) {
                                        const base64 = await fileToBase64(file);
                                        addListItem('aboutPage.heroImageUrls', base64);
                                    }
                                }} />
                            </label>
                        </div>
                    </div>

                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <h3 className="text-xl font-bold font-orbitron text-white uppercase">Chief Faculty Coordinator</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <FormInput value={stagedSettings.aboutPage.chiefFaculty.name} onChange={e => updateValue('aboutPage.chiefFaculty.name', (e.target as HTMLInputElement).value)} placeholder="Full Name" />
                                <FormInput value={stagedSettings.aboutPage.chiefFaculty.designation} onChange={e => updateValue('aboutPage.chiefFaculty.designation', (e.target as HTMLInputElement).value)} placeholder="Designation" />
                                <FormTextarea value={stagedSettings.aboutPage.chiefFaculty.quote} onChange={e => updateValue('aboutPage.chiefFaculty.quote', (e.target as HTMLTextAreaElement).value)} placeholder="Inspiring Quote" />
                                <FormInput value={stagedSettings.aboutPage.chiefFaculty.expertise} onChange={updateValue.bind(null, 'aboutPage.chiefFaculty.expertise')} />
                                <FormInput value={stagedSettings.aboutPage.chiefFaculty.experience} onChange={e => updateValue('aboutPage.chiefFaculty.experience', (e.target as HTMLInputElement).value)} placeholder="Experience (e.g. 15+ Years)" />
                            </div>
                            <ImageUploadField currentImageUrl={stagedSettings.aboutPage.chiefFaculty.image} onImageChange={v => updateValue('aboutPage.chiefFaculty.image', v)} />
                        </div>
                    </div>

                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold font-orbitron text-white uppercase">Journey Timeline</h3>
                            <button onClick={() => addListItem('aboutPage.journeyEvents', { year: '20XX', title: 'New Event', description: 'Brief description...', image: 'https://picsum.photos/seed/new/400' })} className="text-neon-blue text-[10px] font-bold uppercase">+ Add Event</button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stagedSettings.aboutPage.journeyEvents.map((event, i) => (
                                <div key={i} className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex justify-between">
                                        <FormInput value={event.year} onChange={e => updateListItem('aboutPage.journeyEvents', i, { ...event, year: (e.target as HTMLInputElement).value })} className="w-24 text-center font-bold" />
                                        <button onClick={() => removeListItem('aboutPage.journeyEvents', i)} className="text-red-400 text-[10px] font-bold uppercase">Remove</button>
                                    </div>
                                    <FormInput value={event.title} onChange={e => updateListItem('aboutPage.journeyEvents', i, { ...event, title: (e.target as HTMLInputElement).value })} placeholder="Event Title" />
                                    <FormTextarea value={event.description} onChange={e => updateListItem('aboutPage.journeyEvents', i, { ...event, description: (e.target as HTMLTextAreaElement).value })} placeholder="Event Description" />
                                    <ImageUploadField currentImageUrl={event.image} onImageChange={v => updateListItem('aboutPage.journeyEvents', i, { ...event, image: v })} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {pageTab === 'about-dept' && (
                <div className="grid gap-10">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <h3 className="text-xl font-bold font-orbitron text-white uppercase">Department Header</h3>
                        <ImageUploadField label="Hero Banner" currentImageUrl={stagedSettings.aboutDepartmentPage.heroImageUrl} onImageChange={v => updateValue('aboutDepartmentPage.heroImageUrl', v)} />
                    </div>

                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <h3 className="text-xl font-bold font-orbitron text-white uppercase">Department Stats (Scrolling Numbers)</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {stagedSettings.aboutDepartmentPage.stats.map((s, i) => (
                                <div key={i} className="p-5 bg-black/40 rounded-2xl border border-white/5 grid grid-cols-2 gap-3">
                                    <FormField label="Label">
                                        <FormInput value={s.label} onChange={e => {
                                            const newStats = [...stagedSettings.aboutDepartmentPage.stats];
                                            newStats[i] = { ...s, label: (e.target as HTMLInputElement).value };
                                            updateValue('aboutDepartmentPage.stats', newStats);
                                        }} />
                                    </FormField>
                                    <FormField label="Value">
                                        <FormInput value={s.value} onChange={e => {
                                            const newStats = [...stagedSettings.aboutDepartmentPage.stats];
                                            newStats[i] = { ...s, value: (e.target as HTMLInputElement).value };
                                            updateValue('aboutDepartmentPage.stats', newStats);
                                        }} />
                                    </FormField>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <h3 className="text-xl font-bold font-orbitron text-white uppercase">Department HOD</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <FormInput value={stagedSettings.aboutDepartmentPage.hod.name} onChange={e => updateValue('aboutDepartmentPage.hod.name', (e.target as HTMLInputElement).value)} placeholder="HOD Name" />
                                <FormInput value={stagedSettings.aboutDepartmentPage.hod.designation} onChange={e => updateValue('aboutDepartmentPage.hod.designation', (e.target as HTMLInputElement).value)} placeholder="Designation" />
                                <FormTextarea value={stagedSettings.aboutDepartmentPage.hod.quote} onChange={e => updateValue('aboutDepartmentPage.hod.quote', (e.target as HTMLTextAreaElement).value)} placeholder="HOD Message" />
                            </div>
                            <ImageUploadField currentImageUrl={stagedSettings.aboutDepartmentPage.hod.image} onImageChange={v => updateValue('aboutDepartmentPage.hod.image', v)} />
                        </div>
                    </div>

                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                         <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold font-orbitron text-white uppercase">Faculty Registry</h3>
                            <button onClick={() => {
                                const newFac = [...stagedSettings.aboutDepartmentPage.faculty, { id: Date.now(), name: 'New Professor', designation: 'Assistant Professor', image: 'https://picsum.photos/400' }];
                                updateValue('aboutDepartmentPage.faculty', newFac);
                            }} className="text-neon-blue text-[10px] font-bold uppercase">+ Add Faculty</button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stagedSettings.aboutDepartmentPage.faculty.map((f, i) => (
                                <div key={f.id} className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <img src={f.image} className="w-10 h-10 rounded-full" />
                                        <button onClick={() => {
                                            const newFac = stagedSettings.aboutDepartmentPage.faculty.filter(item => item.id !== f.id);
                                            updateValue('aboutDepartmentPage.faculty', newFac);
                                        }} className="text-red-400 text-[10px] font-bold uppercase">Delete</button>
                                    </div>
                                    <FormInput value={f.name} onChange={e => {
                                        const newFac = [...stagedSettings.aboutDepartmentPage.faculty];
                                        newFac[i] = { ...f, name: (e.target as HTMLInputElement).value };
                                        updateValue('aboutDepartmentPage.faculty', newFac);
                                    }} placeholder="Name" />
                                    <FormInput value={f.designation} onChange={e => {
                                        const newFac = [...stagedSettings.aboutDepartmentPage.faculty];
                                        newFac[i] = { ...f, designation: (e.target as HTMLInputElement).value };
                                        updateValue('aboutDepartmentPage.faculty', newFac);
                                    }} placeholder="Designation" />
                                    <ImageUploadField currentImageUrl={f.image} onImageChange={v => {
                                        const newFac = [...stagedSettings.aboutDepartmentPage.faculty];
                                        newFac[i] = { ...f, image: v };
                                        updateValue('aboutDepartmentPage.faculty', newFac);
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {pageTab === 'contact' && (
                <div className="grid gap-10">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <h3 className="text-xl font-bold font-orbitron text-white uppercase">Contact Page Parameters</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <FormField label="Primary Admin Email (for receipts/alerts)">
                                    <FormInput 
                                        value={stagedSettings.adminPage.adminEmail} 
                                        onChange={e => updateValue('adminPage.adminEmail', (e.target as HTMLInputElement).value)} 
                                        placeholder="admin@aimclub.com"
                                    />
                                </FormField>
                                <FormField label="Public Contact Email (Contact form target)">
                                    <FormInput 
                                        value={stagedSettings.adminPage.contactEmail} 
                                        onChange={e => updateValue('adminPage.contactEmail', (e.target as HTMLInputElement).value)} 
                                        placeholder="contact@aimclub.com"
                                    />
                                </FormField>
                            </div>
                            <div className="space-y-6">
                                <FormField label="Office Base Coordinates (Address)">
                                    <FormTextarea 
                                        value={stagedSettings.footer.address} 
                                        onChange={e => updateValue('footer.address', (e.target as HTMLTextAreaElement).value)} 
                                        placeholder="Full physical address..."
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {pageTab === 'general' && (
                <div className="grid gap-10">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-8">
                        <h3 className="text-xl font-bold font-orbitron text-white uppercase">College Branding Logos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
                            <ImageUploadField label="JBREC" currentImageUrl={stagedSettings.collegeHeader.jbrecLogoUrl} onImageChange={v => updateValue('collegeHeader.jbrecLogoUrl', v)} />
                            <ImageUploadField label="NAAC" currentImageUrl={stagedSettings.collegeHeader.naacLogoUrl} onImageChange={v => updateValue('collegeHeader.naacLogoUrl', v)} />
                            <ImageUploadField label="ISO" currentImageUrl={stagedSettings.collegeHeader.isoLogoUrl} onImageChange={v => updateValue('collegeHeader.isoLogoUrl', v)} />
                            <ImageUploadField label="AICTE" currentImageUrl={stagedSettings.collegeHeader.aicteLogoUrl} onImageChange={v => updateValue('collegeHeader.aicteLogoUrl', v)} />
                            <ImageUploadField label="JNTUH" currentImageUrl={stagedSettings.collegeHeader.jntuhLogoUrl} onImageChange={v => updateValue('collegeHeader.jntuhLogoUrl', v)} />
                        </div>
                    </div>

                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-8">
                        <h3 className="text-xl font-bold font-orbitron text-white uppercase">Footer Configuration</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <FormField label="Campus Address">
                                    <FormInput 
                                        value={stagedSettings.footer.address} 
                                        onChange={e => updateValue('footer.address', (e.target as HTMLInputElement).value)} 
                                        placeholder="Full address for footer..."
                                    />
                                </FormField>
                                <FormField label="LinkedIn Profile URL">
                                    <FormInput 
                                        value={stagedSettings.footer.linkedinUrl} 
                                        onChange={e => updateValue('footer.linkedinUrl', (e.target as HTMLInputElement).value)} 
                                        placeholder="https://linkedin.com/..."
                                    />
                                </FormField>
                                <FormField label="Instagram Profile URL">
                                    <FormInput 
                                        value={stagedSettings.footer.instagramUrl} 
                                        onChange={e => updateValue('footer.instagramUrl', (e.target as HTMLInputElement).value)} 
                                        placeholder="https://instagram.com/..."
                                    />
                                </FormField>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <ImageUploadField label="Footer Club Logo" currentImageUrl={stagedSettings.footer.logoUrl} onImageChange={v => updateValue('footer.logoUrl', v)} />
                                <ImageUploadField label="Footer College Logo" currentImageUrl={stagedSettings.footer.secondaryLogoUrl} onImageChange={v => updateValue('footer.secondaryLogoUrl', v)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ===================================================================================
// MANAGERS
// ===================================================================================

const DashboardView: React.FC = () => {
    const { applications, committeeMembers, events, payments } = useContext(AppContext as React.Context<AppContextType>);
    const totalResources = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);
    const today = new Date().toISOString().split('T')[0];
    const todayBriefings = useMemo(() => applications.filter(app => app.status === 'Interview Scheduled' && app.interviewDetails?.date === today), [applications, today]);
    const stats = [ { icon: 'file-text', label: 'Total Apps', value: applications.length, accent: 'text-neon-blue' }, { icon: 'team', label: 'Members', value: committeeMembers.length, accent: 'text-neon-pink' }, { icon: 'calendar', label: 'Events', value: events.length, accent: 'text-golden-yellow' }, { icon: 'download', label: 'Revenue', value: `₹${totalResources.toLocaleString()}`, accent: 'text-green-400' } ];

    return (
        <div className="space-y-12 animate-fade-in">
            <h2 className="text-4xl font-black font-orbitron uppercase text-white">Main Desk</h2>
            
            {/* LIVE UPLINK - TODAY'S INTERVIEWS */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 blur-[80px] -z-10 group-hover:bg-neon-blue/20 transition-all"></div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
                    <h4 className="text-lg font-black font-orbitron text-white uppercase tracking-widest">Active Schedule: {today}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {todayBriefings.length > 0 ? todayBriefings.map(app => (
                        <div key={app.id} className="p-6 bg-black/40 rounded-[2rem] border border-white/10 hover:border-neon-blue transition-all group/card">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1.5 bg-neon-blue/10 text-neon-blue text-[9px] font-black uppercase tracking-widest rounded-xl border border-neon-blue/20">{app.interviewDetails?.time}</span>
                                <Icon name="calendar" className="w-5 h-5 text-gray-700" />
                            </div>
                            <h5 className="text-white font-black text-lg font-orbitron uppercase truncate">{app.name}</h5>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">{app.role}</p>
                            <a href={app.interviewDetails?.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-neon-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-neon-blue/20 group-hover/card:scale-[1.02] transition-all">
                                <Icon name="video" className="w-4 h-4" /> Start Uplink
                            </a>
                        </div>
                    )) : (
                        <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                            <Icon name="refresh" className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em]">No active synchronizations scheduled for today</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(s => (
                    <div key={s.label} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 shadow-lg group hover:border-white/20 transition-all">
                        <div className={`w-14 h-14 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 ${s.accent}`}><Icon name={s.icon} className="w-7 h-7" /></div>
                        <div className="mt-8"><p className="text-4xl font-black font-orbitron text-white tracking-tighter">{s.value}</p><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">{s.label}</p></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ApplicationManager: React.FC = () => {
    const { applications, deleteApplication, updateApplication, setAlert } = useContext(AppContext as React.Context<AppContextType>);
    const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [drawerTab, setDrawerTab] = useState<'info' | 'interview' | 'logs'>('info');

    // Dossier Metrics calculation
    const dossierMetrics = useMemo(() => {
        const todayStr = new Date().toDateString();
        return {
            today: applications.filter(a => new Date(a.submittedAt).toDateString() === todayStr).length,
            pending: applications.filter(a => a.status === 'Pending').length,
            shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
            interviews: applications.filter(a => a.status === 'Interview Scheduled').length,
            purged: applications.filter(a => a.status === 'Rejected').length,
        };
    }, [applications]);

    const handleBulk = (status: ApplicationData['status']) => {
        if (selectedIds.size === 0) return;
        applications.forEach(app => { if (selectedIds.has(app.id)) updateApplication({ ...app, status, logs: [...(app.logs || []), { date: new Date().toISOString(), action: `Bulk: ${status}`, note: 'Admin batch' }] }); });
        setSelectedIds(new Set());
        setAlert({ message: `Updated ${selectedIds.size} applications.`, type: 'success' });
    };

    const handleExport = () => {
        const data = selectedIds.size > 0 ? applications.filter(app => selectedIds.has(app.id)) : applications;
        if (data.length === 0) return;
        const csv = ["ID,Name,Email,Role,Status", ...data.map(a => `${a.applicantId},${a.name},${a.email},${a.role},${a.status}`)].join("\n");
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        link.download = `AIM_Applications.csv`;
        link.click();
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setAlert({ message: 'Neural Matrix Synchronized. Dossiers up to date.', type: 'success' });
        }, 1200);
    };

    const handleScheduleClick = (app: ApplicationData) => {
        setSelectedApp(app);
        setDrawerTab('interview');
    };

    const filtered = useMemo(() => applications.filter(app => (app.name.toLowerCase().includes(search.toLowerCase()) || app.applicantId.toLowerCase().includes(search.toLowerCase())) && (statusFilter === 'All' || app.status === statusFilter)), [applications, search, statusFilter]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* DOSSIER METRICS HIGHLIGHTS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                    { label: "Transmissions Today", value: dossierMetrics.today, color: "text-neon-blue", icon: "megaphone" },
                    { label: "Pending Vetting", value: dossierMetrics.pending, color: "text-golden-yellow", icon: "help-circle" },
                    { label: "Shortlisted Nodes", value: dossierMetrics.shortlisted, color: "text-green-400", icon: "logo" },
                    { label: "Scheduled Syncs", value: dossierMetrics.interviews, color: "text-neon-pink", icon: "calendar" },
                    { label: "Purged Dossiers", value: dossierMetrics.purged, color: "text-red-500", icon: "trash" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-[2rem] shadow-lg flex flex-col group hover:border-white/20 transition-all">
                        <div className={`w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center mb-4 ${stat.color}`}>
                            <Icon name={stat.icon} className="w-4 h-4" />
                        </div>
                        <span className="text-3xl font-black font-orbitron text-white group-hover:scale-110 transition-transform origin-left">{stat.value}</span>
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
                <FormInput placeholder="Search applicants by name or ID..." value={search} onChange={e => setSearch((e.target as HTMLInputElement).value)} className="xl:w-96" />
                <div className="flex gap-3">
                    <button 
                        onClick={handleRefresh} 
                        disabled={isRefreshing}
                        className={`px-4 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all ${isRefreshing ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        <Icon name="refresh" className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={handleExport} className="px-6 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10"><Icon name="download" className="w-4 h-4 mr-2 inline" /> Export Records</button>
                    <div className="flex bg-black/40 p-1.5 rounded-[1.5rem] border border-white/10 overflow-x-auto no-scrollbar">
                        {['All', 'Pending', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Waitlisted', 'Rejected'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === s ? 'bg-neon-blue text-white shadow-lg shadow-neon-blue/20' : 'text-gray-500 hover:text-white'}`}>{s}</button>
                        ))}
                    </div>
                </div>
            </div>
            {selectedIds.size > 0 && (
                <div className="flex gap-2 p-6 bg-neon-blue/10 border border-neon-blue/20 rounded-[2rem] items-center justify-between animate-slide-in">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neon-blue">{selectedIds.size} Target Nodes Selected</span>
                    <div className="flex gap-3">
                        <button onClick={() => handleBulk('Shortlisted')} className="px-5 py-2.5 bg-neon-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Shortlist</button>
                        <button onClick={() => handleBulk('Rejected')} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Reject</button>
                        <button onClick={() => setSelectedIds(new Set())} className="px-5 py-2.5 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Clear</button>
                    </div>
                </div>
            )}
            <CrudManager title="Recruitment Matrix" items={filtered} columns={[
                { header: '', accessor: (a) => <input type="checkbox" checked={selectedIds.has(a.id)} onChange={() => { const s = new Set(selectedIds); if (s.has(a.id)) s.delete(a.id); else s.add(a.id); setSelectedIds(s); }} className="w-5 h-5 rounded-lg border-white/10 bg-black/40 text-neon-blue focus:ring-neon-blue focus:ring-offset-0 cursor-pointer" /> },
                { header: 'Dossier', accessor: (a) => <div><p className="font-black text-white uppercase font-orbitron">{a.name}</p><p className="text-[10px] font-bold text-gray-600 tracking-widest uppercase mt-1">{a.applicantId}</p></div> },
                { header: 'Objective', accessor: (a) => <span className="text-[10px] font-black uppercase tracking-widest text-neon-blue px-3 py-1 bg-neon-blue/5 rounded-lg border border-neon-blue/10">{a.role}</span> },
                { header: 'Status Signal', accessor: (a) => (
                    <div className="flex items-center gap-4">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border ${a.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' : a.status === 'Shortlisted' ? 'bg-green-500/10 border-green-500/20 text-green-400' : a.status === 'Interview Scheduled' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>{a.status}</span>
                        {a.status === 'Shortlisted' && (
                            <button onClick={() => handleScheduleClick(a)} className="text-neon-blue hover:scale-110 transition-transform p-2 bg-neon-blue/10 rounded-xl" title="Schedule Sync"><Icon name="calendar" className="w-4 h-4" /></button>
                        )}
                    </div>
                ) },
            ]} onEdit={(app) => { setSelectedApp(app); setDrawerTab('info'); }} onDelete={(a) => window.confirm('Permanently wipe dossier from database?') && deleteApplication(a.id)} />
            {selectedApp && (
                <ApplicationDrawer 
                    isOpen={true} 
                    onClose={() => setSelectedApp(null)} 
                    application={selectedApp} 
                    onUpdate={updateApplication} 
                    initialTab={drawerTab}
                />
            )}
        </div>
    );
};

const MissionCalendar: React.FC = () => {
    const { applications, updateApplication } = useContext(AppContext as React.Context<AppContextType>);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeBriefing, setActiveBriefing] = useState<ApplicationData | null>(null);
    const scheduled = useMemo(() => applications.filter(app => app.status === 'Interview Scheduled' && app.interviewDetails), [applications]);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-3xl font-black font-orbitron text-white uppercase tracking-tighter">Synchronization Calendar</h3>
                        <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.4em] mt-2">Managing active communication channels</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"><Icon name="chevron-double-left" className="w-5 h-5 text-gray-400" /></button>
                        <span className="text-sm font-black uppercase tracking-widest px-8 py-3 bg-black/40 rounded-[1.5rem] border border-white/5 text-white shadow-inner">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"><Icon name="chevron-double-right" className="w-5 h-5 text-gray-400" /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] pb-6">{d}</div>)}
                    {Array.from({ length: startDay + daysInMonth }).map((_, i) => {
                        const day = i - startDay + 1;
                        if (day <= 0) return <div key={i} className="min-h-[120px] opacity-0"></div>;
                        const dStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const daily = scheduled.filter(app => app.interviewDetails?.date === dStr);
                        const isToday = new Date().toISOString().split('T')[0] === dStr;

                        return (
                            <div key={i} className={`group relative min-h-[140px] p-4 rounded-[2rem] border transition-all duration-500 ${daily.length > 0 ? 'bg-neon-blue/10 border-neon-blue/30 shadow-[0_0_20px_rgba(0,191,255,0.1)]' : 'bg-white/[0.03] border-white/5 hover:border-white/10'} ${isToday ? 'ring-2 ring-neon-blue/40 ring-offset-4 ring-offset-dark-bg' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-black ${isToday ? 'text-neon-blue scale-125 transition-transform' : 'text-gray-600'}`}>{day}</span>
                                    {isToday && <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse"></div>}
                                </div>
                                <div className="space-y-2">
                                    {daily.map(app => (
                                        <button 
                                            key={app.id} 
                                            onClick={() => setActiveBriefing(app)}
                                            className="w-full text-left p-2 bg-neon-blue text-white text-[9px] rounded-xl truncate font-black uppercase tracking-widest shadow-lg shadow-neon-blue/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-between"
                                        >
                                            <span className="truncate">{app.name}</span>
                                            <span className="opacity-50 text-[7px]">{app.interviewDetails?.time}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* QUICK BRIEFING MODAL */}
            {activeBriefing && (
                <Modal isOpen={true} onClose={() => setActiveBriefing(null)} title="Sync Briefing" size="xl">
                    <div className="space-y-8 p-4">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
                                <Icon name="users" className="w-10 h-10 text-neon-blue" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black font-orbitron text-white uppercase tracking-tight">{activeBriefing.name}</h4>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{activeBriefing.role} • {activeBriefing.applicantId}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Transmission Date</p>
                                <p className="text-sm font-bold text-white">{activeBriefing.interviewDetails?.date}</p>
                            </div>
                            <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Local Time</p>
                                <p className="text-sm font-bold text-white">{activeBriefing.interviewDetails?.time}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <a href={activeBriefing.interviewDetails?.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-5 bg-neon-blue text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-neon-blue/30 hover:scale-[1.02] active:scale-95 transition-all">
                                <Icon name="video" className="w-5 h-5" /> Establish Link (Google Meet)
                            </a>
                            <button 
                                onClick={() => { updateApplication({...activeBriefing, status: 'Shortlisted'}); setActiveBriefing(null); }} 
                                className="w-full py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest border border-white/5 rounded-2xl hover:bg-red-500/10 hover:text-red-400 transition-all"
                            >
                                Re-route Sequence (Cancel Meeting)
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

const EventsManager: React.FC = () => {
    const { events, addEvent, updateEvent, deleteEvent, setAlert } = useContext(AppContext as React.Context<AppContextType>);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            try {
                const base64 = await fileToBase64(file);
                setEditingEvent(prev => prev ? { ...prev, pdfUrl: base64 } : null);
                setAlert({ message: 'PDF manifestation encoded successfully.', type: 'info' });
            } catch (err) {
                setAlert({ message: 'Encoding failed.', type: 'error' });
            }
        } else if (file) {
            setAlert({ message: 'Invalid file format. Upload a PDF.', type: 'error' });
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;
        
        if (editingEvent.id) {
            updateEvent(editingEvent as Event);
        } else {
            addEvent(editingEvent as Omit<Event, 'id'>);
        }
        setIsModalOpen(false);
        setEditingEvent(null);
        setAlert({ message: 'Events Updated.', type: 'success' });
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <CrudManager title="All Events" items={events} columns={[
                { header: 'Title', accessor: (e) => <div className="font-bold text-white">{e.title}</div> },
                { header: 'Status', accessor: (e) => <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${e.type === 'Ongoing' ? 'bg-green-500/10 text-green-400' : 'bg-neon-blue/10 text-neon-blue'}`}>{e.type}</span> },
                { header: 'Date', accessor: (e) => <span className="text-xs text-gray-400">{e.date}</span> }
            ]} onAdd={() => { setEditingEvent({ title: '', type: 'Upcoming', date: '', description: '', image: 'https://picsum.photos/400', category: 'Workshop', venue: 'Campus', price: 0, time: '10:00 AM', pdfUrl: '' }); setIsModalOpen(true); }} onEdit={(e) => { setEditingEvent(e); setIsModalOpen(true); }} onDelete={(e) => window.confirm('Delete event?') && deleteEvent(e.id)} />
            {isModalOpen && (
                <Modal isOpen={true} onClose={() => setIsModalOpen(false)} title="Event Editor" size="4xl">
                    <form className="space-y-8" onSubmit={handleSave}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField label="Event Title">
                                <FormInput 
                                    value={editingEvent?.title ?? ''} 
                                    onChange={e => setEditingEvent(prev => prev ? ({...prev, title: (e.target as HTMLInputElement).value}) : null)} 
                                    required 
                                    placeholder="Enter event name..."
                                />
                            </FormField>
                            <FormField label="Mission Status">
                                <FormSelect 
                                    value={editingEvent?.type ?? 'Upcoming'} 
                                    onChange={e => setEditingEvent(prev => prev ? ({...prev, type: (e.target as HTMLSelectElement).value as any}) : null)}
                                >
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Previous">Previous</option>
                                </FormSelect>
                            </FormField>
                            <FormField label="Operational Date">
                                <FormInput 
                                    value={editingEvent?.date ?? ''} 
                                    onChange={e => setEditingEvent(prev => prev ? ({...prev, date: (e.target as HTMLInputElement).value}) : null)} 
                                    required 
                                    placeholder="e.g. Oct 25, 2024"
                                />
                            </FormField>
                            <FormField label="Deployment Timings">
                                <FormInput 
                                    value={editingEvent?.time ?? ''} 
                                    onChange={e => setEditingEvent(prev => prev ? ({...prev, time: (e.target as HTMLInputElement).value}) : null)} 
                                    placeholder="e.g. 10:00 AM - 4:00 PM"
                                />
                            </FormField>
                            <FormField label="Coordinates / Venue">
                                <FormInput 
                                    value={editingEvent?.venue ?? ''} 
                                    onChange={e => setEditingEvent(prev => prev ? ({...prev, venue: (e.target as HTMLInputElement).value}) : null)} 
                                    placeholder="e.g. Main Auditorium"
                                />
                            </FormField>
                            <FormField label="Resource Fee (INR)">
                                <FormInput 
                                    type="number" 
                                    value={editingEvent?.price ?? 0} 
                                    onChange={e => setEditingEvent(prev => prev ? ({...prev, price: parseInt((e.target as HTMLInputElement).value) || 0}) : null)} 
                                />
                            </FormField>
                            <FormField label="External Registration Link (Optional)">
                                <FormInput 
                                    value={editingEvent?.registrationLink ?? ''} 
                                    onChange={e => setEditingEvent(prev => prev ? ({...prev, registrationLink: (e.target as HTMLInputElement).value}) : null)} 
                                    placeholder="https://..."
                                />
                            </FormField>
                            <FormField label="PDF Manifest Uplink">
                                <div className="flex gap-3">
                                    <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" id="event-pdf-upload" />
                                    <label htmlFor="event-pdf-upload" className="flex-1 p-4 bg-gray-900/60 text-gray-500 border border-white/10 rounded-2xl cursor-pointer hover:border-neon-blue transition-all text-sm truncate flex items-center gap-3">
                                        <Icon name="download" className="w-5 h-5" />
                                        {editingEvent?.pdfUrl ? 'Manifest Encoded' : 'Uplink PDF Details'}
                                    </label>
                                    {editingEvent?.pdfUrl && (
                                        <button type="button" onClick={() => setEditingEvent(prev => prev ? ({...prev, pdfUrl: ''}) : null)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                                            <Icon name="trash" className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </FormField>
                        </div>
                        <FormField label="Mission Overview & Objectives">
                            <FormTextarea 
                                value={editingEvent?.description ?? ''} 
                                onChange={e => setEditingEvent(prev => prev ? ({...prev, description: (e.target as HTMLTextAreaElement).value}) : null)} 
                                placeholder="Detailed briefing..."
                            />
                        </FormField>
                        <ImageUploadField label="Mission Visual Header" currentImageUrl={editingEvent?.image || ''} onImageChange={v => setEditingEvent(prev => prev ? ({...prev, image: v}) : null)} />
                        <div className="pt-4">
                            <button type="submit" className="w-full py-5 bg-neon-blue text-white font-black rounded-[2rem] uppercase text-xs tracking-[0.3em] shadow-2xl shadow-neon-blue/20 hover:scale-[1.02] active:scale-95 transition-all">
                                Sync Mission Parameters
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const GalleryManager: React.FC = () => {
    const { galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem, setAlert } = useContext(AppContext as React.Context<AppContextType>);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        if (editingItem.id) {
            updateGalleryItem(editingItem as GalleryItem);
        } else {
            addGalleryItem({ ...editingItem, eventId: editingItem.eventId || 0 } as Omit<GalleryItem, 'id'>);
        }
        setIsModalOpen(false);
        setEditingItem(null);
        setAlert({ message: 'Gallery Synchronized.', type: 'success' });
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <CrudManager title="Photo Gallery" items={galleryItems} columns={[
                { header: 'Event', accessor: (g) => <span className="font-bold text-white">{g.eventTitle}</span> },
                { header: 'Status', accessor: (g) => <span className="text-gray-500">{g.images?.length || 0} Photos</span> }
            ]} onAdd={() => { setEditingItem({ eventTitle: '', images: [], category: 'Workshop', date: new Date().toDateString(), eventId: 0 }); setIsModalOpen(true); }} onEdit={(g) => { setEditingItem(g); setIsModalOpen(true); }} onDelete={(g) => window.confirm('Delete gallery?') && deleteGalleryItem(g.id)} />
            {isModalOpen && (
                <Modal isOpen={true} onClose={() => setIsModalOpen(false)} title="Gallery Editor" size="4xl">
                    <form className="space-y-6" onSubmit={handleSave}>
                        <FormField label="Event Name">
                            <FormInput 
                                value={editingItem?.eventTitle} 
                                onChange={e => setEditingItem(prev => prev ? ({...prev, eventTitle: (e.target as HTMLInputElement).value}) : null)} 
                                required 
                            />
                        </FormField>
                        <FormField label="Upload Image to Album">
                            <input type="file" accept="image/*" multiple onChange={async (e) => {
                                // FIX: Casting result of Array.from to File[] to prevent 'unknown' type error.
                                const files = Array.from(e.target.files || []) as File[];
                                const base64Promises = files.map(file => fileToBase64(file));
                                const newImages = await Promise.all(base64Promises);
                                setEditingItem(prev => prev ? ({ ...prev, images: [...(prev.images || []), ...newImages] }) : null);
                            }} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neon-blue/10 file:text-neon-blue hover:file:bg-neon-blue/20" />
                        </FormField>
                        <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 bg-black/20 rounded-xl">
                            {editingItem?.images?.map((url, i) => (
                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                                    <img src={url} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => {
                                        setEditingItem(prev => {
                                            if (!prev || !prev.images) return prev;
                                            const n = [...prev.images]; 
                                            n.splice(i, 1);
                                            return { ...prev, images: n };
                                        });
                                    }} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon name="trash" className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="w-full py-4 bg-neon-pink text-white font-bold rounded-xl uppercase text-[10px]">Sync Album</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const FAQManager: React.FC = () => {
    const { faqs, addFaq, updateFaq, deleteFaq, setAlert } = useContext(AppContext as React.Context<AppContextType>);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<FAQItem> | null>(null);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        if (editingItem.id) updateFaq(editingItem as FAQItem);
        else addFaq(editingItem as Omit<FAQItem, 'id'>);
        setIsModalOpen(false);
        setEditingItem(null);
        setAlert({ message: 'Queries Synchronized.', type: 'success' });
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <CrudManager title="System FAQ Hub" items={faqs} columns={[
                { header: 'Inquiry / Question', accessor: (f) => <span className="font-bold text-white truncate max-w-xs block">{f.question}</span> },
                { header: 'Response', accessor: (f) => <span className="text-gray-500 truncate max-w-sm block">{f.answer}</span> }
            ]} onAdd={() => { setEditingItem({ question: '', answer: '' }); setIsModalOpen(true); }} onEdit={(f) => { setEditingItem(f); setIsModalOpen(true); }} onDelete={(f) => window.confirm('Purge this query?') && deleteFaq(f.id)} />
            {isModalOpen && (
                <Modal isOpen={true} onClose={() => setIsModalOpen(false)} title="Query Editor" size="3xl">
                    <form className="space-y-6" onSubmit={handleSave}>
                        <FormField label="Inquiry Terminal (Question)">
                            <FormInput 
                                value={editingItem?.question} 
                                onChange={e => setEditingItem(prev => prev ? ({...prev, question: (e.target as HTMLInputElement).value}) : null)} 
                                required 
                            />
                        </FormField>
                        <FormField label="System Response (Answer)">
                            <FormTextarea 
                                value={editingItem?.answer} 
                                onChange={e => setEditingItem(prev => prev ? ({...prev, answer: (e.target as HTMLTextAreaElement).value}) : null)} 
                                required 
                            />
                        </FormField>
                        <button type="submit" className="w-full py-4 bg-neon-blue text-white font-bold rounded-xl uppercase text-[10px]">Commit Sequence</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const PaymentsManager: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const { payments, deletePayment } = appContext;
    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <CrudManager 
                title="Revenue Log" 
                items={payments} 
                columns={[
                    { header: 'Event', accessor: (p) => <span className="font-bold text-white">{p.eventName}</span> },
                    { header: 'User', accessor: (p) => <div><p className="text-white">{p.userName}</p><p className="text-[10px] text-gray-500">{p.userEmail}</p></div> },
                    { header: 'Amount', accessor: (p) => <span className="font-mono text-golden-yellow">₹{p.amount.toFixed(2)}</span> },
                    { header: 'Date', accessor: (p) => <span className="text-xs text-gray-400">{new Date(p.paymentDate).toLocaleDateString()}</span> },
                ]} 
                onEdit={() => {}} // Payment records are read-only
                onDelete={(p) => window.confirm('Delete payment record?') && deletePayment(p.id)} 
            />
        </div>
    );
};

const AdminPage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const { siteSettings } = appContext;
    
    const navItems: { view: AdminView, label: string, icon: string }[] = [
        { view: 'dashboard', label: 'Main Desk', icon: 'dashboard' }, 
        { view: 'applications', label: 'Applicants', icon: 'file-text' }, 
        { view: 'calendar', label: 'Interviews', icon: 'calendar' }, 
        { view: 'content', label: 'Site Editor', icon: 'settings' },
        { view: 'events', label: 'Events Hub', icon: 'logo' }, 
        { view: 'gallery', label: 'Gallery Bank', icon: 'camera' }, 
        { view: 'faqs', label: 'FAQ Hub', icon: 'help-circle' },
        { view: 'payments', label: 'Revenue Log', icon: 'download' }
    ];

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardView />;
            case 'applications': return <ApplicationManager />;
            case 'calendar': return <MissionCalendar />;
            case 'content': return <ContentManager />;
            case 'events': return <EventsManager />;
            case 'gallery': return <GalleryManager />;
            case 'faqs': return <FAQManager />;
            case 'payments': return <PaymentsManager />;
            default: return null;
        }
    };

    if (!isLoggedIn) return <AdminLoginPage onLogin={() => setIsLoggedIn(true)} logoUrl={siteSettings.adminPage.loginLogoUrl} onGoHome={() => appContext.setPage('home')} />;
    
    return (
        <div className="flex min-h-screen text-gray-300 bg-dark-bg transition-colors duration-500 font-montserrat overflow-hidden">
            <aside className={`flex-shrink-0 bg-gray-900/60 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-all duration-700 relative z-40 ${isSidebarCollapsed ? 'w-24' : 'w-72'}`}>
                <div className={`p-8 border-b border-white/5 flex items-center gap-4 overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                    <img src={siteSettings.header.logoUrl} alt="Logo" className="h-10 w-auto flex-shrink-0 drop-shadow-glow-blue" />
                    {!isSidebarCollapsed && <span className="font-black text-lg font-orbitron uppercase text-white">Admin <span className="text-neon-blue">A.I.M</span></span>}
                </div>
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto no-scrollbar">
                    {navItems.map(item => (
                        <button key={item.view} onClick={() => setActiveView(item.view)} className={`w-full flex items-center gap-4 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all relative group ${activeView === item.view ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'} ${isSidebarCollapsed ? 'justify-center px-0' : 'px-6'}`}>
                            <Icon name={item.icon} className={`w-5 h-5 flex-shrink-0 ${activeView === item.view ? 'drop-shadow-glow-blue' : ''}`} />
                            {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            {activeView === item.view && <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue"></div>}
                        </button>
                    ))}
                </nav>
                <div className="p-6 border-t border-white/5 space-y-3">
                    <button onClick={() => appContext.setPage('home')} className="w-full flex items-center gap-4 py-3 text-gray-500 hover:text-white uppercase text-[9px] font-bold px-6"><Icon name="external-link" className="w-4 h-4" />{!isSidebarCollapsed && <span>Visit Site</span>}</button>
                    <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-4 py-3 text-red-400/80 hover:text-red-400 uppercase text-[9px] font-bold px-6"><Icon name="logout" className="w-4 h-4" />{!isSidebarCollapsed && <span>Logout</span>}</button>
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="w-full justify-center text-gray-700 hover:text-neon-blue transition-colors p-2"><Icon name={isSidebarCollapsed ? 'chevron-double-right' : 'chevron-double-left'} className="w-4 h-4" /></button>
                </div>
            </aside>
            <main className="flex-1 p-10 overflow-y-auto no-scrollbar relative bg-admin-mesh">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
                <div className="relative z-10 max-w-7xl mx-auto pb-20">{renderView()}</div>
            </main>
        </div>
    );
};

export default AdminPage;
