
import React, { useState, useContext } from 'react';
import { Event } from '../types';
import Modal from './Modal';
import { Icon } from './icons';
import { AppContext, AppContextType } from '../App';
import PaymentModal from './PaymentModal';

interface EventDetailsModalProps {
  event: Event | null;
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  const [payingForEvent, setPayingForEvent] = useState<Event | null>(null);
  const appContext = useContext(AppContext as React.Context<AppContextType>);

  if (!event) return null;

  const handleRegisterClick = () => {
    if (event.type !== 'Upcoming' && event.type !== 'Ongoing') return;

    if (event.price && event.price > 0) {
      setPayingForEvent(event);
    } else if (event.registrationLink) {
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
    } else {
      appContext?.setPage('application');
      onClose();
    }
  };

  const actionButtonText = {
    'Previous': 'View Gallery Archive',
    'Ongoing': 'Deploy Now',
    'Upcoming': 'Reserve Slot'
  };

  const handleActionButtonClick = () => {
      switch (event.type) {
          case 'Previous':
              appContext?.setPage('gallery');
              onClose();
              break;
          case 'Ongoing':
          case 'Upcoming':
              handleRegisterClick();
              break;
      }
  };

  const handleViewPdf = () => {
    if (event.pdfUrl) {
      // If it's a base64 string, we might want to trigger a download or open in a new tab
      if (event.pdfUrl.startsWith('data:application/pdf;base64,')) {
          const link = document.createElement('a');
          link.href = event.pdfUrl;
          link.download = `AIM_Event_${event.title.replace(/\s+/g, '_')}_Manifest.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } else {
          window.open(event.pdfUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <>
      <Modal isOpen={!!event && !payingForEvent} onClose={onClose} title="Mission Brief" size="4xl">
        <div className="space-y-8">
          <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-8 right-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-neon-blue text-white text-[10px] font-black uppercase tracking-widest rounded-full">{event.category}</span>
                    <span className="text-golden-yellow font-mono text-xs uppercase tracking-widest">{event.date}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white font-orbitron uppercase tracking-tighter drop-shadow-lg">{event.title}</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-neon-blue">Mission Objectives</h3>
                <p className="text-gray-400 font-medium leading-relaxed text-lg">{event.description}</p>
              </div>
              
              {event.guests && event.guests.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neon-pink">Subject Matter Experts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.guests.map((guest, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="w-2 h-2 rounded-full bg-neon-pink shadow-glow-pink"></div>
                            <span className="text-gray-200 font-bold">{guest}</span>
                        </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-4 space-y-6">
              <div className="p-6 bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] space-y-6 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue shrink-0">
                    <Icon name="calendar" className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Timeline</p>
                    <p className="text-sm font-bold text-gray-200">{event.date}</p>
                    {event.time && <p className="text-xs text-gray-500 font-mono mt-1">{event.time}</p>}
                  </div>
                </div>

                {event.venue && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center text-neon-pink shrink-0">
                      <Icon name="logo" className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Signal Source</p>
                      <p className="text-sm font-bold text-gray-200">{event.venue}</p>
                    </div>
                  </div>
                )}

                {/* RESTORED PRICE DISPLAY IN MODAL */}
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-golden-yellow/10 border border-golden-yellow/20 flex items-center justify-center text-golden-yellow shrink-0">
                    <span className="font-black text-lg">₹</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Resource Value</p>
                    {event.price && event.price > 0 ? (
                        <p className="text-xl font-black text-golden-yellow font-mono tracking-tighter">₹{event.price.toFixed(2)}</p>
                    ) : (
                        <p className="text-xl font-black text-green-400 uppercase tracking-tighter">Open Access</p>
                    )}
                  </div>
                </div>
              </div>

              {event.organizers && event.organizers.length > 0 && (
                <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem]">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em] mb-4 text-center">Unit Command</p>
                    <ul className="space-y-2">
                      {event.organizers.map((org, i) => (
                          <li key={i} className="text-xs font-bold text-gray-400 text-center py-2 px-4 bg-black/20 rounded-xl">{org}</li>
                      ))}
                    </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-end gap-5">
            {event.pdfUrl && (
              <button 
                onClick={handleViewPdf}
                className="px-10 py-4 text-center rounded-2xl font-black text-[10px] uppercase tracking-widest bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all border border-white/5 flex items-center justify-center gap-2"
              >
                <Icon name="download" className="w-4 h-4" /> View Manifest (PDF)
              </button>
            )}
            <button 
                onClick={handleActionButtonClick}
                className="px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white bg-neon-blue hover:bg-neon-blue/80 transition-all shadow-lg shadow-neon-blue/20 transform active:scale-95"
            >
                {actionButtonText[event.type]} {event.price && event.price > 0 && event.type !== 'Previous' && `| ₹${event.price.toFixed(0)}`}
            </button>
          </div>
        </div>
      </Modal>

      {payingForEvent && (
        <PaymentModal
          event={payingForEvent}
          onClose={() => setPayingForEvent(null)}
        />
      )}
    </>
  );
};
