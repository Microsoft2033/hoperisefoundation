// import React, { useState } from 'react';
// import { Database, Shield, Bell, Globe } from 'lucide-react';
// import toast from 'react-hot-toast';

// const AdminSettings: React.FC = () => {
//   const [orgName, setOrgName] = useState('HopeRise Foundation');
//   const [orgEmail, setOrgEmail] = useState('info@hoperise.org');
//   const [orgPhone, setOrgPhone] = useState('+1 (212) 555-0100');
//   const [donationCurrency, setDonationCurrency] = useState('USD');
//   const [emailNotifications, setEmailNotifications] = useState(true);
//   const [donationAlerts, setDonationAlerts] = useState(true);
//   const [volunteerAlerts, setVolunteerAlerts] = useState(true);

//   const handleSave = () => {
//     toast.success('Settings saved successfully!');
//   };

//   const handleResetDb = () => {
//     if (window.confirm('This will reset all demo data. Are you sure?')) {
//       localStorage.removeItem('ngo_initialized');
//       localStorage.removeItem('ngo_donors');
//       localStorage.removeItem('ngo_volunteers');
//       localStorage.removeItem('ngo_newsletter');
//       localStorage.removeItem('ngo_messages');
//       localStorage.removeItem('ngo_events');
//       localStorage.removeItem('ngo_event_registrations');
//       localStorage.removeItem('ngo_programs');
//       localStorage.removeItem('ngo_blog_posts');
//       toast.success('Database reset! Refresh the page to reinitialize.');
//     }
//   };

//   return (
//     <div className="p-6 space-y-6 max-w-3xl">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
//         <p className="text-gray-500 text-sm">Manage your organization settings and preferences</p>
//       </div>

//       {/* Organization Settings */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center space-x-3 mb-6">
//           <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Globe className="w-5 h-5 text-blue-600" /></div>
//           <div><h2 className="font-bold text-gray-900">Organization Information</h2><p className="text-gray-500 text-xs">Update your organization details</p></div>
//         </div>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name</label>
//             <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
//               <input type="email" value={orgEmail} onChange={e => setOrgEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
//               <input type="tel" value={orgPhone} onChange={e => setOrgPhone(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Default Donation Currency</label>
//             <select value={donationCurrency} onChange={e => setDonationCurrency(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none">
//               <option value="USD">USD - US Dollar</option>
//               <option value="EUR">EUR - Euro</option>
//               <option value="GBP">GBP - British Pound</option>
//               <option value="KES">KES - Kenyan Shilling</option>
//               <option value="NGN">NGN - Nigerian Naira</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Notifications */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center space-x-3 mb-6">
//           <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center"><Bell className="w-5 h-5 text-orange-600" /></div>
//           <div><h2 className="font-bold text-gray-900">Notification Preferences</h2><p className="text-gray-500 text-xs">Configure when you receive alerts</p></div>
//         </div>
//         <div className="space-y-4">
//           {[
//             { label: 'Email Notifications', desc: 'Receive email alerts for important updates', value: emailNotifications, setter: setEmailNotifications },
//             { label: 'Donation Alerts', desc: 'Get notified when a new donation is received', value: donationAlerts, setter: setDonationAlerts },
//             { label: 'Volunteer Application Alerts', desc: 'Get notified for new volunteer applications', value: volunteerAlerts, setter: setVolunteerAlerts },
//           ].map(({ label, desc, value, setter }) => (
//             <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//               <div>
//                 <p className="font-medium text-gray-900 text-sm">{label}</p>
//                 <p className="text-gray-500 text-xs">{desc}</p>
//               </div>
//               <button onClick={() => setter(!value)} className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-gray-300'}`}>
//                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`}></div>
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Database Info */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center space-x-3 mb-6">
//           <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><Database className="w-5 h-5 text-green-600" /></div>
//           <div><h2 className="font-bold text-gray-900">Database Configuration</h2><p className="text-gray-500 text-xs">Database connection and storage settings</p></div>
//         </div>
//         <div className="space-y-3">
//           <div className="flex justify-between py-3 border-b border-gray-100">
//             <span className="text-gray-500 text-sm">Database Type</span>
//             <span className="font-medium text-gray-900 text-sm">LocalStorage (Demo)</span>
//           </div>
//           <div className="flex justify-between py-3 border-b border-gray-100">
//             <span className="text-gray-500 text-sm">Production DB</span>
//             <span className="font-medium text-gray-900 text-sm">Supabase PostgreSQL</span>
//           </div>
//           <div className="flex justify-between py-3 border-b border-gray-100">
//             <span className="text-gray-500 text-sm">Supabase URL</span>
//             <span className="font-medium text-gray-500 text-sm text-right">Set VITE_SUPABASE_URL in .env</span>
//           </div>
//           <div className="flex justify-between py-3">
//             <span className="text-gray-500 text-sm">Anon Key</span>
//             <span className="font-medium text-gray-500 text-sm">Set VITE_SUPABASE_ANON_KEY in .env</span>
//           </div>
//         </div>
//         <div className="mt-4 bg-blue-50 rounded-xl p-4">
//           <p className="text-blue-800 text-sm font-medium">💡 Production Setup</p>
//           <p className="text-blue-600 text-xs mt-1">Create a Supabase project and set the environment variables to switch from localStorage to PostgreSQL database persistence.</p>
//         </div>
//         <button onClick={handleResetDb} className="mt-4 w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors text-sm">
//           🔄 Reset Demo Data
//         </button>
//       </div>

