

import React, { useState } from 'react';
import {
  CheckCircle, Users, Clock, MapPin,
  Heart, Loader2, ArrowDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface VolunteerForm {
  name: string;
  email: string;
  phone: string;
  age: string;
  location: string;
  skills: string[];
  availability: string;
  program: string;
  motivation: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const emptyForm: VolunteerForm = {
  name: '',
  email: '',
  phone: '',
  age: '',
  location: '',
  skills: [],
  availability: '',
  program: '',
  motivation: '',
};

const SKILL_OPTIONS = [
  'Teaching/Tutoring', 'Medical/Nursing', 'IT/Technology',
  'Construction', 'Agriculture', 'Social Work',
  'Marketing', 'Finance', 'Languages',
  'Leadership', 'Photography', 'Cooking',
];

// Maps UI labels to DB ENUM values
const AVAILABILITY_OPTIONS = [
  { value: 'flexible',   label: 'Flexible / Anytime'       },
  { value: 'weekends',   label: 'Weekends Only'            },
  { value: 'weekdays',   label: 'Weekdays'                 },
  { value: 'evenings',   label: 'Evenings Only'            },
  { value: 'full-time',  label: 'Full-time'                },
];

const PROGRAM_OPTIONS = [
  'Education & Scholarships',
  'Healthcare Services',
  'Clean Water Initiative',
  'Women Empowerment',
  'Environmental Projects',
  'Digital Literacy',
  'Emergency Relief',
];

const OPPORTUNITIES = [
  { title: 'Education Mentor', program: 'Education', location: 'Multiple Locations', commitment: 'Weekends', spots: 25, skills: ['Teaching', 'Patience', 'Communication'] },
  { title: 'Healthcare Assistant', program: 'Healthcare', location: 'Rural Communities', commitment: 'Full-time', spots: 10, skills: ['Medical Background', 'First Aid'] },
  { title: 'Tech Instructor', program: 'Digital Literacy', location: 'Urban Areas', commitment: 'Part-time', spots: 15, skills: ['IT Skills', 'Teaching'] },
  { title: 'Field Coordinator', program: 'Water Initiative', location: 'Sub-Saharan Africa', commitment: 'Full-time', spots: 5, skills: ['Project Management', 'Engineering'] },
  { title: "Women's Empowerment Facilitator", program: 'Women Empowerment', location: 'South Asia', commitment: 'Part-time', spots: 12, skills: ['Social Work', 'Business'] },
  { title: 'Environmental Activist', program: 'Environment', location: 'Global', commitment: 'Flexible', spots: 50, skills: ['Passion for Environment', 'Outdoors'] },
];

// ============================================================
// SUCCESS STATE
// ============================================================

const SuccessState: React.FC<{
  name: string;
  email: string;
  onReset: () => void;
}> = ({ name, email, onReset }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 pt-20">
    <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <CheckCircle className="w-14 h-14 text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
        You're Amazing, {name}!
      </h2>
      <p className="text-gray-600 mb-6">
        Thank you for applying to volunteer with HopeRise Foundation.
        Your application has been received and is under review.
      </p>

      <div className="bg-green-50 rounded-2xl p-6 mb-8 text-left">
        <h3 className="font-semibold text-green-800 mb-3">What happens next?</h3>
        <div className="space-y-3">
          {[
            'Our team will review your application within 3–5 business days',
            `You'll receive an email with next steps and orientation details`,
            `A volunteer coordinator will contact you at ${email}`,
            'Complete your orientation and start making a difference!',
          ].map((step, i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-green-700 text-sm">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
      >
        Submit Another Application
      </button>
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const Volunteer: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<VolunteerForm>(emptyForm);

  // ============================================================
  // TOGGLE SKILL
  // ============================================================
  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  // ============================================================
  // SUBMIT → SUPABASE
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim() || !form.email.trim() || !form.program || !form.motivation.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    const ageNum = parseInt(form.age);
    if (form.age && (isNaN(ageNum) || ageNum < 16 || ageNum > 120)) {
      toast.error('Please enter a valid age (16–120)');
      return;
    }
    if (!form.availability) {
      toast.error('Please select your availability');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('volunteers').insert([
        {
          name:        form.name.trim(),
          email:       form.email.trim().toLowerCase(),
          phone:       form.phone.trim(),
          age:         ageNum || null,
          skills:      form.skills,
          availability: form.availability,
          program:     form.program,
          motivation:  form.motivation.trim(),
          status:      'pending',
          location:    form.location.trim() || 'Not specified',
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      toast.success('Application submitted successfully! 🎉');
    } catch (err: any) {
      console.error('Error submitting volunteer application:', err);
      toast.error(
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESET
  // ============================================================
  const handleReset = () => {
    setSubmitted(false);
    setForm(emptyForm);
  };

  // ============================================================
  // SUCCESS VIEW
  // ============================================================
  if (submitted) {
    return (
      <SuccessState
        name={form.name}
        email={form.email}
        onReset={handleReset}
      />
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-green-600 py-28 pt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-14 h-14 text-white mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Volunteer With Us
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Join our global community of changemakers. Your skills and time can
            transform lives and communities.
          </p>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
              Why Volunteer with HopeRise?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-7 h-7" />,
                title: 'Real Impact',
                desc: 'See the direct difference your efforts make in communities. Our volunteers help 50,000+ people annually.',
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: 'Global Community',
                desc: 'Join a network of 1,200+ volunteers from 45 countries united by a passion for positive change.',
              },
              {
                icon: <Clock className="w-7 h-7" />,
                title: 'Flexible Commitment',
                desc: 'Whether you have a few hours on weekends or can go full-time, we have opportunities for you.',
              },
            ].map(item => (
              <div key={item.title} className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
              Current Opportunities
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OPPORTUNITIES.map(opp => (
              <div
                key={opp.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {opp.program}
                  </span>
                  <span className="text-xs text-gray-500">{opp.spots} spots</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{opp.title}</h3>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{opp.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{opp.commitment}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {opp.skills.map(s => (
                    <span
                      key={s}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() =>
                    document
                      .getElementById('apply-form')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="w-full py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                >
                  Apply Now
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Apply Now
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-serif">
              Volunteer Application Form
            </h2>
            <p className="text-gray-500 mt-2">
              Fill in your details and we'll get back to you within 3–5 business days.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-gray-100"
          >
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Personal Information
              </h3>
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number{' '}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="+1 (555) 000-0000"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age{' '}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="120"
                    value={form.age}
                    onChange={e => setForm({ ...form, age: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="25"
                    disabled={loading}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location / City{' '}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="New York, USA"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Skills & Expertise{' '}
                <span className="text-gray-400 font-normal">(select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all disabled:opacity-50 ${
                      form.skills.includes(skill)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-600 hover:border-green-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability & Program */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Availability *
                </label>
                <select
                  required
                  value={form.availability}
                  onChange={e => setForm({ ...form, availability: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  disabled={loading}
                >
                  <option value="">Select availability</option>
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Program *
                </label>
                <select
                  required
                  value={form.program}
                  onChange={e => setForm({ ...form, program: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  disabled={loading}
                >
                  <option value="">Select a program</option>
                  {PROGRAM_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Why do you want to volunteer? *
              </label>
              <textarea
                required
                value={form.motivation}
                onChange={e => setForm({ ...form, motivation: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none transition-colors"
                placeholder="Share your motivation and what you hope to contribute..."
                disabled={loading}
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {form.motivation.length} characters
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 shadow-lg shadow-green-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-white" />
                  <span>Submit Application</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center -mt-2">
              🔒 Your information is secure and will only be used for volunteer coordination.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;