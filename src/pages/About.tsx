


import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Eye, Award, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin: string | null;
  sort_order: number;
}

interface Milestone {
  id: string;
  year: string;
  event: string;
  sort_order: number;
}

// ============================================================
// STATIC DATA (no DB needed)
// ============================================================

const missionCards = [
  {
    icon: Target,
    color: 'green',
    title: 'Our Mission',
    text: 'To empower underprivileged communities through education, healthcare, and sustainable development, creating pathways out of poverty for individuals and families worldwide.',
  },
  {
    icon: Eye,
    color: 'blue',
    title: 'Our Vision',
    text: 'A world where every person, regardless of their background, has access to quality education, healthcare, clean water, and economic opportunities.',
  },
  {
    icon: Heart,
    color: 'red',
    title: 'Our Values',
    text: 'Compassion, transparency, accountability, community ownership, and sustainable impact guide every program we implement and every dollar we spend.',
  },
];

const storyStats = [
  { value: '$2M+', label: 'Total Funds Raised'    },
  { value: '95%',  label: 'Accountability Rating' },
  { value: '30+',  label: 'Partner Organizations' },
  { value: '10',   label: 'Years of Service'      },
];

const financialBreakdown = [
  { category: 'Direct Programs',  percentage: 78, color: 'bg-green-500'  },
  { category: 'Program Support',  percentage: 12, color: 'bg-blue-500'   },
  { category: 'Fundraising',      percentage: 7,  color: 'bg-orange-500' },
  { category: 'Administration',   percentage: 3,  color: 'bg-gray-400'   },
];

const financialHighlights = [
  { label: 'Total Revenue (2024)',    value: '$2.1 Million'     },
  { label: 'Program Expenses',        value: '$1.64 Million'    },
  { label: 'Overhead Ratio',          value: 'Only 10%'         },
  { label: 'Charity Navigator Rating', value: '4 Stars ⭐⭐⭐⭐' },
  { label: 'GuideStar Platinum Seal', value: '✅ Certified'     },
];

// ============================================================
// COLOR HELPERS
// ============================================================

const missionCardColors: Record<string, {
  border: string; bg: string; iconBg: string; iconText: string;
}> = {
  green: {
    border:   'border-green-500',
    bg:       'bg-green-50',
    iconBg:   'bg-green-100',
    iconText: 'text-green-600',
  },
  blue: {
    border:   'border-blue-500',
    bg:       'bg-blue-50',
    iconBg:   'bg-blue-100',
    iconText: 'text-blue-600',
  },
  red: {
    border:   'border-red-500',
    bg:       'bg-red-50',
    iconBg:   'bg-red-100',
    iconText: 'text-red-600',
  },
};

// ============================================================
// SKELETON LOADERS
// ============================================================

const TeamSkeleton: React.FC = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="w-20 h-20 bg-gray-200 rounded-2xl mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    ))}
  </div>
);

