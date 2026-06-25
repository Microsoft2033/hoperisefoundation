// src/pages/admin/AdminSettings.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Database, Shield, Bell, Globe,
  Loader2, Save, RefreshCw, User,
  Eye, EyeOff, CheckCircle, CreditCard,
  Building2, Bitcoin, 
  AlertCircle, Copy, Edit3
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

type PaymentMethodType = 'stripe' | 'paypal' | 'bank_transfer' | 'crypto';

interface PaymentMethodRecord {
  id: string;
  method_type: PaymentMethodType;
  is_enabled: boolean;
  details: Record<string, any>;
  updated_at: string;
}

interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'password';
  placeholder?: string;
  sensitive?: boolean;
}

// ============================================================
// CONSTANTS — Payment field definitions
// ============================================================

const PAYMENT_FIELD_CONFIGS: Record<PaymentMethodType, FieldConfig[]> = {
  stripe: [
    {
      key: 'publishable_key',
      label: 'Publishable Key',
      type: 'text',
      placeholder: 'pk_live_...',
      sensitive: true,
    },
    {
      key: 'description',
      label: 'Description shown to donors',
      type: 'textarea',
      placeholder: 'Pay securely with your credit or debit card',
    },
    {
      key: 'accepted_cards',
      label: 'Accepted Cards (comma-separated)',
      type: 'text',
      placeholder: 'Visa, Mastercard, Amex, Discover',
    },
  ],
  paypal: [
    {
      key: 'business_email',
      label: 'PayPal Business Email',
      type: 'email',
      placeholder: 'donations@yourorg.org',
    },
    {
      key: 'description',
      label: 'Description shown to donors',
      type: 'textarea',
      placeholder: 'Pay using your PayPal account',
    },
    {
      key: 'paypal_link',
      label: 'PayPal.me Link',
      type: 'text',
      placeholder: 'https://paypal.me/yourorg',
    },
  ],
  bank_transfer: [
    {
      key: 'bank_name',
      label: 'Bank Name',
      type: 'text',
      placeholder: 'First National Bank',
    },
    {
      key: 'account_name',
      label: 'Account Name',
      type: 'text',
      placeholder: 'Your Organization Name',
    },
    {
      key: 'account_number',
      label: 'Account Number',
      type: 'text',
      placeholder: '1234567890',
      sensitive: true,
    },
    {
      key: 'routing_number',
      label: 'Routing / Sort Code',
      type: 'text',
      placeholder: '021000021',
      sensitive: true,
    },
    {
      key: 'swift_code',
      label: 'SWIFT / BIC Code',
      type: 'text',
      placeholder: 'FNBAUS33',
    },
    {
      key: 'iban',
      label: 'IBAN',
      type: 'text',
      placeholder: 'US12FNBA...',
      sensitive: true,
    },
    {
      key: 'reference_prefix',
      label: 'Reference Prefix',
      type: 'text',
      placeholder: 'DONATE',
    },
    {
      key: 'instructions',
      label: 'Donor Instructions',
      type: 'textarea',
      placeholder: 'Please include your full name as the payment reference',
    },
  ],
  crypto: [
    {
      key: 'bitcoin_address',
      label: 'Bitcoin (BTC) Wallet Address',
      type: 'text',
      placeholder: 'bc1q...',
      sensitive: true,
    },
    {
      key: 'ethereum_address',
      label: 'Ethereum (ETH) Wallet Address',
      type: 'text',
      placeholder: '0x...',
      sensitive: true,
    },
    {
      key: 'usdt_address',
      label: 'USDT Wallet Address',
      type: 'text',
      placeholder: '0x...',
      sensitive: true,
    },
    {
      key: 'usdt_network',
      label: 'USDT Network',
      type: 'text',
      placeholder: 'ERC-20',
    },
    {
      key: 'description',
      label: 'Description shown to donors',
      type: 'textarea',
      placeholder: 'Send crypto to any of the addresses below',
    },
    {
      key: 'confirmation_email',
      label: 'Confirmation Email',
      type: 'email',
      placeholder: 'crypto@yourorg.org',
    },
  ],
};

