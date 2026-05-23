/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Customer, PromoCode, OrderStatus, SimulatedEmail, UserRole, AdminPermissions, FooterFeature } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_PROMO_CODES } from '../data/mockProducts';

interface StoreSettings {
  storeName: string;
  taxRate: number; // e.g. 0.08
  shippingRate: number; // e.g. 15
  baseCurrency: string; // e.g. '$'
  language?: 'en' | 'fr';
  showHeroBanner?: boolean;
  bannerType?: string;
  bannerImage?: string;
  bannerVideoUrl?: string;
  bannerBadge?: string;
  bannerTitle?: string;
  bannerDesc?: string;
  bannerBtnText?: string;
  
  // Dedicated, separate Video Banner
  showVideoBanner?: boolean;
  videoBannerType?: string;
  videoBannerBadge?: string;
  videoBannerTitle?: string;
  videoBannerDesc?: string;
  videoBannerBtnText?: string;
  videoBannerVideoUrl?: string;

  adminPanelName?: string;
  logoType?: 'text' | 'image';
  logoText?: string;
  logoImage?: string;
  websiteTheme?: string;
  productGridTheme?: string;
  lowStockThreshold?: number;
  adminEmail?: string;
  
  // Floating Action Contact Widget Settings
  showContactWidget?: boolean;
  contactWidgetType?: 'none' | 'whatsapp' | 'messenger';
  whatsappNumber?: string;
  messengerId?: string;
  contactWidgetPosition?: 'right' | 'left';
  contactWidgetText?: string;

  // SEO & Favicon Configurations
  faviconUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;

  // Custom Footer Configurations
  customFooterText?: string;
  customFooterIntro?: string;
  customFooterEmail?: string;
  footerFeature1Title?: string;
  footerFeature1Desc?: string;
  footerFeature2Title?: string;
  footerFeature2Desc?: string;
  footerFeature3Title?: string;
  footerFeature3Desc?: string;
  footerFeature4Title?: string;
  footerFeature4Desc?: string;
  footerCol1Title?: string;
  footerCol2Title?: string;
  footerSupportTitle?: string;
  footerSupportDesc?: string;
  footerStatusText?: string;
  footerFeatures?: FooterFeature[];
  googleAnalyticsId?: string;
  metaApiKey?: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  customers: Customer[];
  promoCodes: PromoCode[];
  activePromo: PromoCode | null;
  currentView: 'shop' | 'admin' | 'login' | 'checkout';
  currentCategory: string;
  searchKeyword: string;
  activeProductDetail: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  trackingOrderId: string | null;
  loggedInAdmin: boolean;
  settings: StoreSettings;
  
  // Simulated Email alerts
  simulatedEmails: SimulatedEmail[];
  deleteEmail: (id: string) => void;
  markEmailRead: (id: string) => void;
  clearAllEmails: () => void;
  
  // Custom Auth Additions
  currentUser: Customer | null;
  currentAdminUser: { email: string; name: string; passwordHash: string; role: UserRole } | null;
  adminPermissions: AdminPermissions;
  updateAdminPermissions: (permissions: Partial<AdminPermissions>) => void;
  updateUserRole: (email: string, role: UserRole) => void;
  updateUserPassword: (email: string, pass: string) => void;
  createNewAdmin: (name: string, email: string, passwordHash: string, role: 'admin' | 'super_admin') => { success: boolean; message: string };
  userCredentials: { email: string; name: string; passwordHash: string; role: UserRole }[];
  loginUser: (email: string, password: string) => { success: boolean; message: string; role: UserRole | null };
  registerUser: (name: string, email: string, password: string) => { success: boolean; message: string };
  logoutUser: () => void;
  
  // Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  submitCheckout: (customerInfo: {
    name: string;
    email: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
    paymentMethod: string;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setView: (view: 'shop' | 'admin' | 'login' | 'checkout') => void;
  setCategory: (category: string) => void;
  setSearch: (keyword: string) => void;
  setDetail: (product: Product | null) => void;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  setTrackingOrderId: (id: string | null) => void;
  setLoggedInAdmin: (status: boolean) => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
  addPromoCode: (promo: PromoCode) => void;
  togglePromoCode: (code: string) => void;
  dbSyncStatus: 'loading' | 'synced' | 'error' | 'idle';
  dbError: string | null;
  manualSyncDb: () => Promise<boolean>;
  dbLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Persistent States ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aether_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aether_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aether_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('aether_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('aether_promo_codes');
    return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('aether_settings');
    const defaultSettings = {
      storeName: 'AETHER OBJECTS',
      taxRate: 0.08,
      shippingRate: 15.00,
      baseCurrency: '$',
      language: 'en' as const,
      showHeroBanner: true,
      bannerType: 'classic-slate',
      bannerImage: 'https://images.unsplash.com/photo-1593642702821-c8da63116c2c?w=1600&q=80',
      bannerBadge: 'Curated Collection // Spring Release',
      bannerTitle: 'Instruments for the Fine Craft.',
      bannerDesc: 'Our latest design objects merge resilient structures with premium natural materials, engineered to introduce harmony to your daily workspaces.',
      bannerBtnText: 'Examine Acquisitions ↓',
      
      // Dedicated, separate Video Banner default settings
      showVideoBanner: true,
      videoBannerType: 'ocean-cinematic',
      videoBannerBadge: 'CINEMATIC RELEASE // AUTOPLAY CAMPAIGN',
      videoBannerTitle: 'Carthage Shores & Sea Breeze Workspace',
      videoBannerDesc: 'Dive into our breathtaking sea-inspired stationery and limited edition travel diaries, capturing coastal magic on premium sand-colored coordinates.',
      videoBannerBtnText: 'EXPERIENCE SEASHORE JOURNALING ↓',
      videoBannerVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41225-large.mp4',

      adminPanelName: 'Administrative Control Console',
      logoType: 'text' as const,
      logoText: 'Æ',
      logoImage: '',
      websiteTheme: 'neutral-slate',
      productGridTheme: 'minimal-floating',
      lowStockThreshold: 3,
      adminEmail: 'admin@aetherobjects.co',

      // Floating Action Contact Widget Settings Default
      showContactWidget: true,
      contactWidgetType: 'whatsapp',
      whatsappNumber: '15550199',
      messengerId: 'aether.objects',
      contactWidgetPosition: 'right',
      contactWidgetText: 'Support',

      // Brand SEO Constants Default
      faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&q=80',
      seoTitle: 'AETHER OBJECTS — Timeless Artisan Storefront & Workflow Instruments',
      seoDescription: 'Handcrafted premium work tools, sculptural lighting coordinates, fine stationery diaries, and desk furniture. Engineered to harmonize and elevate your creative workspace.',
      seoKeywords: 'artisan workspace, desk instruments, minimalist organizer, fine stationery, walnut risers, designer shop, Tunisia',

      // Custom Footer Defaults
      customFooterIntro: 'Curating high-grade functional instruments, workspace structures, and premium modern accessories constructed with genuine materials designed to endure.',
      customFooterText: 'Handcrafted in the digital workspaces. All rights reserved.',
      customFooterEmail: 'support@aether.design',
      footerFeature1Title: 'Express Shipping',
      footerFeature1Desc: 'Free delivery on orders above $150.00',
      footerFeature2Title: '30-Day Escrow Returns',
      footerFeature2Desc: 'Hassle-free shipping envelope included',
      footerFeature3Title: 'Encrypted Security',
      footerFeature3Desc: '256-bit bank standard SSL certificate protection',
      footerFeature4Title: 'Full Customer Care',
      footerFeature4Desc: 'Available via live correspondence portals',
      footerCol1Title: 'Catalogue',
      footerCol2Title: 'Administrative',
      footerSupportTitle: 'Global Customer Support',
      footerSupportDesc: 'Have inquiries about custom corporate pricing or genuine material specifications?',
      footerStatusText: 'PLATFORM STATUS: SECURE PORTAL',
      footerFeatures: [
        { id: '1', title: 'Express Shipping', desc: 'Free delivery on orders above $150.00', icon: 'truck' },
        { id: '2', title: '30-Day Escrow Returns', desc: 'Hassle-free shipping envelope included', icon: 'rotate-ccw' },
        { id: '3', title: 'Encrypted Security', desc: '256-bit bank standard SSL certificate protection', icon: 'shield' },
        { id: '4', title: 'Full Customer Care', desc: 'Available via live correspondence portals', icon: 'help-circle' }
      ],
      googleAnalyticsId: '',
      metaApiKey: ''
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // --- Session Navigation States ---
  const [currentView, setView] = useState<'shop' | 'admin' | 'login' | 'checkout'>('shop');
  const [currentCategory, setCategory] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const setSearch = setSearchKeyword;
  const [activeProductDetail, setDetail] = useState<Product | null>(null);
  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [loggedInAdmin, setLoggedInAdmin] = useState<boolean>(() => {
    const savedUser = localStorage.getItem('aether_current_admin_user');
    if (savedUser && savedUser !== 'null' && savedUser !== 'undefined' && savedUser.trim() !== '') {
      try {
        const u = JSON.parse(savedUser);
        return !!(u && (u.role === 'admin' || u.role === 'super_admin'));
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  // --- Authenticated User Accounts States ---
  const [currentUser, setCurrentUser] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('aether_current_user');
    if (saved && saved !== 'null' && saved !== 'undefined' && saved.trim() !== '') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [currentAdminUser, setCurrentAdminUser] = useState<{ email: string; name: string; passwordHash: string; role: UserRole } | null>(() => {
    const saved = localStorage.getItem('aether_current_admin_user');
    if (saved && saved !== 'null' && saved !== 'undefined' && saved.trim() !== '') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions>(() => {
    const saved = localStorage.getItem('aether_admin_permissions');
    const defaultPermissions: AdminPermissions = {
      canEditProducts: true,
      canDeleteProducts: false,
      canDeleteOrders: false,
      canManageOrders: true,
      canManagePromos: true,
      canModifySettings: false,
      viewDashboard: true,
      viewProducts: true,
      viewOrders: true,
      viewCustomers: true,
      viewPromos: true,
      viewEmails: true,
      viewSettings: true,
    };
    if (saved && saved !== 'null' && saved !== 'undefined' && saved.trim() !== '') {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultPermissions, ...parsed };
      } catch (e) {
        // Fallback below
      }
    }
    return defaultPermissions;
  });

  const [userCredentials, setUserCredentials] = useState<{ email: string; name: string; passwordHash: string; role: UserRole }[]>(() => {
    const saved = localStorage.getItem('aether_user_credentials');
    const defaultCredentials = [
      { email: 'ganoniarbi@gmail.com', name: 'Super Administrator', passwordHash: 'ARB790874A', role: 'super_admin' },
      { email: 'admin@aetherobjects.co', name: 'Standard Admin', passwordHash: 'admin123', role: 'admin' },
      { email: 'associate@aetherobjects.co', name: 'Associate Manager', passwordHash: 'staff123', role: 'admin' },
      { email: 'alexander@sterling-design.co', name: 'Alexander Sterling', passwordHash: 'customer123', role: 'customer' },
      { email: 'elena.rost@vanguard.io', name: 'Elena Rostova', passwordHash: 'customer123', role: 'customer' },
      { email: 'jouhanarbi@gmail.com', name: 'Jouhan Arbi', passwordHash: 'jouhan123', role: 'customer' }
    ];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const merged = [...parsed];
          defaultCredentials.forEach(item => {
            const exists = merged.some(u => u.email.toLowerCase() === item.email.toLowerCase());
            if (!exists) {
              merged.push(item);
            }
          });
          return merged;
        }
      } catch (e) {
        // Fallback below
      }
    }
    return defaultCredentials;
  });

  const [simulatedEmails, setSimulatedEmails] = useState<SimulatedEmail[]>(() => {
    const saved = localStorage.getItem('aether_simulated_emails');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  // --- Database Synchronization ---
  const [dbLoading, setDbLoading] = useState(true);
  const [dbSyncStatus, setDbSyncStatus] = useState<'loading' | 'synced' | 'error' | 'idle'>('loading');
  const [dbError, setDbError] = useState<string | null>(null);

  // Load state from MongoDB on Mount
  useEffect(() => {
    const loadFromDatabase = async () => {
      setDbSyncStatus('loading');
      try {
        const response = await fetch('/api/store');
        if (response.ok) {
          const data = await response.json();
          if (data && Object.keys(data).length > 0) {
            if (Array.isArray(data.products) && data.products.length > 0) setProducts(data.products);
            if (Array.isArray(data.orders)) setOrders(data.orders);
            if (Array.isArray(data.customers)) setCustomers(data.customers);
            if (Array.isArray(data.promoCodes)) setPromoCodes(data.promoCodes);
            if (data.settings && typeof data.settings === 'object') setSettings(prev => ({ ...prev, ...data.settings }));
            if (data.adminPermissions && typeof data.adminPermissions === 'object') setAdminPermissions(data.adminPermissions);
            if (Array.isArray(data.userCredentials) && data.userCredentials.length > 0) setUserCredentials(data.userCredentials);
            if (Array.isArray(data.simulatedEmails)) setSimulatedEmails(data.simulatedEmails);
            console.log('🎉 Successfully sync\'d all collections from MongoDB cluster');
          }
          setDbSyncStatus('synced');
          setDbError(null);
        } else {
          const errData = await response.json().catch(() => ({}));
          setDbSyncStatus('error');
          setDbError(errData.error || 'Server responded with an error');
        }
      } catch (err: any) {
        console.error('Failed to sync state from database, using offline storage:', err);
        setDbSyncStatus('error');
        setDbError(err.message || String(err));
      } finally {
        setDbLoading(false);
      }
    };
    loadFromDatabase();
  }, []);

  // Manual trigger to force-sync back to database
  const manualSyncDb = async (): Promise<boolean> => {
    setDbSyncStatus('loading');
    try {
      const payload = {
        products,
        orders,
        customers,
        promoCodes,
        settings,
        userCredentials,
        simulatedEmails,
        adminPermissions
      };
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        console.log('💾 Successfully saved backup to MongoDB');
        setDbSyncStatus('synced');
        setDbError(null);
        return true;
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('Failed to dump state backup to MongoDB');
        setDbSyncStatus('error');
        setDbError(errData.error || 'Failed to sync to database');
        return false;
      }
    } catch (err: any) {
      console.error('Error manual syncing to MongoDB:', err);
      setDbSyncStatus('error');
      setDbError(err.message || String(err));
      return false;
    }
  };

  // Save changes back to MongoDB (debounced to prevent spamming server)
  useEffect(() => {
    if (dbLoading) return; // Wait until initial sync finishes to avoid overwriting

    const timer = setTimeout(async () => {
      try {
        const payload = {
          products,
          orders,
          customers,
          promoCodes,
          settings,
          userCredentials,
          simulatedEmails,
          adminPermissions
        };
        const response = await fetch('/api/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          console.log('💾 Successfully saved active state backup to MongoDB');
          setDbSyncStatus('synced');
          setDbError(null);
        } else {
          const errData = await response.json().catch(() => ({}));
          console.error('Failed to dump state backup to MongoDB');
          setDbSyncStatus('error');
          setDbError(errData.error || 'Failed to auto-sync to database');
        }
      } catch (err: any) {
        console.error('Error auto-syncing to MongoDB:', err);
        setDbSyncStatus('error');
        setDbError(err.message || String(err));
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [products, orders, customers, promoCodes, settings, userCredentials, simulatedEmails, adminPermissions, dbLoading]);

  // --- Synchronization Effects ---
  useEffect(() => {
    localStorage.setItem('aether_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aether_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aether_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aether_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('aether_promo_codes', JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    localStorage.setItem('aether_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('aether_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aether_current_admin_user', currentAdminUser ? JSON.stringify(currentAdminUser) : '');
  }, [currentAdminUser]);

  useEffect(() => {
    localStorage.setItem('aether_admin_permissions', JSON.stringify(adminPermissions));
  }, [adminPermissions]);

  useEffect(() => {
    localStorage.setItem('aether_user_credentials', JSON.stringify(userCredentials));
  }, [userCredentials]);

  useEffect(() => {
    localStorage.setItem('aether_simulated_emails', JSON.stringify(simulatedEmails));
  }, [simulatedEmails]);

  // Inventory Stock Monitor & simulated email dispatch
  useEffect(() => {
    const threshold = settings.lowStockThreshold ?? 3;
    const adminMail = settings.adminEmail ?? 'admin@aetherobjects.co';
    
    const lowStockProducts = products.filter(p => p.stock < threshold);
    if (lowStockProducts.length === 0) return;

    setSimulatedEmails(prev => {
      let changed = false;
      let updated = [...prev];

      lowStockProducts.forEach(item => {
        // Only notify if we haven't already sent an alert for this exact product at this exact stock level
        const alreadyAlerted = prev.some(email => email.productId === item.id && email.stock === item.stock);
        
        if (!alreadyAlerted) {
          const newAlert: SimulatedEmail = {
            id: `email-${item.id}-${item.stock}-${Date.now()}`,
            sender: 'system-alerts@aetherobjects.co',
            recipient: adminMail,
            subject: `⚠️ Low Stock Alert: ${item.name} (${item.stock} left)`,
            body: `Dear Store Administrator,

This is an automated inventory warning from your Aetherspace engine. 

The stock level for the exclusive object "${item.name}" has critical capacity constraints.

Product Summary:
- Name: ${item.name}
- ID Code: ${item.id}
- Classification: ${item.category}
- Current Quantity Remaining: ${item.stock} unit${item.stock !== 1 ? 's' : ''}

This is below your low stock threshold limit of ${threshold} units. We recommend replenishing inventory as soon as possible to prevent depleted options for incoming users.

Sincerely,
Aether Automatons & Supply Bot`,
            timestamp: new Date().toISOString(),
            read: false,
            productName: item.name,
            productId: item.id,
            stock: item.stock
          };
          updated = [newAlert, ...updated];
          changed = true;
        }
      });

      return changed ? updated : prev;
    });
  }, [products, settings.lowStockThreshold, settings.adminEmail]);

  // --- Admin Permission & User Role Management Actions ---
  const updateAdminPermissions = (permissions: Partial<AdminPermissions>) => {
    setAdminPermissions(prev => ({ ...prev, ...permissions }));
  };

  const updateUserRole = (email: string, role: UserRole) => {
    setUserCredentials(prev => {
      const updated = prev.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, role } : u);
      // Update logged in user role too if they modified themselves
      if (currentAdminUser && currentAdminUser.email.toLowerCase() === email.toLowerCase()) {
        setCurrentAdminUser(prevAdmin => prevAdmin ? { ...prevAdmin, role } : null);
      }
      return updated;
    });
  };

  const updateUserPassword = (email: string, pass: string) => {
    setUserCredentials(prev => {
      const updated = prev.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, passwordHash: pass } : u);
      // Update logged in user password if they modified themselves
      if (currentAdminUser && currentAdminUser.email.toLowerCase() === email.toLowerCase()) {
        setCurrentAdminUser(prevAdmin => prevAdmin ? { ...prevAdmin, passwordHash: pass } : null);
      }
      return updated;
    });
  };

  const createNewAdmin = (name: string, email: string, pass: string, role: 'admin' | 'super_admin') => {
    const normalized = email.trim().toLowerCase();
    const exists = userCredentials.some(u => u.email.toLowerCase() === normalized);
    if (exists) {
      return { success: false, message: 'This email is already registered.' };
    }
    const newAdmin = {
      email: normalized,
      name: name.trim(),
      passwordHash: pass,
      role
    };
    setUserCredentials(prev => [...prev, newAdmin]);
    return { success: true, message: `Successfully registered new ${role === 'super_admin' ? 'Super Admin' : 'Admin'} account: ${name}` };
  };

  // --- Authentication Actions ---
  const loginUser = (email: string, pass: string) => {
    const normalized = email.trim().toLowerCase();
    const user = userCredentials.find(u => u.email.toLowerCase() === normalized);
    
    if (!user) {
      return { success: false, message: 'Invalid email address or user not registered.', role: null };
    }
    
    if (user.passwordHash !== pass) {
      return { success: false, message: 'Invalid password credentials.', role: null };
    }
    
    if (user.role === 'admin' || user.role === 'super_admin') {
      setLoggedInAdmin(true);
      setCurrentAdminUser(user);
      setCurrentUser(null); // Clear active customer to avoid session bleeding
      setView('admin');
      const roleLabel = user.role === 'super_admin' ? 'Super Administrator' : 'Administrator';
      return { success: true, message: `Welcome back, ${roleLabel}. Authorized session opened.`, role: user.role };
    } else {
      // customer
      let cust = customers.find(c => c.email.toLowerCase() === normalized);
      if (!cust) {
        cust = {
          id: `cust-${Date.now()}`,
          name: user.name,
          email: user.email,
          ordersCount: 0,
          totalSpent: 0,
          registrationDate: new Date().toISOString().split('T')[0]
        };
        setCustomers(prev => [...prev, cust]);
      }
      setLoggedInAdmin(false); // Clear active admin to avoid session bleeding
      setCurrentAdminUser(null);
      setCurrentUser(cust);
      setView('shop');
      return { success: true, message: `Welcome back, ${user.name}!`, role: 'customer' as const };
    }
  };

  const registerUser = (name: string, email: string, pass: string) => {
    const normalized = email.trim().toLowerCase();
    const exists = userCredentials.some(u => u.email.toLowerCase() === normalized);
    if (exists) {
      return { success: false, message: 'This email is already linked to an account.' };
    }

    const newUserAuth = {
      email: normalized,
      name: name.trim(),
      passwordHash: pass,
      role: 'customer' as const
    };

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: normalized,
      ordersCount: 0,
      totalSpent: 0,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    setUserCredentials(prev => [...prev, newUserAuth]);
    setCustomers(prev => {
      if (!prev.some(c => c.email.toLowerCase() === normalized)) {
        return [...prev, newCust];
      }
      return prev;
    });
    setLoggedInAdmin(false);
    setCurrentAdminUser(null);
    setCurrentUser(newCust);
    setView('shop');
    return { success: true, message: `Account initialized successfully! Welcome, ${name.trim()}!` };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentAdminUser(null);
    setLoggedInAdmin(false);
    setView('shop');
  };

  // --- Simulated Email notification actions ---
  const deleteEmail = (id: string) => {
    setSimulatedEmails(prev => prev.filter(em => em.id !== id));
  };

  const markEmailRead = (id: string) => {
    setSimulatedEmails(prev => prev.map(em => em.id === id ? { ...em, read: true } : em));
  };

  const clearAllEmails = () => {
    setSimulatedEmails([]);
  };

  // --- Product Functions ---
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...p,
      id: newId,
      rating: 5.0,
      ratingCount: 0
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const editProduct = (p: Product) => {
    setProducts(prev => prev.map(item => item.id === p.id ? p : item));
    // Also adjust detail state if matching
    if (activeProductDetail?.id === p.id) {
      setDetail(p);
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(item => item.id !== id));
    // Remove from cart if deleted
    removeFromCart(id);
    if (activeProductDetail?.id === id) {
      setDetail(null);
    }
  };

  // --- Shopping Cart Functions ---
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const match = prev.find(item => item.product.id === product.id);
      if (match) {
        // Enforce inventory stock caps
        const targetQty = Math.min(product.stock, match.quantity + quantity);
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: targetQty } : item);
      } else {
        const targetQty = Math.min(product.stock, quantity);
        if (targetQty <= 0) return prev; // Out of stock
        return [...prev, { product, quantity: targetQty }];
      }
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      const match = prev.find(item => item.product.id === productId);
      if (!match) return prev;
      const finalQty = Math.min(match.product.stock, quantity);
      return prev.map(item => item.product.id === productId ? { ...item, quantity: finalQty } : item);
    });
  };

