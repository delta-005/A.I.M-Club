
import { NavLink, Event, CommitteeMember, FAQItem, GalleryItem, RoleConfig, ApplicationData, ApplicationRole, SiteSettings, Pillar, Testimonial, ArchiveHighlight, PaymentData } from './types';

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', page: 'home' },
  { 
    name: 'About Us',
    subLinks: [
      { name: 'About A.I.M.', page: 'about-aim' },
      { name: 'About Department', page: 'about-department' }
    ]
  },
  { name: 'Events', page: 'events' },
  { name: 'Gallery', page: 'gallery' },
  { name: 'Apply Now', page: 'application' },
  { name: 'Contact Us', page: 'contact' },
  { name: 'Admin', page: 'admin' },
];

const PILLARS: Pillar[] = [
    { icon: 'presentation', title: 'Expert Workshops', description: 'Learn cutting-edge skills from industry experts and seasoned academics.', color: 'text-neon-pink border-neon-pink' },
    { icon: 'cogs', title: 'Collaborative Projects', description: 'Gain hands-on experience by working on real-world AI/ML projects.', color: 'text-golden-yellow border-golden-yellow' },
    { icon: 'users', title: 'Vibrant Community', description: 'Join a welcoming community to share ideas, collaborate, and grow together.', color: 'text-violet-500 border-violet-500' },
    { icon: 'briefcase', title: 'Career Growth', description: 'Build a strong portfolio, network with professionals, and get a head start on your career.', color: 'text-neon-blue border-neon-blue' },
];

const TESTIMONIALS: Testimonial[] = [
    {
      quote: "A.I.M. Club is where theory meets reality. The hands-on projects gave me the confidence to pursue a career in machine learning.",
      name: "Maria Garcia",
      role: "Vice President, 3rd Year",
      image: "https://picsum.photos/seed/vp/100"
    },
    {
      quote: "The collaborative environment is incredible. I've learned more from my peers here than in any classroom.",
      name: "Leo Rivera",
      role: "Technical Head, 3rd Year",
      image: "https://picsum.photos/seed/tech/100"
    },
    {
      quote: "Organizing events for A.I.M. has been a highlight of my college life. We bring the best minds in AI to our campus.",
      name: "Chloe Kim",
      role: "Event Coordinator, 2nd Year",
      image: "https://picsum.photos/seed/event/100"
    }
];

