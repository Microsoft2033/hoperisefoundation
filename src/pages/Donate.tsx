

import React, { useState, useCallback } from 'react';
import {
  Heart, Shield, CheckCircle,
  CreditCard, Smartphone, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

type DonationType = 'one-time' | 'monthly' | 'quarterly' | 'annual';
type PaymentMethod = 'stripe' | 'paypal' | 'mobile_money' | 'bank_transfer';
type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'KES' | 'NGN';

interface DonorForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  paypalEmail: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const emptyForm: DonorForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  paypalEmail: '',
};

const PRESET_AMOUNTS = ['25', '50', '100', '250', '500', '1000'];

const PROGRAMS = [
  'Education & Scholarships',
  'Healthcare Services',
  'Clean Water Initiative',
  'Women Empowerment',
  'Environmental Projects',
  'Where Needed Most',
];

const DONATION_TYPES: { id: DonationType; label: string }[] = [
  { id: 'one-time',  label: 'One-Time'  },
  { id: 'monthly',   label: 'Monthly'   },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'annual',    label: 'Annual'    },
];

const CURRENCIES: { id: CurrencyCode; label: string }[] = [
  { id: 'USD', label: 'USD — US Dollar'       },
  { id: 'EUR', label: 'EUR — Euro'            },
  { id: 'GBP', label: 'GBP — British Pound'  },
  { id: 'KES', label: 'KES — Kenyan Shilling' },
  { id: 'NGN', label: 'NGN — Nigerian Naira'  },
];

const PAYMENT_METHODS = [
  { id: 'stripe' as PaymentMethod,       label: 'Credit Card',  icon: <CreditCard className="w-5 h-5" />                             },
  { id: 'paypal' as PaymentMethod,       label: 'PayPal',       icon: <span className="font-bold text-blue-600 text-sm">P</span>     },
  { id: 'mobile_money' as PaymentMethod, label: 'Mobile Money', icon: <Smartphone className="w-5 h-5" />                            },
];

const IMPACT_ITEMS = [
  { min: 25,   text: 'Provide learning materials for a child for a month'  },
  { min: 50,   text: 'Provide school supplies for a child for a full year'  },
  { min: 100,  text: 'Feed a family of four for an entire month'            },
  { min: 250,  text: 'Fund mobile clinic visits to 5 remote villages'       },
  { min: 500,  text: 'Train a woman in vocational skills for 3 months'      },
  { min: 1000, text: 'Install a clean water point for a rural community'    },
];

const STEP_LABELS = ['Amount', 'Your Info', 'Payment'];

// ============================================================
// SUB-COMPONENTS
// ============================================================

