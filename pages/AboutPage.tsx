import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext, AppContextType } from '../App';
import { CommitteeMember, FAQItem } from '../types';
import { Icon } from '../components/icons';

// Custom hook for detecting when an element is in view
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

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [options]);

    return [ref, isInView] as const;
};

const AnimatedDiv: React.FC<{ children: React.ReactNode; className?: string; animation?: string; delay?: string }> = ({ children, className, animation = 'animate-fade-in', delay = '0s' }) => {
    const [ref, isInView] = useInView({ threshold: 0.1 });
    return (
        <div ref={ref} className={`${className} ${isInView ? animation : 'opacity-0'}`} style={{ transition: 'opacity 0.8s ease-out, transform 0.8s ease-out', animationDelay: delay, transitionDelay: delay }}>
            {children}
        </div>
    );
};


// 1. Hero Section (New Design)
const AboutHeroSection: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const images = appContext.siteSettings.aboutPage.heroImageUrls;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (images.length === 0) return;
        const intervalId = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(intervalId);
    }, [images.length]);


    return (
        <section
            className="relative h-[60vh] flex items-center justify-start text-white"
        >
            {/* Background Images with Fade Transition */}
            {images.map((src, index) => (
                <div
                    key={src}
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                    style={{
                        backgroundImage: `url('${src}')`,
                        opacity: index === currentImageIndex ? 1 : 0,
                    }}
                />
            ))}
            
            <div className="absolute inset-0 bg-black/60"></div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
                <AnimatedDiv delay="0.2s">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight font-orbitron">
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-blue to-cyan-400">Aspiring</span>
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-neon-pink via-neon-pink to-purple-400">Innovative</span>
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-golden-yellow via-golden-yellow to-orange-400">Minds</span>
                    </h1>
                </AnimatedDiv>
                <AnimatedDiv delay="0.4s">
                    <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl italic">
                        "Innovate with Integrity, Lead with Purpose"
                    </p>
                </AnimatedDiv>
            </div>
        </section>
    );
};


// 2. What We Do Section (New)
const WhatWeDoSection: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const imageUrl = appContext.siteSettings.aboutPage.whatWeDoImageUrl;
    return (
        <section className="py-20 bg-white dark:bg-dark-bg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <AnimatedDiv>
                        <h2 className="text-4xl font-black tracking-tight mb-6">What We Do</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                            At A.I.M. Club, we bridge the gap between academic theory and real-world application. We are a hub for innovation, collaboration, and learning.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            We organize hands-on workshops, host competitive hackathons, facilitate collaborative projects, and invite industry leaders for insightful seminars. Our goal is to create a dynamic environment where students can learn, build, and innovate in the field of AI, preparing them to be the next generation of tech pioneers.
                        </p>
                    </AnimatedDiv>
                    <AnimatedDiv delay="0.2s">
                        <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                            <img src={imageUrl} alt="Abstract visualization of a neural network" className="w-full h-full object-cover" />
                        </div>
                    </AnimatedDiv>
                </div>
            </div>
        </section>
    );
}

