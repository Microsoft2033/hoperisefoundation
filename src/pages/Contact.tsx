// import React, { useState } from 'react';
// import { Mail, Phone, MapPin, Clock, CheckCircle, MessageSquare } from 'lucide-react';
// import { db } from '../lib/mockDb';
// import toast from 'react-hot-toast';

// const Contact: React.FC = () => {
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await new Promise(r => setTimeout(r, 1500));
//       db.messages.create({ ...form, status: 'unread' });
//       setSubmitted(true);
//       toast.success('Message sent successfully!');
//     } catch {
//       toast.error('Failed to send message. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const faqs = [
//     { q: 'How do I know my donation is used effectively?', a: "We publish annual reports with detailed financial breakdowns. Over 78% of funds go directly to programs. We're rated 4 stars by Charity Navigator." },
//     { q: 'Can I donate in memory of someone?', a: 'Yes! We accept memorial donations. During checkout, mention the name in the message field and we\'ll send a acknowledgment to the family.' },
//     { q: 'Are donations tax-deductible?', a: 'Yes. HopeRise Foundation is a 501(c)(3) organization. All donations are tax-deductible to the extent allowed by law. You\'ll receive a receipt via email.' },
//     { q: 'How can I volunteer internationally?', a: 'We have international volunteer opportunities. Apply through our Volunteer page specifying your preference for international programs. Orientation and preparation support is provided.' },
//     { q: 'Can my company partner with HopeRise?', a: 'Absolutely! We welcome corporate partnerships through CSR programs, matching gifts, employee volunteer days, and sponsorships. Contact us for a partnership proposal.' },
//     { q: 'How can I share my skills as a pro-bono volunteer?', a: 'We welcome professionals who can offer legal, medical, tech, financial, or marketing expertise. Apply via the Volunteer page and select your area of expertise.' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero */}
//       <section className="bg-gradient-to-br from-indigo-800 to-blue-700 py-28 pt-36">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <MessageSquare className="w-14 h-14 text-white mx-auto mb-4" />
//           <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">Get in Touch</h1>
//           <p className="text-indigo-100 text-lg max-w-2xl mx-auto">Have questions or want to get involved? We'd love to hear from you. Our team typically responds within 24-48 hours.</p>
//         </div>
//       </section>

//       {/* Contact Info Cards */}
//       <section className="py-12 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { icon: <Phone className="w-6 h-6" />, title: 'Phone', lines: ['+1 (212) 555-0100', '+1 (800) 467-3747'], color: 'text-green-600 bg-green-50' },
//               { icon: <Mail className="w-6 h-6" />, title: 'Email', lines: ['info@hoperise.org', 'donations@hoperise.org'], color: 'text-blue-600 bg-blue-50' },
//               { icon: <MapPin className="w-6 h-6" />, title: 'Address', lines: ['123 Hope Street,', 'New York, NY 10001'], color: 'text-red-600 bg-red-50' },
//               { icon: <Clock className="w-6 h-6" />, title: 'Office Hours', lines: ['Mon–Fri: 9am – 6pm EST', 'Sat: 10am – 2pm EST'], color: 'text-purple-600 bg-purple-50' },
//             ].map((card) => (
//               <div key={card.title} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
//                 <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>{card.icon}</div>
//                 <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
//                 {card.lines.map((line, i) => <p key={i} className="text-gray-600 text-sm">{line}</p>)}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Form + Map */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12">
//             {/* Form */}
//             <div>
//               <div className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">Send Us a Message</div>
//               <h2 className="text-3xl font-bold text-gray-900 font-serif mb-6">We'd Love to Hear From You</h2>
//               {submitted ? (
//                 <div className="bg-green-50 rounded-2xl p-10 text-center">
//                   <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                   <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h3>
//                   <p className="text-gray-600 mb-6">Thank you for reaching out, {form.name}. We'll get back to you at {form.email} within 24-48 hours.</p>
//                   <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors">
//                     Send Another Message
//                   </button>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
//                   <div className="grid md:grid-cols-2 gap-5">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
//                       <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none" placeholder="John Doe" />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
//                       <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none" placeholder="john@example.com" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
//                     <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none">
//                       <option value="">Select a subject</option>
//                       <option value="General Inquiry">General Inquiry</option>
//                       <option value="Donation Question">Donation Question</option>
//                       <option value="Volunteer Inquiry">Volunteer Inquiry</option>
//                       <option value="Partnership Inquiry">Partnership Inquiry</option>
//                       <option value="Media & Press">Media & Press</option>
//                       <option value="Report an Issue">Report an Issue</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
//                     <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={6} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none" placeholder="Tell us how we can help..." />
//                   </div>
//                   <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70">
//                     {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Sending...</span></> : <><Mail className="w-5 h-5" /><span>Send Message</span></>}
//                   </button>
//                 </form>
//               )}
//             </div>