const MilestoneSkeleton: React.FC = () => (
  <div className="space-y-8">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-start space-x-6 animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 bg-gray-100 rounded-xl p-5">
          <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
    ))}
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const About: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingMilestones, setLoadingMilestones] = useState(true);

  // ============================================================
  // FETCH TEAM MEMBERS
  // ============================================================
  const fetchTeam = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, name, role, bio, avatar, linkedin, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTeam(data || []);
    } catch (err) {
      console.error('Error fetching team:', err);
      // Fail silently — page still renders with other content
    } finally {
      setLoadingTeam(false);
    }
  }, []);

  // ============================================================
  // FETCH MILESTONES
  // ============================================================
  const fetchMilestones = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('id, year, event, sort_order')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch (err) {
      console.error('Error fetching milestones:', err);
    } finally {
      setLoadingMilestones(false);
    }
  }, []);

  useEffect(() => {
    // Fetch in parallel
    fetchTeam();
    fetchMilestones();
  }, [fetchTeam, fetchMilestones]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen">

      {/* ======================================================
          HERO
      ====================================================== */}
      <section className="relative py-32 bg-gradient-to-br from-green-900 via-emerald-800 to-green-700">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/6646952/pexels-photo-6646952.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=1200')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            About HopeRise Foundation
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-serif mb-6">
            Our Story of<br />Compassion & Change
          </h1>
          <p className="text-green-100 text-xl max-w-3xl mx-auto">
            Founded in 2015, HopeRise Foundation has been at the forefront of empowering
            communities through innovative, sustainable programs that address root causes of
            poverty and inequality.
          </p>
        </div>
      </section>

      {/* ======================================================
          MISSION / VISION / VALUES
      ====================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {missionCards.map(({ icon: Icon, color, title, text }) => {
              const c = missionCardColors[color];
              return (
                <div key={title} className={`rounded-2xl p-8 border-t-4 ${c.border} ${c.bg}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${c.iconBg}`}>
                    <Icon className={`w-7 h-7 ${c.iconText}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          OUR STORY
      ====================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                Our Story
              </div>
              <h2 className="text-4xl font-bold text-gray-900 font-serif mb-6">
                Born from a Desire to Create Real Change
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                HopeRise Foundation was born from a simple belief: that access to education,
                healthcare, and economic opportunities should not be determined by the
                circumstances of one's birth. Our founder, Dr. Grace Okonkwo, witnessed firsthand
                the devastating effects of poverty during her work in Sub-Saharan Africa.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Starting with a small scholarship program in rural Nigeria, HopeRise has grown into
                a global organization operating in 30+ countries, with programs that have touched
                over 50,000 lives. We work not just to provide aid, but to create sustainable
                pathways to self-sufficiency.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our approach is community-centered: we work alongside local leaders, understand
                local needs, and implement solutions that communities can maintain long after our
                initial support.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {storyStats.map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <img
                src="https://images.pexels.com/photos/6646884/pexels-photo-6646884.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=350&w=600"
                alt="Our team in action"
                className="rounded-2xl shadow-xl w-full h-72 object-cover"
              />
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.pexels.com/photos/6646952/pexels-photo-6646952.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=300"
                  alt="Community work"
                  className="rounded-xl shadow-md w-full h-44 object-cover"
                />
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 flex flex-col justify-center">
                  <Award className="w-10 h-10 text-white mb-3" />
                  <div className="text-white font-bold text-xl">15+</div>
                  <div className="text-green-100 text-sm">International Awards & Recognition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          FINANCIAL TRANSPARENCY
      ====================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Financial Transparency
            </div>
            <h2 className="text-4xl font-bold text-gray-900 font-serif mb-4">
              How We Use Your Donations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are committed to full financial transparency. Here's how every dollar donated is utilized.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            {/* Progress Bars */}
            <div className="space-y-5">
              {financialBreakdown.map(item => (
                <div key={item.category}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <span className="font-bold text-gray-700">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`${item.color} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Annual Financial Highlights
              </h3>
              <div className="space-y-0">
                {financialHighlights.map(item => (
                  <div
                    key={item.label}
                    className="flex justify-between py-3 border-b border-gray-200 last:border-0"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
              <a
                href="#"
                className="mt-6 block w-full text-center py-3 bg-green-50 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition-colors"
              >
                Download Annual Report 2024
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          TEAM — Dynamic from Supabase
      ====================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Leadership Team
            </div>
            <h2 className="text-4xl font-bold text-gray-900 font-serif">
              Meet Our Dedicated Team
            </h2>
          </div>

          {loadingTeam ? (
            <TeamSkeleton />
          ) : team.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map(member => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:bg-green-500 transition-colors">
                    {member.avatar}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                  <p className="text-green-600 text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                  {member.linkedin && member.linkedin !== '#' && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-xs text-blue-600 hover:underline"
                    >
                      LinkedIn →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">👥</div>
              <p className="text-gray-500">Team information coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
          TIMELINE — Dynamic from Supabase
      ====================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Our Journey
            </div>
            <h2 className="text-4xl font-bold text-gray-900 font-serif">
              Milestones & Achievements
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-100" />

            {loadingMilestones ? (
              <MilestoneSkeleton />
            ) : milestones.length > 0 ? (
              <div className="space-y-8">
                {milestones.map(m => (
                  <div key={m.id} className="flex items-start space-x-6 group">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-white border-4 border-green-200 group-hover:border-green-500 rounded-full flex items-center justify-center font-bold text-green-700 transition-colors z-10 relative">
                        {m.year.slice(2)}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 flex-1 group-hover:bg-green-50 transition-colors">
                      <div className="text-green-700 font-bold text-sm mb-1">{m.year}</div>
                      <p className="text-gray-700">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-gray-500">Milestones coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA
      ====================================================== */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-serif mb-4">
            Ready to Join Our Mission?
          </h2>
          <p className="text-green-100 mb-8">
            Whether you donate, volunteer, or spread the word, your support makes a difference.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/donate"
              className="px-8 py-3 bg-white text-green-700 rounded-xl font-bold hover:bg-green-50 transition-colors"
            >
              Donate Today
            </Link>
            <Link
              to="/volunteer"
              className="px-8 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
            >
              Volunteer With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;