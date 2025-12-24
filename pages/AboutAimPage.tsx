
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext, AppContextType } from '../App';
import { CommitteeMember, FAQItem, JourneyEvent } from '../types';
import { Icon } from '../components/icons';

const useInView = (options?: IntersectionObserverInit) => {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, options);
        if (element) observer.observe(element);
        return () => { if (element) observer.unobserve(element); };
    }, [options]);

    return [ref, isInView] as const;
};

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: string }> = ({ children, className, delay = '0s' }) => {
    const [ref, isInView] = useInView({ threshold: 0.1 });
    return (
        <div ref={ref} className={`${className} transition-all duration-1000 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: delay }}>
            {children}
        </div>
    );
};

// HERO SECTION
const AboutHeroSection: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const images = appContext.siteSettings.aboutPage.heroImageUrls;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (images.length === 0) return;
        const intervalId = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <section className="relative h-[65vh] flex items-center justify-start text-white overflow-hidden">
            {images.map((src, index) => (
                <div key={src} className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out" style={{ backgroundImage: `url('${src}')`, opacity: index === currentImageIndex ? 1 : 0 }} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
                <AnimatedSection delay="0.2s">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter font-orbitron leading-tight">
                        <span className="block text-white">ASPIRING</span>
                        <span className="block text-white">INNOVATIVE</span>
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-pink to-golden-yellow uppercase">Minds</span>
                    </h1>
                    <p className="mt-8 text-xl md:text-2xl text-gray-300 max-w-2xl font-medium tracking-wide">
                        "Innovate with Integrity, Lead with Purpose"
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

// SECTION: GENESIS (About A.I.M. Club)
const GenesisSection: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const imageUrl = appContext.siteSettings.aboutPage.whatWeDoImageUrl;
    return (
        <section className="py-24 relative bg-transparent overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    <AnimatedSection className="lg:col-span-7">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-1 bg-neon-blue rounded-full"></span>
                            <span className="text-neon-blue text-xs font-black tracking-[0.5em] uppercase">Club Overview</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 font-orbitron text-gray-900 dark:text-white leading-[0.9]">
                            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink">A.I.M. Club</span>
                        </h2>
                        <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                            <p>A.I.M. Club is a student-led initiative dedicated to exploring the vast landscape of Artificial Intelligence and Machine Learning. We provide a platform for students to learn through hands-on workshops, build innovative projects, and share knowledge.</p>
                            <p>Our mission is to bridge the gap between theoretical knowledge and practical application, preparing our members for the challenges of the future tech industry.</p>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection delay="0.3s" className="lg:col-span-5 relative group">
                        <div className="relative z-10 aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
                            <img src={imageUrl} alt="AI Core" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
                        </div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-blue/10 rounded-full blur-[80px] animate-pulse"></div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

// SECTION: MISSION & VISION
const MissionVisionSection: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const { mission, vision } = appContext.siteSettings.aboutPage;
    return (
        <section className="py-24 bg-dark-bg text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
             <div className="absolute inset-0 bg-dark-bg [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-12">
                    <AnimatedSection className="md:text-right">
                        <h3 className="text-3xl font-black font-orbitron text-neon-blue mb-4 uppercase tracking-tighter">Our Mission</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">{mission}</p>
                    </AnimatedSection>
                    <div className="flex justify-center row-start-1 md:row-auto">
                        <div className="p-8 rounded-full bg-white/5 border border-white/10 animate-pulse-glow shadow-2xl">
                            <img src={appContext.siteSettings.header.logoUrl} alt="A.I.M." className="w-20 h-20" />
                        </div>
                    </div>
                    <AnimatedSection delay="0.2s" className="md:text-left">
                        <h3 className="text-3xl font-black font-orbitron text-neon-pink mb-4 uppercase tracking-tighter">Our Vision</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">{vision}</p>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

// SECTION: HORIZONTAL JOURNEY TIMELINE
const ClubJourneySection: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const timelineEvents = appContext.siteSettings.aboutPage.journeyEvents || [];
    return (
        <section className="py-24 bg-transparent overflow-hidden">
            <div className="container mx-auto px-4 mb-20 text-center lg:text-left">
                <h2 className="text-4xl font-black font-orbitron text-gray-900 dark:text-white uppercase tracking-tighter">The A.I.M. <span className="text-golden-yellow">Journey</span></h2>
                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Decoding our historical transmissions</p>
            </div>
            <div className="relative w-full overflow-x-auto pb-12 no-scrollbar px-4 custom-horizontal-scroll">
                <div className="relative flex min-w-max gap-12 pt-24 items-start">
                    {/* Flowing animated central line */}
                    <div className="absolute top-[4.5rem] left-0 h-1 w-full bg-gradient-to-r from-neon-blue via-neon-pink via-golden-yellow to-neon-blue bg-[length:200%_auto] animate-flow-horizontal opacity-40"></div>
                    
                    {timelineEvents.map((event, index) => (
                        <div key={index} className="relative w-80 flex-shrink-0">
                            {/* Date Label - Moved significantly higher to avoid overlap */}
                            <div className="absolute -top-24 left-1/2 -translate-x-1/2 text-center w-full z-20">
                                <span className="inline-block px-5 py-2 rounded-full bg-gray-900/80 dark:bg-gray-800 backdrop-blur-md border border-neon-blue/30 text-xs font-black text-golden-yellow uppercase shadow-glow-yellow/10">
                                    {event.year}
                                </span>
                            </div>
                            
                            {/* Animated Node on the line */}
                            <div className="absolute top-[4.5rem] left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neon-blue border-[5px] border-white dark:border-dark-bg z-10 shadow-glow-blue animate-pulse"></div>
                            
                            <AnimatedSection delay={`${index * 0.1}s`}>
                                <div className="group bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-xl transition-all hover:-translate-y-2 hover:border-neon-blue/30">
                                    <div className="relative h-40 w-full overflow-hidden rounded-2xl mb-5 border border-white/10">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/10"></div>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white font-orbitron mb-3 uppercase tracking-tight">{event.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{event.description}</p>
                                </div>
                            </AnimatedSection>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes flow-horizontal {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }
                .animate-flow-horizontal {
                    animation: flow-horizontal 3s linear infinite;
                }
            `}</style>
        </section>
    );
};

