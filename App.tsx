
import React, { useState, useEffect, createContext, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CollegeHeader from './components/CollegeHeader';
import HomePage from './pages/HomePage';
import AboutAimPage from './pages/AboutAimPage';
import AboutDepartmentPage from './pages/AboutDepartmentPage';
import ContactPage from './pages/ContactPage';
import EventsPage from './pages/EventsPage';
import GalleryPage from './pages/GalleryPage';
import ApplicationPage from './pages/Application';
import AdminPage from './pages/AdminPage';
import ApplicationTrackingPage from './pages/ApplicationTrackingPage';
import AlertBox from './components/AlertBox';
import BackgroundCanvas from './components/BackgroundCanvas';
import FloatingShapes from './components/FloatingShapes';
import { Page, Alert, Theme, Event, GalleryItem, CommitteeMember, ApplicationData, FAQItem, ApplicationRole, SiteSettings, PaymentData } from './types';
import { NAV_LINKS, APPLICATION_ROLES, DEFAULT_SITE_SETTINGS } from './constants';
import { Icon } from './components/icons';
import { supabase } from './services/supabaseClient';

export interface AppContextType {
  setPage: (page: Page) => void;
  setAlert: (alert: Alert | null) => void;
  
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;

  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: number) => void;

  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: number) => void;

  committeeMembers: CommitteeMember[];
  addCommitteeMember: (member: Omit<CommitteeMember, 'id'>) => void;
  updateCommitteeMember: (member: CommitteeMember) => void;
  deleteCommitteeMember: (id: number) => void;

  applications: ApplicationData[];
  addApplication: (application: Omit<ApplicationData, 'id' | 'submittedAt'>) => void;
  updateApplication: (application: ApplicationData) => void;
  deleteApplication: (id: string) => void;

  faqs: FAQItem[];
  addFaq: (faq: Omit<FAQItem, 'id'>) => void;
  updateFaq: (faq: FAQItem) => void;
  deleteFaq: (id: number) => void;

  roles: ApplicationRole[];
  addRole: (role: ApplicationRole) => void;
  updateRole: (role: ApplicationRole) => void;
  deleteRole: (name: string) => void;
  
  payments: PaymentData[];
  addPayment: (payment: Omit<PaymentData, 'id' | 'transactionId' | 'paymentDate'>) => PaymentData;
  deletePayment: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const PageTransition: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-dark-bg transition-opacity duration-700 opacity-95"></div>
            <div className="absolute inset-0 data-stream-overlay opacity-20 animate-stream-slow"></div>
            <div className="absolute w-[30vw] h-[30vw] bg-neon-blue/20 rounded-full blur-[80px] animate-neural-bloom"></div>
            <div className="absolute w-[40vw] h-[40vw] bg-neon-pink/10 rounded-full blur-[100px] animate-neural-bloom" style={{ animationDelay: '0.2s' }}></div>
            <div className="relative z-20 text-center animate-fade-in px-4">
                <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-neon-blue/30 blur-2xl rounded-full animate-pulse"></div>
                        <div className="w-24 h-24 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center animate-spin-slow">
                            <Icon name="logo" className="w-12 h-12 text-neon-blue drop-shadow-glow-blue" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-4xl font-black font-orbitron text-white tracking-[0.4em] animate-glitch-text uppercase">Transmission</h2>
                        <div className="flex items-center justify-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse"></div>
                             <p className="text-[10px] font-black font-mono text-neon-blue/60 tracking-[0.6em] uppercase">Syncing Matrix Sector</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [isNavigating, setIsNavigating] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [alert, setAlert] = useState<Alert | null>(null);
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [events, setEvents] = useState<Event[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [roles, setRoles] = useState<ApplicationRole[]>(APPLICATION_ROLES);
  const [payments, setPayments] = useState<PaymentData[]>([]);

  // 1. Initial Load & Realtime Subscriptions
  useEffect(() => {
    const fetchAllData = async () => {
      const [{ data: config }, { data: evts }, { data: apps }, { data: gal }, { data: comm }, { data: fqs }, { data: pays }] = await Promise.all([
        supabase.from('site_config').select('settings').eq('id', 1).single(),
        supabase.from('events').select('*').order('id', { ascending: false }),
        supabase.from('applications').select('*').order('submitted_at', { ascending: false }),
        supabase.from('gallery_items').select('*').order('id', { ascending: false }),
        supabase.from('committee_members').select('*'),
        supabase.from('faqs').select('*'),
        supabase.from('payments').select('*')
      ]);

      if (config) setSiteSettings(config.settings);
      if (evts) setEvents(evts);
      if (apps) setApplications(apps);
      if (gal) setGalleryItems(gal);
      if (comm) setCommitteeMembers(comm);
      if (fqs) setFaqs(fqs);
      if (pays) setPayments(pays);
    };

    fetchAllData();

    // SETUP REALTIME CHANNELS
    const channel = supabase
      .channel('db-changes')
      // Listen to Site Settings
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_config', filter: 'id=eq.1' }, (payload) => {
        setSiteSettings(payload.new.settings);
      })
      // Listen to Events
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
        if (payload.eventType === 'INSERT') setEvents(prev => [payload.new as Event, ...prev]);
        if (payload.eventType === 'UPDATE') setEvents(prev => prev.map(item => item.id === payload.new.id ? (payload.new as Event) : item));
        if (payload.eventType === 'DELETE') setEvents(prev => prev.filter(item => item.id !== payload.old.id));
      })
      // Listen to Applications
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, (payload) => {
        if (payload.eventType === 'INSERT') setApplications(prev => [payload.new as ApplicationData, ...prev]);
        if (payload.eventType === 'UPDATE') setApplications(prev => prev.map(item => item.id === payload.new.id ? (payload.new as ApplicationData) : item));
        if (payload.eventType === 'DELETE') setApplications(prev => prev.filter(item => item.id !== payload.old.id));
      })
      // Listen to Gallery
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_items' }, (payload) => {
        if (payload.eventType === 'INSERT') setGalleryItems(prev => [payload.new as GalleryItem, ...prev]);
        if (payload.eventType === 'UPDATE') setGalleryItems(prev => prev.map(item => item.id === payload.new.id ? (payload.new as GalleryItem) : item));
        if (payload.eventType === 'DELETE') setGalleryItems(prev => prev.filter(item => item.id !== payload.old.id));
      })
      // Listen to Committee
      .on('postgres_changes', { event: '*', schema: 'public', table: 'committee_members' }, (payload) => {
        if (payload.eventType === 'INSERT') setCommitteeMembers(prev => [payload.new as CommitteeMember, ...prev]);
        if (payload.eventType === 'UPDATE') setCommitteeMembers(prev => prev.map(item => item.id === payload.new.id ? (payload.new as CommitteeMember) : item));
        if (payload.eventType === 'DELETE') setCommitteeMembers(prev => prev.filter(item => item.id !== payload.old.id));
      })
      // Listen to FAQs
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, (payload) => {
        if (payload.eventType === 'INSERT') setFaqs(prev => [payload.new as FAQItem, ...prev]);
        if (payload.eventType === 'UPDATE') setFaqs(prev => prev.map(item => item.id === payload.new.id ? (payload.new as FAQItem) : item));
        if (payload.eventType === 'DELETE') setFaqs(prev => prev.filter(item => item.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Theme Sync
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Persistent Actions
  const updateSiteSettings = useCallback(async (newSettings: SiteSettings) => {
    await supabase.from('site_config').upsert({ id: 1, settings: newSettings });
    setSiteSettings(newSettings); // Optimistic UI
  }, []);

  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  
  const handleSetPage = useCallback((newPage: Page) => {
      if (newPage === page) return;
      window.scrollTo(0, 0);
      setPage(newPage);
  }, [page]);

  // Supabase CRUD implementations
  const addEvent = useCallback(async (event: Omit<Event, 'id'>) => {
    await supabase.from('events').insert([event]);
  }, []);
  const updateEvent = useCallback(async (updatedEvent: Event) => {
    await supabase.from('events').update(updatedEvent).eq('id', updatedEvent.id);
  }, []);
  const deleteEvent = useCallback(async (id: number) => {
    await supabase.from('events').delete().eq('id', id);
  }, []);

  const addApplication = useCallback(async (app: Omit<ApplicationData, 'id' | 'submittedAt'>) => {
    await supabase.from('applications').insert([app]);
  }, []);
  const updateApplication = useCallback(async (updatedApp: ApplicationData) => {
    await supabase.from('applications').update(updatedApp).eq('id', updatedApp.id);
  }, []);
  const deleteApplication = useCallback(async (id: string) => {
    await supabase.from('applications').delete().eq('id', id);
  }, []);

  const addGalleryItem = useCallback(async (item: Omit<GalleryItem, 'id'>) => {
    await supabase.from('gallery_items').insert([item]);
  }, []);
  const updateGalleryItem = useCallback(async (item: GalleryItem) => {
    await supabase.from('gallery_items').update(item).eq('id', item.id);
  }, []);
  const deleteGalleryItem = useCallback(async (id: number) => {
    await supabase.from('gallery_items').delete().eq('id', id);
  }, []);

  const addCommitteeMember = useCallback(async (member: Omit<CommitteeMember, 'id'>) => {
    await supabase.from('committee_members').insert([member]);
  }, []);
  const updateCommitteeMember = useCallback(async (member: CommitteeMember) => {
    await supabase.from('committee_members').update(member).eq('id', member.id);
  }, []);
  const deleteCommitteeMember = useCallback(async (id: number) => {
    await supabase.from('committee_members').delete().eq('id', id);
  }, []);

  const addFaq = useCallback(async (faq: Omit<FAQItem, 'id'>) => {
    await supabase.from('faqs').insert([faq]);
  }, []);
  const updateFaq = useCallback(async (faq: FAQItem) => {
    await supabase.from('faqs').update(faq).eq('id', faq.id);
  }, []);
  const deleteFaq = useCallback(async (id: number) => {
    await supabase.from('faqs').delete().eq('id', id);
  }, []);

  const addPayment = useCallback((payment: Omit<PaymentData, 'id' | 'transactionId' | 'paymentDate'>): PaymentData => {
    const newPayment: PaymentData = { ...payment, id: `pay-${Date.now()}`, transactionId: `TXN${Date.now()}`, paymentDate: new Date().toISOString() };
    supabase.from('payments').insert([newPayment]);
    return newPayment;
  }, []);
  const deletePayment = useCallback(async (id: string) => {
    await supabase.from('payments').delete().eq('id', id);
  }, []);

  const handleSetAlert = useCallback((newAlert: Alert | null) => {
    setAlert(newAlert);
    if (newAlert) setTimeout(() => setAlert(null), 5000);
  }, []);

  const appContextValue: AppContextType = useMemo(() => ({
    setPage: handleSetPage, setAlert: handleSetAlert, siteSettings, setSiteSettings: updateSiteSettings,
    events, addEvent, updateEvent, deleteEvent,
    galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem,
    committeeMembers, addCommitteeMember, updateCommitteeMember, deleteCommitteeMember,
    applications, addApplication, updateApplication, deleteApplication,
    faqs, addFaq, updateFaq, deleteFaq,
    roles, addRole: () => {}, updateRole: () => {}, deleteRole: () => {},
    payments, addPayment, deletePayment
  }), [siteSettings, events, galleryItems, committeeMembers, applications, faqs, roles, payments, handleSetAlert, handleSetPage, updateSiteSettings, addEvent, updateEvent, deleteEvent, addGalleryItem, updateGalleryItem, deleteGalleryItem, addCommitteeMember, updateCommitteeMember, deleteCommitteeMember, addApplication, updateApplication, deleteApplication, addFaq, updateFaq, deleteFaq, addPayment, deletePayment]);

  return (
    <AppContext.Provider value={appContextValue}>
      <BackgroundCanvas theme={theme} />
      <FloatingShapes theme={theme} />
      <PageTransition isVisible={isNavigating} />
      <div className={`relative z-10 flex flex-col min-h-screen bg-transparent transition-colors duration-300 ${page === 'admin' ? 'admin-view' : ''}`}>
        {page !== 'admin' && (
          <><CollegeHeader /><Header theme={theme} toggleTheme={toggleTheme} /></>
        )}
        <main className={`flex-grow transition-opacity duration-300 ${isNavigating ? 'opacity-0' : 'opacity-100'}`}>
            {page === 'home' && <HomePage />}
            {page === 'about-aim' && <AboutAimPage />}
            {page === 'about-department' && <AboutDepartmentPage />}
            {page === 'events' && <EventsPage />}
            {page === 'gallery' && <GalleryPage />}
            {page === 'application' && <ApplicationPage />}
            {page === 'contact' && <ContactPage />}
            {page === 'admin' && <AdminPage />}
        </main>
        {page !== 'admin' && <Footer />}
        {alert && <AlertBox message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      </div>
    </AppContext.Provider>
  );
};

export default App;