// 3. Core Directives Section (Kept as is)
const CoreDirectivesSection: React.FC = () => {
    const directives = [
        { icon: 'logo', title: 'Learn', description: 'We provide a fertile ground for knowledge, hosting expert-led workshops and study groups to demystify complex AI concepts for all skill levels.' },
        { icon: 'cogs', title: 'Build', description: 'Theory meets practice in our collaborative projects. Members gain hands-on experience, transforming innovative ideas into tangible AI-powered solutions.' },
        { icon: 'megaphone', title: 'Share', description: 'We foster a vibrant community where insights are shared freely through tech talks, project showcases, and mentorship, amplifying collective growth.' }
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-dark-bg/95">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedDiv className="text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight">Our Core Directives</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        The three pillars that define our purpose and guide every initiative.
                    </p>
                </AnimatedDiv>
                <div className="grid md:grid-cols-3 gap-8">
                    {directives.map((d, i) => (
                        <AnimatedDiv key={d.title} delay={`${i * 200}ms`}>
                            <div className="p-8 h-full bg-white/5 dark:bg-gray-800/20 border border-gray-300/20 dark:border-gray-700/50 rounded-2xl backdrop-blur-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-dark-bg border-2 border-neon-blue text-neon-blue">
                                    <Icon name={d.icon} className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{d.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{d.description}</p>
                            </div>
                        </AnimatedDiv>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 4. Mission & Vision Section (New)
const MissionVisionSection: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    return (
        <section className="py-20 bg-dark-bg text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-grid-white/[0.03]"></div>
             <div className="absolute inset-0 bg-dark-bg [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
    
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-12">
                    
                    {/* Mission */}
                    <AnimatedDiv className="md:text-right">
                        <h3 className="text-3xl font-bold font-orbitron text-neon-blue mb-4">Our Mission</h3>
                        <p className="text-gray-300 leading-relaxed">
                            To cultivate a collaborative and inclusive community for students passionate about Artificial Intelligence, providing them with the resources, mentorship, and practical opportunities needed to excel and innovate.
                        </p>
                    </AnimatedDiv>
    
                    {/* Central Divider/Logo */}
                    <div className="flex justify-center row-start-1 md:row-auto">
                        <div className="p-4 rounded-full bg-dark-bg/50 border-2 border-neon-blue/30 animate-pulse-glow shadow-2xl shadow-neon-blue/20">
                            <img src={appContext.siteSettings.aboutPage.missionVisionLogoUrl} alt="A.I.M. Logo" className="w-24 h-24" />
                        </div>
                    </div>
    
                    {/* Vision */}
                    <AnimatedDiv delay="0.2s" className="md:text-left">
                        <h3 className="text-3xl font-bold font-orbitron text-neon-pink mb-4">Our Vision</h3>
                        <p className="text-gray-300 leading-relaxed">
                            To be a leading student-run organization that pioneers AI research and development on campus, empowering our members to become the next generation of tech leaders who shape a better future.
                        </p>
                    </AnimatedDiv>
    
                </div>
            </div>
        </section>
    );
};


const ClubJourneySection: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const timelineEvents = appContext.siteSettings.aboutPage.journeyEvents || [];

    return (
        <section className="py-20 bg-white dark:bg-dark-bg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedDiv className="text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight">Our Journey</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Tracing our evolution from a simple idea to a thriving community.
                    </p>
                </AnimatedDiv>

                <div className="relative w-full overflow-x-auto pb-10 scrollbar-hide">
                    {/* This div is for establishing the padding context for the absolute timeline */}
                    <div className="relative w-full min-w-max pt-10">
                        {/* The timeline line */}
                        <div className="absolute top-10 left-0 h-1 w-full bg-gradient-to-r from-neon-blue via-neon-pink to-golden-yellow bg-200 animate-flow-horizontal"></div>
                        
                        {/* The flex container for events, sits on top of the line */}
                        <div className="relative flex items-start justify-start">
                            {timelineEvents.map((event, index) => (
                                <div key={index} className="relative flex-shrink-0 px-8" style={{ width: '22rem' /* 352px */ }}>
                                    {/* The content container: year above, card below */}
                                    <div className="text-center">
                                        {/* Year above the line */}
                                        <div className="absolute -top-3 w-full text-center">
                                            <span className="px-3 py-1 bg-white dark:bg-dark-bg text-sm font-semibold text-golden-yellow rounded-full border border-gray-200 dark:border-gray-700">{event.year}</span>
                                        </div>

                                        {/* Node on the line */}
                                        <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-dark-bg border-2 border-neon-blue z-10 animate-pulse"></div>
                                        
                                        {/* Image above the card */}
                                        <div className="mt-16 mb-4">
                                            <img src={event.image} alt={event.title} className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-neon-blue/50 shadow-lg shadow-neon-blue/20" />
                                        </div>
                                        
                                        {/* Card below the line */}
                                        <AnimatedDiv className="text-left w-full p-6 bg-white/5 dark:bg-gray-800/20 border border-gray-300/20 dark:border-gray-700/50 rounded-lg shadow-lg backdrop-blur-sm transform transition-transform duration-300 hover:scale-105">
                                            <h3 className="text-xl font-bold mt-1 text-gray-900 dark:text-white">{event.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{event.description}</p>
                                        </AnimatedDiv>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


// 6. Committee Section (Kept as is)
const CommitteeSection: React.FC = () => {
    const appContext = useContext(AppContext);
    const committeeMembers = appContext?.committeeMembers || [];

    const MemberCard: React.FC<{ member: CommitteeMember }> = ({ member }) => (
        <div className="group relative bg-white/5 dark:bg-gray-800/20 border border-gray-300/20 dark:border-gray-700/50 rounded-2xl p-6 text-center backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-golden-yellow">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-golden-yellow mb-4">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
            <p className="text-neon-blue">{member.role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{member.year}</p>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 text-gray-400 group-hover:text-neon-pink transition-colors">
                <Icon name="linkedin" className="w-6 h-6" />
            </a>
        </div>
    );
    
    return (
        <section className="py-20 bg-gray-50 dark:bg-dark-bg/95">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedDiv className="text-center mb-12">
                    <h2 className="text-4xl font-black tracking-tight">Meet the Architects</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The core team engineering our club's growth and success.</p>
                </AnimatedDiv>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {committeeMembers.map((member, i) => (
                        <AnimatedDiv key={member.id} delay={`${i * 100}ms`}>
                             <MemberCard member={member} />
                        </AnimatedDiv>
                    ))}
                </div>
            </div>
        </section>
    );
};


// 7. FAQ Section (Kept as is)
const FAQSection: React.FC = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const appContext = useContext(AppContext);
    const faqs = appContext?.faqs || [];

    const handleFaqClick = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };
    
    const AccordionItem: React.FC<{ item: FAQItem, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center py-5 text-left text-lg font-medium text-gray-800 dark:text-gray-200"
            >
                <span>{item.question}</span>
                <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'text-neon-blue' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="pb-5 text-gray-600 dark:text-gray-400">
                    {item.answer}
                </p>
            </div>
        </div>
    );

    return (
         <section className="py-20 bg-white dark:bg-dark-bg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <AnimatedDiv className="text-center mb-12">
                    <h2 className="text-4xl font-black tracking-tight">System Queries</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Your questions, answered.</p>
                </AnimatedDiv>
                <div className="max-w-3xl mx-auto">
                    {faqs.map((item, index) => (
                        <AccordionItem
                            key={item.id}
                            item={item}
                            isOpen={openFaqIndex === index}
                            onClick={() => handleFaqClick(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// Main Page Component
const AboutAimPage: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            <AboutHeroSection />
            <WhatWeDoSection />
            <CoreDirectivesSection />
            <MissionVisionSection />
            <ClubJourneySection />
            <CommitteeSection />
            <FAQSection />
        </div>
    );
};

export default AboutAimPage;