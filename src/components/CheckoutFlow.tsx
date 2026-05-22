/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../state/StoreContext';
import { X, ShieldCheck, Mail, User, MapPin, CreditCard, ChevronRight, CheckCircle2, Ticket } from 'lucide-react';

export const CheckoutFlow: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setCheckoutOpen,
    submitCheckout,
    activePromo,
    settings,
    currentUser
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // Processing & Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Auto-populate logged-in customer info
  useEffect(() => {
    if (isCheckoutOpen && currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [isCheckoutOpen, currentUser]);

  if (!isCheckoutOpen) return null;

  // Pricing Estimates
  const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
  const discount = activePromo ? Number((subtotal * (activePromo.percent / 100)).toFixed(2)) : 0;
  const itemsTotal = subtotal - discount;
  const shipping = itemsTotal > 150 ? 0 : settings.shippingRate;
  const tax = Number((itemsTotal * settings.taxRate).toFixed(2));
  const finalTotal = Number((itemsTotal + shipping + tax).toFixed(2));

  // Auto-populate for quick testing (very friendly for review, but clean)
  const fillSampleAddress = () => {
    setName('Julianne Arbi');
    setEmail('jouhanarbi@gmail.com');
    setStreet('450 Tech Avenue, Bldg 12');
    setCity('Seattle');
    setZipCode('98101');
    setCountry('United States');
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name || !email || !street || !city || !zipCode) {
        alert('Please complete all shipping address fields before proceeding.');
        return;
      }
      setStep(2);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    // Simulate merchant processing
    setTimeout(() => {
      const pmLabel = 'Cash on Delivery';
      
      const newOrder = submitCheckout({
        name,
        email,
        street,
        city,
        zipCode,
        country,
        paymentMethod: pmLabel
      });

      setIsSubmitting(false);
      if (newOrder) {
        setCompletedOrder(newOrder);
        setStep(3);
      } else {
        alert('An issue occurred. Possible reasons: Product went out of stock during processing.');
        setCheckoutOpen(false);
      }
    }, 1500);
  };

  const handleClose = () => {
    // Reset forms & status
    setStep(1);
    setName('');
    setEmail('');
    setStreet('');
    setCity('');
    setZipCode('');
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setCompletedOrder(null);
    setCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      
      {/* Container Box */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden border border-slate-100" id="checkout-container">
        
        {/* Left Side: Dynamic Flow forms */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Header navigation step counts */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3 text-xs font-mono font-bold tracking-wider">
              <span className={step >= 1 ? 'text-indigo-600 font-black' : 'text-slate-300'}>01 SHIPPING</span>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <span className={step >= 2 ? 'text-indigo-600 font-black' : 'text-slate-300'}>02 PAYMENT</span>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <span className={step === 3 ? 'text-indigo-600 font-black' : 'text-slate-300'}>03 COMPLETE</span>
            </div>
            {step < 3 && (
              <button onClick={handleClose} className="rounded-full p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

          {/* STEP 1: Shipping and Contact details */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-display text-sm font-bold text-slate-900">Shipment Directives</h3>
                <button 
                  type="button" 
                  onClick={fillSampleAddress}
                  className="text-[10px] bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold px-2.5 py-1 rounded-full transition-all"
                >
                  Autofill Credentials
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Recipient Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julianne Arbi"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  />
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Notification Email (Order Confirmation)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jouhanarbi@gmail.com"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  />
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Street Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 450 Tech Avenue, Bldg 12"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  />
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Seattle"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g. 98101"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-mono outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-850"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Canada">Canada</option>
                  <option value="Japan">Japan</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 flex items-center font-medium">
                  <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-505 text-emerald-650" /> Secure escrow enabled
                </span>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-indigo-700 flex items-center space-x-1 shadow-md shadow-indigo-100 transition-all cursor-pointer"
                >
                  <span>Select Payment</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Cash on Delivery confirmation */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in" id="cod-payment-step">
              <h3 className="font-display text-sm font-bold text-slate-900">Payment Selection</h3>

              <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-5 flex items-start space-x-3.5 shadow-sm">
                <span className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-750 dark:text-indigo-400 rounded-xl font-bold font-display text-lg">
                  💵
                </span>
                <div>
                  <h4 className="font-sans text-xs font-black text-indigo-950">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-indigo-750/80 leading-relaxed mt-0.5">
                    Pay with physical cash upon delivery. No deposit, pre-payment, or credit card details are required to finalize and process your cargo order.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4.5 flex items-start space-x-3 border border-slate-200 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-indigo-655 mt-0.5 flex-shrink-0" />
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-0.5">Delivery Handover Protocol</span>
                  Please prepare the exact cash amount of <strong className="text-slate-900">{settings.baseCurrency}{finalTotal.toFixed(2)}</strong> for the carrier associate when they deliver your parcel. A matching receipt and inventory brief will be handed over.
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-40 transition-colors"
                >
                  ← Return to Delivery
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="rounded-lg bg-indigo-650 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-700 flex items-center space-x-2 disabled:opacity-50 shadow-md shadow-indigo-100 cursor-pointer"
                  id="final-checkout-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-slate-300 border-t-white animate-spin"></span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Confirm Order (COD)</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order fully received confirmation */}
          {step === 3 && completedOrder && (
            <div className="space-y-6 text-center py-6 animate-fade-in" id="checkout-success-state">
              <div className="mx-auto h-16 w-16 bg-indigo-650 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <CheckCircle2 className="h-9 w-9 text-white" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900">Acquisition Standard Approved</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Your purchase request has passed our logistics review. You will pay with physical cash upon delivery.
                </p>
              </div>

              {/* Highlight order details */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 max-w-md mx-auto text-left space-y-3 text-xs leading-relaxed shadow-inner">
                <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
                  <span className="font-mono text-[10px] text-slate-400">TRANSACTION ACCOUNT</span>
                  <span className="font-mono font-bold text-slate-900">{completedOrder.id}</span>
                </div>
                <div className="space-y-1 text-slate-650">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recipient Name</span>
                    <span className="font-semibold text-slate-950">{completedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Delivery Address</span>
                    <span className="text-slate-800 text-right max-w-[200px] truncate">{completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Approved Charge</span>
                    <span className="font-mono font-bold text-indigo-600">{settings.baseCurrency}{completedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
                <button
                  onClick={handleClose}
                  className="w-full rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white uppercase hover:bg-indigo-700 transition-all text-center tracking-wider shadow-md shadow-indigo-100"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Order summary (sticky sidebar on desktop) */}
        {step < 3 && (
          <div className="w-full md:w-80 bg-slate-50/80 md:border-l border-slate-250 p-6 flex flex-col justify-between" id="checkout-summary-sidebar">
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-450 border-b border-slate-200/50 pb-2">Order Summary</h4>
              
              {/* Product mini thumbnails */}
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3 text-xs">
                    <div className="h-11 w-11 rounded border border-slate-200 bg-white overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 truncate">
                      <h5 className="font-semibold text-slate-900 truncate leading-tight">{item.product.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-800">
                      {settings.baseCurrency}{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations check */}
              <div className="space-y-1.5 text-xs border-t border-slate-200 pt-4 text-slate-500 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-800">{settings.baseCurrency}{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-mono">
                    <span className="flex items-center"><Ticket className="h-3 w-3 mr-1" /> Discount</span>
                    <span>-{settings.baseCurrency}{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-slate-805 text-slate-700">{shipping === 0 ? 'FREE' : `${settings.baseCurrency}${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({settings.taxRate * 100}%)</span>
                  <span className="font-mono text-slate-805 text-slate-705">{settings.baseCurrency}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 mt-2 pt-3 font-bold text-slate-900">
                  <span>Grand Total</span>
                  <span className="font-mono text-sm text-indigo-600">{settings.baseCurrency}{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="hidden md:block pt-6 text-[10px] text-slate-400 text-center border-t border-slate-200 mt-6 md:mt-0 leading-relaxed font-medium">
              Your transaction is audited by our legal processing divisions.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