  const clearCart = () => {
    setCart([]);
    setActivePromo(null);
  };

  // --- Promo Code Functions ---
  const applyPromoCode = (code: string) => {
    const cleanedCode = code.trim().toUpperCase();
    const found = promoCodes.find(p => p.code.toUpperCase() === cleanedCode);
    
    if (!found) {
      return { success: false, message: 'Invalid promo code' };
    }
    if (!found.active) {
      return { success: false, message: 'This promo code is currently inactive' };
    }
    setActivePromo(found);
    return { success: true, message: `Successfully applied code for ${found.percent}% Off!` };
  };

  const removePromoCode = () => {
    setActivePromo(null);
  };

  // --- Admin Settings & Promo Admin ---
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addPromoCode = (promo: PromoCode) => {
    setPromoCodes(prev => {
      const exists = prev.some(p => p.code.toUpperCase() === promo.code.toUpperCase());
      if (exists) {
        return prev.map(p => p.code.toUpperCase() === promo.code.toUpperCase() ? promo : p);
      }
      return [...prev, promo];
    });
  };

  const togglePromoCode = (code: string) => {
    setPromoCodes(prev => prev.map(p => {
      if (p.code.toUpperCase() === code.toUpperCase()) {
        return { ...p, active: !p.active };
      }
      return p;
    }));
  };

