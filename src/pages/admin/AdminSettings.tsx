import React, { useState } from 'react';
import { Database, Shield, Bell, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings: React.FC = () => {
  const [orgName, setOrgName] = useState('HopeRise Foundation');
  const [orgEmail, setOrgEmail] = useState('info@hoperise.org');
  const [orgPhone, setOrgPhone] = useState('+1 (212) 555-0100');
  const [donationCurrency, setDonationCurrency] = useState('USD');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [donationAlerts, setDonationAlerts] = useState(true);
  const [volunteerAlerts, setVolunteerAlerts] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleResetDb = () => {
    if (window.confirm('This will reset all demo data. Are you sure?')) {
      localStorage.removeItem('ngo_initialized');
      localStorage.removeItem('ngo_donors');
      localStorage.removeItem('ngo_volunteers');
      localStorage.removeItem('ngo_newsletter');
      localStorage.removeItem('ngo_messages');
      localStorage.removeItem('ngo_events');
      localStorage.removeItem('ngo_event_registrations');
      localStorage.removeItem('ngo_programs');
      localStorage.removeItem('ngo_blog_posts');
      toast.success('Database reset! Refresh the page to reinitialize.');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your organization settings and preferences</p>
      </div>

      {/* Organization Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Globe className="w-5 h-5 text-blue-600" /></div>
          <div><h2 className="font-bold text-gray-900">Organization Information</h2><p className="text-gray-500 text-xs">Update your organization details</p></div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name</label>
            <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" value={orgEmail} onChange={e => setOrgEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input type="tel" value={orgPhone} onChange={e => setOrgPhone(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Default Donation Currency</label>
            <select value={donationCurrency} onChange={e => setDonationCurrency(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="NGN">NGN - Nigerian Naira</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center"><Bell className="w-5 h-5 text-orange-600" /></div>
          <div><h2 className="font-bold text-gray-900">Notification Preferences</h2><p className="text-gray-500 text-xs">Configure when you receive alerts</p></div>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Email Notifications', desc: 'Receive email alerts for important updates', value: emailNotifications, setter: setEmailNotifications },
            { label: 'Donation Alerts', desc: 'Get notified when a new donation is received', value: donationAlerts, setter: setDonationAlerts },
            { label: 'Volunteer Application Alerts', desc: 'Get notified for new volunteer applications', value: volunteerAlerts, setter: setVolunteerAlerts },
          ].map(({ label, desc, value, setter }) => (
            <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 text-sm">{label}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
              <button onClick={() => setter(!value)} className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><Database className="w-5 h-5 text-green-600" /></div>
          <div><h2 className="font-bold text-gray-900">Database Configuration</h2><p className="text-gray-500 text-xs">Database connection and storage settings</p></div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Database Type</span>
            <span className="font-medium text-gray-900 text-sm">LocalStorage (Demo)</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Production DB</span>
            <span className="font-medium text-gray-900 text-sm">Supabase PostgreSQL</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Supabase URL</span>
            <span className="font-medium text-gray-500 text-sm text-right">Set VITE_SUPABASE_URL in .env</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-500 text-sm">Anon Key</span>
            <span className="font-medium text-gray-500 text-sm">Set VITE_SUPABASE_ANON_KEY in .env</span>
          </div>
        </div>
        <div className="mt-4 bg-blue-50 rounded-xl p-4">
          <p className="text-blue-800 text-sm font-medium">💡 Production Setup</p>
          <p className="text-blue-600 text-xs mt-1">Create a Supabase project and set the environment variables to switch from localStorage to PostgreSQL database persistence.</p>
        </div>
        <button onClick={handleResetDb} className="mt-4 w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors text-sm">
          🔄 Reset Demo Data
        </button>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-red-600" /></div>
          <div><h2 className="font-bold text-gray-900">Security</h2><p className="text-gray-500 text-xs">Authentication and security settings</p></div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Admin Email</span>
            <span className="font-medium text-gray-900 text-sm">admin@hoperise.org</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Default Password</span>
            <span className="font-medium text-gray-500 text-sm">Admin@123 (Change in production)</span>
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all">
        💾 Save Settings
      </button>
    </div>
  );
};

export default AdminSettings;