//             {/* Map & Info */}
//             <div className="space-y-6">
//               <div>
//                 <div className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">Our Location</div>
//                 <h2 className="text-3xl font-bold text-gray-900 font-serif mb-6">Visit Our Office</h2>
//               </div>
//               {/* Map Placeholder */}
//               <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden shadow-inner">
//                 <div className="text-center z-10">
//                   <MapPin className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
//                   <p className="font-bold text-gray-700">HopeRise Foundation HQ</p>
//                   <p className="text-gray-600 text-sm">123 Hope Street, New York, NY 10001</p>
//                 </div>
//                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
//               </div>
//               {/* Office Locations */}
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <h3 className="font-bold text-gray-900 mb-4">Regional Offices</h3>
//                 <div className="space-y-4">
//                   {[
//                     { city: 'New York (HQ)', address: '123 Hope Street, NY 10001', phone: '+1 (212) 555-0100' },
//                     { city: 'Nairobi', address: '45 Ubuntu Avenue, Westlands', phone: '+254 20 555 0200' },
//                     { city: 'Mumbai', address: '7 Seva Marg, Bandra West', phone: '+91 22 555 0300' },
//                     { city: 'London', address: '22 Charity Lane, London EC1A', phone: '+44 20 555 0400' },
//                   ].map((office) => (
//                     <div key={office.city} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
//                       <MapPin className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <div className="font-semibold text-gray-900 text-sm">{office.city}</div>
//                         <div className="text-gray-500 text-xs">{office.address}</div>
//                         <div className="text-indigo-600 text-xs">{office.phone}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FAQ */}
//       <section className="py-16 bg-white">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <div className="inline-block bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">FAQ</div>
//             <h2 className="text-3xl font-bold text-gray-900 font-serif">Frequently Asked Questions</h2>
//           </div>
//           <div className="space-y-4">
//             {faqs.map((faq, idx) => (
//               <details key={idx} className="bg-gray-50 rounded-2xl group">
//                 <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900 hover:text-indigo-600 transition-colors list-none">
//                   <span>{faq.q}</span>
//                   <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl">⌄</span>
//                 </summary>
//                 <div className="px-6 pb-6">
//                   <p className="text-gray-600 leading-relaxed">{faq.a}</p>
//                 </div>
//               </details>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Contact;

import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Clock,
  CheckCircle, MessageSquare, Loader2, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const emptyForm: ContactForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const contactCards = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Phone',
    lines: ['+1 (212) 555-0100', '+1 (800) 467-3747'],
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email',
    lines: ['info@hoperise.org', 'donations@hoperise.org'],
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Address',
    lines: ['123 Hope Street,', 'New York, NY 10001'],
    color: 'text-red-600 bg-red-50',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Office Hours',
    lines: ['Mon–Fri: 9am – 6pm EST', 'Sat: 10am – 2pm EST'],
    color: 'text-purple-600 bg-purple-50',
  },
];

const regionalOffices = [
  {
    city:    'New York (HQ)',
    address: '123 Hope Street, NY 10001',
    phone:   '+1 (212) 555-0100',
  },
  {
    city:    'Nairobi',
    address: '45 Ubuntu Avenue, Westlands',
    phone:   '+254 20 555 0200',
  },
  {
    city:    'Mumbai',
    address: '7 Seva Marg, Bandra West',
    phone:   '+91 22 555 0300',
  },
  {
    city:    'London',
    address: '22 Charity Lane, London EC1A',
    phone:   '+44 20 555 0400',
  },
];

const faqs = [
  {
    q: 'How do I know my donation is used effectively?',
    a: "We publish annual reports with detailed financial breakdowns. Over 78% of funds go directly to programs. We're rated 4 stars by Charity Navigator.",
  },
  {
    q: 'Can I donate in memory of someone?',
    a: "Yes! We accept memorial donations. During checkout, mention the name in the message field and we'll send an acknowledgment to the family.",
  },
  {
    q: 'Are donations tax-deductible?',
    a: "Yes. HopeRise Foundation is a 501(c)(3) organization. All donations are tax-deductible to the extent allowed by law. You'll receive a receipt via email.",
  },
  {
    q: 'How can I volunteer internationally?',
    a: 'We have international volunteer opportunities. Apply through our Volunteer page specifying your preference for international programs. Orientation and preparation support is provided.',
  },
  {
    q: 'Can my company partner with HopeRise?',
    a: 'Absolutely! We welcome corporate partnerships through CSR programs, matching gifts, employee volunteer days, and sponsorships. Contact us for a partnership proposal.',
  },
  {
    q: 'How can I share my skills as a pro-bono volunteer?',
    a: 'We welcome professionals who can offer legal, medical, tech, financial, or marketing expertise. Apply via the Volunteer page and select your area of expertise.',
  },
];

