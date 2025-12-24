
import React, { useState, useContext, useMemo } from 'react';
import { AppContext, AppContextType } from '../App';
import { Event } from '../types';
import { Icon } from '../components/icons';
import { EventDetailsModal } from '../components/EventDetailsModal';

const EventCard: React.FC<{ event: Event; onClick: (event: Event) => void; style?: React.CSSProperties }> = ({ event, onClick, style }) => {
    const statusStyles: Record<string, { badge: string; button: string; overlay: string }> = {
        'Previous': { badge: 'bg-gray-500 text-white', button: 'bg-gray-600 hover:bg-gray-700', overlay: 'bg-gray-500/10' },
        'Ongoing': { badge: 'bg-green-500 text-white animate-pulse', button: 'bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90', overlay: 'bg-green-500/10' },
        'Upcoming': { badge: 'bg-blue-500 text-white', button: 'bg-gradient-to-r from-neon-blue to-neon-pink hover:opacity-90', overlay: 'bg-blue-500/10' },
    };

    const currentStyle = statusStyles[event.type] || statusStyles['Upcoming'];

    const handlePdfDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (event.pdfUrl) {
            window.open(event.pdfUrl, '_blank');
        }
    };

    return (
        <div className="group animate-fade-in" style={{ perspective: '1000px', ...style }}>
            <div 
                onClick={() => onClick(event)}
                className="relative h-full rounded-[2.5rem] shadow-lg transition-all duration-500 ease-out group-hover:transform [transform:rotateY(-3deg)_rotateX(3deg)_scale(1.03)] cursor-pointer"
            >
                <div className="absolute inset-0 bg-white/40 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50 rounded-[2.5rem] backdrop-blur-xl"></div>
                <div className="relative z-10 flex flex-col h-full overflow-hidden rounded-[2.5rem]">
                    <div className="relative overflow-hidden aspect-video">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                        
                        {/* PDF Floating Button */}
                        {event.pdfUrl && (
                            <button 
                                onClick={handlePdfDownload}
                                className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-red-500 shadow-xl hover:scale-110 transition-transform z-20 group/pdf"
                                title="Download PDF Manifest"
                            >
                                <Icon name="download" className="w-5 h-5" />
                                <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-white text-[8px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/pdf:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">PDF Manifest</span>
                            </button>
                        )}

                        <span className={`absolute top-5 right-5 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md shadow-xl ${currentStyle.badge}`}>
                            {event.type}
                        </span>
                        
                        {/* RESTORED PRICE INFO */}
                         {event.price !== undefined && event.price > 0 && event.type !== 'Previous' && (
                            <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md text-golden-yellow px-4 py-1.5 rounded-full border border-golden-yellow/30 shadow-xl flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest">Fee:</span>
                                <span className="text-sm font-black font-mono">₹{event.price.toFixed(2)}</span>
                            </div>
                        )}
                        {event.price === 0 && event.type !== 'Previous' && (
                            <div className="absolute top-5 left-5 bg-green-500/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full border border-white/20 shadow-xl flex items-center gap-2 animate-pulse">
                                <span className="text-[10px] font-black uppercase tracking-widest">Entry:</span>
                                <span className="text-sm font-black uppercase">FREE</span>
                            </div>
                        )}
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-neon-blue"></div>
                             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-[0.3em]">{event.date}</p>
                        </div>
                        <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white font-orbitron tracking-tight leading-none uppercase">{event.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 line-clamp-3 flex-grow font-medium leading-relaxed">{event.description}</p>
                        <div 
                            className={`w-full py-4 mt-auto rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-500 text-center shadow-lg ${currentStyle.button}`}
                        >
                            Analyze Mission
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventsHeroSection: React.FC = () => {
    return (
        <header className="relative h-[45vh] min-h-[400px] flex items-center justify-center text-white overflow-hidden bg-transparent">
             <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
            <div className="relative z-10 text-center px-4 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                    <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-blue">Operational Transmissions</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase font-orbitron drop-shadow-[0_0_20px_rgba(0,191,255,0.4)] leading-none">
                    Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-pink">Nexus</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mt-6 max-w-2xl mx-auto font-medium">
                    Participate in technical initiatives, workshops, and high-stakes competitions within the AI ecosystem.
                </p>
            </div>
        </header>
    );
};

const EventsPage: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const events = appContext?.events || [];

    const categories = useMemo(() => ['All', 'Ongoing', 'Upcoming', 'Previous', ...Array.from(new Set(events.map(e => e.category)))], [events]);

    const filteredEvents = useMemo(() => {
        if (activeFilter === 'All') return events;
        if (['Ongoing', 'Upcoming', 'Previous'].includes(activeFilter)) {
            return events.filter(e => e.type === activeFilter);
        }
        return events.filter(e => e.category === activeFilter);
    }, [activeFilter, events]);

    return (
        <div className="animate-fade-in bg-white dark:bg-dark-bg min-h-screen">
            <EventsHeroSection />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-10 max-w-7xl">
                 <div className="mb-16 flex flex-wrap justify-center gap-3 p-4 bg-white/10 dark:bg-gray-800/40 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-2xl">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeFilter === cat ? 'bg-neon-blue text-white shadow-[0_0_15px_rgba(0,191,255,0.4)]' : 'text-gray-500 hover:text-neon-blue hover:bg-white/5'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredEvents.map((event, index) => (
                        <EventCard 
                            key={event.id} 
                            event={event} 
                            onClick={setSelectedEvent}
                            style={{ animationDelay: `${index * 100}ms` }}
                        />
                    ))}
                </div>
                
                {filteredEvents.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-[3rem]">
                        <Icon name="calendar" className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-black uppercase tracking-[0.4em]">No Missions Found In Current Sector</p>
                    </div>
                )}
            </div>

            {selectedEvent && (
                <EventDetailsModal 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
};

export default EventsPage;