const ARCHIVE_HIGHLIGHTS: ArchiveHighlight[] = [
    {
        icon: "trophy",
        title: "National Code Vanguard",
        description: "Secured first place in the national-level AI programming competition."
    },
    {
        icon: "cogs",
        title: "Autonomous Campus Bot",
        description: "Developed and deployed a fully autonomous navigation robot for campus tours."
    },
    {
        icon: "presentation",
        title: "AI Ethics Symposium",
        description: "Hosted a successful symposium on the ethical implications of AI with industry leaders."
    }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  liveUpdates: [
    "Registrations for AI Fusion 2024 are now open!",
    "New workshop on Transformers announced for Nov 5th.",
    "A.I.M. Club wins first place at the National Code Vanguard competition.",
    "Join our new community project on autonomous agents.",
    "Guest lecture by Dr. Eva Rostova on ethical AI this Friday.",
  ],
  header: {
    logoUrl: 'https://i.ibb.co/GQd9PbgN/Aim-AA-removebg-preview.png',
  },
  collegeHeader: {
    jbrecLogoUrl: 'https://i.ibb.co/3sZg9xR/jbrec-logo-user.png',
    naacLogoUrl: 'https://i.ibb.co/3Y7j1fM/naac.png',
    isoLogoUrl: 'https://i.ibb.co/vLG7vM1/iso.png',
    aicteLogoUrl: 'https://i.ibb.co/8YjC32G/aicte.png',
    jntuhLogoUrl: 'https://i.ibb.co/T0pHLxR/jntuh.png',
  },
  footer: {
    logoUrl: 'https://i.ibb.co/GQd9PbgN/Aim-AA-removebg-preview.png',
    secondaryLogoUrl: 'https://i.ibb.co/3sZg9xR/jbrec-logo-user.png',
    linkedinUrl: '#',
    instagramUrl: '#',
    address: 'JBREC Campus, Hyderabad, TS',
  },
  homePage: {
    heroLogoUrl: 'https://i.ibb.co/GQd9PbgN/Aim-AA-removebg-preview.png',
    whyAimLogoUrl: 'https://i.ibb.co/GQd9PbgN/Aim-AA-removebg-preview.png',
    pillars: PILLARS,
    testimonials: TESTIMONIALS,
    archiveHighlights: ARCHIVE_HIGHLIGHTS,
  },
  aboutPage: {
    mission: "To cultivate a collaborative and inclusive community for students passionate about Artificial Intelligence, providing them with the resources, mentorship, and practical opportunities needed to excel and innovate.",
    vision: "To be a leading student-run organization that pioneers AI research and development on campus, empowering our members to become the next generation of tech leaders who shape a better future.",
    whatWeDoImageUrl: 'https://i.postimg.cc/GhZD2j9T/generated-image.png',
    missionVisionLogoUrl: 'https://i.ibb.co/GQd9PbgN/Aim-AA-removebg-preview.png',
    heroImageUrls: [
      'https://picsum.photos/seed/ai-hero-1/1920/1080',
      'https://picsum.photos/seed/ai-hero-2/1920/1080',
      'https://picsum.photos/seed/ai-hero-3/1920/1080',
      'https://picsum.photos/seed/ai-hero-4/1920/1080',
    ],
    journeyEvents: [
        { year: '2022', title: 'Genesis Node', description: 'A small group of AI enthusiasts plant the seed for a new kind of tech club on campus.', image: 'https://picsum.photos/seed/genesis/400' },
        { year: '2023', title: 'First Contact', description: 'The A.I.M. Club officially launches, hosting its first workshop on Neural Networks to a packed room.', image: 'https://picsum.photos/seed/contact/400' },
        { year: '2023', title: 'Project Ignition', description: 'The first major club project, an autonomous navigation bot, begins development.', image: 'https://picsum.photos/seed/ignition/400' },
        { year: '2024', title: 'AI Fusion', description: 'Hosted our flagship hackathon, bringing together over 100 participants to solve real-world problems.', image: 'https://picsum.photos/seed/fusion-event/400' },
        { year: 'Vision', title: 'Future Singularity', description: 'To become a nationally recognized hub for student-led AI innovation and a key launchpad for future tech leaders.', image: 'https://picsum.photos/seed/singularity/400' }
    ],
    chiefFaculty: {
        id: 0,
        name: 'Dr. Samuel Chen',
        designation: 'Chief Faculty Coordinator',
        expertise: 'PhD in Machine Learning',
        experience: '15+ Years Experience',
        image: 'https://picsum.photos/seed/faculty-chief/600',
        quote: "Our objective is to nurture a generation of engineers who don't just understand AI, but who can architect ethical and impactful solutions for the global stage."
    }
  },
  aboutDepartmentPage: {
    heroImageUrl: 'https://picsum.photos/seed/dept-hero/1920/1080',
    mission: "To produce competent and skilled professionals in Computer Science & Engineering with a focus on Artificial Intelligence & Machine Learning, fostering innovation and research to address societal needs.",
    vision: "To be a center of excellence in AI & ML education and research, recognized for our contribution to the advancement of technology and the development of ethical, forward-thinking leaders.",
    aboutDescription: "The Department of Computer Science & Engineering (AI & ML) was established in 2020 with the vision to create high-quality engineers who can meet the challenges of the modern tech landscape. We offer a comprehensive curriculum, state-of-the-art laboratories, and a dedicated faculty team to provide students with a robust foundation in AI, machine learning, data science, and beyond. Our focus is on practical learning, encouraging students to engage in projects, research, and industry collaborations to develop real-world problem-solving skills.",
    stats: [
      { icon: 'users', label: 'Students', value: '480+' },
      { icon: 'team', label: 'Faculty', value: '25+' },
      { icon: 'briefcase', label: 'Placements', value: '95%' },
      { icon: 'trophy', label: 'Awards', value: '15+' },
    ],
    hod: {
      id: 1,
      name: 'Dr. Evelyn Reed',
      designation: 'Professor & Head of Department',
      image: 'https://picsum.photos/seed/hod/400',
      quote: "We are not just teaching students to use AI; we are empowering them to build the future of AI. Our focus is on creating innovators who will lead with both technical brilliance and ethical responsibility."
    },
    faculty: [
      { id: 2, name: 'Dr. Samuel Chen', designation: 'Associate Professor', image: 'https://picsum.photos/seed/faculty1/400' },
      { id: 3, name: 'Dr. Olivia Carter', designation: 'Associate Professor', image: 'https://picsum.photos/seed/faculty2/400' },
      { id: 4, name: 'Mr. Benjamin Grant', designation: 'Assistant Professor', image: 'https://picsum.photos/seed/faculty3/400' },
      { id: 5, name: 'Ms. Sophia Martinez', designation: 'Assistant Professor', image: 'https://picsum.photos/seed/faculty4/400' },
    ]
  },
  adminPage: {
    loginLogoUrl: 'https://i.ibb.co/GQd9PbgN/Aim-AA-removebg-preview.png',
    adminEmail: 'contact.aimcomittee@gmail.com',
    contactEmail: 'contact.aimcomittee@gmail.com',
  }
};


