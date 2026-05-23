/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../state/StoreContext';
import { Product, Order, OrderStatus } from '../types';
import { Star, SlidersHorizontal, ArrowLeft, ShieldAlert, Check, ShoppingCart, Clock, User, Calendar, MapPin, CreditCard, ChevronDown, ChevronUp, Package, Printer, ExternalLink, Sliders, MessageCircle, MessageSquare, Play, Film } from 'lucide-react';
import { getTheme } from '../utils/theme';
import { SpendingChart } from './SpendingChart';
import { getTranslation } from '../utils/translations';

const isVideoUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  const u = url.toLowerCase();
  return (
    u.includes('youtube.com') ||
    u.includes('youtu.be') ||
    u.includes('vimeo.com') ||
    u.endsWith('.mp4') ||
    u.endsWith('.webm') ||
    u.endsWith('.ogg') ||
    u.includes('/embed/') ||
    u.includes('video')
  );
};

interface ProductSkeletonProps {
  themeType: string;
  websiteTheme?: string;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ themeType, websiteTheme }) => {
  const isDark = websiteTheme === 'dark-obsidian';
  
  if (themeType === 'brutalist-grid') {
    return (
      <div className="flex flex-col bg-white border-[2.5px] border-slate-900 rounded-none p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] animate-pulse">
        {/* Media */}
        <div className="relative aspect-square w-full rounded-none border-b-2 border-slate-900 bg-slate-250">
          <div className="absolute top-2 left-2 h-4 w-16 bg-slate-300"></div>
        </div>
        {/* Text */}
        <div className="mt-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-4 w-16 bg-slate-200 border border-slate-900"></div>
              <div className="h-3 w-8 bg-slate-200"></div>
            </div>
            <div className="h-4 w-3/4 bg-slate-300"></div>
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-full bg-slate-100"></div>
              <div className="h-3 w-5/6 bg-slate-100"></div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
            <div className="h-4 w-12 bg-slate-300"></div>
          </div>
        </div>
      </div>
    );
  }

  if (themeType === 'glassmorphism-card') {
    return (
      <div className={`flex flex-col p-4 rounded-3xl border border-slate-100/50 animate-pulse ${
        isDark 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/40 border-slate-250/50 shadow-sm'
      }`}>
        {/* Media */}
        <div className={`aspect-square w-full rounded-2xl ${isDark ? 'bg-white/10' : 'bg-slate-200/60 shadow-inner'}`}></div>
        {/* Text */}
        <div className="mt-4 flex-grow space-y-3">
          <div className="flex justify-between items-center">
            <div className={`h-4 w-12 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200/80'}`}></div>
            <div className={`h-3 w-8 rounded ${isDark ? 'bg-white/10' : 'bg-slate-200/80'}`}></div>
          </div>
          <div className={`h-4.5 w-2/3 rounded-lg ${isDark ? 'bg-white/15' : 'bg-slate-300/85'}`}></div>
          <div className="space-y-1.5 pt-1">
            <div className={`h-3 w-full rounded ${isDark ? 'bg-white/5' : 'bg-slate-150'}`}></div>
            <div className={`h-3 w-5/6 rounded ${isDark ? 'bg-white/5' : 'bg-slate-150'}`}></div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className={`h-5 w-14 rounded-md ${isDark ? 'bg-white/15' : 'bg-slate-300'}`}></div>
            <div className={`h-8 w-16 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (themeType === 'editorial-list') {
    return (
      <div className={`flex flex-col md:flex-row rounded-2xl overflow-hidden border animate-pulse md:col-span-2 ${
        isDark 
          ? 'border-slate-800 bg-slate-900' 
          : 'border-slate-200 bg-white shadow-sm'
      }`}>
        {/* Media */}
        <div className={`w-full md:w-5/12 aspect-square md:aspect-auto md:h-64 border-b md:border-b-0 md:border-r ${
          isDark ? 'border-slate-800 bg-white/10' : 'border-slate-100 bg-slate-200/60'
        }`}></div>
        {/* Content */}
        <div className="flex-grow p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className={`h-4 w-20 rounded ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
              <div className={`h-3 w-8 rounded ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
            </div>
            <div className={`h-5 w-1/2 rounded ${isDark ? 'bg-white/15' : 'bg-slate-300'}`}></div>
            <div className="space-y-1.5 pt-1">
              <div className={`h-3 w-full rounded ${isDark ? 'bg-white/5' : 'bg-slate-150'}`}></div>
              <div className={`h-3 w-5/6 rounded ${isDark ? 'bg-white/5' : 'bg-slate-150'}`}></div>
              <div className={`h-3 w-2/3 rounded ${isDark ? 'bg-white/5' : 'bg-slate-150'}`}></div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200">
            <div className={`h-5 w-16 rounded ${isDark ? 'bg-white/15' : 'bg-slate-300'}`}></div>
            <div className={`h-8 w-20 rounded-xl ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT & CLEAN FLOATING CARDS
  return (
    <div className={`flex flex-col p-2.5 rounded-2xl border animate-pulse ${
      isDark 
        ? 'border-slate-800 bg-slate-900 shadow-none' 
        : 'border-slate-205/60 bg-white shadow-sm'
    }`}>
      {/* Media */}
      <div className={`aspect-square w-full rounded-xl border ${
        isDark ? 'border-slate-800 bg-white/10' : 'border-slate-205 bg-slate-200/60'
      }`}></div>
      {/* Text */}
      <div className="mt-4 flex-grow space-y-3 px-1">
        <div className="flex justify-between items-center">
          <div className={`h-3.5 w-12 rounded ${isDark ? 'bg-white/10' : 'bg-slate-150'}`}></div>
          <div className={`h-3 w-8 rounded ${isDark ? 'bg-white/10' : 'bg-slate-150'}`}></div>
        </div>
        <div className={`h-4 w-3/4 rounded ${isDark ? 'bg-white/15' : 'bg-slate-300'}`}></div>
        <div className="space-y-1.5 pt-1">
          <div className={`h-3 w-full rounded ${isDark ? 'bg-white/5' : 'bg-slate-150'}`}></div>
          <div className={`h-3 w-5/6 rounded ${isDark ? 'bg-white/5' : 'bg-slate-150'}`}></div>
        </div>
        <div className={`h-5 w-16 rounded pt-2 ${isDark ? 'bg-white/15' : 'bg-slate-300'}`}></div>
      </div>
    </div>
  );
};

export const ShopLayout: React.FC = () => {
  const {
    products,
    currentCategory,
    setCategory,
    searchKeyword,
    activeProductDetail,
    setDetail,
    addToCart,
    trackingOrderId,
    setTrackingOrderId,
    orders,
    settings,
    currentUser,
    formatPrice
  } = useStore();

  const [shopSection, setShopSection] = useState<'catalog' | 'orders'>('catalog');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderStatus>('All');
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [selectedDetailImage, setSelectedDetailImage] = useState<string | null>(null);
  const [viewingVideo, setViewingVideo] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setShopSection('catalog');
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeProductDetail) {
      setSelectedDetailImage(activeProductDetail.image);
      setViewingVideo(false);
    } else {
      setSelectedDetailImage(null);
      setViewingVideo(false);
    }
  }, [activeProductDetail]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550); // Satisfying, brief loader transition
    return () => clearTimeout(timer);
  }, [currentCategory, searchKeyword]);

  const theme = getTheme(settings.websiteTheme);
  const t = getTranslation(settings.language);

  // Filter products by category and active search term
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = currentCategory === 'All' || prod.category === currentCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          prod.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          prod.tags.some(t => t.toLowerCase().includes(searchKeyword.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Extract all categories dynamically
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Retrieve tracked order if search query active
  const trackedOrder = orders.find(o => o.id.toUpperCase() === trackingOrderId?.toUpperCase());

  // Filter orders related to log-in customer ID/email
  const userOrders = orders
    .filter(o => o.customerEmail.toLowerCase() === (currentUser?.email || '').toLowerCase())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter user orders by status and SearchQuery (order ID or product names in order)
  const filteredUserOrders = userOrders.filter(order => {
    const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
    const matchesSearch = order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          order.items.some(item => item.productName.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleAddToCartWithNotify = (product: Product, qty: number) => {
    addToCart(product, qty);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. ORDER TRACKING OVERLAY / HIGHLIGHT */}
      {trackingOrderId && (
        <div className="mb-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm" id="order-tracking-portal">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping"></div>
              <h2 className="font-display text-md font-bold text-slate-900 tracking-tight">Active Consignment Routing</h2>
            </div>
            <button
              onClick={() => setTrackingOrderId(null)}
              className="text-xs font-mono font-semibold text-slate-400 hover:text-indigo-600"
            >
              ← Close Tracking Console
            </button>
          </div>

          {trackedOrder ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Timeline diagram */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block font-mono text-[10px] text-slate-400">TRACKING IDENTIFIER</span>
                    <span className="font-mono text-sm font-bold text-slate-900">{trackedOrder.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-[10px] text-slate-400">ROUTING STATUS</span>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      trackedOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      trackedOrder.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                      trackedOrder.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {trackedOrder.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Styled Pipeline Steps */}
                <div className="relative pt-4 pb-8">
                  <div className="absolute left-[15px] top-[15px] bottom-0 w-0.5 bg-slate-100 hidden sm:block"></div>
                  <div className="absolute left-0 right-0 top-[20px] h-0.5 bg-slate-100 hidden sm:flex justify-between -z-10"></div>
                  
                  {/* Timeline Horizontal / Vertical */}
                  <div className="flex flex-col sm:flex-row justify-between relative space-y-6 sm:space-y-0">
                    
                    {/* Step 1: Registered */}
                    <div className="flex sm:flex-col items-center sm:items-center text-left sm:text-center relative">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white ${
                        ['Pending', 'Shipped', 'Delivered'].includes(trackedOrder.status) ? 'bg-slate-900 text-white' : 'bg-slate-105 text-slate-400'
                      }`}>
                        1
                      </div>
                      <div className="ml-4 sm:ml-0 sm:mt-2">
                        <span className="block text-xs font-bold text-slate-900">Request Received</span>
                        <span className="block text-[10px] text-slate-400 font-mono">Approved Escrow</span>
                      </div>
                    </div>

                    {/* Step 2: Dispatched */}
                    <div className="flex sm:flex-col items-center sm:items-center text-left sm:text-center relative">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white ${
                        ['Shipped', 'Delivered'].includes(trackedOrder.status) ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-105 text-slate-400'
                      }`}>
                        2
                      </div>
                      <div className="ml-4 sm:ml-0 sm:mt-2">
                        <span className="block text-xs font-bold text-slate-900">Out for Transport</span>
                        <span className="block text-[10px] text-slate-400 font-mono">Consolidated Track</span>
                      </div>
                    </div>

                    {/* Step 3: Arrived */}
                    <div className="flex sm:flex-col items-center sm:items-center text-left sm:text-center relative">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white ${
                        trackedOrder.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-slate-105 text-slate-400'
                      }`}>
                        3
                      </div>
                      <div className="ml-4 sm:ml-0 sm:mt-2">
                        <span className="block text-xs font-bold text-slate-900">Consignment Arrived</span>
                        <span className="block text-[10px] text-slate-400 font-mono">Verified Signature</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Order Summary list */}
                <div className="space-y shadow-inner p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-900 mb-2">Items inside this routing:</h4>
                  <div className="space-y-2">
                    {trackedOrder.items.map((it: any) => (
                      <div key={it.productId} className="flex justify-between items-center text-xs text-slate-650">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded bg-white border border-slate-200 overflow-hidden">
                            <img src={it.image} alt={it.productName} className="h-full w-full object-cover" />
                          </div>
                          <span className="text-slate-700">{it.productName} <strong className="text-indigo-600">× {it.quantity}</strong></span>
                        </div>
                        <span className="font-mono font-semibold text-slate-900">
                          {settings.baseCurrency}{(it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shipping specifications */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-150 space-y-4 text-xs">
                <div>
                  <h4 className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-1.5">Consignee Address</h4>
                  <p className="font-bold text-slate-900">{trackedOrder.customerName}</p>
                  <p className="text-slate-500 mt-1">{trackedOrder.shippingAddress.street}</p>
                  <p className="text-slate-500">{trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.zipCode}</p>
                  <p className="text-slate-500 font-medium">{trackedOrder.shippingAddress.country}</p>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <h4 className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-1.5">Charge Ledger</h4>
                  <div className="space-y-1 text-slate-550">
                    <div className="flex justify-between">
                      <span>Consignment Total</span>
                      <span className="font-mono font-medium text-slate-900">{settings.baseCurrency}{trackedOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span className="font-medium text-slate-900">{trackedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 pb-1 flex items-center space-x-2 text-slate-400">
                  <Clock className="h-4 w-4 text-indigo-550" />
                  <span className="text-[10px]">Expected within 5 transport dates.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-slate-500 text-xs">
              <ShieldAlert className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              There is no record of an order tracking ledger with ID "<strong>{trackingOrderId}</strong>". Please verify your entry.
            </div>
          )}
        </div>
      )}

      {/* 2. MAIN STOREFRONT HERO BANNERS */}
      {settings.showHeroBanner !== false && (() => {
        const theme = (() => {
          switch (settings.bannerType || 'classic-slate') {
            case 'ocean-cinematic':
              return {
                container: 'bg-teal-950 text-teal-100 border border-teal-900/55',
                overlay: 'from-teal-950 via-teal-950/85 to-transparent',
                badge: 'border-cyan-400/60 bg-cyan-900/20 text-cyan-300',
                title: 'text-white',
                desc: 'text-teal-200',
                button: 'bg-cyan-505 text-slate-950 hover:bg-cyan-400 font-bold shadow-md hover:shadow-cyan-500/30',
                opacity: 'opacity-40',
                coverImg: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1600&q=80'
              };
            case 'workspace-ambient':
              return {
                container: 'bg-neutral-900 text-stone-105 border border-neutral-800',
                overlay: 'from-neutral-900 via-neutral-900/85 to-transparent',
                badge: 'border-amber-400/50 bg-amber-500/10 text-amber-300',
                title: 'text-white',
                desc: 'text-stone-300',
                button: 'bg-amber-600 text-white hover:bg-amber-500 font-semibold shadow-md hover:shadow-amber-600/30',
                opacity: 'opacity-45',
                coverImg: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80'
              };
            case 'cosmic-starfall':
              return {
                container: 'bg-violet-950 text-indigo-100 border border-violet-900/53',
                overlay: 'from-violet-950 via-violet-950/80 to-transparent',
                badge: 'border-pink-400 bg-pink-500/10 text-pink-300',
                title: 'text-white',
                desc: 'text-violet-200',
                button: 'bg-pink-600 text-white hover:bg-pink-500 font-bold shadow-md hover:shadow-pink-600/30',
                opacity: 'opacity-45',
                coverImg: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1600&q=80'
              };
            case 'cosmic-night':
              return {
                container: 'bg-indigo-950 text-indigo-100 border border-indigo-900/50',
                overlay: 'from-indigo-950 via-indigo-950/80 to-transparent',
                badge: 'border-purple-400/50 bg-purple-500/10 text-purple-300',
                title: 'text-white',
                desc: 'text-indigo-200',
                button: 'bg-purple-600 text-white hover:bg-purple-750 shadow-md hover:shadow-purple-400/40',
                opacity: 'opacity-40',
                coverImg: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1600&q=80'
              };
            case 'emerald-glass':
              return {
                container: 'bg-emerald-950 text-emerald-100 border border-emerald-900/50',
                overlay: 'from-emerald-950 via-emerald-950/80 to-transparent',
                badge: 'border-amber-400/50 bg-amber-500/10 text-amber-300',
                title: 'text-white',
                desc: 'text-emerald-200',
                button: 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-md hover:shadow-amber-500/40 font-bold',
                opacity: 'opacity-30',
                coverImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80'
              };
            case 'warm-oak':
              return {
                container: 'bg-stone-900 text-stone-100 border border-stone-800',
                overlay: 'from-stone-900 via-stone-900/80 to-transparent',
                badge: 'border-orange-400/50 bg-orange-500/10 text-orange-300',
                title: 'text-white',
                desc: 'text-stone-300',
                button: 'bg-orange-600 text-white hover:bg-orange-500 shadow-md hover:shadow-orange-400/40 font-semibold',
                opacity: 'opacity-40',
                coverImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=80'
              };
            case 'minimal-cream':
              return {
                container: 'bg-slate-50 text-slate-800 border border-slate-200',
                overlay: 'from-slate-50 via-slate-50/90 to-transparent',
                badge: 'border-slate-300 bg-slate-100 text-slate-600',
                title: 'text-slate-900',
                desc: 'text-slate-500',
                button: 'bg-slate-900 text-white hover:bg-slate-805 shadow-md hover:shadow-slate-400/40',
                opacity: 'opacity-25',
                coverImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80'
              };
            case 'classic-slate':
            default:
              return {
                container: 'bg-slate-900 text-white',
                overlay: 'from-slate-900 via-slate-900/80 to-transparent',
                badge: 'border-indigo-400 bg-indigo-500/10 text-indigo-300',
                title: 'text-white',
                desc: 'text-slate-300',
                button: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-300/40',
                opacity: 'opacity-40',
                coverImg: 'https://images.unsplash.com/photo-1593642702821-c8da63116c2c?w=1600&q=80'
              };
          }
        })();

        return (
          <div className={`mb-12 relative overflow-hidden rounded-3xl min-h-[420px] flex items-center p-8 sm:p-16 shadow-lg shadow-slate-203 transition-all duration-300 ${theme.container}`}>
            {/* Ambient template background image (IMAGE ONLY) */}
            <div className={`absolute inset-0 z-0 ${theme.opacity}`}>
              <img 
                src={settings.bannerImage || theme.coverImg} 
                alt="Storefront Hero" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.overlay} z-5`}></div>
            
            <div className="relative z-10 max-w-xl space-y-6">
              <span className={`pointer-events-none rounded-full border px-3.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase ${theme.badge}`}>
                {settings.bannerBadge || 'Curated Collection // Spring Release'}
              </span>
              <h1 className={`font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-none ${theme.title}`}>
                {settings.bannerTitle || 'Instruments for the Fine Craft.'}
              </h1>
              <p className={`text-sm leading-relaxed max-w-md ${theme.desc}`}>
                {settings.bannerDesc || 'Our latest design objects merge resilient structures with premium natural materials, engineered to introduce harmony to your daily workspaces.'}
              </p>
              <div className="pt-3">
                <button
                  onClick={() => {
                    const risers = document.getElementById('catalogue-filter-bar');
                    if (risers) risers.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all ${theme.button}`}
                >
                  {settings.bannerBtnText || 'Examine Acquisitions ↓'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2.5 DEDICATED CINEMATIC VIDEO CAMPAIGN BANNER */}
      {settings.showVideoBanner !== false && (() => {
        if (settings.videoBannerType === 'pure-video') {
          return (
            <div className="mb-12 relative overflow-hidden rounded-3xl aspect-[16/9] lg:aspect-[21/9] w-full bg-slate-950 border border-slate-200/10 shadow-2xl transition-all duration-300">
              <video
                src={settings.videoBannerVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41225-large.mp4'}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          );
        }

        const videoTheme = (() => {
          switch (settings.videoBannerType || 'ocean-cinematic') {
            case 'workspace-ambient':
              return {
                container: 'bg-neutral-950 text-stone-105 border border-neutral-805',
                overlay: 'from-neutral-950 via-neutral-950/80 to-transparent',
                badge: 'border-amber-400/60 bg-amber-500/10 text-amber-300',
                title: 'text-white',
                desc: 'text-stone-300',
                button: 'bg-amber-600 text-white hover:bg-amber-500 shadow-md hover:shadow-amber-653/30 font-semibold',
                opacity: 'opacity-45',
                defaultVideo: 'https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-notebook-computer-close-up-of-hands-41481-large.mp4'
              };
            case 'cosmic-starfall':
              return {
                container: 'bg-violet-950 text-indigo-100 border border-violet-900/53',
                overlay: 'from-violet-950 via-violet-950/80 to-transparent',
                badge: 'border-pink-400 bg-pink-500/10 text-pink-300',
                title: 'text-white',
                desc: 'text-violet-200',
                button: 'bg-pink-600 text-white hover:bg-pink-500 shadow-md hover:shadow-pink-612/30 font-bold',
                opacity: 'opacity-45',
                defaultVideo: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-shining-stars-and-clouds-40913-large.mp4'
              };
            case 'ocean-cinematic':
            default:
              return {
                container: 'bg-teal-950 text-teal-100 border border-teal-900/55',
                overlay: 'from-teal-950 via-teal-950/85 to-transparent',
                badge: 'border-cyan-400 bg-cyan-900/20 text-cyan-300',
                title: 'text-white',
                desc: 'text-teal-200',
                button: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md hover:shadow-cyan-533/30 font-bold',
                opacity: 'opacity-45',
                defaultVideo: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41225-large.mp4'
              };
          }
        })();

        return (
          <div className={`mb-12 relative overflow-hidden rounded-3xl min-h-[425px] flex items-center p-8 sm:p-16 shadow-lg shadow-slate-203 transition-all duration-300 ${videoTheme.container}`}>
            {/* Ambient template background video */}
            <div className={`absolute inset-0 z-0 ${videoTheme.opacity}`}>
              <video
                src={settings.videoBannerVideoUrl || videoTheme.defaultVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute inset-0 bg-gradient-to-r ${videoTheme.overlay} z-5`}></div>
            
            <div className="relative z-10 max-w-xl space-y-6">
              <span className={`pointer-events-none rounded-full border px-3.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase ${videoTheme.badge}`}>
                {settings.videoBannerBadge || 'CINEMATIC AUTOPLAY FEED'}
              </span>
              <h2 className={`font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-none ${videoTheme.title}`}>
                {settings.videoBannerTitle || 'Experience Pure Stationery Craft.'}
              </h2>
              <p className={`text-sm leading-relaxed max-w-md ${videoTheme.desc}`}>
                {settings.videoBannerDesc || 'Dive into our breathtaking sea-inspired stationery and limited edition travel diaries, capturing coastal magic on sand-colored coordinates.'}
              </p>
              <div className="pt-3">
                <button
                  onClick={() => {
                    const risers = document.getElementById('catalogue-filter-bar');
                    if (risers) risers.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all ${videoTheme.button}`}
                >
                  {settings.videoBannerBtnText || 'EXPERIENCE LIVE CAMPAIGN ↓'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SECTION TABS FOR REGISTERED USERS */}
      {currentUser && (
        <div className="mb-8 flex space-x-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit border border-slate-150 dark:border-slate-800" id="shop-view-segment-control">
          <button
            onClick={() => setShopSection('catalog')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              shopSection === 'catalog'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📦 {t.browse_collection_btn || 'Browse Collection'}
          </button>
          <button
            onClick={() => {
              setShopSection('orders');
              setExpandedOrderId(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 relative ${
              shopSection === 'orders'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🕰️ {t.order_history_btn || 'Order History'}
            {userOrders.length > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold font-mono bg-indigo-150 text-indigo-805 dark:bg-indigo-950/50 dark:text-indigo-350 rounded-full animate-bounce">
                {userOrders.length}
              </span>
            )}
          </button>
        </div>
      )}

      {shopSection === 'catalog' ? (
        <>
          {/* 3. CATEGORIES INDEX & SEARCH LABELS */}
      <div 
        id="catalogue-filter-bar" 
        className={`mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 ${theme.borderColor}`}
      >
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer transition-all duration-200 border ${
                  currentCategory === cat
                    ? `${theme.accentBg} ${theme.accentBorder} text-white font-semibold shadow-md shadow-sm`
                    : `${theme.cardBg} ${theme.textSecondary} ${theme.borderColor} hover:bg-slate-50 hover:text-current shadow-sm`
                }`}
              >
                {cat === 'All' ? t.all_categories : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-400 font-mono uppercase tracking-wider">
          {settings.language === 'fr' 
            ? `AFFICHAGE DE ${filteredProducts.length} SUR ${products.length} OBJETS` 
            : `DISPLAYING ${filteredProducts.length} OF ${products.length} OBJECTS`}
        </div>
      </div>

      {/* 4. PRODUCT MATRIX GRID */}
      {isLoading ? (
        <div id="products-catalog-grid" className={
          (settings.productGridTheme || 'minimal-floating') === 'editorial-list'
            ? "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
            : "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8"
        }>
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductSkeleton key={`skel-${idx}`} themeType={settings.productGridTheme || 'minimal-floating'} websiteTheme={settings.websiteTheme} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={`py-24 text-center rounded-2xl border border-dashed ${theme.borderColor} ${theme.cardBg}`} id="no-search-results">
          <div className="h-10 w-10 text-slate-300 mx-auto mb-3">⎋</div>
          <h3 className="font-display text-sm font-bold text-current">
            {settings.language === 'fr' ? 'Aucun objet ne correspond à vos paramètres' : 'No objects align with your parameters'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {settings.language === 'fr' 
              ? "Essayez d'ajuster vos termes de recherche ou d'élargir vos filtres de catégories." 
              : "Try adjusting your search terms or choosing a different architectural categorization filter."}
          </p>
        </div>
      ) : (
        <div id="products-catalog-grid" className={
          (settings.productGridTheme || 'minimal-floating') === 'editorial-list'
            ? "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
            : "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8"
        }>
          {filteredProducts.map((p) => {
            const hasPromoDiscount = p.originalPrice && p.originalPrice > p.price;
            const isOutOfStock = p.stock <= 0;
            const cardTheme = settings.productGridTheme || 'minimal-floating';

            // --- TEMPLATE 1: STARK RETRO BRUTALIST ---
            if (cardTheme === 'brutalist-grid') {
              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col bg-white border-[2.5px] border-slate-900 rounded-none p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:translate-x-0.5 transition-all duration-200"
                  onMouseEnter={() => setHoveredCardId(p.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  id={`product-card-${p.id}`}
                >
                  {/* Media */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-none border-b-2 border-slate-900 bg-slate-50 cursor-pointer">
                    {isOutOfStock ? (
                      <span className="absolute left-2 top-2 z-10 rounded-none bg-black text-white px-2 py-0.5 text-[8.5px] font-bold font-mono tracking-wider uppercase">
                        DEPLETED
                      </span>
                    ) : p.stock <= 5 ? (
                      <span className="absolute left-2 top-2 z-10 rounded-none bg-rose-600 text-white px-2 py-0.5 text-[8.5px] font-bold font-mono tracking-wider uppercase">
                        CRITICAL ({p.stock})
                      </span>
                    ) : hasPromoDiscount ? (
                      <span className="absolute left-2 top-2 z-10 rounded-none bg-emerald-650 text-white px-2 py-0.5 text-[8.5px] font-bold font-mono tracking-wider uppercase">
                        PROMO SLOT
                      </span>
                    ) : null}

                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-103"
                      onClick={() => { setDetail(p); setDetailQuantity(1); }}
                    />

                    {!isOutOfStock && (
                      <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2 bg-slate-900 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleAddToCartWithNotify(p, 1)}
                          className="w-full flex items-center justify-center space-x-1 rounded-none bg-white text-slate-900 py-1.5 sm:py-2.5 text-[8.5px] sm:text-[9.5px] font-mono font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer border-2 border-slate-900"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          <span className="truncate">QUICK ADD</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Text info layout */}
                  <div className="mt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-mono text-[9px] tracking-widest text-slate-900 font-bold uppercase bg-slate-100 px-1.5 py-0.5 border border-slate-900">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-slate-900 flex items-center font-bold">
                          ★ {p.rating}
                        </span>
                      </div>

                      <h3 
                        onClick={() => { setDetail(p); setDetailQuantity(1); }}
                        className="text-xs font-mono font-bold text-slate-900 tracking-tight line-clamp-1 cursor-pointer hover:underline"
                      >
                        {p.name}
                      </h3>
                      <p className="mt-1 text-[10px] font-mono text-slate-500 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-2 flex items-baseline space-x-2 pt-2 border-t border-dashed border-slate-200">
                      <span className={`${settings.priceColor || 'text-slate-900'} ${settings.priceSize || 'text-xs'}`}>
                        {formatPrice(p.price)}
                      </span>
                      {hasPromoDiscount && (
                        <span className={`${settings.originalPriceColor || 'text-slate-400 line-through'} ${settings.originalPriceSize || 'text-[10px]'}`}>
                          {formatPrice(p.originalPrice || 0)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // --- TEMPLATE 2: HOLOGRAPHIC GLASSMORPHISM ---
            if (cardTheme === 'glassmorphism-card') {
              const isDarkTheme = settings.websiteTheme === 'dark-obsidian';
              return (
                <div
                  key={p.id}
                  className={`group relative flex flex-col p-4 rounded-3xl border transition-all duration-300 ${
                    isDarkTheme
                      ? 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/20'
                      : 'bg-white/40 backdrop-blur-md border-slate-250/50 hover:bg-white/60 hover:border-slate-350 hover:shadow-md'
                  }`}
                  onMouseEnter={() => setHoveredCardId(p.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  id={`product-card-${p.id}`}
                >
                  <div className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-white/20 border cursor-pointer ${isDarkTheme ? 'border-white/5' : 'border-slate-100'}`}>
                    {isOutOfStock ? (
                      <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-0.5 text-[8px] font-bold tracking-wider uppercase">
                        DEPLETED
                      </span>
                    ) : p.stock <= 5 ? (
                      <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-rose-500/80 backdrop-blur-sm text-white px-2.5 py-0.5 text-[8px] font-bold tracking-wider uppercase">
                        STOCK: {p.stock}
                      </span>
                    ) : hasPromoDiscount ? (
                      <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-emerald-500/85 backdrop-blur-sm text-white px-2.5 py-0.5 text-[8px] font-bold tracking-wider uppercase">
                        OFFER
                      </span>
                    ) : null}

                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center transition-transform duration-550 ease-out group-hover:scale-104"
                      onClick={() => { setDetail(p); setDetailQuantity(1); }}
                    />

                    {!isOutOfStock && (
                      <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2 bg-slate-900/45 backdrop-blur-md flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleAddToCartWithNotify(p, 1)}
                          className={`w-full flex items-center justify-center space-x-1 rounded-xl ${theme.accentBg} text-white py-1.5 sm:py-2.5 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm`}
                        >
                          <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span className="truncate">{settings.language === 'fr' ? 'AJOUTER' : 'ADD TO LIST'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`font-mono text-[9.5px] tracking-widest ${theme.accentText} font-bold uppercase`}>
                          {p.category}
                        </span>
                        <span className="text-[10px] text-current/75 flex items-center">
                          ★ {p.rating}
                        </span>
                      </div>

                      <h3 
                        onClick={() => { setDetail(p); setDetailQuantity(1); }}
                        className="text-xs font-bold leading-tight cursor-pointer hover:underline text-current line-clamp-1"
                      >
                        {p.name}
                      </h3>
                      <p className="mt-1 text-[10px] text-current/60 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-baseline space-x-2 pt-2 border-t border-current/10">
                      <span className={`${settings.priceColor || 'text-current'} ${settings.priceSize || 'text-xs'}`}>
                        {formatPrice(p.price)}
                      </span>
                      {hasPromoDiscount && (
                        <span className={`${settings.originalPriceColor || 'text-current/40 line-through'} ${settings.originalPriceSize || 'text-[9.5px]'}`}>
                          {formatPrice(p.originalPrice || 0)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // --- TEMPLATE 3: EDITORIAL PORTFOLIO PANEL ---
            if (cardTheme === 'editorial-list') {
              return (
                <div
                  key={p.id}
                  className={`group relative flex flex-col md:flex-row rounded-2xl overflow-hidden border transition-all duration-300 md:col-span-2 ${
                    settings.websiteTheme === 'dark-obsidian'
                      ? 'border-slate-800 bg-slate-900 hover:border-slate-705'
                      : `${theme.borderColor} ${theme.cardBg} hover:shadow-md`
                  }`}
                  onMouseEnter={() => setHoveredCardId(p.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  id={`product-card-${p.id}`}
                >
                  {/* Left horizontal image */}
                  <div className={`relative w-full md:w-5/12 aspect-square md:aspect-auto md:h-64 overflow-hidden bg-slate-50 cursor-pointer border-b md:border-b-0 md:border-r ${
                    settings.websiteTheme === 'dark-obsidian' ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                    {isOutOfStock ? (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-slate-900 border px-2.5 py-0.5 text-[8px] font-bold font-mono text-slate-450 uppercase">
                        OUT OF ACQUISITION
                      </span>
                    ) : p.stock <= 5 ? (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-rose-100 text-rose-850 px-2.5 py-0.5 text-[8px] font-bold font-mono uppercase">
                        LIMITED RUN ({p.stock})
                      </span>
                    ) : hasPromoDiscount ? (
                      <span className="absolute left-3 top-3 z-10 bg-emerald-100 text-emerald-800 rounded-full px-2.5 py-0.5 text-[8px] font-bold font-mono uppercase">
                        SPECIAL RELEASE
                      </span>
                    ) : null}

                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
                      onClick={() => { setDetail(p); setDetailQuantity(1); }}
                    />
                  </div>

                  {/* Right description column space */}
                  <div className="flex-grow p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`font-mono text-[10px] tracking-wider uppercase font-extrabold ${theme.accentText}`}>
                          {p.category} // SERIAL_OBJ
                        </span>
                        <span className="text-xs text-current/80 flex items-center font-bold">
                          ★ {p.rating}
                        </span>
                      </div>

                      <h3 
                        onClick={() => { setDetail(p); setDetailQuantity(1); }}
                        className="text-sm font-bold tracking-tight hover:underline cursor-pointer text-current mb-2"
                      >
                        {p.name}
                      </h3>
                      
                      <p className="text-xs text-current/70 leading-relaxed mb-4 line-clamp-3">
                        {p.description}
                      </p>

                      <div className="pt-3 flex flex-wrap gap-2">
                        {p.tags?.map(t => (
                          <span key={t} className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                            settings.websiteTheme === 'dark-obsidian' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                          }`}>
                            #{t.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-current/10">
                      <div className="flex items-baseline space-x-2">
                        <span className={`${settings.priceColor || 'text-current'} ${settings.priceSize || 'text-sm'}`}>
                          {formatPrice(p.price)}
                        </span>
                        {hasPromoDiscount && (
                          <span className={`${settings.originalPriceColor || 'text-current/40 line-through'} ${settings.originalPriceSize || 'text-xs'}`}>
                            {formatPrice(p.originalPrice || 0)}
                          </span>
                        )}
                      </div>

                      {!isOutOfStock ? (
                        <button
                          onClick={() => handleAddToCartWithNotify(p, 1)}
                          className={`rounded-xl px-5 py-2.5 text-[9.5px] font-bold uppercase tracking-widest text-white shadow transition-all active:scale-97 cursor-pointer flex items-center space-x-1 ${theme.accentBg} ${theme.accentHoverBg}`}
                        >
                          <ShoppingCart className="h-3 w-3" />
                          <span>{settings.language === 'fr' ? 'AJOUTER' : 'ADD TO LIST'}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{settings.language === 'fr' ? 'ÉPUISÉ' : 'OUT OF STOCK'}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // --- TEMPLATE 4 (DEFAULT): CLEAN FLOATING CARDS ---
            return (
              <div
                key={p.id}
                className={`group relative flex flex-col p-2.5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
                  settings.websiteTheme === 'dark-obsidian'
                    ? 'border-slate-800 bg-slate-900 shadow-none'
                    : 'border-slate-205/60 bg-white shadow-sm'
                }`}
                onMouseEnter={() => setHoveredCardId(p.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                id={`product-card-${p.id}`}
              >
                {/* Image panel */}
                <div className={`relative aspect-square w-full overflow-hidden rounded-xl border bg-slate-100/40 cursor-pointer ${
                  settings.websiteTheme === 'dark-obsidian' ? 'border-slate-800' : 'border-slate-205'
                }`}>
                  {isOutOfStock ? (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-slate-100 border px-2.5 py-0.5 text-[8.5px] font-bold font-mono tracking-wider text-slate-500 uppercase">
                      DEPLETED
                    </span>
                  ) : p.stock <= 5 ? (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-rose-100 px-2.5 py-0.5 text-[8.5px] font-bold font-mono tracking-wider text-rose-700 uppercase">
                      CRITICAL STOCK ({p.stock})
                    </span>
                  ) : hasPromoDiscount ? (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[8.5px] font-bold font-mono tracking-wider text-emerald-805 uppercase">
                      SPECIAL ACQUISITION
                    </span>
                  ) : null}

                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    onClick={() => { setDetail(p); setDetailQuantity(1); }}
                  />

                  {!isOutOfStock && (
                    <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-3 bg-gradient-to-t from-slate-900/60 to-transparent flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleAddToCartWithNotify(p, 1)}
                        className={`w-full flex items-center justify-center space-x-1 sm:space-x-1.5 rounded-xl ${theme.accentBg} text-white py-1.5 sm:py-3 text-[8.5px] sm:text-[10px] font-bold uppercase tracking-widest ${theme.accentHoverBg} transition-all shadow-md active:scale-98`}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        <span className="truncate">{settings.language === 'fr' ? 'AJOUTER' : 'ADD TO LIST'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Info panels */}
                <div className="mt-4 flex-1 flex flex-col justify-between px-1">
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`font-mono text-[10px] tracking-widest ${theme.accentText} font-semibold uppercase`}>
                        {p.category}
                      </span>
                      <span className="text-[10px] text-current/75 flex items-center">
                        <Star className="h-3 w-3 fill-amber-450 text-amber-550 mr-0.5" />
                        <strong>{p.rating}</strong>
                      </span>
                    </div>

                    <h3 
                      onClick={() => { setDetail(p); setDetailQuantity(1); }}
                      className={`text-xs font-semibold line-clamp-1 cursor-pointer hover:${theme.accentText} transition-colors text-current`}
                    >
                      {p.name}
                    </h3>
                    
                    <p className="mt-1 text-[11px] text-current/60 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-baseline space-x-2">
                    <span className={`${settings.priceColor || 'text-current'} ${settings.priceSize || 'text-xs'}`}>
                      {formatPrice(p.price)}
                    </span>
                    {hasPromoDiscount && (
                      <span className={`${settings.originalPriceColor || 'text-current/50 line-through'} ${settings.originalPriceSize || 'text-[10px]'}`}>
                        {formatPrice(p.originalPrice || 0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      ) : (
        <div className="space-y-8 animate-fade-in text-xs" id="customer-order-history-dashboard">
          
          {/* Aether Ledger Hero Header Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="order-history-counters">
            
            <div className={`p-5 rounded-2xl border ${theme.cardBg} ${theme.borderColor} shadow-sm`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-b-current/10">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">{t.total_acquisitions}</span>
                <span className="p-1 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400">
                  <Package className="h-4 w-4" />
                </span>
              </div>
              <p className="text-xl font-bold font-display text-current">{userOrders.length}</p>
              <p className="text-[9.5px] text-slate-400 mt-1">{t.confirmed_design_orders}</p>
            </div>

            <div className={`p-5 rounded-2xl border ${theme.cardBg} ${theme.borderColor} shadow-sm`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-b-current/10">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">{t.consolidated_spent}</span>
                <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400">
                  <CreditCard className="h-4 w-4" />
                </span>
              </div>
              <p className="text-xl font-bold font-mono text-current">
                {settings.baseCurrency}{userOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
              </p>
              <p className="text-[9.5px] text-slate-400 mt-1">{t.acquisition_capital_volume}</p>
            </div>

            <div className={`p-5 rounded-2xl border ${theme.cardBg} ${theme.borderColor} shadow-sm`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-b-current/10">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">{t.average_order_value}</span>
                <span className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-650 dark:text-amber-400">
                  <Sliders className="h-4 w-4" />
                </span>
              </div>
              <p className="text-xl font-bold font-mono text-current">
                {settings.baseCurrency}{userOrders.length > 0 
                  ? (userOrders.reduce((sum, o) => sum + o.total, 0) / userOrders.length).toFixed(2)
                  : '0.00'}
              </p>
              <p className="text-[9.5px] text-slate-400 mt-1">{t.mean_receipt_value}</p>
            </div>

            <div className={`p-5 rounded-2xl border ${theme.cardBg} ${theme.borderColor} shadow-sm`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-b-current/10">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">{t.active_consignments}</span>
                <span className="p-1 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-650 dark:text-sky-400">
                  <Clock className="h-4 w-4" />
                </span>
              </div>
              <p className="text-xl font-bold font-display text-current">
                {userOrders.filter(o => ['Pending', 'Shipped'].includes(o.status)).length}
              </p>
              <p className="text-[9.5px] text-slate-400 mt-1">{t.in_transit_or_preparing}</p>
            </div>

          </div>

          {/* D3 Spending Dynamics Trend Visualization */}
          <SpendingChart orders={userOrders} baseCurrency={settings.baseCurrency} />

          {/* Filtering Options Control Rack */}
          <div className={`p-4 rounded-2xl border ${theme.cardBg} ${theme.borderColor} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`} id="order-history-filters-bar">
            
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 z-10 text-slate-400">🔍</span>
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder={t.search_history_placeholder || "Search history by Order ID code or Item descriptions..."}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-current focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-650/40"
              />
              {orderSearchQuery && (
                <button 
                  onClick={() => setOrderSearchQuery('')} 
                  className="absolute right-3 top-2 text-[10px] text-slate-500 hover:text-slate-850 dark:text-slate-400 border border-slate-200 hover:border-slate-350 bg-white dark:bg-slate-800 dark:border-slate-700 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  {t.clear || 'Clear'}
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 font-sans">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold mr-1.5">{t.status_filter}</span>
              {(['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'] as const).map((status) => {
                const isActive = orderStatusFilter === status;
                const statusName = settings.language === 'fr' ? (
                  status === 'All' ? 'Tout' :
                  status === 'Pending' ? 'En attente' :
                  status === 'Shipped' ? 'Expédiée' :
                  status === 'Delivered' ? 'Livrée' : 'Annulée'
                ) : status;
                return (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer border transition-all ${
                      isActive
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-850 dark:hover:text-white border-slate-205 dark:border-slate-800'
                    }`}
                  >
                    {statusName}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Core Orders Table/List */}
          {filteredUserOrders.length === 0 ? (
            <div className={`py-16 text-center rounded-2xl border border-dashed ${theme.borderColor} ${theme.cardBg}`} id="orders-catalog-empty">
              <p className="text-xl mb-2">📜</p>
              <h3 className="font-display text-sm font-bold text-current">{t.no_ledger_matches}</h3>
              <p className="text-[10.5px] text-slate-400 mt-1 max-w-sm mx-auto font-sans">
                {userOrders.length === 0 
                  ? t.no_acquisitions_yet
                  : t.try_clearing_filters}
              </p>
              {userOrders.length > 0 && (
                <button
                  onClick={() => {
                    setOrderSearchQuery('');
                    setOrderStatusFilter('All');
                  }}
                  className="mt-4 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  {t.show_all_orders}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4" id="order-history-list-cards">
              {filteredUserOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                
                // Set color scheme for badges
                const statusTheme = 
                  order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40' :
                  order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/40' :
                  order.status === 'Cancelled' ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40' :
                  'bg-amber-50 text-amber-850 border-amber-205 dark:bg-amber-950/15 dark:text-amber-300 dark:border-amber-900/30';
                
                return (
                  <div 
                    key={order.id} 
                    className={`rounded-2xl border transition-all ${
                      isExpanded 
                        ? 'border-indigo-650 bg-indigo-50/5 ring-1 ring-indigo-650/10 dark:ring-indigo-500/20 shadow-md' 
                        : `${theme.borderColor} ${theme.cardBg} hover:shadow-sm`
                    }`}
                    id={`order-history-row-${order.id}`}
                  >
                    
                    {/* Collapsible Card Header Info */}
                    <div 
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs shadow-inner">
                          {order.items.length}x
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-xs">
                              {order.id}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${statusTheme}`}>
                              {(settings.language === 'fr' ? (
                                order.status === 'Pending' ? 'En attente' :
                                order.status === 'Shipped' ? 'Expédiée' :
                                order.status === 'Delivered' ? 'Livrée' : 'Annulée'
                              ) : order.status).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 mt-1 font-mono text-[9px]">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(order.date).toLocaleDateString(settings.language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-current/10">
                        <div className="text-left md:text-right font-mono">
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase font-mono">{t.ledger_total || 'Ledger Total'}</span>
                          <span className="text-xs font-black text-current">
                            {settings.baseCurrency}{order.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="p-1 px-2.5 rounded-lg border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 group hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                          {isExpanded ? (
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-bold">{t.compress || 'Compress'}</span>
                              <ChevronUp className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-bold font-sans">{t.details || 'Details'}</span>
                              <ChevronDown className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Collapsible Card Expand Details Panel */}
                    {isExpanded && (
                      <div className="px-5 pb-6 border-t border-current/10 pt-5 space-y-6 animate-fade-in" id={`order-history-expansion-${order.id}`}>
                        
                        {/* 1. Progress Step Log-Timeline */}
                        <div>
                          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center">
                            <Package className="h-3.5 w-3.5 text-indigo-600 mr-1.5" /> {t.routing_stepper_logs}
                          </h4>
                          
                          {order.status === 'Cancelled' ? (
                            <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-800 dark:text-rose-350 font-medium font-sans">
                              {t.order_cancelled_msg}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 font-mono">
                              
                              {/* Step 1: Placed */}
                              <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl flex items-center space-x-2.5">
                                <span className="h-5 w-5 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center justify-center font-bold text-[9px]">✓</span>
                                <div>
                                  <div className="font-bold text-emerald-800 dark:text-emerald-400 uppercase text-[9px]">{t.receipt_created || 'Aether Receipt Created'}</div>
                                  <div className="text-[8px] text-slate-400 mt-0.5">{t.order_verified_logged || 'Order verified & logged'}</div>
                                </div>
                              </div>

                              {/* Step 2: Shipped */}
                              {['Shipped', 'Delivered'].includes(order.status) ? (
                                <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-xl flex items-center space-x-2.5">
                                  <span className="h-5 w-5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold text-[9px]">✓</span>
                                  <div>
                                    <div className="font-bold text-indigo-800 dark:text-indigo-400 uppercase text-[9px]">{t.dispatched_carrier || 'Dispatched Carrier'}</div>
                                    <div className="text-[8px] text-slate-400 mt-0.5">{t.in_transit_courier || 'In transit via Courier API'}</div>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center space-x-2.5 opacity-60">
                                  <span className="h-5 w-5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center font-bold text-[9px]">2</span>
                                  <div>
                                    <div className="font-bold text-slate-500 uppercase text-[9px]">{t.vessel_logistics_dispatch || 'Vessel Logistics Dispatch'}</div>
                                    <div className="text-[8px] text-slate-400 mt-0.5">{t.awaiting_custom_assembly || 'Awaiting custom assembly'}</div>
                                  </div>
                                </div>
                              )}

                              {/* Step 3: Delivered */}
                              {order.status === 'Delivered' ? (
                                <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl flex items-center space-x-2.5">
                                  <span className="h-5 w-5 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center justify-center font-bold text-[9px]">✓</span>
                                  <div>
                                    <div className="font-bold text-emerald-800 dark:text-emerald-400 uppercase text-[9px]">{t.consignee_dropoff_compliant || 'Consignee Dropoff Compliant'}</div>
                                    <div className="text-[8px] text-slate-400 mt-0.5">{t.signed_secure || 'Signed for & secure'}</div>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center space-x-2.5 opacity-60">
                                  <span className="h-5 w-5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center font-bold text-[9px]">3</span>
                                  <div>
                                    <div className="font-bold text-slate-500 uppercase text-[9px]">{t.signed_distribution_return || 'Signed Distribution Return'}</div>
                                    <div className="text-[8px] text-slate-400 mt-0.5">Awaiting depot dropoff</div>
                                  </div>
                                </div>
                              )}

                            </div>
                          )}
                        </div>

                        {/* 2. List of Line Items */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center">
                            <Package className="h-3.5 w-3.5 text-indigo-600 mr-1.5" /> {t.itemized_cargo_inventory}
                          </h4>
                          <div className="border border-current/10 divide-y divide-current/10 rounded-xl overflow-hidden">
                            {order.items.map((item) => {
                              const matchingProduct = products.find(p => p.id === item.productId);
                              return (
                                <div 
                                  key={item.productId} 
                                  className="p-3 bg-slate-50/30 dark:bg-slate-950/10 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-between gap-4 transition-colors"
                                >
                                  <div className="flex items-center space-x-3 truncate">
                                    <img 
                                      src={item.image} 
                                      alt={item.productName} 
                                      referrerPolicy="no-referrer"
                                      className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800 cursor-pointer hover:opacity-85"
                                      onClick={() => {
                                        if (matchingProduct) {
                                          setDetail(matchingProduct);
                                          setDetailQuantity(1);
                                        }
                                      }}
                                    />
                                    <div className="truncate">
                                      <p 
                                        className="font-bold hover:underline cursor-pointer truncate text-slate-850 dark:text-slate-100 text-xs"
                                        onClick={() => {
                                          if (matchingProduct) {
                                            setDetail(matchingProduct);
                                            setDetailQuantity(1);
                                          }
                                        }}
                                      >
                                        {item.productName}
                                      </p>
                                      <p className="text-[9.5px] font-mono text-slate-400">
                                        {t.qty || "Qty"}: {item.quantity} × {settings.baseCurrency}{item.price.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right font-mono font-bold text-xs text-slate-800 dark:text-slate-100">
                                    {settings.baseCurrency}{(item.quantity * item.price).toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3. Three Columns Detail Block */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-current/10">
                          
                          {/* Col 1: Destination Shipping */}
                          <div>
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center">
                              <MapPin className="h-3.5 w-3.5 text-indigo-600 mr-1.5" /> {t.shipping_address}
                            </h4>
                            <div className="p-4 rounded-xl border border-current/10 bg-slate-50/15 text-xs leading-relaxed">
                              <p className="font-bold text-slate-800 dark:text-zinc-100">{order.customerName}</p>
                              <p className="text-slate-550 dark:text-slate-400 mt-1">{order.shippingAddress.street}</p>
                              <p className="text-slate-550 dark:text-slate-400">{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                              <p className="text-slate-550 dark:text-slate-400 font-medium">{order.shippingAddress.country}</p>
                              <div className="mt-3 text-[9px] text-slate-400 font-mono">
                                {t.registered_tracking_verified}
                              </div>
                            </div>
                          </div>

                          {/* Col 2: Cost Breakdown Ledger */}
                          <div>
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center">
                              <CreditCard className="h-3.5 w-3.5 text-indigo-600 mr-1.5" /> {t.ledger_calculation}
                            </h4>
                            <div className="p-4 rounded-xl border border-current/10 bg-slate-50/15 text-slate-500 dark:text-slate-450 font-mono text-xs space-y-1.5">
                              <div className="flex justify-between">
                                <span>{t.subtotal || "Subtotal"}</span>
                                <span className="font-medium text-slate-900 dark:text-white">{settings.baseCurrency}{order.subtotal.toFixed(2)}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-rose-600 font-bold">
                                  <span>{settings.language === 'fr' ? 'Remise' : 'Discount'} ({order.promoCode || 'PROMO'})</span>
                                  <span>-{settings.baseCurrency}{order.discount.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>{t.shipping_carrier_fee}</span>
                                <span className="font-medium text-slate-900 dark:text-white">{settings.baseCurrency}{order.shipping.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{t.custom_trade_tax}</span>
                                <span className="font-medium text-slate-900 dark:text-white">{settings.baseCurrency}{order.tax.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between pt-1.5 border-t border-current/10 text-xs font-bold text-slate-900 dark:text-white">
                                <span>{t.consolidated_total}</span>
                                <span>{settings.baseCurrency}{order.total.toFixed(2)}</span>
                              </div>
                              <div className="pt-2 text-[8px] text-slate-450 flex items-center justify-between">
                                <span>{t.method_label || "Method"}: <strong className="text-slate-500">{order.paymentMethod}</strong></span>
                                <span>{t.status_label || "STATUS"}: <strong className="text-indigo-600 dark:text-indigo-400 uppercase">
                                  {settings.language === 'fr' ? (
                                    order.status === 'Pending' ? 'En attente' :
                                    order.status === 'Shipped' ? 'Expédiée' :
                                    order.status === 'Delivered' ? 'Livrée' : 'Annulée'
                                  ) : order.status}
                                </strong></span>
                              </div>
                            </div>
                          </div>

                          {/* Col 3: Discharge Controls / Actions */}
                          <div className="flex flex-col justify-between">
                            <div>
                              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center">
                                <Sliders className="h-3.5 w-3.5 text-indigo-600 mr-1.5" /> {t.discharge_controls}
                              </h4>
                              <p className="text-[10px] text-slate-400 leading-normal mb-4 font-sans">
                                {t.discharge_help_desc}
                              </p>
                            </div>

                            <div className="space-y-2">
                              {order.status !== 'Cancelled' && (
                                <button
                                  onClick={() => {
                                    setTrackingOrderId(order.id);
                                    // Scroll smoothly up to the Tracking interface
                                    setTimeout(() => {
                                      const portal = document.getElementById('order-tracking-portal');
                                      if (portal) {
                                        portal.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }}
                                  className="w-full flex items-center justify-center space-x-1.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-355 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-[10px] uppercase font-bold transition-all cursor-pointer shadow-sm"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>{t.live_satellite_route}</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  order.items.forEach(it => {
                                    const matchingProd = products.find(p => p.id === it.productId);
                                    if (matchingProd) {
                                      addToCart(matchingProd, it.quantity);
                                    }
                                  });
                                  setShowNotification(true);
                                  setTimeout(() => setShowNotification(false), 3000);
                                }}
                                className={`w-full flex items-center justify-center space-x-1.5 rounded-xl ${theme.accentBg} text-white py-2 hover:opacity-90 text-[10px] uppercase font-bold transition-all cursor-pointer shadow-md`}
                              >
                                <ShoppingCart className="h-3 w-3" />
                                <span>{t.re_order_collection}</span>
                              </button>

                              <button
                                onClick={() => setPrintOrder(order)}
                                className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 text-[10px] uppercase font-bold transition-all cursor-pointer"
                              >
                                <Printer className="h-3 w-3" />
                                <span>{t.examine_bill_invoice}</span>
                              </button>
                            </div>

                          </div>

                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* 5. PRODUCT DETAIL MODAL PANEL - OVERLAY POPUP */}
      {activeProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" id="detail-pane-backdrop">
          
          {/* Main Modal Container */}
          <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] border border-slate-100" id="detail-modal-card">
            
            <button
              onClick={() => setDetail(null)}
              className="absolute right-4 top-4 z-20 rounded-full bg-white/80 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm"
              aria-label="Close panel"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* Left media visual panel */}
            <div className="w-full md:w-1/2 bg-slate-50 relative border-r border-slate-100 flex flex-col">
              <div className="flex-1 overflow-hidden relative min-h-[300px] aspect-square md:aspect-auto">
                {(() => {
                  const activeMediaUrl = selectedDetailImage || activeProductDetail.image;
                  const playVideoUrl = isVideoUrl(activeMediaUrl) 
                    ? activeMediaUrl 
                    : (viewingVideo && activeProductDetail.videoUrl ? activeProductDetail.videoUrl : null);

                  if (playVideoUrl) {
                    const isYoutube = playVideoUrl.includes('youtube.com') || playVideoUrl.includes('youtu.be') || playVideoUrl.includes('embed');
                    if (isYoutube) {
                      let embedUrl = playVideoUrl;
                      if (!playVideoUrl.includes('embed/')) {
                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                        const match = playVideoUrl.match(regExp);
                        if (match && match[2].length === 11) {
                          embedUrl = `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}`;
                        }
                      }
                      return (
                        <iframe
                          src={embedUrl}
                          title="Product Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="h-full w-full object-cover min-h-[300px]"
                        />
                      );
                    } else {
                      return (
                        <video
                          src={playVideoUrl}
                          controls
                          autoPlay
                          muted
                          loop
                          className="h-full w-full object-cover min-h-[300px]"
                        />
                      );
                    }
                  } else {
                    return (
                      <img
                        src={activeMediaUrl}
                        alt={activeProductDetail.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-all duration-300"
                      />
                    );
                  }
                })()}
                <div className={`absolute top-4 left-4 rounded-lg bg-slate-900/80 py-1.5 px-3 text-[10px] tracking-wider ${theme.accentText} font-mono border border-white/10 uppercase font-semibold`}>
                  {activeProductDetail.category}
                </div>
              </div>
              
              {/* Image Gallery Selection Thumbnails */}
              {(() => {
                const validMediaList = [
                  ...(activeProductDetail.image ? [activeProductDetail.image] : []),
                  ...(activeProductDetail.images || []),
                  ...(activeProductDetail.videoUrl ? [activeProductDetail.videoUrl] : [])
                ].filter((val, i, self) => self.indexOf(val) === i);

                const sortedList = (activeProductDetail.mediaOrder || []).filter(x => validMediaList.includes(x));
                validMediaList.forEach(item => {
                  if (!sortedList.includes(item)) {
                    sortedList.push(item);
                  }
                });

                const allMediaList = sortedList;

                if (allMediaList.length <= 1) return null;

                return (
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <span className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                      {settings.language === 'fr' ? 'Galerie de photos & médias' : 'Product Gallery & Media'}
                    </span>
                    <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                      {allMediaList.map((imgUrl, idx) => {
                        const isThumbnailVideo = isVideoUrl(imgUrl);
                        const isActive = (selectedDetailImage || activeProductDetail.image) === imgUrl;
                        
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedDetailImage(imgUrl);
                              setViewingVideo(isThumbnailVideo);
                            }}
                            className={`h-11 w-11 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all relative group ${
                              isActive 
                                ? 'border-indigo-600 scale-105 shadow-sm' 
                                : 'border-transparent hover:border-slate-300'
                            }`}
                          >
                            {isThumbnailVideo ? (
                              <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center text-white">
                                <Play className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                                <span className="text-[5.5px] font-mono font-bold uppercase mt-0.5 tracking-tighter">VIDEO</span>
                              </div>
                            ) : (
                              <img
                                src={imgUrl}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right details content box */}
            <div className={`flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto transition-colors duration-300 ${
              settings.websiteTheme === 'dark-obsidian' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white text-slate-900'
            }`}>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                    ACQUISITION CARD CODE #{activeProductDetail.id}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs">
                    <Star className="h-3 w-3 fill-amber-450 text-amber-500" />
                    <span className="font-semibold">{activeProductDetail.rating}</span>
                    <span className="text-slate-400">({activeProductDetail.ratingCount})</span>
                  </div>
                </div>

                <h2 className="font-display text-lg font-bold pr-6 leading-tight">
                  {activeProductDetail.name}
                </h2>

                <div className="mt-3 flex items-baseline space-x-2.5">
                  <span className={`${settings.priceColor || 'text-indigo-600'} ${settings.priceSize || 'text-sm'}`}>
                    {formatPrice(activeProductDetail.price)}
                  </span>
                  {activeProductDetail.originalPrice && activeProductDetail.originalPrice > activeProductDetail.price && (
                    <span className={`${settings.originalPriceColor || 'text-slate-400 line-through'} ${settings.originalPriceSize || 'text-xs'}`}>
                      {formatPrice(activeProductDetail.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="mt-4 pb-4 border-b border-slate-150">
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {activeProductDetail.description}
                  </p>
                </div>

                {/* Highlights listing bullet lists */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-405">Spec Highlights</h4>
                  <ul className="space-y-1.5 text-xs font-sans">
                    {activeProductDetail.highlights.map((bullet, i) => (
                      <li key={i} className="flex items-start space-x-1.5 leading-tight">
                        <Check className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${theme.accentText}`} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Purchase interface controller */}
              <div className="mt-6 pt-5 border-t border-slate-150">
                <div className="flex justify-between items-center mb-4 font-sans">
                  <div className="text-xs">
                    <span className="text-slate-400 block font-mono text-[9px] uppercase font-semibold">INVENTORY LEDGER</span>
                    <span className="font-bold">
                      {activeProductDetail.stock <= 0 ? 'Out of Stock' : `${activeProductDetail.stock} units available`}
                    </span>
                  </div>

                  {activeProductDetail.stock > 0 && (
                    <div className="flex items-center border border-slate-205 rounded-md bg-slate-50">
                      <button
                        onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                        className="py-1 px-2.5 hover:bg-slate-100 text-slate-400 font-semibold"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold w-8 text-center text-slate-800">{detailQuantity}</span>
                      <button
                        onClick={() => setDetailQuantity(Math.min(activeProductDetail.stock, detailQuantity + 1))}
                        className="py-1 px-2.5 hover:bg-slate-100 text-slate-455 font-semibold"
                        disabled={detailQuantity >= activeProductDetail.stock}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3.5">
                  <button
                    onClick={() => {
                      if (activeProductDetail.stock > 0) {
                        handleAddToCartWithNotify(activeProductDetail, detailQuantity);
                        setDetail(null);
                      }
                    }}
                    className={`flex-1 rounded-xl py-3.5 text-center text-xs font-bold uppercase tracking-widest text-white disabled:opacity-40 transition-all active:scale-97 shadow-md ${theme.accentBg} ${theme.accentHoverBg}`}
                    disabled={activeProductDetail.stock <= 0}
                  >
                    {activeProductDetail.stock <= 0 ? (t.depleted_label || 'Depleted') : (t.incorporate_in_drawer || 'Incorporate in Drawer')}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Quick alert notifications toast popup on top corner */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-55 rounded-xl bg-slate-900 text-white px-5 py-4 flex items-center space-x-3 shadow-xl border border-slate-800 transition-all duration-300">
          <div className="rounded-full bg-slate-800 p-1 border border-slate-700">
            <Check className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <span className="block text-xs font-bold text-white">{t.item_added_notification || "Acquisition added to selection"}</span>
            <span className="block text-[10px] text-slate-400 font-mono">{t.deductions_applied_notification || "Deductions applied dynamically"}</span>
          </div>
        </div>
      )}

      {/* 6. DUPLICATE BILL OF LADING / INVOICE PRINT DIALOG MAP OVERLAY */}
      {printOrder && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md" id="print-invoice-backdrop">
          <div className="bg-white text-slate-900 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative flex flex-col justify-between max-h-[85vh] overflow-y-auto border border-slate-200">
            
            <button
              onClick={() => setPrintOrder(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 cursor-pointer"
              aria-label="Close invoice popup"
            >
              ✕
            </button>

            {/* Print Header template */}
            <div className="border-b-2 border-dashed border-slate-200 pb-5 mb-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-650 tracking-wider font-mono">AETHER OBJECT LABS</span>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{t.original_bill_receipt || 'ORIGINAL BILL RECEIPT'}</span>
              </div>
              <h2 className="font-display text-base font-black tracking-tight uppercase">{t.acquisitions_invoice_ledger || 'Acquisitions Invoice Ledger'}</h2>
              <p className="text-[10px] text-slate-505 text-slate-500">{t.automated_control_node_msg}</p>
            </div>

            {/* Bill Summary Information */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-[10px] leading-relaxed">
              <div>
                <span className="text-slate-400 font-mono block text-[9px]">{t.consignee_profile || 'CONSIGNEE PROFILE'}</span>
                <strong className="text-slate-800 text-[11px] block">{printOrder.customerName}</strong>
                <span className="text-slate-500">{printOrder.customerEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono block text-[9px]">{t.shipment_ledger_id || 'SHIPMENT LEDGER ID'}</span>
                <strong className="font-mono text-slate-800 block text-[11px]">{printOrder.id}</strong>
                <span className="text-slate-500 font-mono">DATE: {new Date(printOrder.date).toLocaleDateString(settings.language === 'fr' ? 'fr-FR' : 'en-US')}</span>
              </div>
            </div>

            {/* Shipping Address details */}
            <div className="py-3 border-b border-slate-100 text-[10.5px] leading-normal font-sans">
              <span className="text-slate-400 font-mono text-[9px] block">{t.delivery_dispatch_boundary || 'DELIVERY DISPATCH BOUNDARY'}</span>
              <p className="font-semibold text-slate-800">{printOrder.shippingAddress.street}</p>
              <p className="text-slate-500">{printOrder.shippingAddress.city}, {printOrder.shippingAddress.zipCode}, {printOrder.shippingAddress.country}</p>
            </div>

            {/* Line items listed out */}
            <div className="space-y-3 py-4 border-b border-dashed border-slate-200">
              <span className="text-slate-400 font-mono text-[9px] block">{t.itemized_disposition_quantities || 'ITEMIZED DISPOSITION QUANTITIES'}</span>
              <div className="space-y-1.5 font-mono text-[10px]">
                {printOrder.items.map((it) => (
                  <div key={it.productId} className="flex justify-between items-center text-slate-605">
                    <span className="font-sans font-semibold text-slate-800">{it.productName} <span className="text-slate-400 text-[9px] font-mono ml-1.5">x{it.quantity}</span></span>
                    <strong className="text-slate-900">{settings.baseCurrency}{(it.quantity * it.price).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Ledger Totals */}
            <div className="space-y-1.5 py-4 font-mono text-[10.5px]">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.basket_subtotal || 'Basket Subtotal'}</span>
                <span className="font-medium text-slate-900">{settings.baseCurrency}{printOrder.subtotal.toFixed(2)}</span>
              </div>
              {printOrder.discount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>{t.trade_discount || 'Trade Discount'} ({printOrder.promoCode})</span>
                  <span>-{settings.baseCurrency}{printOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.vessel_shipping_surcharge || 'Vessel Shipping Surcharge'}</span>
                <span className="font-medium text-slate-900">{settings.baseCurrency}{printOrder.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.custom_sales_tax_fee || 'Custom / Sales Tax Fee'}</span>
                <span className="font-medium text-slate-900">{settings.baseCurrency}{printOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-300 text-xs font-black text-slate-900">
                <span>{t.consolidated_discharge || 'CONSOLIDATED DISCHARGE'}</span>
                <span>{settings.baseCurrency}{printOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 pt-1">
                <span>{t.reconciliation_method || 'RECONCILIATION METHOD'}</span>
                <span>{printOrder.paymentMethod.toUpperCase()}</span>
              </div>
            </div>

            {/* Digital signature bar */}
            <div className="my-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-center text-[9px] font-mono text-slate-400 leading-normal">
              {t.payment_completed_secure_msg || '💳 Payment completed via secure API key. Authenticated user verified.'}<br/>
              Ather Object Laboratories Co • ID {printOrder.id.substring(0, 8)}
            </div>

            {/* Print and Close buttons */}
            <div className="flex space-x-3 mt-4 border-t border-slate-100 pt-4">
              <button
                onClick={() => setPrintOrder(null)}
                className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 font-bold cursor-pointer text-center text-[10px] uppercase"
              >
                {t.dismiss_ledger || 'Dismiss Ledger'}
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-850 text-white py-2.5 font-bold cursor-pointer text-center text-[10px] uppercase flex items-center justify-center space-x-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{t.print_bill_dispatch || 'Print Bill Dispatch'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING ACTION CONTACT WIDGET */}
      {settings.showContactWidget !== false && settings.contactWidgetType && settings.contactWidgetType !== 'none' && (() => {
        const isWhatsapp = settings.contactWidgetType === 'whatsapp';
        const url = isWhatsapp 
          ? `https://wa.me/${(settings.whatsappNumber || '15550199').replace(/[^0-9a-zA-Z]/g, '')}` 
          : `https://m.me/${settings.messengerId || 'aether.objects'}`;
        
        const isLeft = settings.contactWidgetPosition === 'left';
        const positionClass = isLeft ? 'left-6' : 'right-6';
        
        // WhatsApp green colors vs Facebook Messenger brand colors
        const themeClass = isWhatsapp 
          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20' 
          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20';

        const label = settings.contactWidgetText || (isWhatsapp ? 'WhatsApp' : 'Messenger');

        return (
          <div className={`fixed bottom-6 ${positionClass} z-50 flex items-center group pointer-events-auto`}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-2.5 rounded-full px-5 py-3.5 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${themeClass} border border-white/10`}
              title={`Contact via ${isWhatsapp ? 'WhatsApp' : 'Messenger'}`}
              id="floating-contact-widget"
            >
              {isWhatsapp ? (
                <MessageCircle className="h-4.5 w-4.5 fill-white/10" />
              ) : (
                <MessageSquare className="h-4.5 w-4.5 fill-white/10" />
              )}
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                {label}
              </span>
            </a>
          </div>
        );
      })()}

    </main>
  );
};
