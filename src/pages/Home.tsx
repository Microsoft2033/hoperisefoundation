// import React, { useEffect, useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, Users, Globe, Award, ArrowRight, ChevronRight, Play, CheckCircle } from 'lucide-react';
// import { db, Program, BlogPost, Event } from '../lib/mockDb';
// import { format } from 'date-fns';

// const CountUpStat: React.FC<{ end: number; suffix: string; label: string; icon: React.ReactNode }> = ({ end, suffix, label, icon }) => {
//   const [count, setCount] = useState(0);
//   const ref = useRef<HTMLDivElement>(null);
//   const [started, setStarted] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting && !started) {
//         setStarted(true);
//         let start = 0;
//         const duration = 2000;
//         const step = end / (duration / 16);
//         const timer = setInterval(() => {
//           start += step;
//           if (start >= end) { setCount(end); clearInterval(timer); }
//           else setCount(Math.floor(start));
//         }, 16);
//       }
//     });
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [end, started]);

//   return (
//     <div ref={ref} className="text-center group">
//       <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors duration-300">
//         <div className="text-green-600 group-hover:text-white transition-colors duration-300">{icon}</div>
//       </div>
//       <div className="text-4xl font-bold text-gray-900 mb-1">
//         {count.toLocaleString()}{suffix}
//       </div>
//       <p className="text-gray-600 text-sm">{label}</p>
//     </div>
//   );
// };

// const Home: React.FC = () => {
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [posts, setPosts] = useState<BlogPost[]>([]);
//   const [events, setEvents] = useState<Event[]>([]);

//   useEffect(() => {
//     setPrograms(db.programs.getAll().filter(p => p.status === 'active').slice(0, 3));
//     setPosts(db.blog.getPublished().slice(0, 3));
//     setEvents(db.events.getAll().filter(e => e.is_active).slice(0, 3));
//   }, []);

//   const categoryColors: Record<string, string> = {
//     Education: 'bg-blue-100 text-blue-700',
//     Healthcare: 'bg-red-100 text-red-700',
//     Environment: 'bg-green-100 text-green-700',
//     'Water & Sanitation': 'bg-cyan-100 text-cyan-700',
//     'Economic Empowerment': 'bg-purple-100 text-purple-700',
//     'Digital Education': 'bg-orange-100 text-orange-700',
//   };

//   return (
//     <div className="overflow-hidden">
//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center">
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: `url('https://images.pexels.com/photos/6646855/pexels-photo-6646855.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920')` }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
//           <div className="max-w-3xl">
//             <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-sm">
//               <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
//               <span>Making a Difference Since 2015</span>
//             </div>
//             <h1 className="text-5xl md:text-7xl font-bold text-white font-serif leading-tight mb-6">
//               Together We
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300"> Rise</span>
//             </h1>
//             <p className="text-xl text-gray-200 leading-relaxed mb-8 max-w-2xl">
//               Empowering underprivileged communities through education, healthcare, and sustainable development. Every contribution creates lasting change.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <Link to="/donate" className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/40 group">
//                 <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
//                 <span>Donate Now</span>
//               </Link>
//               <Link to="/programs" className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur border border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 group">
//                 <span>Our Programs</span>
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </div>
//             <div className="mt-12 flex flex-wrap gap-8">
//               {[
//                 { value: '50K+', label: 'Lives Impacted' },
//                 { value: '$2M+', label: 'Funds Raised' },
//                 { value: '30+', label: 'Countries' },
//               ].map((stat) => (
//                 <div key={stat.label} className="text-center">
//                   <div className="text-3xl font-bold text-white">{stat.value}</div>
//                   <div className="text-green-300 text-sm">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce">
//           <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1">
//             <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 font-serif mb-4">Our Impact in Numbers</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">Every number represents a life changed, a community strengthened, and a future brightened through collective action.</p>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
//             <CountUpStat end={50000} suffix="+" label="Lives Impacted" icon={<Users className="w-7 h-7" />} />
//             <CountUpStat end={30} suffix="+" label="Countries Reached" icon={<Globe className="w-7 h-7" />} />
//             <CountUpStat end={120} suffix="+" label="Active Volunteers" icon={<Heart className="w-7 h-7" />} />
//             <CountUpStat end={15} suffix="+" label="Awards Received" icon={<Award className="w-7 h-7" />} />
//           </div>
//         </div>
//       </section>

