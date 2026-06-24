// Mock Database - simulates Supabase behavior with localStorage persistence

export interface Donor {
  id: string;
  created_at: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  payment_method: string;
  donation_type: string;
  message: string | null;
  status: string;
  program: string | null;
}

export interface Volunteer {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  skills: string[];
  availability: string;
  motivation: string;
  program: string;
  status: string;
  location: string;
}

export interface NewsletterSubscriber {
  id: string;
  created_at: string;
  email: string;
  status: string;
}

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
}

export interface Event {
  id: string;
  created_at: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  seats_available: number;
  is_active: boolean;
}

export interface EventRegistration {
  id: string;
  created_at: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  attendees: number;
}

export interface Program {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  beneficiaries: number;
  status: string;
  start_date: string;
  end_date: string | null;
}

export interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  published: boolean;
  tags: string[];
}

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
const now = () => new Date().toISOString();

// Initialize with seed data
const initializeData = () => {
  if (!localStorage.getItem('ngo_initialized')) {
    localStorage.setItem('ngo_donors', JSON.stringify([
      { id: generateId(), created_at: '2024-01-15T10:00:00Z', name: 'Alice Johnson', email: 'alice@example.com', amount: 500, currency: 'USD', payment_method: 'credit_card', donation_type: 'one-time', message: 'Keep up the great work!', status: 'completed', program: 'Education' },
      { id: generateId(), created_at: '2024-02-20T14:30:00Z', name: 'Bob Smith', email: 'bob@example.com', amount: 1000, currency: 'USD', payment_method: 'paypal', donation_type: 'recurring', message: null, status: 'completed', program: 'Healthcare' },
      { id: generateId(), created_at: '2024-03-05T09:15:00Z', name: 'Carol White', email: 'carol@example.com', amount: 250, currency: 'USD', payment_method: 'bank_transfer', donation_type: 'one-time', message: 'For the children!', status: 'completed', program: 'Education' },
      { id: generateId(), created_at: '2024-04-12T16:45:00Z', name: 'David Brown', email: 'david@example.com', amount: 750, currency: 'USD', payment_method: 'credit_card', donation_type: 'one-time', message: null, status: 'completed', program: 'Environment' },
      { id: generateId(), created_at: '2024-05-18T11:20:00Z', name: 'Emma Davis', email: 'emma@example.com', amount: 200, currency: 'USD', payment_method: 'mobile_money', donation_type: 'recurring', message: 'Monthly contribution', status: 'completed', program: 'Water & Sanitation' },
      { id: generateId(), created_at: '2024-06-22T13:10:00Z', name: 'Frank Wilson', email: 'frank@example.com', amount: 5000, currency: 'USD', payment_method: 'bank_transfer', donation_type: 'one-time', message: 'Major donation for new school', status: 'completed', program: 'Education' },
    ]));

    localStorage.setItem('ngo_volunteers', JSON.stringify([
      { id: generateId(), created_at: '2024-01-10T08:00:00Z', name: 'Sarah Miller', email: 'sarah@example.com', phone: '+1234567890', age: 28, skills: ['Teaching', 'Communication'], availability: 'weekends', motivation: 'Want to give back to community', program: 'Education', status: 'active', location: 'New York' },
      { id: generateId(), created_at: '2024-02-15T09:30:00Z', name: 'James Taylor', email: 'james@example.com', phone: '+0987654321', age: 35, skills: ['Medical', 'First Aid'], availability: 'full-time', motivation: 'Use medical skills for good', program: 'Healthcare', status: 'active', location: 'Los Angeles' },
      { id: generateId(), created_at: '2024-03-20T14:00:00Z', name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+1122334455', age: 22, skills: ['IT', 'Web Design'], availability: 'part-time', motivation: 'Tech for social good', program: 'Digital Literacy', status: 'pending', location: 'Chicago' },
    ]));

    localStorage.setItem('ngo_newsletter', JSON.stringify([
      { id: generateId(), created_at: '2024-01-05T10:00:00Z', email: 'subscriber1@example.com', status: 'active' },
      { id: generateId(), created_at: '2024-02-10T11:00:00Z', email: 'subscriber2@example.com', status: 'active' },
      { id: generateId(), created_at: '2024-03-15T12:00:00Z', email: 'subscriber3@example.com', status: 'active' },
    ]));

    localStorage.setItem('ngo_messages', JSON.stringify([
      { id: generateId(), created_at: '2024-05-01T10:00:00Z', name: 'John Doe', email: 'john@example.com', subject: 'Partnership Inquiry', message: 'We would like to explore partnership opportunities with your organization.', status: 'unread' },
      { id: generateId(), created_at: '2024-05-10T14:00:00Z', name: 'Jane Smith', email: 'jane@example.com', subject: 'Volunteer Program', message: 'I am interested in your volunteer program. Could you provide more details?', status: 'read' },
    ]));

    localStorage.setItem('ngo_events', JSON.stringify([
      { id: generateId(), created_at: '2024-01-01T00:00:00Z', title: 'Annual Charity Gala 2025', description: 'Join us for our annual fundraising gala featuring live music, dinner, and inspiring stories from our beneficiaries.', date: '2025-09-15T18:00:00Z', location: 'Grand Ballroom, New York', image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', category: 'Fundraising', seats_available: 200, is_active: true },
      { id: generateId(), created_at: '2024-01-01T00:00:00Z', title: 'Community Health Camp', description: 'Free medical check-ups, vaccinations, and health education for underserved communities.', date: '2025-08-20T08:00:00Z', location: 'Community Center, Chicago', image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', category: 'Healthcare', seats_available: 500, is_active: true },
      { id: generateId(), created_at: '2024-01-01T00:00:00Z', title: 'Tree Planting Drive', description: 'Help us plant 10,000 trees to restore our local ecosystem and fight climate change.', date: '2025-07-10T07:00:00Z', location: 'Riverside Park, Dallas', image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', category: 'Environment', seats_available: 150, is_active: true },
    ]));

    localStorage.setItem('ngo_event_registrations', JSON.stringify([]));

    localStorage.setItem('ngo_programs', JSON.stringify([
      { id: generateId(), created_at: '2023-01-01T00:00:00Z', title: 'Bright Futures Education', description: 'Providing quality education to underprivileged children through scholarship programs, school supplies, and mentorship.', category: 'Education', image: 'https://images.pexels.com/photos/8363025/pexels-photo-8363025.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', location: 'Multiple Regions', beneficiaries: 5000, status: 'active', start_date: '2023-01-01', end_date: null },
      { id: generateId(), created_at: '2023-03-01T00:00:00Z', title: 'HealthFirst Community Clinics', description: 'Mobile health clinics bringing essential medical services including check-ups, vaccinations, and maternal care to remote areas.', category: 'Healthcare', image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', location: 'Rural Communities', beneficiaries: 12000, status: 'active', start_date: '2023-03-01', end_date: null },
      { id: generateId(), created_at: '2023-06-01T00:00:00Z', title: 'Clean Water Initiative', description: 'Installing water purification systems and wells in communities without access to clean drinking water.', category: 'Water & Sanitation', image: 'https://images.pexels.com/photos/2962405/pexels-photo-2962405.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', location: 'Sub-Saharan Africa', beneficiaries: 8000, status: 'active', start_date: '2023-06-01', end_date: null },
      { id: generateId(), created_at: '2023-09-01T00:00:00Z', title: 'Women Empowerment Program', description: 'Vocational training, microfinance, and leadership development for women from marginalized communities.', category: 'Economic Empowerment', image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', location: 'South Asia', beneficiaries: 3500, status: 'active', start_date: '2023-09-01', end_date: null },
      { id: generateId(), created_at: '2022-01-01T00:00:00Z', title: 'Reforestation Project', description: 'Planting native trees and restoring degraded ecosystems while engaging local communities in environmental stewardship.', category: 'Environment', image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', location: 'Amazon Region', beneficiaries: 25000, status: 'completed', start_date: '2022-01-01', end_date: '2023-12-31' },
      { id: generateId(), created_at: '2024-01-01T00:00:00Z', title: 'Digital Literacy for All', description: 'Teaching digital skills to youth and adults in underserved communities to bridge the technology gap.', category: 'Digital Education', image: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', location: 'Urban Slums', beneficiaries: 1500, status: 'active', start_date: '2024-01-01', end_date: null },
    ]));

    localStorage.setItem('ngo_blog_posts', JSON.stringify([
      { id: generateId(), created_at: '2024-06-01T10:00:00Z', title: '5,000 Children Receive Scholarships This Year', content: 'This year marks a milestone in our Bright Futures Education program. Thanks to the generous support of our donors, we have been able to provide scholarships to 5,000 children across multiple regions, giving them access to quality education that would otherwise be beyond their reach...', excerpt: 'Thanks to generous donors, we reached a major milestone by providing 5,000 scholarships this year.', image: 'https://images.pexels.com/photos/8363025/pexels-photo-8363025.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', category: 'Education', author: 'Dr. Sarah Johnson', published: true, tags: ['education', 'scholarships', 'impact'] },
      { id: generateId(), created_at: '2024-05-15T08:00:00Z', title: 'New Mobile Health Clinics Reach Remote Villages', content: 'Our HealthFirst program has expanded its reach with three new mobile health clinics that now serve previously inaccessible villages. These clinics provide essential services including maternal care, vaccinations, and basic diagnostics...', excerpt: 'Three new mobile clinics now serve remote villages that previously had no access to healthcare.', image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', category: 'Healthcare', author: 'Dr. Michael Chen', published: true, tags: ['healthcare', 'mobile-clinics', 'rural'] },
      { id: generateId(), created_at: '2024-04-22T09:00:00Z', title: 'Earth Day: Our Reforestation Impact', content: 'On Earth Day, we celebrate the successful completion of our Reforestation Project. Over two years, we planted over 50,000 trees, restored 200 hectares of degraded land, and engaged 500 local community members as environmental stewards...', excerpt: 'Celebrating Earth Day with the successful completion of our 50,000-tree reforestation project.', image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', category: 'Environment', author: 'Maria Lopez', published: true, tags: ['environment', 'trees', 'earth-day'] },
      { id: generateId(), created_at: '2024-03-08T08:00:00Z', title: "Women's Day: Stories of Empowerment", content: "On International Women's Day, we share the inspiring stories of women who have transformed their lives through our Women Empowerment Program. From learning new vocational skills to starting their own businesses, these women are changing their communities...", excerpt: "On International Women's Day, we highlight the transformative impact of our Women Empowerment Program.", image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', category: 'Empowerment', author: 'Amina Hassan', published: true, tags: ['women', 'empowerment', "women's-day"] },
    ]));

    localStorage.setItem('ngo_initialized', 'true');
  }
};

// Initialize on first load
initializeData();

// Generic CRUD operations
const getCollection = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setCollection = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Donors
export const db = {
  donors: {
    getAll: (): Donor[] => getCollection<Donor>('ngo_donors').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    getById: (id: string): Donor | undefined => getCollection<Donor>('ngo_donors').find(d => d.id === id),
    create: (data: Omit<Donor, 'id' | 'created_at'>): Donor => {
      const donors = getCollection<Donor>('ngo_donors');
      const newDonor: Donor = { id: generateId(), created_at: now(), ...data };
      donors.push(newDonor);
      setCollection('ngo_donors', donors);
      return newDonor;
    },
    update: (id: string, data: Partial<Donor>): Donor | null => {
      const donors = getCollection<Donor>('ngo_donors');
      const idx = donors.findIndex(d => d.id === id);
      if (idx === -1) return null;
      donors[idx] = { ...donors[idx], ...data };
      setCollection('ngo_donors', donors);
      return donors[idx];
    },
    delete: (id: string): boolean => {
      const donors = getCollection<Donor>('ngo_donors');
      const filtered = donors.filter(d => d.id !== id);
      setCollection('ngo_donors', filtered);
      return filtered.length < donors.length;
    },
    getTotalAmount: (): number => getCollection<Donor>('ngo_donors').filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0),
  },

  volunteers: {
    getAll: (): Volunteer[] => getCollection<Volunteer>('ngo_volunteers').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    getById: (id: string): Volunteer | undefined => getCollection<Volunteer>('ngo_volunteers').find(v => v.id === id),
    create: (data: Omit<Volunteer, 'id' | 'created_at'>): Volunteer => {
      const volunteers = getCollection<Volunteer>('ngo_volunteers');
      const newVolunteer: Volunteer = { id: generateId(), created_at: now(), ...data };
      volunteers.push(newVolunteer);
      setCollection('ngo_volunteers', volunteers);
      return newVolunteer;
    },
    update: (id: string, data: Partial<Volunteer>): Volunteer | null => {
      const volunteers = getCollection<Volunteer>('ngo_volunteers');
      const idx = volunteers.findIndex(v => v.id === id);
      if (idx === -1) return null;
      volunteers[idx] = { ...volunteers[idx], ...data };
      setCollection('ngo_volunteers', volunteers);
      return volunteers[idx];
    },
    delete: (id: string): boolean => {
      const volunteers = getCollection<Volunteer>('ngo_volunteers');
      const filtered = volunteers.filter(v => v.id !== id);
      setCollection('ngo_volunteers', filtered);
      return filtered.length < volunteers.length;
    },
  },

  newsletter: {
    getAll: (): NewsletterSubscriber[] => getCollection<NewsletterSubscriber>('ngo_newsletter'),
    subscribe: (email: string): NewsletterSubscriber => {
      const subs = getCollection<NewsletterSubscriber>('ngo_newsletter');
      const existing = subs.find(s => s.email === email);
      if (existing) throw new Error('Email already subscribed');
      const newSub: NewsletterSubscriber = { id: generateId(), created_at: now(), email, status: 'active' };
      subs.push(newSub);
      setCollection('ngo_newsletter', subs);
      return newSub;
    },
    delete: (id: string): boolean => {
      const subs = getCollection<NewsletterSubscriber>('ngo_newsletter');
      const filtered = subs.filter(s => s.id !== id);
      setCollection('ngo_newsletter', filtered);
      return filtered.length < subs.length;
    },
  },

  messages: {
    getAll: (): ContactMessage[] => getCollection<ContactMessage>('ngo_messages').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    create: (data: Omit<ContactMessage, 'id' | 'created_at'>): ContactMessage => {
      const messages = getCollection<ContactMessage>('ngo_messages');
      const newMsg: ContactMessage = { id: generateId(), created_at: now(), ...data };
      messages.push(newMsg);
      setCollection('ngo_messages', messages);
      return newMsg;
    },
    update: (id: string, data: Partial<ContactMessage>): ContactMessage | null => {
      const messages = getCollection<ContactMessage>('ngo_messages');
      const idx = messages.findIndex(m => m.id === id);
      if (idx === -1) return null;
      messages[idx] = { ...messages[idx], ...data };
      setCollection('ngo_messages', messages);
      return messages[idx];
    },
    delete: (id: string): boolean => {
      const messages = getCollection<ContactMessage>('ngo_messages');
      const filtered = messages.filter(m => m.id !== id);
      setCollection('ngo_messages', filtered);
      return filtered.length < messages.length;
    },
  },

  events: {
    getAll: (): Event[] => getCollection<Event>('ngo_events').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    getById: (id: string): Event | undefined => getCollection<Event>('ngo_events').find(e => e.id === id),
    create: (data: Omit<Event, 'id' | 'created_at'>): Event => {
      const events = getCollection<Event>('ngo_events');
      const newEvent: Event = { id: generateId(), created_at: now(), ...data };
      events.push(newEvent);
      setCollection('ngo_events', events);
      return newEvent;
    },
    update: (id: string, data: Partial<Event>): Event | null => {
      const events = getCollection<Event>('ngo_events');
      const idx = events.findIndex(e => e.id === id);
      if (idx === -1) return null;
      events[idx] = { ...events[idx], ...data };
      setCollection('ngo_events', events);
      return events[idx];
    },
    delete: (id: string): boolean => {
      const events = getCollection<Event>('ngo_events');
      const filtered = events.filter(e => e.id !== id);
      setCollection('ngo_events', filtered);
      return filtered.length < events.length;
    },
  },

  eventRegistrations: {
    getAll: (): EventRegistration[] => getCollection<EventRegistration>('ngo_event_registrations'),
    getByEvent: (eventId: string): EventRegistration[] => getCollection<EventRegistration>('ngo_event_registrations').filter(r => r.event_id === eventId),
    create: (data: Omit<EventRegistration, 'id' | 'created_at'>): EventRegistration => {
      const regs = getCollection<EventRegistration>('ngo_event_registrations');
      const newReg: EventRegistration = { id: generateId(), created_at: now(), ...data };
      regs.push(newReg);
      setCollection('ngo_event_registrations', regs);
      return newReg;
    },
  },

  programs: {
    getAll: (): Program[] => getCollection<Program>('ngo_programs'),
    getById: (id: string): Program | undefined => getCollection<Program>('ngo_programs').find(p => p.id === id),
    create: (data: Omit<Program, 'id' | 'created_at'>): Program => {
      const programs = getCollection<Program>('ngo_programs');
      const newProgram: Program = { id: generateId(), created_at: now(), ...data };
      programs.push(newProgram);
      setCollection('ngo_programs', programs);
      return newProgram;
    },
    update: (id: string, data: Partial<Program>): Program | null => {
      const programs = getCollection<Program>('ngo_programs');
      const idx = programs.findIndex(p => p.id === id);
      if (idx === -1) return null;
      programs[idx] = { ...programs[idx], ...data };
      setCollection('ngo_programs', programs);
      return programs[idx];
    },
    delete: (id: string): boolean => {
      const programs = getCollection<Program>('ngo_programs');
      const filtered = programs.filter(p => p.id !== id);
      setCollection('ngo_programs', filtered);
      return filtered.length < programs.length;
    },
  },

  blog: {
    getAll: (): BlogPost[] => getCollection<BlogPost>('ngo_blog_posts').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    getById: (id: string): BlogPost | undefined => getCollection<BlogPost>('ngo_blog_posts').find(p => p.id === id),
    getPublished: (): BlogPost[] => getCollection<BlogPost>('ngo_blog_posts').filter(p => p.published).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    create: (data: Omit<BlogPost, 'id' | 'created_at'>): BlogPost => {
      const posts = getCollection<BlogPost>('ngo_blog_posts');
      const newPost: BlogPost = { id: generateId(), created_at: now(), ...data };
      posts.push(newPost);
      setCollection('ngo_blog_posts', posts);
      return newPost;
    },
    update: (id: string, data: Partial<BlogPost>): BlogPost | null => {
      const posts = getCollection<BlogPost>('ngo_blog_posts');
      const idx = posts.findIndex(p => p.id === id);
      if (idx === -1) return null;
      posts[idx] = { ...posts[idx], ...data };
      setCollection('ngo_blog_posts', posts);
      return posts[idx];
    },
    delete: (id: string): boolean => {
      const posts = getCollection<BlogPost>('ngo_blog_posts');
      const filtered = posts.filter(p => p.id !== id);
      setCollection('ngo_blog_posts', filtered);
      return filtered.length < posts.length;
    },
  },

  auth: {
    ADMIN_CREDENTIALS: { email: 'admin@hoperise.org', password: 'Admin@123' },
    login: (email: string, password: string): boolean => {
      const isValid = email === 'admin@hoperise.org' && password === 'Admin@123';
      if (isValid) {
        localStorage.setItem('ngo_admin_session', JSON.stringify({ email, name: 'Admin User', role: 'super_admin', loginTime: now() }));
      }
      return isValid;
    },
    logout: (): void => {
      localStorage.removeItem('ngo_admin_session');
    },
    getSession: (): { email: string; name: string; role: string; loginTime: string } | null => {
      const session = localStorage.getItem('ngo_admin_session');
      return session ? JSON.parse(session) : null;
    },
    isAuthenticated: (): boolean => {
      return !!localStorage.getItem('ngo_admin_session');
    },
  },
};
