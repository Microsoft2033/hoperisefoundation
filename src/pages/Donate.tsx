import React, { useState } from 'react';
import { Heart, Shield, CheckCircle, CreditCard, Smartphone } from 'lucide-react';
import { db } from '../lib/mockDb';
import toast from 'react-hot-toast';

const Donate: React.FC = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<'one-time' | 'recurring'>('one-time');
  const [program, setProgram] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: '',
    cardNumber: '', cardExpiry: '', cardCvv: '',
    paypalEmail: '',
  });

  const presetAmounts = ['25', '50', '100', '250', '500', '1000'];
  const programs = ['Education & Scholarships', 'Healthcare Services', 'Clean Water Initiative', 'Women Empowerment', 'Environmental Projects', 'Where Needed Most'];

  const handleAmountSelect = (val: string) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmount = (val: string) => {
    setCustomAmount(val);
    setAmount('');
  };

  const finalAmount = customAmount || amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      db.donors.create({
        name: formData.name,
        email: formData.email,
        amount: parseFloat(finalAmount),
        currency: 'USD',
        payment_method: paymentMethod,
        donation_type: donationType,
        message: formData.message || null,
        status: 'completed',
        program: program || null,
      });
      setSuccess(true);
      toast.success('🎉 Thank you for your generous donation!');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 pt-20">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">Thank You, {formData.name}!</h2>
          <p className="text-gray-600 mb-2">Your donation of <span className="font-bold text-green-600">${parseFloat(finalAmount).toLocaleString()}</span> has been received.</p>
          <p className="text-gray-500 text-sm mb-8">A receipt has been sent to {formData.email}. Your contribution will directly fund our programs and change lives.</p>
          <div className="bg-green-50 rounded-2xl p-6 mb-8">
            <p className="text-green-800 font-medium text-sm">💡 Did you know? Your ${parseFloat(finalAmount).toLocaleString()} donation could:</p>
            <ul className="mt-3 space-y-2 text-left">
              {parseFloat(finalAmount) >= 50 && <li className="text-green-700 text-sm flex items-center space-x-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /><span>Provide school supplies for a child for a full year</span></li>}
              {parseFloat(finalAmount) >= 100 && <li className="text-green-700 text-sm flex items-center space-x-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /><span>Feed a family of four for an entire month</span></li>}
              {parseFloat(finalAmount) >= 250 && <li className="text-green-700 text-sm flex items-center space-x-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /><span>Fund mobile clinic visits to 5 remote villages</span></li>}
            </ul>
          </div>
          <button onClick={() => { setSuccess(false); setStep(1); setAmount(''); setCustomAmount(''); setFormData({ name: '', email: '', phone: '', message: '', cardNumber: '', cardExpiry: '', cardCvv: '', paypalEmail: '' }); }} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all">
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-emerald-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-14 h-14 text-white fill-white mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">Make a Difference Today</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">Your donation directly funds life-changing programs in education, healthcare, and sustainable development.</p>
          <div className="mt-8 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            {[{ val: '$50', label: 'School supplies for 1 child' }, { val: '$100', label: 'Feeds a family for a month' }, { val: '$500', label: 'Healthcare for 10 people' }].map((item) => (
              <div key={item.val} className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="text-white font-bold text-xl">{item.val}</div>
                <div className="text-green-100 text-xs mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress */}
          <div className="flex items-center justify-center mb-10">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`h-1 w-24 mx-2 rounded-full transition-all ${step > s ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center space-x-24 -mt-4 mb-10 text-xs text-gray-500">
            <span className={step === 1 ? 'text-green-600 font-semibold' : ''}>Amount</span>
            <span className={step === 2 ? 'text-green-600 font-semibold' : ''}>Your Info</span>
            <span className={step === 3 ? 'text-green-600 font-semibold' : ''}>Payment</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose Your Donation</h2>
                {/* Donation Type */}
                <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-8">
                  <button onClick={() => setDonationType('one-time')} className={`flex-1 py-3 font-semibold text-sm transition-all ${donationType === 'one-time' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    One-Time Donation
                  </button>
                  <button onClick={() => setDonationType('recurring')} className={`flex-1 py-3 font-semibold text-sm transition-all ${donationType === 'recurring' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    Monthly Recurring
                  </button>
                </div>
                {/* Amount Presets */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {presetAmounts.map((a) => (
                    <button key={a} onClick={() => handleAmountSelect(a)} className={`py-4 rounded-xl font-bold text-lg border-2 transition-all ${amount === a ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-700 hover:border-green-300'}`}>
                      ${a}
                    </button>
                  ))}
                </div>
                {/* Custom Amount */}
                <div className="relative mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
                  <input type="number" placeholder="Custom Amount" value={customAmount} onChange={(e) => handleCustomAmount(e.target.value)} className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg" />
                </div>
                {/* Program */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Direct your donation to (optional)</label>
                  <select value={program} onChange={(e) => setProgram(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none">
                    <option value="">Where it's needed most</option>
                    {programs.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <button onClick={() => { if (!finalAmount) { toast.error('Please select or enter an amount'); return; } setStep(2); }} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30">
                  Continue — ${finalAmount || '0'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Information</h2>
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone (optional)</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message (optional)</label>
                    <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none" rows={3} placeholder="Share why you're donating..." />
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-800 text-sm font-medium">Tax Deductible Donation</p>
                      <p className="text-blue-600 text-xs mt-1">HopeRise Foundation is a registered 501(c)(3) nonprofit. Your donation is tax-deductible to the extent permitted by law.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                    Back
                  </button>
                  <button onClick={() => { if (!formData.name || !formData.email) { toast.error('Please fill in your name and email'); return; } setStep(3); }} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method</h2>
                <p className="text-gray-500 text-sm mb-8">Total: <span className="font-bold text-green-600 text-lg">${parseFloat(finalAmount).toLocaleString()} {donationType === 'recurring' ? '/month' : ''}</span></p>
                {/* Payment Method Select */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { id: 'credit_card', label: 'Credit Card', icon: <CreditCard className="w-5 h-5" /> },
                    { id: 'paypal', label: 'PayPal', icon: <span className="font-bold text-blue-600 text-sm">P</span> },
                    { id: 'mobile_money', label: 'Mobile Money', icon: <Smartphone className="w-5 h-5" /> },
                  ].map((pm) => (
                    <button key={pm.id} type="button" onClick={() => setPaymentMethod(pm.id)} className={`py-4 rounded-xl border-2 flex flex-col items-center space-y-1 transition-all ${paymentMethod === pm.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className={paymentMethod === pm.id ? 'text-green-600' : 'text-gray-500'}>{pm.icon}</div>
                      <span className={`text-xs font-medium ${paymentMethod === pm.id ? 'text-green-700' : 'text-gray-500'}`}>{pm.label}</span>
                    </button>
                  ))}
                </div>
                {/* Credit Card Form */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} value={formData.cardNumber} onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" maxLength={5} value={formData.cardExpiry} onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                        <input type="text" placeholder="123" maxLength={4} value={formData.cardCvv} onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" />
                      </div>
                    </div>
                  </div>
                )}
                {paymentMethod === 'paypal' && (
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PayPal Email</label>
                    <input type="email" placeholder="your@paypal.com" value={formData.paypalEmail} onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" />
                  </div>
                )}
                {paymentMethod === 'mobile_money' && (
                  <div className="mb-8 bg-orange-50 rounded-xl p-4">
                    <p className="text-orange-800 font-medium text-sm">Mobile Money Instructions</p>
                    <p className="text-orange-600 text-xs mt-1">Send your donation to: +1 (800) HOPERISE<br />Reference: DONATE-{formData.name.toUpperCase().replace(' ', '-')}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <p className="text-gray-600 text-sm">Your payment is secured with 256-bit SSL encryption. We never store your card details.</p>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2"><Shield className="w-4 h-4 text-green-500" /><span>SSL Secured</span></div>
            <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-green-500" /><span>501(c)(3) Registered</span></div>
            <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-green-500" /><span>4-Star Charity Navigator</span></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