  // --- Checkout Processing ---
  const submitCheckout = (customerInfo: {
    name: string;
    email: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
    paymentMethod: string;
  }) => {
    if (cart.length === 0) return null;

    // Verify stock availability
    for (const item of cart) {
      const actualProd = products.find(p => p.id === item.product.id);
      if (!actualProd || actualProd.stock < item.quantity) {
        return null; // Not enough inventory stock
      }
    }

    // Calculations
    const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    const discount = activePromo ? Number((subtotal * (activePromo.percent / 100)).toFixed(2)) : 0;
    const itemsTotal = subtotal - discount;
    const tax = Number((itemsTotal * settings.taxRate).toFixed(2));
    const shipping = itemsTotal > 150 ? 0 : settings.shippingRate; // Free shipping over $150
    const total = Number((itemsTotal + tax + shipping).toFixed(2));

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      shippingAddress: {
        street: customerInfo.street,
        city: customerInfo.city,
        zipCode: customerInfo.zipCode,
        country: customerInfo.country
      },
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      subtotal,
      discount,
      shipping,
      tax,
      total,
      status: 'Pending',
      promoCode: activePromo?.code,
      paymentMethod: customerInfo.paymentMethod
    };

    // Deduct stock levels from genuine product state
    setProducts(prev => {
      return prev.map(p => {
        const matchedCart = cart.find(it => it.product.id === p.id);
        if (matchedCart) {
          return { ...p, stock: Math.max(0, p.stock - matchedCart.quantity) };
        }
        return p;
      });
    });

