
import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { AppContext, AppContextType } from '../App';
import { Event, Pillar } from '../types';
import { Icon } from '../components/icons';
import { EventDetailsModal } from '../components/EventDetailsModal';

const LogoVisualization: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const logoUrl = appContext.siteSettings.homePage.heroLogoUrl;

    return (
        <div className="relative w-full max-w-lg h-96 flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="absolute w-80 h-80 rounded-full animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-neon-blue rounded-full shadow-lg shadow-neon-blue/50 animate-pulse-point"></div>
            </div>
             <div className="absolute w-96 h-96 rounded-full animate-spin-slow" style={{animationDuration: '25s'}}>
                <div className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2 bg-golden-yellow rounded-full shadow-lg shadow-golden-yellow/50 animate-pulse-point" style={{animationDelay: '1s'}}></div>
                 <div className="absolute top-1/4 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-neon-pink rounded-full shadow-lg shadow-neon-pink/50 animate-pulse-point" style={{animationDelay: '2s'}}></div>
            </div>
            <div className="absolute w-48 h-48 rounded-full border-2 border-neon-pink/50 animate-pulse-ring"></div>
            <div className="absolute w-48 h-48 rounded-full border-2 border-neon-blue/50 animate-pulse-ring" style={{animationDelay: '1.5s'}}></div>
            <div className="relative w-72 h-72 animate-float">
                <img src={logoUrl} alt="A.I.M. Club Logo" className="w-full h-full object-contain drop-shadow-[0_5px_15px_rgba(0,191,255,0.2)]" />
            </div>
        </div>
    );
};

const HeroSection: React.FC = () => {
    const appContext = useContext(AppContext);
    return (
        <div className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-transparent">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-pink to-golden-yellow">
                                    Welcome to A.I.M
                                </span>
                            </h1>
                        </div>
                        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <p className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-gray-900 dark:text-gray-100 font-medium mb-10 leading-relaxed shadow-black drop-shadow-md">
                                Where Human Aspiration Meets Artificial Intelligence. Join a community dedicated to shaping the future of technology.
                            </p>
                        </div>
                        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                            <button onClick={() => appContext?.setPage('about-aim')} className="px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-neon-blue to-neon-pink hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-neon-blue/20 animate-pulse-glow">
                                Discover More
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center">
                        <LogoVisualization />
                    </div>
                </div>
            </div>
        </div>
    );
};