// Step Indicator
const StepIndicator: React.FC<{ step: number }> = ({ step }) => (
  <div className="mb-10">
    <div className="flex items-center justify-center">
      {[1, 2, 3].map(s => (
        <React.Fragment key={s}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step >= s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > s ? <CheckCircle className="w-5 h-5" /> : s}
          </div>
          {s < 3 && (
            <div className={`h-1 w-24 mx-2 rounded-full transition-all ${
              step > s ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
    <div className="flex justify-center space-x-20 mt-3 text-xs text-gray-500">
      {STEP_LABELS.map((label, i) => (
        <span
          key={label}
          className={step === i + 1 ? 'text-green-600 font-semibold' : ''}
        >
          {label}
        </span>
      ))}
    </div>
  </div>
);

// Trust Badges
const TrustBadges: React.FC = () => (
  <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
    {[
      { icon: <Shield className="w-4 h-4 text-green-500" />,      label: 'SSL Secured'               },
      { icon: <CheckCircle className="w-4 h-4 text-green-500" />, label: '501(c)(3) Registered'      },
      { icon: <CheckCircle className="w-4 h-4 text-green-500" />, label: '4-Star Charity Navigator'  },
    ].map(b => (
      <div key={b.label} className="flex items-center space-x-2">
        {b.icon}
        <span>{b.label}</span>
      </div>
    ))}
  </div>
);

// ============================================================
// SUCCESS PAGE
// ============================================================

const SuccessPage: React.FC<{
  name: string;
  email: string;
  amount: number;
  currency: CurrencyCode;
  onReset: () => void;
}> = ({ name, email, amount, currency, onReset }) => {
  const impactItems = IMPACT_ITEMS.filter(item => amount >= item.min);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 pt-20">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10 text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
          Thank You, {name}!
        </h2>
        <p className="text-gray-600 mb-2">
          Your donation of{' '}
          <span className="font-bold text-green-600">
            {currency} {amount.toLocaleString()}
          </span>{' '}
          has been received.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          A receipt has been sent to{' '}
          <span className="font-medium text-indigo-600">{email}</span>.
          Your contribution will directly fund our programs and change lives.
        </p>

        {/* Impact */}
        {impactItems.length > 0 && (
          <div className="bg-green-50 rounded-2xl p-6 mb-8 text-left">
            <p className="text-green-800 font-medium text-sm mb-3">
              💡 Your {currency} {amount.toLocaleString()} donation could:
            </p>
            <ul className="space-y-2">
              {impactItems.map(item => (
                <li
                  key={item.text}
                  className="text-green-700 text-sm flex items-start space-x-2"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Share */}
        <div className="mb-6">
          <p className="text-gray-500 text-xs mb-3">
            Help us spread the word
          </p>
          <div className="flex gap-3 justify-center">
            {[
              {
                label: '🐦 Twitter',
                href: `https://twitter.com/intent/tweet?text=I just donated to HopeRise Foundation! Join me in making a difference 💚 #HopeRise #Charity`,
                color: 'bg-sky-50 text-sky-600 hover:bg-sky-100',
              },
              {
                label: '📘 Facebook',
                href: `https://www.facebook.com/sharer/sharer.php?u=https://hoperise.org`,
                color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
              },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${s.color}`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
        >
          Make Another Donation
        </button>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const Donate: React.FC = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<DonationType>('one-time');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [program, setProgram] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<DonorForm>(emptyForm);

  // ============================================================
  // COMPUTED
  // ============================================================
  const finalAmount = customAmount || amount;
  const finalAmountNumber = parseFloat(finalAmount) || 0;

  const handleAmountSelect = (val: string) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmount = (val: string) => {
    setCustomAmount(val);
    setAmount('');
  };

  // ============================================================
  // RESET
  // ============================================================
  const handleReset = useCallback(() => {
    setSuccess(false);
    setStep(1);
    setAmount('');
    setCustomAmount('');
    setProgram('');
    setPaymentMethod('stripe');
    setCurrency('USD');
    setDonationType('one-time');
    setFormData(emptyForm);
  }, []);

  // ============================================================
  // SUBMIT → SUPABASE
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!finalAmount || finalAmountNumber <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please provide your name and email');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('donors')
        .insert([
          {
            name:           formData.name.trim(),
            email:          formData.email.trim().toLowerCase(),
            amount:         finalAmountNumber,
            currency:       currency,
            payment_method: paymentMethod,
            donation_type:  donationType,
            message:        formData.message.trim() || null,
            status:         'completed',
            program:        program || null,
          },
        ]);

      if (error) throw error;

      setSuccess(true);
      toast.success('🎉 Thank you for your generous donation!');
    } catch (err: any) {
      console.error('Error saving donation:', err);
      toast.error(
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SUCCESS STATE
  // ============================================================
  if (success) {
    return (
      <SuccessPage
        name={formData.name}
        email={formData.email}
        amount={finalAmountNumber}
        currency={currency}
        onReset={handleReset}
      />
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 pt-20">

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-emerald-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-14 h-14 text-white fill-white mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Make a Difference Today
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Your donation directly funds life-changing programs in education,
            healthcare, and sustainable development.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            {[
              { val: '$50',  label: 'School supplies for 1 child'  },
              { val: '$100', label: 'Feeds a family for a month'   },
              { val: '$500', label: 'Healthcare for 10 people'      },
            ].map(item => (
              <div key={item.val} className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="text-white font-bold text-xl">{item.val}</div>
                <div className="text-green-100 text-xs mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <StepIndicator step={step} />

          <div className="bg-white rounded-3xl shadow-xl p-8">

            {/* ================================================ */}
            {/* STEP 1: AMOUNT                                    */}
            {/* ================================================ */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Choose Your Donation
                </h2>

                {/* Donation Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Donation Frequency
                  </label>
                  <div className="grid grid-cols-4 rounded-xl border border-gray-200 overflow-hidden">
                    {DONATION_TYPES.map(dt => (
                      <button
                        key={dt.id}
                        onClick={() => setDonationType(dt.id)}
                        className={`py-3 font-semibold text-xs sm:text-sm transition-all ${
                          donationType === dt.id
                            ? 'bg-green-500 text-white'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {dt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Preset Amounts */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {PRESET_AMOUNTS.map(a => (
                    <button
                      key={a}
                      onClick={() => handleAmountSelect(a)}
                      className={`py-4 rounded-xl font-bold text-lg border-2 transition-all ${
                        amount === a
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-700 hover:border-green-300'
                      }`}
                    >
                      {currency} {a}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Custom Amount"
                    value={customAmount}
                    onChange={e => handleCustomAmount(e.target.value)}
                    className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                  />
                </div>

                {/* Program */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Direct your donation to (optional)
                  </label>
                  <select
                    value={program}
                    onChange={e => setProgram(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Where it's needed most</option>
                    {PROGRAMS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Impact Preview */}
                {finalAmountNumber > 0 && (
                  <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100">
                    <p className="text-green-800 text-sm font-medium mb-2">
                      💚 Your {currency} {finalAmountNumber.toLocaleString()} could:
                    </p>
                    <ul className="space-y-1">
                      {IMPACT_ITEMS.filter(i => finalAmountNumber >= i.min).slice(-3).map(item => (
                        <li key={item.text} className="flex items-start gap-2 text-green-700 text-xs">
                          <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!finalAmount || finalAmountNumber <= 0) {
                      toast.error('Please select or enter a valid amount');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30"
                >
                  Continue — {currency} {finalAmountNumber > 0 ? finalAmountNumber.toLocaleString() : '0'}
                  {donationType !== 'one-time' && ` / ${donationType}`}
                </button>
              </div>
            )}

            {/* ================================================ */}
            {/* STEP 2: DONOR INFO                               */}
            {/* ================================================ */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Your Information
                </h2>
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Share why you're donating..."
                    />
                  </div>

                  {/* Tax Notice */}
                  <div className="bg-blue-50 rounded-xl p-4 flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-800 text-sm font-medium">
                        Tax Deductible Donation
                      </p>
                      <p className="text-blue-600 text-xs mt-1">
                        HopeRise Foundation is a registered 501(c)(3) nonprofit.
                        Your donation is tax-deductible to the extent permitted by law.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (!formData.name.trim() || !formData.email.trim()) {
                        toast.error('Please fill in your name and email');
                        return;
                      }
                      setStep(3);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* ================================================ */}
            {/* STEP 3: PAYMENT                                  */}
            {/* ================================================ */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Payment Method
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                  Total:{' '}
                  <span className="font-bold text-green-600 text-lg">
                    {currency} {finalAmountNumber.toLocaleString()}
                    {donationType !== 'one-time' && (
                      <span className="text-sm font-normal text-gray-400">
                        {' '}/ {donationType}
                      </span>
                    )}
                  </span>
                </p>

                {/* Payment Method Select */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {PAYMENT_METHODS.map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`py-4 rounded-xl border-2 flex flex-col items-center space-y-1 transition-all ${
                        paymentMethod === pm.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={paymentMethod === pm.id ? 'text-green-600' : 'text-gray-500'}>
                        {pm.icon}
                      </div>
                      <span className={`text-xs font-medium ${
                        paymentMethod === pm.id ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {pm.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Credit Card Fields */}
                {paymentMethod === 'stripe' && (
                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={formData.cardNumber}
                        onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={formData.cardExpiry}
                          onChange={e => setFormData({ ...formData, cardExpiry: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          value={formData.cardCvv}
                          onChange={e => setFormData({ ...formData, cardCvv: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      🔒 Card details are encrypted and never stored on our servers.
                    </p>
                  </div>
                )}

                {/* PayPal */}
                {paymentMethod === 'paypal' && (
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      PayPal Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@paypal.com"
                      value={formData.paypalEmail}
                      onChange={e => setFormData({ ...formData, paypalEmail: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Mobile Money */}
                {paymentMethod === 'mobile_money' && (
                  <div className="mb-8 bg-orange-50 rounded-xl p-5 border border-orange-100">
                    <p className="text-orange-800 font-semibold text-sm mb-2">
                      📱 Mobile Money Instructions
                    </p>
                    <p className="text-orange-700 text-xs leading-relaxed">
                      Send <strong>{currency} {finalAmountNumber.toLocaleString()}</strong> to:{' '}
                      <strong>+1 (800) HOPERISE</strong>
                      <br />
                      Reference:{' '}
                      <strong>
                        DONATE-{formData.name.toUpperCase().replace(/\s+/g, '-')}
                      </strong>
                    </p>
                  </div>
                )}

                {/* Security Note */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    Your payment is secured with 256-bit SSL encryption.
                    We never store your card details.
                  </p>
                </div>

                {/* Donation Summary */}
                <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100">
                  <h4 className="text-green-800 font-semibold text-sm mb-2">
                    Donation Summary
                  </h4>
                  <div className="space-y-1 text-xs text-green-700">
                    <div className="flex justify-between">
                      <span>Donor</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span className="font-medium">
                        {currency} {finalAmountNumber.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency</span>
                      <span className="font-medium capitalize">{donationType}</span>
                    </div>
                    {program && (
                      <div className="flex justify-between">
                        <span>Program</span>
                        <span className="font-medium">{program}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 fill-white" />
                        <span>Complete Donation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <TrustBadges />
        </div>
      </section>
    </div>
  );
};

export default Donate;