export const EVENTS: Event[] = [
  { id: 1, title: 'AI Fusion 2024', type: 'Ongoing', date: 'Oct 15-17, 2024', time: '9:00 AM - 6:00 PM Daily', description: 'A 3-day national level hackathon focused on creating innovative solutions using generative AI. Participants will work in teams to build a functional prototype and present it to a panel of industry experts.', image: 'https://picsum.photos/seed/ai-fusion/600/400', category: 'Competition', venue: 'Main Auditorium, JBREC', guests: ['Dr. Eva Rostova (Google DeepMind)', 'Mr. Alex Chen (NVIDIA)'], organizers: ['A.I.M. Club Committee', 'Dept. of AI & ML'], pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 2, title: 'Intro to Transformers', type: 'Upcoming', date: 'Nov 5, 2024', time: '2:00 PM - 5:00 PM', description: 'A deep dive workshop into the Transformer architecture that powers models like GPT and BERT. This session is perfect for beginners and intermediate learners.', image: 'https://picsum.photos/seed/transformers/600/400', category: 'Workshop', registrationLink: 'https://forms.gle/12345abcde', price: 100, organizers: ['Dr. Samuel Chen'], pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', venue: 'Online via Google Meet' },
  { id: 3, title: 'Tech Symposium 2023', type: 'Previous', date: 'Dec 10, 2023', time: '10:00 AM - 4:00 PM', description: 'Our annual tech fest featuring keynote speakers from top tech companies, project showcases, and networking opportunities for all students.', image: 'https://picsum.photos/seed/symposium/600/400', category: 'Seminar', venue: 'Seminar Hall 1', guests: ['Industry leaders from top tech companies'], organizers: ['A.I.M. Club Alumni'], pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 4, title: 'Code Vanguard', type: 'Upcoming', date: 'Nov 20, 2024', time: '1:00 PM - 5:00 PM', description: 'A competitive programming contest with a twist! All challenges will be based on algorithmic problems in the domain of artificial intelligence.', image: 'https://picsum.photos/seed/vanguard/600/400', category: 'Competition', organizers: ['A.I.M. Technical Team'], pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', venue: 'CSE Labs 1 & 2'},
];

export const COMMITTEE_MEMBERS: CommitteeMember[] = [
  { id: 1, role: 'President', name: 'Alex Johnson', year: '4th Year', linkedin: '#', image: 'https://picsum.photos/seed/president/400' },
  { id: 2, role: 'Vice President', name: 'Maria Garcia', year: '3rd Year', linkedin: '#', image: 'https://picsum.photos/seed/vp/400' },
  { id: 3, role: 'Secretary', name: 'Chen Wei', year: '3rd Year', linkedin: '#', image: 'https://picsum.photos/seed/secretary/400' },
  { id: 4, role: 'Treasurer', name: 'Fatima Ahmed', year: '3rd Year', linkedin: '#', image: 'https://picsum.photos/seed/treasurer/400' },
  { id: 5, role: 'Technical Head', name: 'Leo Rivera', year: '3rd Year', linkedin: '#', image: 'https://picsum.photos/seed/tech/400' },
  { id: 6, role: 'Event Coordinator', name: 'Chloe Kim', year: '2nd Year', linkedin: '#', image: 'https://picsum.photos/seed/event/400' },
  { id: 7, role: 'Public Relations', name: 'Sam Taylor', year: '2nd Year', linkedin: '#', image: 'https://picsum.photos/seed/pr/400' },
  { id: 8, role: 'Executive Member', name: 'Ben Carter', year: '2nd Year', linkedin: '#', image: 'https://picsum.photos/seed/exec/400' },
];

export const FAQ_DATA: FAQItem[] = [
    { id: 1, question: 'What is the A.I.M. Club?', answer: 'We are a community of students passionate about Artificial Intelligence and Machine Learning. We explore, learn, and build cool projects together.' },
    { id: 2, question: 'Who can join the club?', answer: 'Any student with a keen interest in AI/ML, regardless of their branch or year of study, is welcome to apply.' },
    { id: 3, question: 'What kind of events do you host?', answer: 'We host a variety of events including workshops, hackathons, seminars with industry experts, and project showcases.' },
    { id: 4, question: 'Is prior experience in AI/ML required?', answer: 'No, but a strong desire to learn and contribute is essential. We have events and resources for all skill levels.' },
];

export const GALLERY_ITEMS: GalleryItem[] = [
    { id: 1, eventId: 3, eventTitle: 'Tech Symposium 2023', category: 'Seminar', date: 'Dec 10, 2023', images: ['https://picsum.photos/seed/g1-1/800/600', 'https://picsum.photos/seed/g1-2/800/600', 'https://picsum.photos/seed/g1-3/800/600', 'https://picsum.photos/seed/g1-4/800/600', 'https://picsum.photos/seed/g1-5/800/600'] },
    { id: 2, eventId: 0, eventTitle: 'Robotics Workshop', category: 'Workshop', date: 'Nov 15, 2023', images: ['https://picsum.photos/seed/g2-1/800/600', 'https://picsum.photos/seed/g2-2/800/600', 'https://picsum.photos/seed/g2-3/800/600'] },
    { id: 3, eventId: 0, eventTitle: 'Data Science Fest', category: 'Fest', date: 'Oct 22, 2023', images: ['https://picsum.photos/seed/g3-1/800/600', 'https://picsum.photos/seed/g3-2/800/600', 'https://picsum.photos/seed/g3-3/800/600', 'https://picsum.photos/seed/g3-4/800/600'] },
    { id: 4, eventId: 0, eventTitle: 'HackAI 2023', category: 'Competition', date: 'Sep 5, 2023', images: ['https://picsum.photos/seed/g4-1/800/600', 'https://picsum.photos/seed/g4-2/800/600', 'https://picsum.photos/seed/g4-3/800/600', 'https://picsum.photos/seed/g4-4/800/600', 'https://picsum.photos/seed/g4-5/800/600', 'https://picsum.photos/seed/g4-6/800/600'] },
];

export const ROLES_CONFIG: RoleConfig = {
    'President': {
        eligibleYears: ['4'],
        questions: ['Outline your vision for the club for the next academic year.', 'Describe a time you led a team through a significant challenge.', 'How would you represent the club to external bodies and potential sponsors?'],
        responsibilities: [
            "Sets annual and long-term goals for the club.",
            "Chairs club meetings and represents the club to faculty and external entities.",
            "Approves action plans and budgets, ensuring adherence to the club’s constitution and code of conduct.",
            "Fosters leadership within the committee and plans for succession to sustain club growth.",
            "Acts as the main spokesperson and resolves major conflicts."
        ]
    },
    'Vice President': {
        eligibleYears: ['4'],
        questions: ['How would you support the President and other committee members?', 'Describe your approach to managing internal club operations and conflicts.', 'What new initiative would you propose to increase member engagement?'],
        responsibilities: [
            "Develops team synergy through regular communication and feedback.",
            "Takes charge of operational strategies and ensures key deliverables.",
            "Upholds connections between teams and supports the president in resolving issues efficiently.",
            "Provides mentorship to junior committee members.",
            "Leads special projects and takes charge in the president’s absence."
        ]
    },
    'Secretary': {
        eligibleYears: ['4'],
        questions: ['How would you ensure effective communication and documentation within the club?', 'Describe your organizational skills and experience with administrative tasks.', 'What tools would you use to manage meeting minutes, member records, and official correspondence?'],
        responsibilities: [
            "Circulates notices and compiles all documentation, correspondence, and event summaries.",
            "Organizes elections, maintains up-to-date membership records.",
            "Communicates with the department and members on behalf of the club.",
            "Keeps detailed minutes of all meetings for future reference."
        ]
    },
    'Treasurer': {
        eligibleYears: ['3', '4'],
        questions: ['What experience do you have with financial management or budgeting?', 'How would you ensure transparency and accountability in handling club funds?', 'Propose a strategy for securing sponsorships for a large-scale event.'],
        responsibilities: [
            "Manages and allocates the club’s budget responsibly.",
            "Handles fundraising, maintains financial records and upholds transparency.",
            "Prepares regular financial reports for the club’s review and audit.",
            "Ensures proper processing of expenses and reimbursements."
        ]
    },
    'Technical Head': {
        eligibleYears: ['3', '4'],
        questions: ['Describe your technical expertise relevant to AI/ML.', 'Propose a technical project the club could undertake.', 'How would you mentor members with varying levels of technical skill?'],
        responsibilities: [
            "Identifies relevant technologies and courseware for workshops.",
            "Organizes and leads hands-on training sessions and competitions.",
            "Ensures that technical resources are accessible for all initiatives.",
            "Coordinates with resource managers for logistics and lab requirements."
        ]
    },
    'Event Coordinator': {
        eligibleYears: ['2', '3', '4'],
        questions: ['Describe your experience in planning and executing events.', 'How would you manage logistics for a large-scale workshop or hackathon?', 'What makes an event successful and memorable for attendees?'],
        responsibilities: [
            "Develops the annual event calendar and creates action plans for events.",
            "Secures venues/resources and manages the logistics of club events.",
            "Trains and manages volunteer teams to ensure professional event management.",
            "Collects feedback after events and prepares review reports."
        ]
    },
    'Public Relations & Media Lead': {
        eligibleYears: ['3'],
        questions: ['How would you enhance the club\'s public image and social media presence?', 'Describe your content creation skills (graphics, video, writing).', 'Outline a promotional campaign for our flagship annual event.'],
        responsibilities: [
            "Crafts club communications, news posts, and event promotions.",
            "Designs digital and print collateral in alignment with club branding.",
            "Builds and manages relationships with campus media, alumni, and industry partners.",
            "Increases club visibility via social media and other outreach channels."
        ]
    },
    'Hospitality Lead': {
        eligibleYears: ['3', '4'],
        questions: ['Why is hospitality crucial for the club\'s events and image?', 'How would you manage guest speakers, judges, and VIPs during an event?', 'Describe how you would create a welcoming atmosphere for new members?'],
        responsibilities: [
            "Develops hospitality protocols and guest checklists for events.",
            "Coordinates refreshment, accommodation, and reception logistics.",
            "Maintains post-event records and feedback sources for continuous improvement."
        ]
    },
    'Executive Member': {
        eligibleYears: ['2', '3'],
        questions: ['In what specific area do you want to contribute as an Executive Member?', 'How would you take initiative on a new project or task?', 'What qualities do you possess that make you a good team player?'],
        responsibilities: [
            "Provides support to the main office bearers and contributes to club events.",
            "Takes on delegated tasks and actively participates in the club’s growth.",
            "Demonstrates initiative and teamwork across club activities."
        ]
    },
};

export const APPLICATION_ROLES: ApplicationRole[] = Object.entries(ROLES_CONFIG).map(([name, config]) => ({
    name,
    ...config,
}));

export const MOCK_APPLICATIONS: ApplicationData[] = [
    { id: '1', applicantId: 'AIM-2024-001', trackingId: 'track_8f3j9dke0a', name: 'John Doe', rollNumber: '21CS101', email: 'john.doe@example.com', contact: '9876543210', yearOfStudy: '3', role: 'Technical Head', answers: { 'Q1': 'I have extensive experience with PyTorch and TensorFlow.', 'Q2': 'I propose we build a campus navigation chatbot.', 'Q3': 'I would create mentorship pods with senior members.'}, status: 'Pending', viewed: false, submittedAt: '2024-07-20T10:00:00.000Z' },
    { id: '2', applicantId: 'AIM-2024-002', trackingId: 'track_p5g2h1j8f4', name: 'Jane Smith', rollNumber: '22EC202', email: 'jane.smith@example.com', contact: '9876543211', yearOfStudy: '2', role: 'Event Coordinator', answers: { 'Q1': 'I organized my school\'s annual fest.', 'Q2': 'I would use a detailed checklist and delegate tasks effectively.', 'Q3': 'High engagement and positive feedback.'}, status: 'Shortlisted', viewed: true, submittedAt: '2024-07-21T14:30:00.000Z' },
    { id: '3', applicantId: 'AIM-2024-003', trackingId: 'track_a9b8c7d6e5', name: 'Peter Jones', rollNumber: '23ME303', email: 'peter.jones@example.com', contact: '9876543212', yearOfStudy: '1', role: 'Executive Member', answers: { 'Q1': 'I am passionate about AI and want to learn.', 'Q2': 'I am good at design and can help with posters.', 'Q3': 'I always complete my tasks on time.'}, status: 'Interview Scheduled', viewed: true, submittedAt: '2024-07-22T09:00:00.000Z', interviewDetails: { date: '2024-11-10', time: '14:00', link: 'https://meet.google.com/xyz-abc-def'} },
    { id: '4', applicantId: 'AIM-2024-004', trackingId: 'track_k2l3m4n5p6', name: 'Emily White', rollNumber: '21CS121', email: 'emily.white@example.com', contact: '9876543213', yearOfStudy: '3', role: 'Technical Head', answers: { 'Q1': 'My expertise is in reinforcement learning.', 'Q2': 'An automated timetabling system for the university.', 'Q3': 'By holding weekly coding sessions and doubt clearings.'}, status: 'Rejected', viewed: true, submittedAt: '2024-07-22T11:45:00.000Z' },
    { id: '5', applicantId: 'AIM-2024-005', trackingId: 'track_q1r2s3t4u5', name: 'Michael Brown', rollNumber: '23EE404', email: 'michael.brown@example.com', contact: '9876543214', yearOfStudy: '1', role: 'Executive Member', answers: { 'Q1': 'I wish to contribute to the tech community.', 'Q2': 'I have good communication skills for outreach.', 'Q3': 'I am a dedicated and punctual individual.'}, status: 'Selected', viewed: true, submittedAt: '2024-07-23T16:20:00.000Z' },
];

export const MOCK_PAYMENTS: PaymentData[] = [
    { id: 'pay-1', transactionId: 'TXN1721510400000', eventId: 2, eventName: 'Intro to Transformers', userName: 'Test User', userEmail: 'test@example.com', amount: 100, paymentDate: '2024-07-20T10:00:00.000Z' }
];