//       {/* Security */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center space-x-3 mb-6">
//           <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-red-600" /></div>
//           <div><h2 className="font-bold text-gray-900">Security</h2><p className="text-gray-500 text-xs">Authentication and security settings</p></div>
//         </div>
//         <div className="space-y-3">
//           <div className="flex justify-between py-3 border-b border-gray-100">
//             <span className="text-gray-500 text-sm">Admin Email</span>
//             <span className="font-medium text-gray-900 text-sm">admin@hoperise.org</span>
//           </div>
//           <div className="flex justify-between py-3 border-b border-gray-100">
//             <span className="text-gray-500 text-sm">Default Password</span>
//             <span className="font-medium text-gray-500 text-sm">Admin@123 (Change in production)</span>
//           </div>
//         </div>
//       </div>

//       <button onClick={handleSave} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all">
//         💾 Save Settings
//       </button>
//     </div>
//   );
// };

// export default AdminSettings;

import React, { useState, useEffect, useCallback } from 'react';
import {
  Database, Shield, Bell, Globe,
  Loader2, Save, RefreshCw, User,
  Eye, EyeOff, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// ============================================================
// TYPES
// ============================================================

interface OrgSettings {
  id: string;
  org_name: string;
  org_email: string;
  org_phone: string;
  currency: string;
  email_notifications: boolean;
  donation_alerts: boolean;
  volunteer_alerts: boolean;
  updated_at: string;
}

interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// ============================================================
// TOGGLE COMPONENT
// ============================================================

const Toggle: React.FC<{
  value: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!value)}
    disabled={disabled}
    className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 ${
      value ? 'bg-green-500' : 'bg-gray-300'
    }`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
      value ? 'translate-x-7' : 'translate-x-1'
    }`} />
  </button>
);