const PAYMENT_METHOD_META: Record<
  PaymentMethodType,
  { label: string; icon: React.ReactNode; color: string; bgColor: string }
> = {
  stripe: {
    label:   'Credit / Debit Card (Stripe)',
    icon:    <CreditCard className="w-5 h-5" />,
    color:   'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  paypal: {
    label:   'PayPal',
    icon:    <span className="font-black text-sm leading-none">PP</span>,
    color:   'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  bank_transfer: {
    label:   'Bank Transfer',
    icon:    <Building2 className="w-5 h-5" />,
    color:   'text-green-600',
    bgColor: 'bg-green-100',
  },
  crypto: {
    label:   'Cryptocurrency',
    icon:    <Bitcoin className="w-5 h-5" />,
    color:   'text-orange-600',
    bgColor: 'bg-orange-100',
  },
};

// ============================================================
// REUSABLE TOGGLE
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
    className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 focus:outline-none ${
      value ? 'bg-green-500' : 'bg-gray-300'
    }`}
  >
    <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
        value ? 'translate-x-7' : 'translate-x-1'
      }`}
    />
  </button>
);

// ============================================================
// SECTION HEADER
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
// SINGLE PAYMENT METHOD EDITOR ROW
// ============================================================

const PaymentMethodRow: React.FC<{
  method: PaymentMethodRecord;
  isSuperAdmin: boolean;
  onSaved: () => void;
}> = ({ method, isSuperAdmin, onSaved }) => {
  const meta        = PAYMENT_METHOD_META[method.method_type];
  const fields      = PAYMENT_FIELD_CONFIGS[method.method_type];

  const [isExpanded,    setIsExpanded]    = useState(false);
  const [isEnabled,     setIsEnabled]     = useState(method.is_enabled);
  const [details,       setDetails]       = useState<Record<string, any>>({ ...method.details });
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({});
  const [saving,        setSaving]        = useState(false);

  // Keep local state in sync if parent refetches
  useEffect(() => {
    setIsEnabled(method.is_enabled);
    setDetails({ ...method.details });
  }, [method]);

  const toggleVisibility = (key: string) =>
    setVisibleFields(prev => ({ ...prev, [key]: !prev[key] }));

  const handleChange = (key: string, value: string) =>
    setDetails(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!isSuperAdmin) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({
          is_enabled: isEnabled,
          details,
          updated_at: new Date().toISOString(),
        })
        .eq('id', method.id);

      if (error) throw error;
      toast.success(`${meta.label} updated!`);
      onSaved();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`border-2 rounded-2xl overflow-hidden transition-all ${
        isEnabled ? 'border-gray-200' : 'border-gray-100'
      }`}
    >
      {/* ── Row header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 bg-white">

        {/* Left — icon + labels */}
        <button
          type="button"
          disabled={!isSuperAdmin}
          onClick={() => isSuperAdmin && setIsExpanded(e => !e)}
          className="flex items-center gap-3 flex-1 text-left disabled:cursor-default"
        >
          <div
            className={`w-10 h-10 ${meta.bgColor} ${meta.color} rounded-xl
                        flex items-center justify-center flex-shrink-0`}
          >
            {meta.icon}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{meta.label}</p>
            <p className="text-xs text-gray-400">
              {fields.length} configurable field{fields.length !== 1 ? 's' : ''}
            </p>
          </div>

          {isSuperAdmin && (
            <Edit3
              className={`w-4 h-4 mr-3 flex-shrink-0 transition-colors ${
                isExpanded ? 'text-green-500' : 'text-gray-300'
              }`}
            />
          )}
        </button>

        {/* Right — enabled badge + toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className={`hidden sm:inline text-xs font-semibold ${
              isEnabled ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {isEnabled ? 'Active' : 'Inactive'}
          </span>
          <Toggle
            value={isEnabled}
            onChange={val => {
              if (!isSuperAdmin) return;
              setIsEnabled(val);
            }}
            disabled={!isSuperAdmin}
          />
        </div>
      </div>

      {/* ── Expanded fields ─────────────────────────────────── */}
      {isExpanded && isSuperAdmin && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-5 space-y-5">

          {fields.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                {field.label}
                {field.sensitive && (
                  <span className="ml-2 normal-case tracking-normal font-normal text-amber-500">
                    · sensitive
                  </span>
                )}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  rows={2}
                  placeholder={field.placeholder}
                  value={details[field.key] ?? ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500
                             focus:outline-none text-sm bg-white resize-none"
                />
              ) : (
                <div className="relative">
                  <input
                    type={
                      field.sensitive && !visibleFields[field.key]
                        ? 'password'
                        : field.type
                    }
                    placeholder={field.placeholder}
                    value={details[field.key] ?? ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500
                               focus:outline-none text-sm bg-white pr-20"
                  />

                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {/* Copy */}
                    {details[field.key] && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(details[field.key]);
                          toast.success(`${field.label} copied!`);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400
                                   hover:text-gray-600 transition-colors"
                        title="Copy value"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Eye */}
                    {field.sensitive && (
                      <button
                        type="button"
                        onClick={() => toggleVisibility(field.key)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400
                                   hover:text-gray-600 transition-colors"
                        title={visibleFields[field.key] ? 'Hide' : 'Reveal'}
                      >
                        {visibleFields[field.key]
                          ? <EyeOff className="w-3.5 h-3.5" />
                          : <Eye    className="w-3.5 h-3.5" />
                        }
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* last-updated hint */}
          <p className="text-xs text-gray-400">
            Last saved: {new Date(method.updated_at).toLocaleString()}
          </p>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl
                       font-semibold text-sm hover:from-green-600 hover:to-emerald-700 transition-all
                       flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> Save {meta.label}</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// PAYMENT METHODS SECTION
// ============================================================

const PaymentMethodsSection: React.FC<{ isSuperAdmin: boolean }> = ({
  isSuperAdmin,
}) => {
  const [methods,  setMethods]  = useState<PaymentMethodRecord[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetchMethods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchErr) throw fetchErr;
      setMethods(data ?? []);
    } catch (err: any) {
      setError(err.message || 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMethods(); }, [fetchMethods]);

  const activeCount = methods.filter(m => m.is_enabled).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Payment Methods</h2>
            <p className="text-gray-500 text-xs">
              Configure details shown to donors on the donation page
            </p>
          </div>
        </div>

        {/* Active badge */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-100
                        rounded-xl px-3 py-1.5 flex-shrink-0">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-green-700 text-xs font-semibold">
            {activeCount} Active
          </span>
        </div>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200
                      rounded-xl px-4 py-3 mb-5">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-amber-700 text-xs leading-relaxed">
          Payment details are fetched <strong>live from the database</strong> and displayed
          directly to donors. Double-check all wallet addresses, bank details, and API keys
          before saving. Sensitive fields are masked — click the eye icon to reveal.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-10 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading payment methods…</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 text-sm font-semibold">Failed to load</p>
            <p className="text-red-600 text-xs mt-1">{error}</p>
            <button
              onClick={fetchMethods}
              className="mt-2 text-xs text-red-600 underline font-semibold"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Method rows */}
      {!loading && !error && (
        <>
          {methods.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              No payment methods found.{' '}
              <span className="block text-xs mt-1">
                Run the SQL seed script in your Supabase dashboard first.
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {methods.map(m => (
                <PaymentMethodRow
                  key={m.id}
                  method={m}
                  isSuperAdmin={isSuperAdmin}
                  onSaved={fetchMethods}
                />
              ))}
            </div>
          )}

          {/* Refresh */}
          <button
            onClick={fetchMethods}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5
                       bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold
                       hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Payment Methods
          </button>
        </>
      )}

      {/* Read-only notice */}
      {!isSuperAdmin && (
        <p className="mt-4 text-center text-xs text-gray-400">
          Only Super Admins can edit payment details.
        </p>
      )}
    </div>
  );
};

// ============================================================
// MAIN ADMIN SETTINGS COMPONENT
// ============================================================

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  // Org settings
  const [settings,        setSettings]        = useState<OrgSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings,  setSavingSettings]  = useState(false);

  // Admin profile
  const [adminName,     setAdminName]     = useState('');
  const [adminEmail,    setAdminEmail]    = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current_password: '',
    new_password:     '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new:     false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // DB stats
  const [dbStats, setDbStats] = useState({
    donors: 0, volunteers: 0, messages: 0, subscribers: 0,
  });

  // ── Fetch org settings + DB stats ──────────────────────────
  const fetchSettings = useCallback(async () => {
    try {
      setLoadingSettings(true);

      const [settingsRes, statsRes] = await Promise.all([
        supabase.from('organization_settings').select('*').single(),
        Promise.all([
          supabase.from('donors').select('id',                   { count: 'exact', head: true }),
          supabase.from('volunteers').select('id',               { count: 'exact', head: true }),
          supabase.from('contact_messages').select('id',         { count: 'exact', head: true }),
          supabase.from('newsletter_subscribers').select('id',   { count: 'exact', head: true }),
        ]),
      ]);

      if (settingsRes.error) throw settingsRes.error;
      setSettings(settingsRes.data);

      const [donorsR, volunteersR, messagesR, subsR] = statsRes;
      setDbStats({
        donors:      donorsR.count     ?? 0,
        volunteers:  volunteersR.count ?? 0,
        messages:    messagesR.count   ?? 0,
        subscribers: subsR.count       ?? 0,
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
      setAdminName(user.name   || '');
      setAdminEmail(user.email || '');
    }
  }, [fetchSettings, user]);

  // ── Save org settings ──────────────────────────────────────
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
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // ── Save admin profile ─────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setSavingProfile(true);
      const { error: profileError } = await supabase
        .from('admin_users')
        .update({ name: adminName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      if (adminEmail !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: adminEmail });
        if (emailError) throw emailError;
        toast.success('Profile updated! Check your new email to confirm.');
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Change password ────────────────────────────────────────
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
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const updateSettings = (field: keyof OrgSettings, value: any) =>
    setSettings(prev => prev ? { ...prev, [field]: value } : null);

  // ── Loading state ──────────────────────────────────────────
  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading settings…</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 max-w-3xl">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage your organization settings and preferences
        </p>
        {!isSuperAdmin && (
          <div className="mt-2 flex items-center gap-2 text-yellow-700 bg-yellow-50
                          border border-yellow-200 rounded-xl px-4 py-2 text-sm">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>
              You have <strong>read-only</strong> access.
              Only Super Admins can modify settings.
            </span>
          </div>
        )}
      </div>

      {/* ── Admin Profile ────────────────────────────────────── */}
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                           focus:border-indigo-500 focus:outline-none"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                           focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
              user?.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
              user?.role === 'admin'       ? 'bg-blue-100   text-blue-700'   :
                                             'bg-gray-100   text-gray-700'
            }`}>
              {user?.role?.replace('_', ' ')}
            </span>
            <span className="text-gray-400 text-xs">Account active</span>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white
                       rounded-xl font-semibold hover:bg-indigo-700 transition-colors
                       disabled:opacity-70 text-sm"
          >
            {savingProfile
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Save     className="w-4 h-4" />
            }
            <span>{savingProfile ? 'Saving…' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {/* ── Change Password ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <SectionHeader
          icon={<Shield className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-100"
          title="Change Password"
          subtitle="Update your Supabase Auth password"
        />
        <form onSubmit={handleChangePassword} className="space-y-4">
          {([
            {
              key:    'new_password',
              label:  'New Password',
              show:   showPasswords.new,
              toggle: () => setShowPasswords(p => ({ ...p, new: !p.new })),
            },
            {
              key:    'confirm_password',
              label:  'Confirm Password',
              show:   showPasswords.confirm,
              toggle: () => setShowPasswords(p => ({ ...p, confirm: !p.confirm })),
            },
          ] as const).map(({ key, label, show, toggle }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={passwordForm[key]}
                  onChange={e =>
                    setPasswordForm(prev => ({ ...prev, [key]: e.target.value }))
                  }
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl
                             focus:border-red-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600"
                >
                  {show
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye    className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>
          ))}

          {/* Match indicator */}
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
            className="flex items-center space-x-2 px-5 py-2.5 bg-red-600 text-white
                       rounded-xl font-semibold hover:bg-red-700 transition-colors
                       disabled:opacity-70 text-sm"
          >
            {changingPassword
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Shield  className="w-4 h-4" />
            }
            <span>{changingPassword ? 'Changing…' : 'Change Password'}</span>
          </button>
        </form>
      </div>

      {/* ── Organization Information ─────────────────────────── */}
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                         focus:border-blue-500 focus:outline-none
                         disabled:bg-gray-50 disabled:text-gray-500"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                           focus:border-blue-500 focus:outline-none
                           disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={settings?.org_phone || ''}
                onChange={e => updateSettings('org_phone', e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                           focus:border-blue-500 focus:outline-none
                           disabled:bg-gray-50 disabled:text-gray-500"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                         focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
            >
              {[
                ['USD', 'USD — US Dollar'],
                ['EUR', 'EUR — Euro'],
                ['GBP', 'GBP — British Pound'],
                ['KES', 'KES — Kenyan Shilling'],
                ['NGN', 'NGN — Nigerian Naira'],
                ['ZAR', 'ZAR — South African Rand'],
                ['CAD', 'CAD — Canadian Dollar'],
                ['AUD', 'AUD — Australian Dollar'],
              ].map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Notification Preferences ─────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <SectionHeader
          icon={<Bell className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-100"
          title="Notification Preferences"
          subtitle="Configure when you receive alerts"
        />
        <div className="space-y-4">
          {([
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
          ]).map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
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

      {/* ── Payment Methods ──────────────────────────────────── */}
      <PaymentMethodsSection isSuperAdmin={isSuperAdmin} />

      {/* ── Database Configuration ───────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <SectionHeader
          icon={<Database className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-100"
          title="Database Configuration"
          subtitle="Supabase PostgreSQL connection details"
        />

        {/* Connection indicator */}
        <div className="flex items-center gap-2 mb-4 px-4 py-3
                        bg-green-50 border border-green-200 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-700 text-sm font-medium">
            Connected to Supabase PostgreSQL
          </span>
        </div>

        {/* Stats grid */}
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

        {/* Config rows */}
        <div className="space-y-0">
          {[
            { label: 'Database',      value: 'Supabase PostgreSQL' },
            {
              label: 'Supabase URL',
              value: import.meta.env.VITE_SUPABASE_URL
                ? '✅ Configured'
                : '❌ Not set (VITE_SUPABASE_URL)',
            },
            {
              label: 'Anon Key',
              value: import.meta.env.VITE_SUPABASE_ANON_KEY
                ? '✅ Configured'
                : '❌ Not set (VITE_SUPABASE_ANON_KEY)',
            },
            { label: 'Auth Provider', value: 'Supabase Auth (JWT)' },
            {
              label: 'Last Updated',
              value: settings?.updated_at
                ? new Date(settings.updated_at).toLocaleString()
                : '—',
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="font-medium text-gray-900 text-sm text-right max-w-[55%]">
                {value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={fetchSettings}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3
                     bg-gray-50 text-gray-700 rounded-xl font-semibold
                     hover:bg-gray-100 transition-colors text-sm border border-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Connection
        </button>
      </div>

      {/* ── Save All Org Settings ────────────────────────────── */}
      {isSuperAdmin && (
        <button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white
                     rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700
                     transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
        >
          {savingSettings ? (
            <><Loader2 className="w-5 h-5 animate-spin" /><span>Saving Settings…</span></>
          ) : (
            <><Save className="w-5 h-5" /><span>Save All Settings</span></>
          )}
        </button>
      )}
    </div>
  );
};

export default AdminSettings;