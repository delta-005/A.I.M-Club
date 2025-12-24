
export type Page = 'home' | 'about-aim' | 'about-department' | 'events' | 'gallery' | 'application' | 'admin' | 'contact';

export interface NavLink {
  name: string;
  page?: Page;
  subLinks?: { name: string; page: Page }[];
}

export type Theme = 'light' | 'dark';

export interface Event {
  id: number;
  title: string;
  type: 'Previous' | 'Ongoing' | 'Upcoming';
  date: string;
  time?: string;
  description: string;
  image: string;
  category: string;
  venue?: string;
  guests?: string[];
  organizers?: string[];
  registrationLink?: string;
  price?: number;
  pdfUrl?: string;
}

export interface CommitteeMember {
  id: number;
  role: string;
  name: string;
  year: string;
  linkedin: string;
  image: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface GalleryItem {
  id: number;
  eventId: number;
  eventTitle: string;
  category: 'Workshop' | 'Competition' | 'Seminar' | 'Fest';
  images: string[];
  date: string;
}

export interface PersonalInfo {
    name: string;
    rollNumber: string;
    email: string;
    contact: string;
    yearOfStudy: '1' | '2' | '3' | '4';
}

export interface ApplicationLog {
    date: string;
    action: string;
    note: string;
}

export interface ApplicationData extends PersonalInfo {
  id: string;
  applicantId: string;
  trackingId: string;
  role: string;
  answers: { [key: string]: string };
  status: 'Pending' | 'Shortlisted' | 'Rejected' | 'Interview Scheduled' | 'Selected' | 'Waitlisted';
  viewed: boolean;
  submittedAt: string;
  interviewDetails?: {
    date: string;
    time: string;
    link: string;
  };
  aiAnalysis?: {
    summary: string;
    score: number;
    technicalScore: number;
    communicationScore: number;
  };
  scorecard?: {
    technical: number;
    communication: number;
    passion: number;
    notes: string;
  };
  logs?: ApplicationLog[];
}

export interface ApplicationRole {
    name: string;
    eligibleYears: ('1' | '2' | '3' | '4')[];
    questions: string[];
    responsibilities: string[];
}

export interface RoleConfig {
    [key: string]: {
        eligibleYears: ('1' | '2' | '3' | '4')[];
        questions: string[];
        responsibilities: string[];
    };
}


export interface Alert {
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface JourneyEvent {
  year: string;
  title: string;
  description: string;
  image: string;
}

export interface Pillar {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

export interface ArchiveHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  image: string;
  quote?: string;
  expertise?: string;
  experience?: string;
}

export interface DeptStat {
  icon: string;
  label: string;
  value: string;
}

export interface SiteSettings {
  liveUpdates: string[];
  header: {
    logoUrl: string;
  };
  collegeHeader: {
    jbrecLogoUrl: string;
    naacLogoUrl: string;
    isoLogoUrl: string;
    aicteLogoUrl: string;
    jntuhLogoUrl: string;
  };
  footer: {
    logoUrl: string;
    secondaryLogoUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
    address: string;
  };
  homePage: {
    heroLogoUrl: string;
    whyAimLogoUrl: string;
    pillars: Pillar[];
    testimonials: Testimonial[];
    archiveHighlights: ArchiveHighlight[];
  };
  aboutPage: {
    mission: string;
    vision: string;
    whatWeDoImageUrl: string;
    missionVisionLogoUrl:string;
    heroImageUrls: string[];
    journeyEvents: JourneyEvent[];
    chiefFaculty: FacultyMember;
  };
  aboutDepartmentPage: {
    heroImageUrl: string;
    mission: string;
    vision: string;
    aboutDescription: string;
    stats: DeptStat[];
    hod: FacultyMember;
    faculty: FacultyMember[];
  };
  adminPage: {
    loginLogoUrl: string;
    adminEmail: string;
    contactEmail: string;
  };
}

export interface PaymentData {
  id: string;
  transactionId: string;
  eventId: number;
  eventName: string;
  userName: string;
  userEmail: string;
  amount: number;
  paymentDate: string;
}