//       {/* Mission Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-16 items-center">
//             <div className="relative">
//               <div className="rounded-3xl overflow-hidden shadow-2xl">
//                 <img
//                   src="https://images.pexels.com/photos/6646864/pexels-photo-6646864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=700"
//                   alt="Volunteers at work"
//                   className="w-full h-96 object-cover"
//                 />
//               </div>
//               <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
//                 <div className="flex items-center space-x-3 mb-3">
//                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                     <CheckCircle className="w-5 h-5 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-900 text-sm">98% Fund Utilization</p>
//                     <p className="text-gray-500 text-xs">Directly to programs</p>
//                   </div>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '98%' }}></div>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">Our Mission</div>
//               <h2 className="text-4xl font-bold text-gray-900 font-serif mb-6 leading-tight">
//                 Committed to Creating Lasting Change
//               </h2>
//               <p className="text-gray-600 leading-relaxed mb-6">
//                 At HopeRise Foundation, we believe that every person deserves access to quality education, healthcare, and economic opportunities. We work tirelessly to bridge the gap between privilege and poverty through sustainable programs.
//               </p>
//               <div className="space-y-4 mb-8">
//                 {[
//                   { title: 'Education First', desc: 'Scholarships and mentorship for 5,000+ children annually' },
//                   { title: 'Healthcare Access', desc: 'Mobile clinics serving 12,000+ patients in remote areas' },
//                   { title: 'Sustainable Development', desc: 'Environmental and economic empowerment programs' },
//                 ].map((item) => (
//                   <div key={item.title} className="flex items-start space-x-3">
//                     <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <span className="font-semibold text-gray-900">{item.title}: </span>
//                       <span className="text-gray-600">{item.desc}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <Link to="/about" className="inline-flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700 group">
//                 <span>Learn More About Us</span>
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Programs Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-end justify-between mb-12">
//             <div>
//               <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">Our Programs</div>
//               <h2 className="text-4xl font-bold text-gray-900 font-serif">Transforming Communities</h2>
//             </div>
//             <Link to="/programs" className="hidden md:flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700 group">
//               <span>View All Programs</span>
//               <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {programs.map((program) => (
//               <div key={program.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
//                 <div className="relative h-52 overflow-hidden">
//                   <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
//                   <div className="absolute top-4 left-4">
//                     <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${categoryColors[program.category] || 'bg-gray-100 text-gray-700'}`}>
//                       {program.category}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">{program.title}</h3>
//                   <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{program.description}</p>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-500">📍 {program.location}</span>
//                     <span className="text-green-600 font-semibold">{program.beneficiaries.toLocaleString()} beneficiaries</span>
//                   </div>
//                   <div className="mt-4 pt-4 border-t border-gray-100">
//                     <Link to="/programs" className="flex items-center space-x-2 text-green-600 text-sm font-semibold hover:text-green-700 group/link">
//                       <span>Learn More</span>
//                       <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="mt-8 text-center md:hidden">
//             <Link to="/programs" className="inline-flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700">
//               <span>View All Programs</span>
//               <ChevronRight className="w-4 h-4" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* CTA Banner */}
//       <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
//         </div>
//         <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm mb-6">
//             <Play className="w-4 h-4 fill-white" />
//             <span>Watch Our Story</span>
//           </div>
//           <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-6">
//             Your Generosity Changes Lives
//           </h2>
//           <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
//             $50 provides school supplies for a child. $100 feeds a family for a month. $500 provides medical care for 10 people. Every dollar makes a difference.
//           </p>
//           <div className="flex flex-wrap gap-4 justify-center">
//             <Link to="/donate" className="px-8 py-4 bg-white text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg">
//               Make a Donation
//             </Link>
//             <Link to="/volunteer" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
//               Become a Volunteer
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Events Section */}
//       {events.length > 0 && (
//         <section className="py-20 bg-gray-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-end justify-between mb-12">
//               <div>
//                 <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">Upcoming Events</div>
//                 <h2 className="text-4xl font-bold text-gray-900 font-serif">Join Our Next Events</h2>
//               </div>
//               <Link to="/events" className="hidden md:flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700 group">
//                 <span>View All Events</span>
//                 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </div>
//             <div className="grid md:grid-cols-3 gap-8">
//               {events.map((event) => (
//                 <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
//                   <div className="relative h-48 overflow-hidden">
//                     <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                     <div className="absolute top-4 right-4 bg-white rounded-xl px-3 py-2 text-center shadow-md">
//                       <div className="text-lg font-bold text-gray-900">{format(new Date(event.date), 'dd')}</div>
//                       <div className="text-xs text-gray-500 uppercase">{format(new Date(event.date), 'MMM')}</div>
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{event.category}</span>
//                     <h3 className="font-bold text-gray-900 mt-3 mb-2 group-hover:text-green-600 transition-colors">{event.title}</h3>
//                     <p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>
//                     <div className="flex items-center justify-between text-sm text-gray-500">
//                       <span>📍 {event.location.split(',')[0]}</span>
//                       <span>{event.seats_available} seats left</span>
//                     </div>
//                     <Link to="/events" className="mt-4 block w-full text-center py-2.5 bg-green-50 text-green-600 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors">
//                       Register Now
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Blog Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-end justify-between mb-12">
//             <div>
//               <div className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">Latest News</div>
//               <h2 className="text-4xl font-bold text-gray-900 font-serif">Stories of Impact</h2>
//             </div>
//             <Link to="/blog" className="hidden md:flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700 group">
//               <span>Read All Stories</span>
//               <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {posts.map((post) => (
//               <article key={post.id} className="group">
//                 <div className="rounded-2xl overflow-hidden mb-5 h-52">
//                   <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex items-center space-x-3">
//                     <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{post.category}</span>
//                     <span className="text-gray-400 text-xs">{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
//                   </div>
//                   <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-green-600 transition-colors">{post.title}</h3>
//                   <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
//                   <div className="flex items-center justify-between pt-2">
//                     <span className="text-gray-500 text-xs">By {post.author}</span>
//                     <Link to="/blog" className="text-green-600 text-sm font-semibold hover:text-green-700 flex items-center space-x-1 group/link">
//                       <span>Read More</span>
//                       <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
//                     </Link>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Partners */}
//       <section className="py-16 bg-gray-50 border-t border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <p className="text-center text-gray-500 text-sm mb-10 uppercase tracking-widest font-medium">Trusted Partners & Supporters</p>
//           <div className="flex flex-wrap items-center justify-center gap-10 opacity-50">
//             {['UNICEF', 'WHO', 'World Bank', 'USAID', 'Gates Foundation', 'Oxfam'].map((partner) => (
//               <div key={partner} className="text-2xl font-bold text-gray-400">{partner}</div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <div className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">Testimonials</div>
//             <h2 className="text-4xl font-bold text-gray-900 font-serif">What People Say</h2>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { name: 'Maria Santos', role: 'Scholarship Recipient', text: "HopeRise's scholarship changed my life. I'm now the first in my family to attend university. Their support went beyond just financial help—they mentored me every step of the way.", avatar: '👩‍🎓' },
//               { name: 'Dr. Ahmed Hassan', role: 'Healthcare Volunteer', text: "Volunteering with HopeRise's mobile clinic program has been the most rewarding experience of my career. We've brought essential healthcare to thousands who had none.", avatar: '👨‍⚕️' },
//               { name: 'Jennifer Cole', role: 'Monthly Donor', text: "I donate monthly and the transparency I receive about how my money is used gives me complete confidence. The impact reports are detailed and moving. This is an organization I trust completely.", avatar: '👩‍💼' },
//             ].map((t) => (
//               <div key={t.name} className="bg-gray-50 rounded-2xl p-8 relative">
//                 <div className="text-4xl text-green-300 mb-4">"</div>
//                 <p className="text-gray-700 leading-relaxed mb-6">{t.text}</p>
//                 <div className="flex items-center space-x-3">
//                   <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">{t.avatar}</div>
//                   <div>
//                     <div className="font-semibold text-gray-900">{t.name}</div>
//                     <div className="text-gray-500 text-sm">{t.role}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Users, Globe, Award, ArrowRight,
  ChevronRight, Play, CheckCircle
} from 'lucide-react';
import { format, isFuture } from 'date-fns';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  beneficiaries: number;
  status: string;
}

interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  published: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  seats_available: number;
  is_active: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

const categoryColors: Record<string, string> = {
  education:    'bg-blue-100 text-blue-700',
  health:       'bg-red-100 text-red-700',
  environment:  'bg-green-100 text-green-700',
  community:    'bg-orange-100 text-orange-700',
  empowerment:  'bg-purple-100 text-purple-700',
  relief:       'bg-cyan-100 text-cyan-700',
  other:        'bg-gray-100 text-gray-700',
};

const categoryLabels: Record<string, string> = {
  education:    'Education',
  health:       'Health',
  environment:  'Environment',
  community:    'Community',
  empowerment:  'Empowerment',
  relief:       'Relief',
  other:        'Other',
};

const blogCategoryLabels: Record<string, string> = {
  education: 'Education',
  news:      'News',
  stories:   'Stories',
  updates:   'Updates',
  events:    'Events',
  opinion:   'Opinion',
  other:     'Other',
};

const eventCategoryLabels: Record<string, string> = {
  fundraiser: 'Fundraiser',
  workshop:   'Workshop',
  seminar:    'Seminar',
  community:  'Community',
  volunteer:  'Volunteer',
  awareness:  'Awareness',
  other:      'Other',
};

// ============================================================
// COUNT-UP COMPONENT (unchanged — no DB dependency)
// ============================================================

