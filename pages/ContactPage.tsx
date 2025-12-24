import React, { useState, useContext } from 'react';
import { Icon } from '../components/icons';
import { AppContext, AppContextType } from '../App';

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-1">{label}</label>
        {children}
    </div>
);

const FormInput = (props: React.ComponentProps<'input'>) => (
    <input 
        {...props} 
        className={`w-full p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-white/10 rounded-2xl focus:border-neon-blue focus:ring-4 focus:ring-neon-blue/10 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${props.className}`} 
    />
);

const FormTextarea = (props: React.ComponentProps<'textarea'>) => (
    <textarea 
        {...props} 
        className="w-full p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-white/10 rounded-2xl focus:border-neon-blue focus:ring-4 focus:ring-neon-blue/10 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 min-h-[150px]" 
    />
);

const ContactHero: React.FC = () => {
    return (
        <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-dark-bg">
                <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
                {/* Dynamic Gradient Blobs */}
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-pink/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 text-center px-4 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                    <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-blue">Direct Uplink Active</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter font-orbitron leading-tight text-white">
                    GET IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-pink">TOUCH</span>
                </h1>
                <p className="mt-4 text-gray-400 max-w-xl mx-auto font-medium">
                    Initiate a connection with the A.I.M. core team. Whether you have a query, a proposal, or just want to talk tech, we're listening.
                </p>
            </div>
        </section>
    );
};

const QueriesSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const faqs = appContext?.faqs || [];

    return (
        <section className="py-24 bg-transparent">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-16 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                        <div className="w-12 h-[2px] bg-neon-pink"></div>
                        <span className="text-neon-pink font-black tracking-widest text-[10px] uppercase">Retrieval Unit</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black font-orbitron text-gray-900 dark:text-white tracking-tighter uppercase">SYSTEM <span className="text-neon-blue">QUERIES</span></h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">Common transmissions decoded for your convenience.</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <div key={item.id} className={`group rounded-3xl border transition-all duration-500 ${openIndex === index ? 'bg-white/95 dark:bg-gray-900/60 border-neon-blue/30 shadow-2xl backdrop-blur-xl' : 'bg-white/40 dark:bg-transparent border-gray-100 dark:border-white/5 hover:border-neon-blue/20 backdrop-blur-sm'}`}>
                            <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center p-8 text-left">
                                <span className="text-xl font-bold text-gray-800 dark:text-gray-100 font-orbitron tracking-tight">{item.question}</span>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-neon-blue text-white rotate-180' : 'bg-gray-100/80 dark:bg-gray-800/50 text-gray-400 group-hover:text-neon-blue'}`}>
                                    <Icon name="chevronDown" className="w-5 h-5" />
                                </div>
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-8 pb-8 pt-2">
                                    <div className="h-[1px] w-12 bg-neon-blue/40 mb-6"></div>
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{item.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const appContext = useContext(AppContext as React.Context<AppContextType>);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!appContext) return;
        setIsLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('subject', formData.subject);
        data.append('message', formData.message);
        data.append('_subject', `A.I.M. Club Contact Form: ${formData.subject}`);

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${appContext.siteSettings.adminPage.contactEmail}`, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                appContext.setAlert({ message: "Transmission successful! We'll get back to you soon.", type: 'success' });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                throw new Error('Failed to send message.');
            }
        } catch (error) {
            appContext.setAlert({ message: "Network interference detected. Please try again later.", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const contactInfo = [
        { icon: 'logo', label: 'Base Location', value: 'JBREC Campus, Hyderabad', sub: 'Yenkapally, Moinabad' },
        { icon: 'megaphone', label: 'Email Uplink', value: appContext?.siteSettings.adminPage.contactEmail || 'contact.aimcomittee@gmail.com', sub: 'Direct Communication' },
        { icon: 'team', label: 'Social Matrix', value: '@aim_club_official', sub: 'Instagram / LinkedIn' },
    ];

    return (
        <div className="animate-fade-in bg-white dark:bg-dark-bg transition-colors duration-500">
            <ContactHero />
            
            <div className="container mx-auto px-4 max-w-7xl -mt-20 relative z-20 pb-12">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Contact Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        {contactInfo.map((info, idx) => (
                            <div key={idx} className="group p-8 bg-white/80 dark:bg-gray-900/40 backdrop-blur-2xl border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-neon-blue/5 border border-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform">
                                        <Icon name={info.icon} className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">{info.label}</p>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight break-all">{info.value}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{info.sub}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="p-8 bg-gradient-to-br from-neon-blue/10 to-neon-pink/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] text-center shadow-lg">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Follow our journey</h4>
                            <div className="flex justify-center gap-4">
                                <a href="#" className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-neon-blue hover:border-neon-blue transition-all">
                                    <Icon name="linkedin" className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-neon-pink hover:border-neon-pink transition-all">
                                    <Icon name="logo" className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white/95 dark:bg-gray-900/60 backdrop-blur-3xl border border-gray-100 dark:border-white/10 rounded-[3.5rem] shadow-2xl p-8 md:p-14">
                            <div className="mb-10">
                                <h2 className="text-3xl md:text-4xl font-black font-orbitron text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-3">
                                    Transmission <span className="text-neon-blue">Portal</span>
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Fill in the parameters to send your message to the command center.</p>
                            </div>
                            
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField label="Full Identifier">
                                        <FormInput name="name" type="text" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                                    </FormField>
                                    <FormField label="Response Address">
                                        <FormInput name="email" type="email" placeholder="example@domain.com" value={formData.email} onChange={handleChange} required />
                                    </FormField>
                                </div>
                                <FormField label="Subject of Inquiry">
                                    <FormInput name="subject" type="text" placeholder="Regarding..." value={formData.subject} onChange={handleChange} required />
                                </FormField>
                                <FormField label="Message Payload">
                                    <FormTextarea name="message" placeholder="Type your transmission here..." value={formData.message} onChange={handleChange} required />
                                </FormField>
                                
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="group relative w-full md:w-auto px-10 py-4 bg-neon-blue text-white font-black rounded-2xl hover:bg-neon-blue/90 transition-all transform active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(0,191,255,0.3)]"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                                            {isLoading ? 'Transmitting...' : 'Send Transmission'}
                                            {!isLoading && <Icon name="arrowRight" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ Section Integrated into Contact Us */}
                <QueriesSection />

                {/* Map Section - Reduced Dimensions */}
                <div className="mt-8">
                    <div className="relative group p-[2px] rounded-[3.5rem] bg-gradient-to-r from-neon-blue/20 via-white/10 to-neon-pink/20 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none"></div>
                        <div className="relative h-[380px] w-full bg-gray-900 rounded-[3.4rem] overflow-hidden grayscale contrast-110 hover:grayscale-0 transition-all duration-1000">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.318041188354!2d78.23942007425409!3d17.34821810398683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba338f3529369%3A0x1921350a420b98a!2sJoginpally%20B.R.%20Engineering%20College!5e0!3m2!1sen!2sin!4v1714138138760!5m2!1sen!2sin"
                                className="w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="A.I.M. Club Headquarters Location"
                            ></iframe>
                            
                            {/* Location Badge */}
                            <div className="absolute bottom-6 right-6 p-5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl pointer-events-none group-hover:bg-white/20 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neon-blue mb-1">Signal Source</p>
                                <h4 className="text-white font-bold font-orbitron text-base tracking-tight">JBREC COMMAND CENTER</h4>
                                <p className="text-gray-400 text-[10px] mt-1">Yenkapally, Hyderabad, TS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;