// SECTION: COMMAND HIERARCHY (Faculty + Students Combined)
const CommandHierarchySection: React.FC = () => {
    const appContext = useContext(AppContext);
    const members = appContext?.committeeMembers || [];
    const chiefFaculty = appContext?.siteSettings.aboutPage.chiefFaculty;

    return (
        <section className="py-24 bg-transparent">
            <div className="container mx-auto px-4 max-7xl">
                <AnimatedSection className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter font-orbitron text-gray-900 dark:text-white uppercase">COMMAND <span className="text-neon-pink">HIERARCHY</span></h2>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">The Architects of Innovation</p>
                </AnimatedSection>

                {/* Chief Faculty Card - Top Placement */}
                {chiefFaculty && (
                <AnimatedSection className="mb-20">
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/5 to-neon-pink/5 rounded-[4rem] blur-3xl -z-10"></div>
                        <div className="bg-white/40 dark:bg-gray-900/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[3.5rem] shadow-3xl flex flex-col md:flex-row items-center gap-10 group transition-all hover:border-neon-blue/20">
                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] overflow-hidden border-4 border-neon-blue/20 flex-shrink-0 shadow-2xl relative">
                                <img src={chiefFaculty.image} alt={chiefFaculty.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/20 to-transparent"></div>
                            </div>
                            <div className="flex-grow text-center md:text-left space-y-5">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black font-orbitron text-gray-900 dark:text-white uppercase tracking-tight">{chiefFaculty.name}</h3>
                                    <p className="text-neon-blue font-black uppercase tracking-widest text-[10px] mt-1">{chiefFaculty.designation}</p>
                                </div>
                                <div className="relative">
                                    <Icon name="quote" className="absolute -top-4 -left-6 w-10 h-10 text-neon-blue/5" />
                                    <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg font-medium italic leading-relaxed">
                                        "{chiefFaculty.quote}"
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    {chiefFaculty.expertise && <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">{chiefFaculty.expertise}</div>}
                                    {chiefFaculty.experience && <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">{chiefFaculty.experience}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
                )}

                {/* Student Grid - Following Faculty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {members.map((member, i) => (
                        <AnimatedSection key={member.id} delay={`${i * 0.05}s`}>
                            <div className="group relative bg-white/60 dark:bg-gray-900/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg flex flex-col items-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden h-full">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative w-28 h-28 mb-6">
                                    <img src={member.image} alt={member.name} className="relative z-10 w-full h-full object-cover rounded-full p-1 border-2 border-gray-100 dark:border-white/10 group-hover:border-neon-blue/30 transition-colors" />
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-black rounded-full flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-lg scale-0 group-hover:scale-100 transition-transform"><Icon name="linkedin" className="w-3.5 h-3.5 text-gray-900 dark:text-white" /></a>
                                </div>
                                <h3 className="text-base font-black text-gray-900 dark:text-white font-orbitron tracking-tight text-center leading-tight mb-1">{member.name}</h3>
                                <div className="text-neon-blue font-black text-[9px] tracking-[0.3em] uppercase text-center">{member.role}</div>
                                <div className="mt-auto pt-3 text-[8px] font-bold text-gray-400 uppercase tracking-widest">{member.year}</div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

const AboutAimPage: React.FC = () => {
    return (
        <div className="animate-fade-in bg-transparent pb-24">
            <AboutHeroSection />
            <GenesisSection />
            <MissionVisionSection />
            <ClubJourneySection />
            <CommandHierarchySection />
        </div>
    );
};

export default AboutAimPage;