// ============================================================
// SECTION HEADER COMPONENT
// ============================================================

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
}> = ({ icon, iconBg, title, subtitle }) => (
  <div className="flex items-center space-x-3 mb-6">
    <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <h2 className="font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 text-xs">{subtitle}</p>
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  // Organization Settings State
  const [settings, setSettings] = useState<OrgSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Admin Profile State
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password State
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Supabase Connection State
  const [dbStats, setDbStats] = useState({
    donors: 0,
    volunteers: 0,
    messages: 0,
    subscribers: 0,
  });

  // ============================================================
  // FETCH SETTINGS
  // ============================================================
  const fetchSettings = useCallback(async () => {
    try {
      setLoadingSettings(true);

      const [settingsRes, statsRes] = await Promise.all([
        supabase
          .from('organization_settings')
          .select('*')
          .single(),

        Promise.all([
          supabase.from('donors').select('id', { count: 'exact', head: true }),
          supabase.from('volunteers').select('id', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
          supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
        ]),
      ]);

      if (settingsRes.error) throw settingsRes.error;
      setSettings(settingsRes.data);

      const [donorsRes, volunteersRes, messagesRes, subsRes] = statsRes;
      setDbStats({
        donors:      donorsRes.count || 0,
        volunteers:  volunteersRes.count || 0,
        messages:    messagesRes.count || 0,
        subscribers: subsRes.count || 0,
      });
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      toast.error('Failed to load settings');
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    if (user) {
      setAdminName(user.name || '');
      setAdminEmail(user.email || '');
    }
  }, [fetchSettings, user]);

  // ============================================================
  // SAVE ORG SETTINGS
  // ============================================================
  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setSavingSettings(true);

      const { error } = await supabase
        .from('organization_settings')
        .update({
          org_name:            settings.org_name,
          org_email:           settings.org_email,
          org_phone:           settings.org_phone,
          currency:            settings.currency,
          email_notifications: settings.email_notifications,
          donation_alerts:     settings.donation_alerts,
          volunteer_alerts:    settings.volunteer_alerts,
        })
        .eq('id', settings.id);

      if (error) throw error;
      toast.success('Settings saved successfully!');
      await fetchSettings();
    } catch (err: any) {
      console.error('Error saving settings:', err);
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // ============================================================
  // UPDATE ADMIN PROFILE
  // ============================================================
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSavingProfile(true);

      // Update admin_users table
      const { error: profileError } = await supabase
        .from('admin_users')
        .update({ name: adminName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update email in Supabase Auth if changed
      if (adminEmail !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: adminEmail,
        });
        if (emailError) throw emailError;
        toast.success('Profile updated! Check your new email to confirm the change.');
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setChangingPassword(true);

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password,
      });

      if (error) throw error;

      toast.success('Password changed successfully!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err: any) {
      console.error('Error changing password:', err);
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  // ============================================================
  // UPDATE SETTINGS LOCAL STATE
  // ============================================================
  const updateSettings = (field: keyof OrgSettings, value: any) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : null);
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-6 space-y-6 max-w-3xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage your organization settings and preferences
        </p>
        {!isSuperAdmin && (
          <div className="mt-2 flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>
              You have <strong>read-only</strong> access. Only Super Admins can modify settings.
            </span>
          </div>
        )}
      </div>

      {/* Admin Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <SectionHeader
          icon={<User className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-100"
          title="My Profile"
          subtitle="Update your admin account information"
        />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
              user?.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
              user?.role === 'admin' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {user?.role?.replace('_', ' ')}
            </span>
            <span className="text-gray-400 text-xs">
              Member since {user ? 'Active' : '—'}
            </span>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-70 text-sm"
          >
            {savingProfile
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Save className="w-4 h-4" />
            }
            <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <SectionHeader
          icon={<Shield className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-100"
          title="Change Password"
          subtitle="Update your Supabase Auth password"
        />
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { key: 'new_password',     label: 'New Password',     show: showPasswords.new,     toggle: () => setShowPasswords(p => ({ ...p, new: !p.new }))     },
            { key: 'confirm_password', label: 'Confirm Password', show: showPasswords.confirm, toggle: () => setShowPasswords(p => ({ ...p, confirm: !p.confirm })) },
          ].map(({ key, label, show, toggle }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={passwordForm[key as keyof PasswordForm]}
                  onChange={e => setPasswordForm(prev => ({ ...prev, [key]: e.target.value }))}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          {/* Password Match Indicator */}
          {passwordForm.new_password && passwordForm.confirm_password && (
            <div className={`flex items-center gap-2 text-sm ${
              passwordForm.new_password === passwordForm.confirm_password
                ? 'text-green-600'
                : 'text-red-500'
            }`}>
              <CheckCircle className="w-4 h-4" />
              <span>
                {passwordForm.new_password === passwordForm.confirm_password
                  ? 'Passwords match'
                  : 'Passwords do not match'}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={
              changingPassword ||
              !passwordForm.new_password ||
              !passwordForm.confirm_password ||
              passwordForm.new_password !== passwordForm.confirm_password
            }
            className="flex items-center space-x-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-70 text-sm"
          >
            {changingPassword
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Shield className="w-4 h-4" />
            }
            <span>{changingPassword ? 'Changing...' : 'Change Password'}</span>
          </button>
        </form>
      </div>

      {/* Organization Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <SectionHeader
          icon={<Globe className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-100"
          title="Organization Information"
          subtitle="Update your organization details"
        />
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              value={settings?.org_name || ''}
              onChange={e => updateSettings('org_name', e.target.value)}
              disabled={!isSuperAdmin}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings?.org_email || ''}
                onChange={e => updateSettings('org_email', e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings?.org_phone || ''}
                onChange={e => updateSettings('org_phone', e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Default Donation Currency
            </label>
            <select
              value={settings?.currency || 'USD'}
              onChange={e => updateSettings('currency', e.target.value)}
              disabled={!isSuperAdmin}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="KES">KES — Kenyan Shilling</option>
              <option value="NGN">NGN — Nigerian Naira</option>
              <option value="ZAR">ZAR — South African Rand</option>
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="AUD">AUD — Australian Dollar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <SectionHeader
          icon={<Bell className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-100"
          title="Notification Preferences"
          subtitle="Configure when you receive alerts"
        />
        <div className="space-y-4">
          {[
            {
              key:   'email_notifications' as keyof OrgSettings,
              label: 'Email Notifications',
              desc:  'Receive email alerts for important updates',
            },
            {
              key:   'donation_alerts' as keyof OrgSettings,
              label: 'Donation Alerts',
              desc:  'Get notified when a new donation is received',
            },
            {
              key:   'volunteer_alerts' as keyof OrgSettings,
              label: 'Volunteer Application Alerts',
              desc:  'Get notified for new volunteer applications',
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 text-sm">{label}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
              <Toggle
                value={!!settings?.[key]}
                onChange={val => updateSettings(key, val)}
                disabled={!isSuperAdmin}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <SectionHeader
          icon={<Database className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-100"
          title="Database Configuration"
          subtitle="Supabase PostgreSQL connection details"
        />

        {/* Connection Status */}
        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-700 text-sm font-medium">
            Connected to Supabase PostgreSQL
          </span>
        </div>

        {/* DB Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Donors',      value: dbStats.donors      },
            { label: 'Volunteers',  value: dbStats.volunteers  },
            { label: 'Messages',    value: dbStats.messages    },
            { label: 'Subscribers', value: dbStats.subscribers },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-0">
          {[
            { label: 'Database',      value: 'Supabase PostgreSQL'                             },
            { label: 'Supabase URL',  value: import.meta.env.VITE_SUPABASE_URL
                                        ? '✅ Configured'
                                        : '❌ Not set (VITE_SUPABASE_URL)'                    },
            { label: 'Anon Key',      value: import.meta.env.VITE_SUPABASE_ANON_KEY
                                        ? '✅ Configured'
                                        : '❌ Not set (VITE_SUPABASE_ANON_KEY)'              },
            { label: 'Auth Provider', value: 'Supabase Auth (JWT)'                             },
            { label: 'Last Updated',  value: settings?.updated_at
                                        ? new Date(settings.updated_at).toLocaleString()
                                        : '—'                                                  },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="font-medium text-gray-900 text-sm text-right max-w-[55%]">
                {value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={fetchSettings}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm border border-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Connection
        </button>
      </div>

      {/* Save All Settings Button */}
      {isSuperAdmin && (
        <button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
        >
          {savingSettings ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving Settings...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save All Settings</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AdminSettings;