    // Append to orders
    setOrders(prev => [newOrder, ...prev]);

    // Track or augment customers profile
    setCustomers(prev => {
      const matchIndex = prev.findIndex(c => c.email.toLowerCase() === customerInfo.email.toLowerCase());
      if (matchIndex >= 0) {
        return prev.map((c, idx) => {
          if (idx === matchIndex) {
            return {
              ...c,
              name: customerInfo.name, // update in case changed
              ordersCount: c.ordersCount + 1,
              totalSpent: Number((c.totalSpent + total).toFixed(2))
            };
          }
          return c;
        });
      } else {
        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          name: customerInfo.name,
          email: customerInfo.email,
          ordersCount: 1,
          totalSpent: total,
          registrationDate: new Date().toISOString().split('T')[0]
        };
        return [...prev, newCustomer];
      }
    });

    // Reset shopping cart
    clearCart();
    
    // Automatically trigger visual focus to tracking order status
    setTrackingOrderId(orderId);

    return newOrder;
  };

  // --- Order Status Adjuster ---
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status } : ord));
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      orders,
      customers,
      promoCodes,
      activePromo,
      currentView,
      currentCategory,
      searchKeyword,
      activeProductDetail,
      isCartOpen,
      isCheckoutOpen,
      trackingOrderId,
      loggedInAdmin,
      settings,
      currentUser,
      currentAdminUser,
      adminPermissions,
      updateAdminPermissions,
      updateUserRole,
      updateUserPassword,
      createNewAdmin,
      userCredentials,
      simulatedEmails,
      deleteEmail,
      markEmailRead,
      clearAllEmails,
      loginUser,
      registerUser,
      logoutUser,
      addProduct,
      editProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      applyPromoCode,
      removePromoCode,
      submitCheckout,
      updateOrderStatus,
      setView,
      setCategory,
      setSearch,
      setDetail,
      setCartOpen,
      setCheckoutOpen,
      setTrackingOrderId,
      setLoggedInAdmin,
      updateSettings,
      addPromoCode,
      togglePromoCode,
      dbSyncStatus,
      dbError,
      manualSyncDb,
      dbLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
};