const LiveUpdatesSection: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const updates = appContext.siteSettings.liveUpdates || [];
    const repeatedUpdates = [...updates, ...updates];
    return (
        <div className="bg-gradient-to-r from-neon-blue to-neon-pink py-3 relative z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center overflow-hidden">
                <Icon name="megaphone" className="w-6 h-6 text-white flex-shrink-0" />
                <div className="ml-4 flex-grow relative whitespace-nowrap">
                    <div className="animate-marquee flex">
                        {repeatedUpdates.map((update, index) => (
                            <p key={index} className="text-white font-semibold text-md mr-12">{update}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BentoInfrastructureSection: React.FC = () => {
    const { siteSettings } = useContext(AppContext as React.Context<AppContextType>);
    const pillars = siteSettings.homePage.pillars || [];
    const logoUrl = siteSettings.homePage.whyAimLogoUrl;

    const BentoCard = ({ pillar, className, delay }: { pillar: Pillar; className?: string; delay: number }) => {
        const cardRef = useRef<HTMLDivElement>(null);
        const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

        const handleMouseMove = (e: React.MouseEvent) => {
            if (!cardRef.current) return;
            const rect = cardRef.current.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };

        return (
            <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                className={`group relative p-[1.5px] transition-all duration-500 hover:scale-[1.01] ${className} opacity-0 animate-fade-in rounded-[2rem] hover:shadow-[0_0_20px_rgba(0,191,255,0.3)]`}
                style={{ animationDelay: `${delay}ms` }}
            >
                {/* Border Background - Becomes visible as a glowing border on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-pink to-golden-yellow rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Main Content Div - Opaque background to prevent the border from glowing through the center */}
                <div className={`relative h-full overflow-hidden rounded-[1.95rem] bg-white dark:bg-dark-bg p-8 flex flex-col justify-end min-h-[260px] z-20`}>
                    
                    <div 
                        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                        style={{
                            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 191, 255, 0.08), transparent 40%)`
                        }}
                    />

                    <div className="relative z-20">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gray-50 dark:bg-gray-800/60 shadow-md border ${pillar.color}`}>
                            <Icon name={pillar.icon} className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 font-orbitron uppercase tracking-tighter">
                            {pillar.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-relaxed max-w-[280px]">
                            {pillar.description}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="py-32 relative overflow-hidden bg-transparent">
            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white font-orbitron tracking-tighter mb-6">
                            WHY <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink">A.I.M?</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-semibold leading-relaxed">
                            We've engineered a framework designed to maximize human potential through technical rigor and collaborative intelligence.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <BentoCard pillar={pillars[0]} delay={100} className="lg:col-span-1" />
                    
                    <div className="lg:col-span-2 lg:row-span-2 relative min-h-[400px] flex items-center justify-center rounded-[3rem] bg-white dark:bg-dark-bg overflow-hidden group shadow-2xl border border-gray-100 dark:border-white/10 animate-fade-in opacity-0" style={{ animationDelay: '300ms' }}>
                        <div className="absolute inset-0 bg-cyber-grid opacity-10 group-hover:opacity-20 transition-opacity" />
                        
                        <div className="relative">
                            <div className="absolute inset-0 -m-20 bg-neon-blue/10 blur-[100px] rounded-full animate-pulse" />
                            <div className="absolute inset-0 -m-12 border border-neon-blue/10 rounded-full animate-spin-slow" />
                            
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center p-8 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-inner">
                                    <img src={logoUrl} alt="A.I.M. Core" className="w-full h-full object-contain animate-float drop-shadow-glow-blue" />
                                </div>
                                <div className="mt-8 text-center">
                                    <div className="text-[10px] font-black tracking-[0.5em] text-neon-blue uppercase mb-2">Central Node</div>
                                    <h4 className="text-gray-900 dark:text-white text-2xl font-bold font-orbitron uppercase">Intelligence Hub</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <BentoCard pillar={pillars[1]} delay={200} className="lg:col-span-1" />
                    <BentoCard pillar={pillars[2]} delay={400} className="lg:col-span-1" />
                    <BentoCard pillar={pillars[3]} delay={500} className="lg:col-span-1" />
                </div>
            </div>
        </section>
    );
};

const NexusEventsSection: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const { events } = appContext;
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Initialize activeEvent once events are loaded
    useEffect(() => {
        if (events.length > 0 && !activeEvent) {
            setActiveEvent(events[0]);
        }
    }, [events, activeEvent]);

    if (events.length === 0 || !activeEvent) {
        return (
             <section className="py-24 bg-transparent text-center">
                <Icon name="refresh" className="w-12 h-12 text-neon-blue animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-black uppercase tracking-[0.4em]">Syncing Mission Nexus...</p>
             </section>
        );
    }

    return (
        <section className="py-24 bg-transparent transition-colors duration-500 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white font-orbitron">
                            Event <span className="text-neon-pink">Nexus</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">The latest frequency of innovation and community gatherings.</p>
                    </div>
                    <button onClick={() => appContext.setPage('events')} className="group flex items-center gap-2 text-neon-blue font-bold px-6 py-3 border border-neon-blue/20 rounded-full hover:bg-neon-blue hover:text-white transition-all">
                        View All Transmissions <Icon name="arrowRight" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 group cursor-pointer" onClick={() => setSelectedEvent(activeEvent)}>
                        <div className="relative h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                            <img src={activeEvent.image} alt={activeEvent.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                            <div className="absolute bottom-10 left-10 right-10">
                                <p className="text-golden-yellow font-mono text-sm mb-2">{activeEvent.date}</p>
                                <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{activeEvent.title}</h3>
                                <p className="text-gray-300 line-clamp-2 mb-6 max-w-xl">{activeEvent.description}</p>
                                <div className="px-6 py-3 inline-block bg-white text-gray-900 rounded-full font-bold shadow-xl transition-all hover:bg-neon-blue hover:text-white">
                                    View Details
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                        {events.map((event) => (
                            <div 
                                key={event.id}
                                onMouseEnter={() => setActiveEvent(event)}
                                onClick={() => setSelectedEvent(event)}
                                className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer border transition-all ${
                                    activeEvent.id === event.id 
                                    ? 'bg-white/20 dark:bg-gray-900/40 border-neon-blue shadow-lg scale-[1.02] backdrop-blur-md' 
                                    : 'bg-transparent border-gray-200/30 dark:border-gray-800/30 hover:bg-white/10 dark:hover:bg-gray-800/20'
                                }`}
                            >
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow overflow-hidden">
                                    <h4 className={`font-bold truncate ${activeEvent.id === event.id ? 'text-neon-blue' : 'text-gray-900 dark:text-gray-100'}`}>
                                        {event.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{event.date}</p>
                                </div>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                    activeEvent.id === event.id ? 'bg-neon-blue text-white' : 'bg-gray-100/20 dark:bg-gray-800/20 text-gray-400'
                                }`}>
                                    <Icon name="arrowRight" className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedEvent && (
                <EventDetailsModal 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </section>
    );
};

const TestimonialsSection: React.FC = () => {
    const { siteSettings } = useContext(AppContext as React.Context<AppContextType>);
    const testimonials = siteSettings.homePage.testimonials || [];

    return (
        <section className="py-24 bg-transparent transition-colors duration-500">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-16 font-orbitron">
                    Voices of <span className="text-neon-pink">A.I.M.</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="p-8 bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-800/50 rounded-2xl shadow-xl backdrop-blur-md transform hover:-translate-y-2 transition-all duration-300 text-left flex flex-col">
                            <Icon name="quote" className="w-10 h-10 text-neon-pink/20 mb-6" />
                            <p className="text-gray-700 dark:text-gray-300 font-medium italic mb-8 leading-relaxed flex-grow">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center gap-4 mt-auto">
                                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-neon-pink/50 object-cover" />
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ArchiveSection: React.FC = () => {
  const { siteSettings } = useContext(AppContext as React.Context<AppContextType>);
  const archiveHighlights = siteSettings.homePage.archiveHighlights || [];
  
  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white font-orbitron">From the <span className="text-golden-yellow">Archives</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {archiveHighlights.map((item, index) => (
             <div key={index} className="group transition-transform duration-500 ease-out hover:-translate-y-1 h-full">
                <div className="relative h-full rounded-2xl p-[1.5px] transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                    {/* Glowing Border Reveal */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-pink to-golden-yellow rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Content Body - Opaque to block inner glow */}
                    <div className="relative h-full p-8 bg-white dark:bg-dark-bg rounded-[1.9rem] shadow-lg border border-gray-100 dark:border-white/5 text-center flex flex-col items-center z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gray-50 dark:bg-gray-800 border-2 border-golden-yellow text-golden-yellow shadow-sm">
                            <Icon name={item.icon as any} className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white font-orbitron uppercase tracking-tight">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{item.description}</p>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
    return (
        <div className="animate-fade-in bg-transparent">
            <HeroSection />
            <LiveUpdatesSection />
            <BentoInfrastructureSection />
            <NexusEventsSection />
            <TestimonialsSection />
            <ArchiveSection />
        </div>
    );
};

export default HomePage;