// ============================================================
// FAQ ACCORDION ITEM
// ============================================================

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
      >
        <span>{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================
// SUCCESS STATE
// ============================================================

const SuccessState: React.FC<{
  name: string;
  email: string;
  onReset: () => void;
}> = ({ name, email, onReset }) => (
  <div className="bg-green-50 rounded-2xl p-10 text-center border border-green-100">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle className="w-10 h-10 text-green-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h3>
    <p className="text-gray-600 mb-2">
      Thank you for reaching out,{' '}
      <span className="font-semibold text-gray-800">{name}</span>.
    </p>
    <p className="text-gray-500 text-sm mb-8">
      We'll get back to you at{' '}
      <span className="font-medium text-indigo-600">{email}</span>{' '}
      within 24–48 hours.
    </p>
    <button
      onClick={onReset}
      className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
    >
      Send Another Message
    </button>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ContactForm>(emptyForm);

  // ============================================================
  // SUBMIT FORM → SUPABASE
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name:    form.name.trim(),
            email:   form.email.trim().toLowerCase(),
            subject: form.subject,
            message: form.message.trim(),
            status:  'unread',
          },
        ]);

      if (error) throw error;

      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (err: any) {
      console.error('Error sending message:', err);
      toast.error(
        err.message || 'Failed to send message. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESET FORM
  // ============================================================
  const handleReset = () => {
    setSubmitted(false);
    setForm(emptyForm);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-800 to-blue-700 py-28 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageSquare className="w-14 h-14 text-white mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Get in Touch
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Have questions or want to get involved? We'd love to hear from you.
            Our team typically responds within 24–48 hours.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map(card => (
              <div
                key={card.title}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                {card.lines.map((line, i) => (
                  <p key={i} className="text-gray-600 text-sm">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* ------------------------------------------------ */}
            {/* CONTACT FORM                                      */}
            {/* ------------------------------------------------ */}
            <div>
              <div className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                Send Us a Message
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-6">
                We'd Love to Hear From You
              </h2>

              {submitted ? (
                <SuccessState
                  name={form.name}
                  email={form.email}
                  onReset={handleReset}
                />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                  {/* Name + Email */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                        placeholder="John Doe"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                        placeholder="john@example.com"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                      disabled={loading}
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Donation Question">Donation Question</option>
                      <option value="Volunteer Inquiry">Volunteer Inquiry</option>
                      <option value="Partnership Inquiry">Partnership Inquiry</option>
                      <option value="Media & Press">Media & Press</option>
                      <option value="Report an Issue">Report an Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none transition-colors"
                      placeholder="Tell us how we can help..."
                      disabled={loading}
                    />
                    {/* Character count */}
                    <p className="text-xs text-gray-400 text-right mt-1">
                      {form.message.length} characters
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {/* Privacy Note */}
                  <p className="text-xs text-gray-400 text-center">
                    🔒 Your information is safe with us. We never share your data with third parties.
                  </p>
                </form>
              )}
            </div>

            {/* ------------------------------------------------ */}
            {/* MAP + OFFICES                                     */}
            {/* ------------------------------------------------ */}
            <div className="space-y-6">
              <div>
                <div className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                  Our Location
                </div>
                <h2 className="text-3xl font-bold text-gray-900 font-serif mb-6">
                  Visit Our Office
                </h2>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden shadow-inner">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="text-center z-10">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                    <MapPin className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="font-bold text-gray-800">HopeRise Foundation HQ</p>
                  <p className="text-gray-600 text-sm">123 Hope Street, New York, NY 10001</p>
                  <a
                    href="https://maps.google.com/?q=123+Hope+Street+New+York+NY+10001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs text-indigo-600 font-semibold hover:text-indigo-800 underline"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              {/* Regional Offices */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Regional Offices</h3>
                <div className="space-y-4">
                  {regionalOffices.map(office => (
                    <div
                      key={office.city}
                      className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {office.city}
                        </div>
                        <div className="text-gray-500 text-xs">{office.address}</div>
                        <div className="text-indigo-600 text-xs font-medium mt-0.5">
                          {office.phone}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Time Banner */}
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Quick Response Guarantee</h3>
                </div>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  We aim to respond to all inquiries within{' '}
                  <strong className="text-white">24–48 hours</strong> on business days.
                  For urgent matters, call us directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              FAQ
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-serif">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-sm mt-3">
              Can't find your answer?{' '}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Send us a message ↑
              </button>
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FaqItem key={idx} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;