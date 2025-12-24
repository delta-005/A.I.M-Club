
import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext, AppContextType } from '../App';
import { FacultyMember } from '../types';
import { Icon } from '../components/icons';

const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    const targetValueMatch = value.match(/\d+/);
    const target = targetValueMatch ? parseInt(targetValueMatch[0]) : 0;
    const suffix = value.replace(/[0-9]/g, '');
    const duration = 2500;

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let startTime: number | null = null;
        let animationFrame: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
            setCount(Math.floor(easeOutExpo(percentage) * target));
            if (progress < duration) animationFrame = requestAnimationFrame(animate);
            else setCount(target);
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, target]);

    return <span ref={ref}>{count}{suffix}</span>;
};

const DepartmentHero: React.FC = () => {
    const { siteSettings } = useContext(AppContext as React.Context<AppContextType>);
    return (
        <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-110" style={{ backgroundImage: `url('${siteSettings.aboutDepartmentPage.heroImageUrl}')` }}>
                <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]"></div>
            </div>
            <div className="relative z-10 text-center px-4 animate-fade-in">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter font-orbitron leading-none">
                    <span className="block text-white uppercase">Dept. Of</span>
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-white to-neon-blue">AI & ML</span>
                </h1>
                <p className="mt-8 text-lg md:text-xl text-gray-400 font-medium tracking-[0.2em] uppercase">Pioneering the Intelligence Revolution</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-dark-bg to-transparent"></div>
        </section>
    );
};

const DepartmentStats: React.FC = () => {
    const { siteSettings } = useContext(AppContext as React.Context<AppContextType>);
    const stats = siteSettings.aboutDepartmentPage.stats || [];
    
    return (
        <div className="container mx-auto px-4 mt-12 relative z-20 pb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-6 rounded-[2rem] shadow-2xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                        <Icon name={stat.icon} className="w-6 h-6 text-neon-blue mb-4" />
                        <span className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white font-orbitron"><AnimatedCounter value={stat.value} /></span>
                        <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AboutAndDirectivesSection: React.FC = () => {
    const { siteSettings } = useContext(AppContext as React.Context<AppContextType>);
    const { mission, vision, aboutDescription } = siteSettings.aboutDepartmentPage;
    return (
        <section className="py-24 bg-transparent">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    <div className="space-y-8">
                        <h2 className="text-5xl md:text-6xl font-black font-orbitron text-gray-900 dark:text-white tracking-tighter leading-none uppercase">Academic <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-orange-400">Excellence</span></h2>
                        <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium space-y-6">
                            {aboutDescription.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                            <div className="pt-4">
                                <a 
                                    href="https://jbrec.edu.in/computer-science-engineering-aiml/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-neon-blue text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-neon-blue/80 transition-all shadow-lg shadow-neon-blue/20"
                                >
                                    Know More <Icon name="arrowRight" className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-8">
                        <div className="p-10 bg-white/40 dark:bg-gray-800/20 border border-gray-100 dark:border-white/5 rounded-[3rem] backdrop-blur-md">
                            <h3 className="text-3xl font-black font-orbitron text-gray-900 dark:text-white mb-6 uppercase">Mission</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{mission}</p>
                        </div>
                        <div className="p-10 bg-white/40 dark:bg-gray-800/20 border border-gray-100 dark:border-white/5 rounded-[3rem] backdrop-blur-md">
                            <h3 className="text-3xl font-black font-orbitron text-gray-900 dark:text-white mb-6 uppercase">Vision</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{vision}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const HODSection: React.FC = () => {
    const { siteSettings } = useContext(AppContext as React.Context<AppContextType>);
    const hod = siteSettings.aboutDepartmentPage.hod;

    if (!hod) return null;

    return (
        <section className="py-24 relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="grid md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-5">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-neon-blue to-neon-pink rounded-[3.5rem] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl">
                                <img src={hod.image} alt={hod.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8">
                                    <h3 className="text-3xl font-black text-white font-orbitron uppercase tracking-tight">{hod.name}</h3>
                                    <p className="text-neon-blue font-bold uppercase tracking-[0.2em] text-xs mt-2">{hod.designation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-7 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20">
                            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neon-blue">Leadership Signal</span>
                        </div>
                        <h2 className="text-5xl font-black font-orbitron text-gray-900 dark:text-white uppercase tracking-tighter leading-none">A Message From <br/><span className="text-neon-blue">THE CHIEF</span></h2>
                        <div className="relative">
                            <Icon name="quote" className="absolute -top-6 -left-6 w-12 h-12 text-neon-blue/10" />
                            <p className="text-2xl text-gray-600 dark:text-gray-300 font-medium italic leading-relaxed pl-4">
                                "{hod.quote}"
                            </p>
                        </div>
                        <div className="pt-6">
                            <div className="h-px w-24 bg-gradient-to-r from-neon-blue to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FacultyMatrix: React.FC = () => {
    const { siteSettings } = useContext(AppContext as React.Context<AppContextType>);
    const { faculty } = siteSettings.aboutDepartmentPage;
    return (
        <section className="py-24 bg-transparent">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black font-orbitron text-gray-900 dark:text-white tracking-tighter uppercase">THE FACULTY <span className="text-neon-pink">MATRIX</span></h2>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Expert Guides in the Realm of Intelligence</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {faculty.map((member) => (
                        <div key={member.id} className="group relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col items-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative w-28 h-28 mb-6">
                                <img src={member.image} alt={member.name} className="relative z-10 w-full h-full object-cover rounded-full p-1 border-2 border-gray-200 dark:border-white/10 group-hover:border-neon-blue/50 transition-colors" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-base font-black text-gray-900 dark:text-white font-orbitron tracking-tight leading-tight transition-colors group-hover:text-neon-blue">{member.name}</h4>
                                <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mt-2">{member.designation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const AboutDepartmentPage: React.FC = () => {
    return (
        <div className="animate-fade-in bg-transparent">
            <DepartmentHero />
            <DepartmentStats />
            <AboutAndDirectivesSection />
            <HODSection />
            <FacultyMatrix />
        </div>
    );
};

export default AboutDepartmentPage;
