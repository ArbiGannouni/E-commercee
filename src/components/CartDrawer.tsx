/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../state/StoreContext';
import { X, Plus, Minus, Trash2, Tag, Loader } from 'lucide-react';
import { getTranslation } from '../utils/translations';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    updateCartQty,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    activePromo,
    setView,
    settings,
    formatPrice
  } = useStore();

  const t = getTranslation(settings.language);

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  // Real-time pricing calculations
  const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
  const discountPercent = activePromo ? activePromo.percent : 0;
  const discount = Number((subtotal * (discountPercent / 100)).toFixed(2));
  const itemsTotal = subtotal - discount;
  const shippingThreshold = 150.30;
  const isFreeShipping = itemsTotal > shippingThreshold;
  const shipping = cart.length === 0 ? 0 : (isFreeShipping ? 0 : settings.shippingRate);
  const calculatedTax = Number((itemsTotal * settings.taxRate).toFixed(2));
  const grandTotal = Number((itemsTotal + shipping + calculatedTax).toFixed(2));

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

  const handleCheckoutTrigger = () => {
    setCartOpen(false);
    setView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        
        {/* Backdrop overlay */}
        <div 
          onClick={() => setCartOpen(false)}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        ></div>

        {/* Sliding Panel */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col bg-white shadow-2xl">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-display text-sm font-bold tracking-widest text-slate-900 uppercase">
                    {t.your_cart}
                  </span>
                  <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                    {cart.reduce((s, c) => s + c.quantity, 0)} {settings.language === 'fr' ? 'Articles' : 'Items'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-900 outline-none transition-colors"
                  id="close-cart-drawer-btn"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body - Item List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center" id="empty-cart-state">
                    <div className="rounded-full bg-slate-50 p-6 mb-4">
                      <X className="h-8 w-8 text-slate-300 stroke-1" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-slate-900 animate-fade-in">{t.cart_empty}</h3>
                    <p className="mt-1 text-xs text-slate-400 max-w-xs leading-relaxed">
                      {settings.language === 'fr' ? 'Découvrez notre collection d’objets d’artisanat d’art et enrichissez votre bureau au quotidien.' : 'Discover our curated design selection and find the perfect objects for your workday visual landscape.'}
                    </p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                      {settings.language === 'fr' ? 'Explorer la Boutique' : 'Browse Modern Objects'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    {cart.map((item) => {
                      const finalLimit = item.product.stock;
                      return (
                        <div 
                          key={item.product.id}
                          className="flex items-center space-x-4 border-b border-slate-105 pb-4"
                          id={`cart-item-${item.product.id}`}
                        >
                          {/* Item Thumbnail */}
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          {/* Item Copy Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                                  {item.product.name}
                                </h4>
                                <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider block mt-0.5">
                                  {item.product.category}
                                </span>
                              </div>
                              <span className="text-xs font-mono font-semibold text-slate-900">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>

                            {/* Item Action Bar */}
                            <div className="flex items-center justify-between mt-3">
                              {/* Stock status indicator */}
                              <span className="text-[10px] font-mono font-medium text-slate-400">
                                {finalLimit <= 5 ? `Only ${finalLimit} left` : 'In Stock'}
                              </span>

                              <div className="flex items-center space-x-3">
                                {/* Qty Stepper */}
                                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overscroll-contain">
                                  <button
                                    onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                                    className="p-1 px-1.5 hover:bg-slate-150 text-slate-500 rounded-l-lg transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="text-xs font-mono font-semibold w-7 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                                    className="p-1 px-1.5 hover:bg-slate-150 text-slate-500 rounded-r-lg disabled:opacity-30 transition-colors"
                                    disabled={item.quantity >= finalLimit}
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>

                                {/* Trash bin */}
                                <button
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Drawer Footer - Totals & Promotions */}
              {cart.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50 px-6 py-6 space-y-4">
                  {/* Free shipping progression bar */}
                  {!isFreeShipping && (
                    <div className="rounded-lg bg-amber-50 p-3 border border-amber-100 flex flex-col space-y-1.5 shadow-sm">
                      <div className="flex justify-between items-center text-[11px] text-amber-800 font-medium">
                        <span>{settings.language === 'fr' ? `Ajoutez ${formatPrice(shippingThreshold - itemsTotal)} pour la Livraison Gratuite` : `Spend ${formatPrice(shippingThreshold - itemsTotal)} more for Free Shipping`}</span>
                        <span className="font-semibold">{Math.round((itemsTotal / shippingThreshold) * 100)}%</span>
                      </div>
                      <div className="w-full bg-amber-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (itemsTotal / shippingThreshold) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Promo Input Section */}
                  <div className="border-b border-slate-200/60 pb-3.5">
                    {activePromo ? (
                      <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs">
                        <div className="flex items-center space-x-2 text-emerald-800 font-medium">
                          <Tag className="h-3.5 w-3.5" />
                          <span>{settings.language === 'fr' ? 'Code : ' : 'Code: '}<strong>{activePromo.code}</strong> {settings.language === 'fr' ? 'appliqué' : 'Applied'}</span>
                        </div>
                        <button 
                          onClick={handleRemovePromo}
                          className="text-slate-405 hover:text-indigo-600 text-[10px] font-semibold underline uppercase transition-colors"
                        >
                          {settings.language === 'fr' ? 'Retirer' : 'Remove'}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="space-y-2">
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={promoInput}
                              onChange={(e) => setPromoInput(e.target.value)}
                              placeholder={settings.language === 'fr' ? "CODE PROMO (ex: WELCOME10)" : "PROMO CODE (e.g., WELCOME10)"}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-8 text-[11px] font-mono outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <Tag className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <button
                            type="submit"
                            disabled={isApplying || !promoInput.trim()}
                            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors shadow-sm"
                          >
                            {isApplying ? <Loader className="h-3.5 w-3.5 animate-spin" /> : (settings.language === 'fr' ? 'Valider' : 'Apply')}
                          </button>
                        </div>
                        {promoMessage && (
                          <p className={`text-[10px] font-medium ${promoMessage.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                            {promoMessage.text}
                          </p>
                        )}
                      </form>
                    )}
                  </div>

                  {/* Calculations Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>{t.subtotal}</span>
                      <span className="font-mono">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold font-mono">
                        <span>{settings.language === 'fr' ? 'Remise' : 'Discount'} ({discountPercent}%)</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>{t.shipping}</span>
                      <span className="font-semibold font-mono">
                        {shipping === 0 ? (settings.language === 'fr' ? 'GRATUIT' : 'FREE') : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>{t.tax} ({settings.taxRate * 100}%)</span>
                      <span className="font-mono">{formatPrice(calculatedTax)}</span>
                    </div>
                    <div className="border-t border-slate-200 mt-2 pt-3 flex justify-between items-baseline text-slate-900">
                      <span className="font-bold text-sm">{settings.language === 'fr' ? 'Total Estimé' : 'Estimated Total'}</span>
                      <span className="font-mono text-lg font-bold text-indigo-600">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Primary Call to Action */}
                  <div className="pt-2">
                    <button
                      onClick={handleCheckoutTrigger}
                      className="w-full rounded-xl bg-indigo-600 py-3.5 text-center text-xs font-bold uppercase tracking-widest text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-98"
                      id="checkout-trigger-btn"
                    >
                      {t.checkout}
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-2 leading-relaxed">
                      {settings.language === 'fr' 
                        ? "Chaque commande personnalisée comprend les taxes provinciales/d'état. Les codes d'entiercement sécurisés sont émis sur demande."
                        : "All custom quotes include state taxes. Instant escrow tracking codes is issued upon request submission."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