const CountUpStat: React.FC<{
  end: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
}> = ({ end, suffix, label, icon }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
        let start = 0;
        const duration = 2000;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, started]);

  return (
    <div ref={ref} className="text-center group">
      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors duration-300">
        <div className="text-green-600 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
};

// ============================================================
// SKELETON LOADERS
// ============================================================

const ProgramCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="flex justify-between mt-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const EventCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-4 bg-gray-200 rounded-full w-20" />
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-10 bg-gray-200 rounded-lg mt-4" />
    </div>
  </div>
);

const BlogCardSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-52 bg-gray-200 rounded-2xl mb-5" />
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="h-5 bg-gray-200 rounded-full w-20" />
        <div className="h-5 bg-gray-200 rounded w-24" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const Home: React.FC = () => {
  const [programs, setPrograms]   = useState<Program[]>([]);
  const [posts, setPosts]         = useState<BlogPost[]>([]);
  const [events, setEvents]       = useState<Event[]>([]);
  const [loading, setLoading]     = useState(true);

  // ============================================================
  // FETCH ALL DATA IN PARALLEL
  // ============================================================
  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);

      const [programsRes, postsRes, eventsRes] = await Promise.all([
        // Active programs (max 3)
        supabase
          .from('programs')
          .select('id, title, description, category, image, location, beneficiaries, status')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(3),

        // Published blog posts (max 3)
        supabase
          .from('blog_posts')
          .select('id, created_at, title, excerpt, image, category, author, published')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3),

        // Active upcoming events (max 3)
        supabase
          .from('events')
          .select('id, title, description, date, location, image, category, seats_available, is_active')
          .eq('is_active', true)
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(3),
      ]);

      if (programsRes.error) throw programsRes.error;
      if (postsRes.error)    throw postsRes.error;
      if (eventsRes.error)   throw eventsRes.error;

      setPrograms(programsRes.data || []);
      setPosts(postsRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (err) {
      console.error('Error fetching home page data:', err);
      // Fail silently — page still renders with empty sections
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="overflow-hidden">

      {/* ======================================================
          HERO SECTION — static, no DB dependency
      ====================================================== */}
      <section className="relative min-h-screen flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/6646855/pexels-photo-6646855.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Making a Difference Since 2015</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-serif leading-tight mb-6">
              Together We
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                {' '}Rise
              </span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-8 max-w-2xl">
              Empowering underprivileged communities through education, healthcare,
              and sustainable development. Every contribution creates lasting change.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/donate"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/40 group"
              >
                <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                <span>Donate Now</span>
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur border border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 group"
              >
                <span>Our Programs</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { value: '50K+', label: 'Lives Impacted' },
                { value: '$2M+', label: 'Funds Raised'   },
                { value: '30+',  label: 'Countries'      },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-green-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ======================================================
          STATS SECTION — static numbers
      ====================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 font-serif mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every number represents a life changed, a community strengthened,
              and a future brightened through collective action.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <CountUpStat end={50000} suffix="+" label="Lives Impacted"   icon={<Users className="w-7 h-7" />}  />
            <CountUpStat end={30}    suffix="+" label="Countries Reached" icon={<Globe className="w-7 h-7" />}  />
            <CountUpStat end={120}   suffix="+" label="Active Volunteers" icon={<Heart className="w-7 h-7" />}  />
            <CountUpStat end={15}    suffix="+" label="Awards Received"   icon={<Award className="w-7 h-7" />}  />
          </div>
        </div>
      </section>

      {/* ======================================================
          MISSION SECTION — static content
      ====================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/6646864/pexels-photo-6646864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=700"
                  alt="Volunteers at work"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">98% Fund Utilization</p>
                    <p className="text-gray-500 text-xs">Directly to programs</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: '98%' }}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                Our Mission
              </div>
              <h2 className="text-4xl font-bold text-gray-900 font-serif mb-6 leading-tight">
                Committed to Creating Lasting Change
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At HopeRise Foundation, we believe that every person deserves access to
                quality education, healthcare, and economic opportunities. We work
                tirelessly to bridge the gap between privilege and poverty through
                sustainable programs.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { title: 'Education First',         desc: 'Scholarships and mentorship for 5,000+ children annually'          },
                  { title: 'Healthcare Access',        desc: 'Mobile clinics serving 12,000+ patients in remote areas'          },
                  { title: 'Sustainable Development',  desc: 'Environmental and economic empowerment programs'                   },
                ].map(item => (
                  <div key={item.title} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900">{item.title}: </span>
                      <span className="text-gray-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700 group"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          PROGRAMS SECTION — dynamic from Supabase
      ====================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                Our Programs
              </div>
              <h2 className="text-4xl font-bold text-gray-900 font-serif">
                Transforming Communities
              </h2>
            </div>
            <Link
              to="/programs"
              className="hidden md:flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700 group"
            >
              <span>View All Programs</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProgramCardSkeleton key={i} />
              ))}
            </div>
          ) : programs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {programs.map(program => (
                <div
                  key={program.id}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/600x300?text=Program';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        categoryColors[program.category] || 'bg-gray-100 text-gray-700'
                      }`}>
                        {categoryLabels[program.category] || program.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {program.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">📍 {program.location}</span>
                      <span className="text-green-600 font-semibold">
                        {program.beneficiaries.toLocaleString()} beneficiaries
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        to="/programs"
                        className="flex items-center space-x-2 text-green-600 text-sm font-semibold hover:text-green-700 group/link"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-gray-500">Programs coming soon.</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/programs"
              className="inline-flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700"
            >
              <span>View All Programs</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA BANNER — static
      ====================================================== */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm mb-6">
            <Play className="w-4 h-4 fill-white" />
            <span>Watch Our Story</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-6">
            Your Generosity Changes Lives
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            $50 provides school supplies for a child. $100 feeds a family for a month.
            $500 provides medical care for 10 people. Every dollar makes a difference.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/donate"
              className="px-8 py-4 bg-white text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
            >
              Make a Donation
            </Link>
            <Link
              to="/volunteer"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          EVENTS SECTION — dynamic from Supabase
      ====================================================== */}
      {(loading || events.length > 0) && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                  Upcoming Events
                </div>
                <h2 className="text-4xl font-bold text-gray-900 font-serif">
                  Join Our Next Events
                </h2>
              </div>
              <Link
                to="/events"
                className="hidden md:flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700 group"
              >
                <span>View All Events</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {events.map(event => (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/600x300?text=Event';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-xl px-3 py-2 text-center shadow-md">
                        <div className="text-lg font-bold text-gray-900">
                          {format(new Date(event.date), 'dd')}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">
                          {format(new Date(event.date), 'MMM')}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {eventCategoryLabels[event.category] || event.category}
                      </span>
                      <h3 className="font-bold text-gray-900 mt-3 mb-2 group-hover:text-green-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>📍 {event.location.split(',')[0]}</span>
                        <span
                          className={`font-medium ${
                            event.seats_available <= 10
                              ? 'text-red-500'
                              : 'text-green-600'
                          }`}
                        >
                          {event.seats_available} seats left
                        </span>
                      </div>
                      <Link
                        to="/events"
                        className="mt-4 block w-full text-center py-2.5 bg-green-50 text-green-600 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
                      >
                        Register Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ======================================================
          BLOG SECTION — dynamic from Supabase
      ====================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                Latest News
              </div>
              <h2 className="text-4xl font-bold text-gray-900 font-serif">
                Stories of Impact
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden md:flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700 group"
            >
              <span>Read All Stories</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map(post => (
                <article key={post.id} className="group">
                  <div className="rounded-2xl overflow-hidden mb-5 h-52 bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/600x300?text=Blog';
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {blogCategoryLabels[post.category] || post.category}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-green-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-gray-500 text-xs">By {post.author}</span>
                      <Link
                        to="/blog"
                        className="text-green-600 text-sm font-semibold hover:text-green-700 flex items-center space-x-1 group/link"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="text-4xl mb-3">📰</div>
              <p className="text-gray-500">No stories published yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
          PARTNERS — static
      ====================================================== */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm mb-10 uppercase tracking-widest font-medium">
            Trusted Partners & Supporters
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-50">
            {['UNICEF', 'WHO', 'World Bank', 'USAID', 'Gates Foundation', 'Oxfam'].map(p => (
              <div key={p} className="text-2xl font-bold text-gray-400">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          TESTIMONIALS — static
      ====================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Testimonials
            </div>
            <h2 className="text-4xl font-bold text-gray-900 font-serif">
              What People Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name:   'Maria Santos',
                role:   'Scholarship Recipient',
                text:   "HopeRise's scholarship changed my life. I'm now the first in my family to attend university. Their support went beyond just financial help—they mentored me every step of the way.",
                avatar: '👩‍🎓',
              },
              {
                name:   'Dr. Ahmed Hassan',
                role:   'Healthcare Volunteer',
                text:   "Volunteering with HopeRise's mobile clinic program has been the most rewarding experience of my career. We've brought essential healthcare to thousands who had none.",
                avatar: '👨‍⚕️',
              },
              {
                name:   'Jennifer Cole',
                role:   'Monthly Donor',
                text:   "I donate monthly and the transparency I receive about how my money is used gives me complete confidence. The impact reports are detailed and moving. This is an organization I trust completely.",
                avatar: '👩‍💼',
              },
            ].map(t => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-8 relative">
                <div className="text-4xl text-green-300 mb-4">"</div>
                <p className="text-gray-700 leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-gray-500 text-sm">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;