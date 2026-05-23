/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../state/StoreContext';
import { getTheme } from '../utils/theme';
import { 
  X, ShieldCheck, Mail, User, MapPin, 
  CreditCard, ChevronRight, CheckCircle2, Ticket, 
  ShoppingBag, ArrowLeft, Loader, HelpCircle, Package, Lock
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    setView,
    submitCheckout,
    activePromo,
    settings,
    currentUser,
    applyPromoCode,
    removePromoCode,
    formatPrice
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const theme = getTheme(settings.websiteTheme);
  const isDark = settings.websiteTheme === 'dark-obsidian';

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Processing & Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Auto-populate logged-in customer info
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Pricing Estimates
  const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
  const discount = activePromo ? Number((subtotal * (activePromo.percent / 100)).toFixed(2)) : 0;
  const itemsTotal = subtotal - discount;
  const shipping = itemsTotal > 150 ? 0 : settings.shippingRate;
  const tax = Number((itemsTotal * settings.taxRate).toFixed(2));
  const finalTotal = Number((itemsTotal + shipping + tax).toFixed(2));

  // Quick Autofill helper
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

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    
    setIsApplying(true);
    setPromoMessage(null);

    setTimeout(() => {
      const res = applyPromoCode(promoInput);
      setIsApplying(false);
      setPromoMessage({ text: res.message, isError: !res.success });
      if (res.success) {
        setPromoInput('');
      }
    }, 500);
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoMessage(null);
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
        setView('shop');
      }
    }, 1500);
  };

  const handleClose = () => {
    // Return to main viewport
    setView('shop');
  };

  if (cart.length === 0 && step < 3) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
        <div className={`rounded-full p-6 mb-4 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100'}`}>
          <ShoppingBag className="h-10 w-10 text-slate-400 stroke-1" />
        </div>
        <h3 className="font-display text-base font-bold text-current">Your Selection List is Empty</h3>
        <p className="mt-2 text-xs text-slate-400 max-w-sm leading-relaxed">
          Please add beautiful instruments to your cart from our curated product collection before checking out.
        </p>
        <button
          onClick={() => setView('shop')}
          className={`mt-6 rounded-lg ${theme.accentBg} ${theme.accentHoverBg} px-6 py-2.5 text-xs font-semibold text-white transition-all shadow-md`}
        >
          Explore Acquisitions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in" id="checkout-page-root">
      
      {/* Top Breadcrumb Header for Page Checkout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-dashed border-current/10">
        <div className="flex items-center space-x-3 text-left">
          <button 
            onClick={() => setView('shop')}
            className={`flex items-center space-x-1.5 text-slate-400 hover:${theme.accentText} text-xs font-semibold transition-colors`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </button>
          <span className="text-slate-300">/</span>
          <div className="flex items-center space-x-2 font-mono text-[11px] font-bold tracking-wider">
            <span className={`${isDark ? 'text-slate-500' : 'text-slate-450'} uppercase`}>ROOT</span>
            <span className="text-slate-300">/</span>
            <span className={theme.accentText}>CHECKOUT_PROTO_V1.0</span>
          </div>
        </div>

        {/* Steps Breadcrumbs Tracker */}
        <div className="flex items-center space-x-3 text-xs font-mono font-bold tracking-wider mt-4 md:mt-0">
          <span className={step >= 1 ? `${theme.accentText} font-black` : 'text-slate-300'}>01 SHIPPING</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className={step >= 2 ? `${theme.accentText} font-black` : 'text-slate-300'}>02 PAYMENT</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className={step === 3 ? `${theme.accentText} font-black` : 'text-slate-300'}>03 SUCCESS</span>
        </div>
      </div>

      {step < 3 && (
        <div className="text-left mb-6">
          <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-current uppercase">
            Acquisition Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in your billing, logistics inputs and claim codes to finalize standard order fulfillment.
          </p>
        </div>
      )}

      {/* Main Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Area - Dynamic Step Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-6 md:p-8 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            
            {/* STEP 1: Shipping and Delivery */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-5 text-left">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-display text-sm font-bold text-current uppercase tracking-wide">
                    Logistics Delivery coordinates
                  </h3>
                  <button 
                    type="button" 
                    onClick={fillSampleAddress}
                    className={`text-[9.5px] font-bold px-3 py-1.5 rounded-full transition-all ${
                      isDark ? 'bg-slate-800 hover:bg-slate-750 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Quick Autofill
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recipient Input */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Recipient Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Julianne Arbi"
                        className={`w-full rounded-lg border py-2.5 pl-9 pr-4 text-xs font-medium outline-none transition-all ${
                          isDark 
                            ? 'border-slate-800 bg-slate-950 focus:border-purple-500 font-semibold' 
                            : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Mail Input */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Notification Mail
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jouhanarbi@gmail.com"
                        className={`w-full rounded-lg border py-2.5 pl-9 pr-4 text-xs font-medium outline-none transition-all ${
                          isDark 
                            ? 'border-slate-800 bg-slate-950 focus:border-purple-500 font-semibold' 
                            : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Street Input */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Street Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. 450 Tech Avenue, Bldg 12"
                      className={`w-full rounded-lg border py-2.5 pl-9 pr-4 text-xs font-medium outline-none transition-all ${
                        isDark 
                          ? 'border-slate-800 bg-slate-950 focus:border-purple-500 font-semibold' 
                          : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white'
                      }`}
                    />
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* City Input */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Seattle"
                      className={`w-full rounded-lg border py-2.5 px-3.5 text-xs font-medium outline-none transition-all ${
                        isDark 
                          ? 'border-slate-800 bg-slate-950 focus:border-purple-500 font-semibold' 
                          : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white'
                      }`}
                    />
                  </div>

                  {/* Postal Code Input */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="98101"
                      className={`w-full rounded-lg border py-2.5 px-3.5 text-xs font-mono font-bold outline-none transition-all ${
                        isDark 
                          ? 'border-slate-800 bg-slate-950 focus:border-purple-500 font-semibold' 
                          : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white'
                      }`}
                    />
                  </div>

                  {/* Country Selection */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Country Location
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={`w-full rounded-lg border py-2.5 px-3 text-xs outline-none transition-all ${
                        isDark 
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-purple-500 font-semibold' 
                          : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white text-slate-850'
                      }`}
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
                </div>

                <div className={`mt-6 pt-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
                  <span className="text-[11px] text-slate-400 flex items-center font-medium">
                    <ShieldCheck className="h-4.5 w-4.5 mr-1.5 text-emerald-500" /> All inputs encrypted via 256-bit SSL Standard
                  </span>
                  <button
                    type="submit"
                    className={`rounded-lg ${theme.accentBg} ${theme.accentHoverBg} px-6 py-3 text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5 shadow-md active:scale-98 transition-all w-full sm:w-auto justify-center cursor-pointer`}
                  >
                    <span>Proceed to Delivery & Payment</span>
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Payment and COD Setup */}
            {step === 2 && (
              <div className="space-y-6 text-left animate-fade-in">
                <h3 className="font-display text-sm font-bold text-current uppercase tracking-wide">
                  Transaction Payment Directives
                </h3>

                <div className={`rounded-xl border p-5 flex items-start space-x-4 shadow-xs ${
                  isDark ? 'border-purple-950/70 bg-purple-950/20' : 'border-indigo-100 bg-indigo-50/40'
                }`}>
                  <span className="p-3 bg-indigo-100 dark:bg-purple-900 text-xl rounded-xl">
                    💵
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-current">Cash on Delivery (COD) Standard</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                      Finalize the delivery payload matching standard logistics protocols. No instant deposit, pre-payment tokens, or charge card credentials required. Perfect secure alternative.
                    </p>
                  </div>
                </div>

                {/* Handover notification context */}
                <div className={`rounded-xl p-5 border flex items-start space-x-3.5 shadow-sm text-[11px] leading-relaxed ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-150'
                }`}>
                  <ShieldCheck className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-current block mb-1">Logistics Carriage Receipt</span>
                    Please arrange the physical cash reserve of <strong className="font-semibold text-indigo-650 dark:text-purple-400">{formatPrice(finalTotal)}</strong> for the carriage courier upon delivery arrival. A matching transaction invoice slips will be delivered.
                  </div>
                </div>

                <div className={`mt-6 pt-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="text-xs font-bold text-slate-400 hover:text-current transition-colors disabled:opacity-40"
                  >
                    ← Back to Shipping
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className={`rounded-lg ${theme.accentBg} ${theme.accentHoverBg} px-6 py-3 text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2 disabled:opacity-50 shadow-md cursor-pointer w-full sm:w-auto justify-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-slate-300 border-t-white animate-spin" />
                        <span>Verifying Ledger...</span>
                      </>
                    ) : (
                      <span>Complete Purchase & Dispatch order</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Order Completed Page View */}
            {step === 3 && completedOrder && (
              <div className="space-y-6 text-center py-6 animate-fade-in" id="receipt-success-page">
                <div className={`mx-auto h-16 w-16 ${isDark ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-indigo-50'} rounded-full flex items-center justify-center text-current`}>
                  <CheckCircle2 className="h-9 w-9 text-indigo-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-current uppercase">Cargo acquisition order received</h3>
                  <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                    Logistics ledger order initialized. We have registered your shipment under order identifier <strong className="font-bold text-current font-mono">{completedOrder.id}</strong>.
                  </p>
                </div>

                {/* Invoice specs panel */}
                <div className={`rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-150'} p-5 max-w-md mx-auto text-left space-y-3.5 py-4 text-xs`}>
                  <div className={`flex justify-between items-baseline border-b pb-2 ${isDark ? 'border-slate-850' : 'border-slate-200'}`}>
                    <span className="font-mono text-[9px] text-slate-400 tracking-wider">TRACKING ID (ESCROW)</span>
                    <span className="font-mono font-bold text-current">{completedOrder.id}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Carrier Shipment Rep</span>
                      <span className="font-semibold text-current">{completedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Destination Coordinate</span>
                      <span className="text-slate-400 truncate max-w-[200px]" title={`${completedOrder.shippingAddress.street}, ${completedOrder.shippingAddress.city}`}>
                        {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ledger Method</span>
                      <span className="font-semibold text-current">Cash on Delivery</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2 border-current/5">
                      <span className="text-slate-400 font-semibold">Total Escrow Assessed</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-purple-400">{formatPrice(completedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-sm mx-auto">
                  <button
                    onClick={() => {
                      setView('shop');
                    }}
                    className={`w-full rounded-lg ${theme.accentBg} ${theme.accentHoverBg} py-3 text-xs font-bold text-white uppercase transition-all shadow-md`}
                  >
                    Back to Store catalog
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Area - Cart Overview Widget Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/80 border-slate-200'} text-left space-y-5`}>
            <div className="flex items-center justify-between border-b border-dashed border-current/10 pb-3">
              <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-450">
                Lading Shipment Summary
              </h4>
              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-tight ${
                isDark ? 'bg-purple-950/20 text-purple-300' : 'bg-indigo-50 text-indigo-700'
              }`}>
                {cart.reduce((tot, it) => tot+it.quantity, 0)} Units
              </span>
            </div>

            {/* List mini listings */}
            <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-3 text-xs">
                  <div className={`h-12 w-12 rounded border overflow-hidden flex-shrink-0 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
                    <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 truncate">
                    <h5 className="font-semibold text-current truncate leading-tight">{item.product.name}</h5>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Quantity: {item.quantity}</span>
                  </div>
                  <span className="font-mono font-semibold text-current">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Claiming engine */}
            {step < 3 && (
              <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-250/60'}`}>
                {activePromo ? (
                  <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs">
                    <div className="flex items-center space-x-2 text-emerald-555 font-bold">
                      <Ticket className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Code <strong>{activePromo.code}</strong> Applied ({activePromo.percent}%)</span>
                    </div>
                    <button 
                      onClick={handleRemovePromo}
                      className="text-red-500 hover:text-red-650 text-[10px] font-bold uppercase underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <label className="block text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Discounts Ledger Key
                    </label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="PROMO CODE"
                          className={`w-full rounded-lg border py-2 pl-8 pr-3 text-[11px] font-mono outline-none transition-all ${
                            isDark 
                              ? 'border-slate-800 bg-slate-950 text-white focus:border-purple-500' 
                              : 'border-slate-200 bg-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                          }`}
                        />
                        <Ticket className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <button
                        type="submit"
                        disabled={isApplying || !promoInput.trim()}
                        className={`rounded-lg ${theme.accentBg} ${theme.accentHoverBg} px-3 py-2 text-[11px] font-bold text-white disabled:opacity-40 transition-colors shadow-sm cursor-pointer`}
                      >
                        {isApplying ? <Loader className="h-3.5 w-3.5 animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                    {promoMessage && (
                      <p className={`text-[10px] font-medium ${promoMessage.isError ? 'text-red-505 text-red-500' : 'text-emerald-505 text-emerald-600'}`}>
                        {promoMessage.text}
                      </p>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* Price Calculations Sheet */}
            <div className={`space-y-2 pt-4 border-t text-xs text-slate-400 font-medium ${isDark ? 'border-slate-800' : 'border-slate-250/60'}`}>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-current">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-510 dark:text-emerald-400 font-mono">
                  <span>Promo Reduction</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Logistic Shipping Care</span>
                <span className="font-mono text-current">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Value Tax ({settings.taxRate * 100}%)</span>
                <span className="font-mono text-current">{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-dashed border-current/10 mt-3 pt-4 flex justify-between items-baseline text-current">
                <span className="font-bold text-sm">TOTAL INVESTMENT</span>
                <span className="font-mono text-base font-black text-indigo-600 dark:text-purple-400">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <div className={`pt-4 border-t text-[10px] text-slate-400 text-center leading-relaxed ${isDark ? 'border-slate-800' : 'border-slate-250/60'}`}>
              Transactions are securely monitored and audited to guarantee frictionless shipping care.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
