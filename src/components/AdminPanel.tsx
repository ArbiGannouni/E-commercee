/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../state/StoreContext';
import { Product, Order, PromoCode, OrderStatus, UserRole, AdminPermissions } from '../types';
import { 
  TrendingUp, Package, ShoppingCart, Users, Coins, Tag, 
  Settings, Trash2, Edit3, Plus, Sliders, CheckCircle, 
  ArrowRight, ShieldAlert, Lock, Sparkles, Filter, Search,
  Palette, Mail, Bell, MessageCircle, MessageSquare,
  Database, Server, CloudLightning, RefreshCw
} from 'lucide-react';
import { SALES_TRENDS } from '../data/mockProducts';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    customers,
    promoCodes,
    addProduct,
    editProduct,
    deleteProduct,
    updateOrderStatus,
    addPromoCode,
    togglePromoCode,
    settings,
    updateSettings: rawUpdateSettings,
    loggedInAdmin,
    setLoggedInAdmin,
    loginUser,
    logoutUser,
    simulatedEmails,
    deleteEmail,
    markEmailRead,
    clearAllEmails,
    currentAdminUser,
    adminPermissions,
    updateAdminPermissions,
    updateUserRole,
    createNewAdmin,
    userCredentials,
    dbSyncStatus,
    dbError,
    manualSyncDb
  } = useStore();

  // Navigation Sub-views inside Admin Panel
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'promos' | 'settings' | 'emails' | 'permissions'>('dashboard');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  // Security credentials state
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [passError, setPassError] = useState('');
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Redirect standard admin if they don't have permission for the current activeTab
  useEffect(() => {
    if (currentAdminUser?.role === 'admin') {
      const isTabAllowed = (tabId: string): boolean => {
        if (tabId === 'permissions') return true;
        const tabMap: Record<string, keyof AdminPermissions> = {
          dashboard: 'viewDashboard',
          products: 'viewProducts',
          orders: 'viewOrders',
          customers: 'viewCustomers',
          promos: 'viewPromos',
          emails: 'viewEmails',
          settings: 'viewSettings',
        };
        const permKey = tabMap[tabId];
        return permKey ? adminPermissions[permKey] === true : true;
      };

      if (!isTabAllowed(activeTab)) {
        const tabsOrder: ('dashboard' | 'products' | 'orders' | 'customers' | 'promos' | 'emails' | 'settings' | 'permissions')[] = [
          'dashboard', 'products', 'orders', 'customers', 'promos', 'emails', 'settings', 'permissions'
        ];
        const allowedTab = tabsOrder.find(t => isTabAllowed(t));
        if (allowedTab) {
          setActiveTab(allowedTab);
        }
      }
    }
  }, [adminPermissions, activeTab, currentAdminUser]);

  const checkPermission = (action: 'edit' | 'delete' | 'orders' | 'promos' | 'settings'): boolean => {
    if (currentAdminUser?.role === 'super_admin') return true;
    let allowed = false;
    let desc = '';
    switch (action) {
      case 'edit':
        allowed = adminPermissions.canEditProducts;
        desc = 'edit and modify catalog products';
        break;
      case 'delete':
        allowed = adminPermissions.canDeleteProducts;
        desc = 'delete or purge catalog items';
        break;
      case 'orders':
        allowed = adminPermissions.canManageOrders;
        desc = 'alter or process client order logs';
        break;
      case 'promos':
        allowed = adminPermissions.canManagePromos;
        desc = 'create or manage discount promotional coupons';
        break;
      case 'settings':
        allowed = adminPermissions.canModifySettings;
        desc = 'edit master store configuration constants';
        break;
    }
    if (!allowed) {
      setPermissionError(`Your account role (${currentAdminUser?.role || 'Staff'}) lacks clearance to ${desc}. Please consult a Super Administrator for permissions edit.`);
      setTimeout(() => setPermissionError(null), 7000);
    }
    return allowed;
  };

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    if (checkPermission('settings')) {
      rawUpdateSettings(newSettings);
    }
  };

  // Search/Filters in tables
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('All');

  // CRUD item states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Product Schema Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Desk & Office');
  const [newProdPrice, setNewProdPrice] = useState(0);
  const [newProdOrigPrice, setNewProdOrigPrice] = useState(0);
  const [newProdStock, setNewProdStock] = useState(0);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  
  // New Staff Registration State
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'admin' | 'super_admin'>('admin');
  const [staffSuccess, setStaffSuccess] = useState<string | null>(null);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [newProdHighlight, setNewProdHighlight] = useState('');
  const [newProdTags, setNewProdTags] = useState('');

  // Custom Category States
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryOldName, setEditingCategoryOldName] = useState<string | null>(null);
  const [editingCategoryNewName, setEditingCategoryNewName] = useState('');

  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('aether_custom_categories');
    return saved ? JSON.parse(saved) : ['Desk & Office', 'Lighting', 'Stationery', 'Accessories', 'Home Modern', 'Kitchenware'];
  });

  useEffect(() => {
    localStorage.setItem('aether_custom_categories', JSON.stringify(customCategories));
  }, [customCategories]);

  // New Promo Code Form State
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoPercent, setNewPromoPercent] = useState(10);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // --- SECURITY LOGIN CONTROLLER ---
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginUser(adminUser, adminPass);
    if (result.success && (result.role === 'admin' || result.role === 'super_admin')) {
      setPassError('');
    } else {
      setPassError(result.message || 'Access Denied. Only administrator keys are authorized.');
    }
  };

  if (!loggedInAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-150">
            <Lock className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">Administrative Verification</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Kindly authenticate using the administrator access credentials to view financial ledgers and product catalogs.
            </p>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                Admin Username / Email
              </label>
              <input
                type="text"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="e.g. ganoniarbi@gmail.com"
                className="w-full rounded-lg border border-slate-200 bg-slate-55 py-2.5 px-3 text-xs outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                Security Password (Use ARB790874A)
              </label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="••••••••••"
                className="w-full rounded-lg border border-slate-200 bg-slate-55 py-2.5 px-3 text-xs outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            {passError && (
              <p className="text-[11px] font-medium text-rose-500">
                {passError} Use 'ganoniarbi@gmail.com' and 'ARB790874A' to authenticate clearance.
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white uppercase hover:bg-indigo-700 tracking-wider transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200"
            >
              Verify Administrative Clearance
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ANALYTICAL CALCULATIONS ---
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, ord) => sum + ord.total, 0);

  const totalSalesCount = orders.filter(o => o.status !== 'Cancelled').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);
  const averageValue = totalSalesCount > 0 ? Number((totalRevenue / totalSalesCount).toFixed(2)) : 0;

  // Render SVG Chart for metrics
  // We plot dates along X-axis, amounts along Y-axis dynamically
  const maxSalesAmt = Math.max(...SALES_TRENDS.map(s => s.amount), 3000);
  const chartHeight = 120;
  const chartWidth = 500;

  // Calculate polygon points
  const points = SALES_TRENDS.map((dat, idx) => {
    const x = (idx / (SALES_TRENDS.length - 1)) * chartWidth;
    const y = chartHeight - (dat.amount / maxSalesAmt) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  // Create area coordinates
  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  // --- CRUD FUNCTIONS HANDLERS ---
  const handleAddNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission('edit')) return;
    if (!newProdName || !newProdDesc || newProdPrice <= 0) {
      alert('Product Name, Price and description are required.');
      return;
    }

    const highlightList = newProdHighlight ? newProdHighlight.split('\n').filter(Boolean) : [
      'Genuine selected premium hardware components',
      'Tested for physical and aesthetic durability standards'
    ];

    const tagList = newProdTags ? newProdTags.split(',').map(t => t.trim().toLowerCase()) : ['custom', 'design'];

    const finalCategory = isCustomCategory ? (customCategoryName.trim() || 'Uncategorized') : newProdCategory;

    addProduct({
      name: newProdName,
      description: newProdDesc,
      price: Number(newProdPrice),
      originalPrice: newProdOrigPrice > 0 ? Number(newProdOrigPrice) : undefined,
      category: finalCategory,
      stock: Number(newProdStock),
      image: newProdImage || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      highlights: highlightList,
      tags: tagList
    });

    // Reset Form
    setNewProdName('');
    setNewProdPrice(0);
    setNewProdOrigPrice(0);
    setNewProdStock(0);
    setNewProdDesc('');
    setNewProdImage('');
    setNewProdHighlight('');
    setNewProdTags('');
    setCustomCategoryName('');
    setIsCustomCategory(false);
    setShowAddForm(false);
  };

  const saveProductEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission('edit')) return;
    if (editingProduct) {
      editProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleRegisterStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffSuccess(null);
    setStaffError(null);

    if (currentAdminUser?.role !== 'super_admin') {
      setStaffError('Only active Super Administrators have credentials to authorize and register new administration roles.');
      return;
    }

    if (!newStaffName || !newStaffEmail || !newStaffPass) {
      setStaffError('Please provide All requirements: Colleague Name, Email Username, Password String.');
      return;
    }

    if (!newStaffEmail.includes('@')) {
      setStaffError('Authentication username must align to a standard email address syntax.');
      return;
    }

    try {
      createNewAdmin(newStaffName, newStaffEmail, newStaffPass, newStaffRole);
      setStaffSuccess(`Secure profile created successfully for ${newStaffName}. They may now access standard administrative systems.`);
      setNewStaffName('');
      setNewStaffEmail('');
      setNewStaffPass('');
      setNewStaffRole('admin');
    } catch (err: any) {
      setStaffError(err.message || 'The user credentials registration was rejected by the database ledger.');
    }
  };

  const handleCreatePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission('promos')) return;
    if (!newPromoCode || newPromoPercent <= 0) return;
    
    addPromoCode({
      code: newPromoCode.trim().toUpperCase(),
      percent: Number(newPromoPercent),
      active: true,
      description: newPromoDesc || `${newPromoPercent}% discount applied at invoice checkout`
    });

    setNewPromoCode('');
    setNewPromoPercent(10);
    setNewPromoDesc('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="admin-panel-root">
      
      {/* Dynamic Upper Title details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">{settings.adminPanelName || 'Administrative Control Console'}</h1>
          <p className="text-xs text-slate-450 mt-1">
            Real-time shop financial ledger, product catalogue editor, promotion campaigns and order processing tools.
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0 text-xs font-mono">
          <span className="text-slate-450 uppercase">ACCESS PROTOCOL: </span>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 font-semibold">ADMIN_SECURE_AUTH</span>
          <button 
            onClick={() => logoutUser()}
            className="text-slate-500 hover:text-rose-600 border border-slate-200 px-2.5 py-1 rounded hover:bg-slate-50 font-semibold"
          >
            Lock Dashboard
          </button>
        </div>
      </div>

      {/* Grid Tabs Selection */}
      <div className="flex space-x-1.5 border-b border-slate-200 pb-4 mb-6 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Suite Dashboard', icon: TrendingUp },
          { id: 'products', label: 'Inventory Register', icon: Package },
          { id: 'orders', label: 'Order Processing', icon: ShoppingCart },
          { id: 'customers', label: 'Customers Registry', icon: Users },
          { id: 'promos', label: 'Discount Campaigns', icon: Tag },
          { id: 'emails', label: `System Alerts (${simulatedEmails.filter(e => !e.read).length})`, icon: Bell },
          { id: 'settings', label: 'Store Constants', icon: Settings },
          { id: 'permissions', label: 'Staff & Permissions', icon: Lock },
        ].filter((tab) => {
          if (currentAdminUser?.role === 'super_admin') return true;
          if (tab.id === 'permissions') return true;
          
          const tabMap: Record<string, keyof AdminPermissions> = {
            dashboard: 'viewDashboard',
            products: 'viewProducts',
            orders: 'viewOrders',
            customers: 'viewCustomers',
            promos: 'viewPromos',
            emails: 'viewEmails',
            settings: 'viewSettings',
          };
          
          const permKey = tabMap[tab.id];
          return permKey ? adminPermissions[permKey] === true : true;
        }).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border shadow-sm ${
                activeTab === tab.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 hover:bg-indigo-700'
                  : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================= VIEW: DASHBOARD PANEL ======================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in" id="dashboard-tab">
          
          {/* Key Metric cards widget */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-1.5">
                <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest">Total Net Revenue</span>
                <span className="block text-xl font-bold font-mono text-slate-900">{settings.baseCurrency}{totalRevenue.toFixed(2)}</span>
                <span className="block text-[9.5px] font-sans text-emerald-600 font-semibold">↑ 14.2% from preceding week</span>
              </div>
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-indigo-600">
                <Coins className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-1.5">
                <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest">Orders Processed</span>
                <span className="block text-xl font-bold font-mono text-slate-900">{totalSalesCount} Receipts</span>
                <span className="block text-[9.5px] font-sans text-slate-400">Average billing basket size: 1.8 items</span>
              </div>
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-indigo-600">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-1.5">
                <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest">Mean Ticket Order Value</span>
                <span className="block text-xl font-bold font-mono text-slate-900">{settings.baseCurrency}{averageValue.toFixed(2)}</span>
                <span className="block text-[9.5px] font-sans text-emerald-600 font-semibold">↑ Premium tier items chosen</span>
              </div>
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-indigo-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-1.5">
                <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest">Customer Accounts</span>
                <span className="block text-xl font-bold font-mono text-slate-900">{customers.length} Profiles</span>
                <span className="block text-[9.5px] font-sans text-slate-400">Loyalty rate threshold: 82%</span>
              </div>
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
            </div>

          </div>

          {/* Lower layout: Custom Graphical Analytics and Low Stock Warnings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Visual Line Chart Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-display text-sm font-bold text-slate-900">Capital Flow Performance</h3>
                  <p className="text-[10px] text-slate-400">Total transaction processing volumes over past 7 calendar dates</p>
                </div>
                <span className="text-[10.5px] font-mono hover:text-indigo-600 text-slate-500 cursor-pointer font-semibold">Export CSV →</span>
              </div>

              {/* Vector SVG Line Chart */}
              <div className="relative pt-2 h-[140px] w-full bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#E2E8F0" strokeWidth="1" />
                  <line x1="0" y1={chartHeight/2} x2={chartWidth} y2={chartHeight/2} stroke="#E2E8F0" strokeWidth="1" />
                  <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3" />

                  {/* Shaded Area */}
                  <polygon points={areaPoints} fill="url(#areaGrad)" />

                  {/* Data path line */}
                  <polyline
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                    points={points}
                  />

                  {/* Bullet anchors */}
                  {SALES_TRENDS.map((dat, idx) => {
                    const x = (idx / (SALES_TRENDS.length - 1)) * chartWidth;
                    const y = chartHeight - (dat.amount / maxSalesAmt) * chartHeight;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="3.5"
                        className="fill-indigo-600 stroke-white stroke-2 shadow"
                      />
                    );
                  })}
                </svg>

                {/* X axis tag dates summary labels */}
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 px-1 pt-1.5 border-t border-slate-200">
                  {SALES_TRENDS.map((dat, idx) => (
                    <span key={idx}>{dat.date}</span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10.5px] text-slate-500 mt-4 leading-relaxed bg-slate-100 p-3 rounded-xl border border-slate-200">
                <span>Maximum sales spike: <strong className="text-indigo-605 font-mono">{settings.baseCurrency}{maxSalesAmt.toFixed(2)}</strong></span>
                <span>Active Ledger tracking: <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Verified Live</strong></span>
              </div>
            </div>

            {/* Low-Inventory alert panels */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <span className="font-display text-sm font-bold text-slate-900 flex items-center">
                  <ShieldAlert className="h-4.5 w-4.5 mr-1.5 text-rose-500" /> Stock Alerts
                </span>
                <span className="rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-[9px] font-bold font-mono">
                  {lowStockProducts.length} CRITICAL
                </span>
              </div>

              <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                {lowStockProducts.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    All inventory levels within expected margin parameters.
                  </div>
                ) : (
                  lowStockProducts.map(p => (
                    <div 
                      key={p.id} 
                      className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5 max-w-[160px] truncate">
                        <div className="h-8 w-8 rounded overflow-hidden bg-white border border-slate-200">
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="truncate">
                          <span className="block font-semibold text-slate-900 truncate leading-tight">{p.name}</span>
                          <span className="block text-[9px] text-slate-400 font-mono italic">{p.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`block font-mono font-bold text-[11px] ${p.stock === 0 ? 'text-rose-600 font-black' : 'text-amber-700'}`}>
                          {p.stock <= 0 ? 'DEPLETED' : `${p.stock} units`}
                        </span>
                        <button
                          onClick={() => {
                            editProduct({ ...p, stock: p.stock + 15 });
                          }}
                          className="text-[9.5px] font-semibold text-indigo-650 hover:text-indigo-800 hover:underline cursor-pointer uppercase block"
                        >
                          Restock +15
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-[10px] text-slate-405 leading-relaxed pt-2 text-center border-t border-slate-100">
                Low-stocks trigger storefront safety warnings for checking clients.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ======================= VIEW: PRODUCTS REGISTER ======================= */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fade-in" id="products-tab">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="relative max-w-xs">
              <input
                type="text"
                placeholder="Find item ID, tag, title..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setShowCategoryManager(!showCategoryManager);
                  setShowAddForm(false);
                }}
                className={`rounded-lg border px-4 py-2 text-xs font-bold uppercase transition-all flex items-center space-x-1.5 shadow-sm ${
                  showCategoryManager
                    ? 'bg-slate-850 border-slate-805 text-white'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-705'
                }`}
              >
                <Tag className="h-4 w-4" />
                <span>Manage Categories ({Array.from(new Set([...customCategories, ...products.map(p => p.category)])).filter(Boolean).length})</span>
              </button>

              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setShowCategoryManager(false);
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white uppercase hover:bg-indigo-700 flex items-center space-x-1.5 shadow-md shadow-indigo-100 transition-all font-semibold"
              >
                <Plus className="h-4 w-4" />
                <span>Acquire New Product</span>
              </button>
            </div>
          </div>

          {/* CATEGORY MANAGER CONSOLE */}
          {showCategoryManager && (() => {
            const allCats = Array.from(new Set([
              ...customCategories,
              ...products.map(p => p.category)
            ])).filter(Boolean);

            return (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-4xl animate-fade-in">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 uppercase">
                    📂 Core Classification Registry
                  </span>
                  <h3 className="font-display text-sm font-bold text-slate-900 mt-1">Category Blueprint Builder</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Instrain segments, build custom catalogs, rename names universally, or eliminate empty templates to keep your system organized.
                  </p>
                </div>

                {/* Grid for Segment adding or listings */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left: Create Empty segment */}
                  <div className="md:col-span-5 bg-white p-4 rounded-xl border border-slate-150 space-y-3">
                    <h4 className="font-display text-xs font-bold text-slate-800">Add Custom Shelf Segment</h4>
                    <p className="text-[10.5px] text-slate-400 leading-snug">
                      Creating an empty category registers it globally so it becomes immediately selectable when uploading specs.
                    </p>
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        placeholder="e.g. Stoneware Ceramics"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const formatted = newCategoryName.trim();
                          if (!formatted) {
                            alert('Segment title cannot be left blank.');
                            return;
                          }
                          if (allCats.some(c => c.toLowerCase() === formatted.toLowerCase())) {
                            alert('A classification segment with this exact title already exists.');
                            return;
                          }
                          setCustomCategories([...customCategories, formatted]);
                          setNewCategoryName('');
                        }}
                        className="w-full rounded bg-slate-155 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-white hover:bg-slate-800 active:scale-98 transition-all"
                      >
                        Instantiate Segment
                      </button>
                    </div>
                  </div>

                  {/* Right: Existing segment ledger */}
                  <div className="md:col-span-7 bg-white p-4 rounded-xl border border-slate-150 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display text-xs font-bold text-slate-800 mb-2 font-mono tracking-wide">Category Segment Index</h4>
                      <div className="space-y-2 max-h-[225px] overflow-y-auto pr-1">
                        {allCats.map(cat => {
                          const productCount = products.filter(p => p.category === cat).length;
                          const isEditing = editingCategoryOldName === cat;

                          return (
                            <div key={cat} className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                              <div className="flex-1 mr-4">
                                {isEditing ? (
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={editingCategoryNewName}
                                      onChange={(e) => setEditingCategoryNewName(e.target.value)}
                                      className="flex-1 rounded border border-indigo-550 bg-white px-2 py-1 text-xs outline-none font-sans"
                                    />
                                    <button
                                      onClick={() => {
                                        const edited = editingCategoryNewName.trim();
                                        if (!edited) return;
                                        if (allCats.some(c => c !== cat && c.toLowerCase() === edited.toLowerCase())) {
                                          alert('A category with that name exists.');
                                          return;
                                        }

                                        // 1. Rename inside custom list
                                        setCustomCategories(prev => prev.map(c => c === cat ? edited : c));
                                        
                                        // 2. Rename globally across matching products
                                        products.forEach(p => {
                                          if (p.category === cat) {
                                            editProduct({ ...p, category: edited });
                                          }
                                        });

                                        setEditingCategoryOldName(null);
                                      }}
                                      className="bg-emerald-600 text-white rounded px-2.5 py-1 text-[10px] font-bold uppercase"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingCategoryOldName(null)}
                                      className="text-slate-400 hover:text-slate-600 px-1"
                                    >
                                      ╳
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="font-semibold text-slate-800 block text-xs">{cat}</span>
                                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">
                                      💼 {productCount} Active spec{productCount === 1 ? '' : 's'}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {!isEditing && (
                                <div className="flex items-center space-x-2.5 flex-shrink-0">
                                  <button
                                    onClick={() => {
                                      setEditingCategoryOldName(cat);
                                      setEditingCategoryNewName(cat);
                                    }}
                                    className="text-slate-400 hover:text-indigo-600 text-[10px] uppercase font-bold"
                                    title="Rename Segment Globally"
                                  >
                                    Rename
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you certain you wish to purge category segment "${cat}"? Products inside will be reset to "Uncategorized".`)) {
                                        // Bulk update products
                                        products.forEach(p => {
                                          if (p.category === cat) {
                                            editProduct({ ...p, category: 'Uncategorized' });
                                          }
                                        });
                                        // Remove from custom indices
                                        setCustomCategories(prev => prev.filter(c => c !== cat));
                                      }
                                    }}
                                    className="text-rose-500 hover:text-rose-700 text-[10px] uppercase font-bold"
                                    title="Remove categorization directory"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ADD PRODUCT FORM PANEL TRIGGER */}
          {showAddForm && (
            <form onSubmit={handleAddNewProductSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-2xl">
              <h3 className="font-display text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Add Custom Item Specification</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Boreal Brass Sconce"
                    className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-505 focus:ring-1 focus:ring-indigo-505"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                  <div className="space-y-1.5">
                    <select
                      value={isCustomCategory ? '__custom__' : newProdCategory}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__custom__') {
                          setIsCustomCategory(true);
                          setCustomCategoryName('');
                        } else {
                          setIsCustomCategory(false);
                          setNewProdCategory(val);
                        }
                      }}
                      className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-500"
                    >
                      {Array.from(new Set([
                        ...customCategories,
                        ...products.map(p => p.category)
                      ])).filter(Boolean).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__custom__">+ Define New Category...</option>
                    </select>

                    {isCustomCategory && (
                      <input
                        type="text"
                        required
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        placeholder="Type custom category..."
                        className="w-full rounded bg-slate-50 border border-purple-400 p-2 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-purple-400"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Pricing ({settings.baseCurrency})</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProdPrice || ''}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs font-mono outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Original Cutoff ({settings.baseCurrency})</label>
                  <input
                    type="number"
                    value={newProdOrigPrice || ''}
                    onChange={(e) => setNewProdOrigPrice(Number(e.target.value))}
                    placeholder="Optional"
                    className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs font-mono outline-none focus:bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Stock Vol.</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newProdStock || ''}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs font-mono outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Image Web Address</label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="Paste Unsplash address link..."
                  className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Description Brief</label>
                <textarea
                  required
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Detail natural materials and durability criteria spec..."
                  className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2 text-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-lg px-4 py-2 border border-slate-200 text-xs hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100"
                >
                  Create and Broadcast Acquisition
                </button>
              </div>
            </form>
          )}

          {/* EDITING PRODUCT FORM INLINE OVERLAY */}
          {editingProduct && (
            <form onSubmit={saveProductEdits} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-2xl">
              <h3 className="font-display text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Modify Spec Properties: {editingProduct.name}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    list="categories-list-suggestions"
                    className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs focus:bg-white outline-none"
                  />
                  <datalist id="categories-list-suggestions">
                    {Array.from(new Set([
                      ...customCategories,
                      ...products.map(p => p.category)
                    ])).filter(Boolean).map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 text-slate-400">Unit Pricing</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs font-mono focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 text-slate-400">Stock Cap</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs font-mono focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Product Image URL with Premium Thumbnail Preview */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Product Image URL</label>
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex-shrink-0 shadow-sm">
                    <img 
                      src={editingProduct.image || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'} 
                      alt="Preview" 
                      className="h-full w-full object-cover transition-opacity duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="Paste Unsplash image URL..."
                    className="flex-1 rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white font-mono text-slate-800"
                  />
                </div>
              </div>

              {/* Product Description / Detail */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Description / Detail (Dt)</label>
                <textarea
                  required
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detail natural materials and durability criteria spec..."
                  className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white text-slate-800"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2 text-slate-705">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-lg px-4 py-2 border border-slate-200 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-xs font-bold hover:bg-indigo-700 shadow-md"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          )}

          {/* MAIN PRODUCTS TABLE LIST */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-150 text-left text-xs">
              <thead className="bg-slate-50 font-mono text-[10px] text-slate-450 uppercase tracking-widest border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Item Spec</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">In-Stock Register</th>
                  <th className="px-6 py-4 text-right">Direct Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
                {products
                  .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.id.toLowerCase().includes(productSearch.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 flex items-center space-x-3">
                        <img src={p.image} alt="" className="h-9 w-9 rounded-lg overflow-hidden object-cover border border-slate-150" />
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{p.name}</p>
                          <span className="font-mono text-[9px] text-slate-400">ID: {p.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-medium">{p.category}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{settings.baseCurrency}{p.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block font-mono font-bold ${p.stock <= 5 ? 'text-rose-500' : 'text-slate-700'}`}>
                          {p.stock} Units
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            if (checkPermission('edit')) {
                              setEditingProduct(p);
                            }
                          }}
                          className="p-1 px-2.5 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 font-semibold transition-colors rounded-lg text-slate-500 text-xs shadow-sm bg-white"
                          title="Edit specs"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => {
                            if (checkPermission('delete')) {
                              if (confirm('Delete item from catalogue register completely?')) {
                                deleteProduct(p.id);
                              }
                            }
                          }}
                          className="p-1 px-2.5 border text-rose-600 border-rose-100 hover:bg-rose-50 transition-all rounded-lg text-xs"
                          title="Delete product"
                        >
                          Purge
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ======================= VIEW: ORDER PROCESSING ======================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in" id="orders-tab">
          
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-mono text-slate-550 uppercase tracking-widest font-semibold">FILTER ROUTING PIPELINE:</span>
            <div className="flex gap-2">
              {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`rounded-lg border px-3.5 py-1.5 text-[10.5px] font-semibold transition-all shadow-sm ${
                    orderFilter === st 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100 shadow-inner' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-550'
                  }`}
                >
                  {st.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-150 text-left text-xs">
              <thead className="bg-slate-50 font-mono text-[10px] text-slate-450 uppercase tracking-widest border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Receipt Account ID</th>
                  <th className="px-4 py-4">Client Detail</th>
                  <th className="px-4 py-4">Financial Ledger Gross</th>
                  <th className="px-4 py-4">Pipeline Status</th>
                  <th className="px-6 py-4 text-right">Status Modifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders
                  .filter(o => orderFilter === 'All' || o.status === orderFilter)
                  .map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        {ord.id}
                        <span className="block text-[9px] text-slate-400 font-normal">{new Date(ord.date).toLocaleDateString()}</span>
                      </td>
                      <td className="px-4 py-4 max-w-[180px]">
                        <p className="font-semibold text-slate-900 truncate leading-tight">{ord.customerName}</p>
                        <span className="block text-[10.5px] text-slate-400 truncate font-mono">{ord.customerEmail}</span>
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-slate-900">
                        {settings.baseCurrency}{ord.total.toFixed(2)}
                        <span className="block text-[9.5px] text-slate-400 font-normal">{ord.items.length} items purchased</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          ord.status === 'Shipped' ? 'bg-indigo-100 text-indigo-805 text-indigo-800 border border-indigo-200' :
                          ord.status === 'Cancelled' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-805 text-amber-800 border border-amber-200'
                        }`}>
                          {ord.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            if (checkPermission('orders')) {
                              updateOrderStatus(ord.id, e.target.value as OrderStatus);
                            }
                          }}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-xs outline-none focus:border-indigo-500 text-slate-700"
                        >
                          <option value="Pending">Pending Setup</option>
                          <option value="Shipped">Dispatched Shipped</option>
                          <option value="Delivered">Delivered Done</option>
                          <option value="Cancelled">Cancelled Reverted</option>
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ======================= VIEW: CUSTOMERS REGISTRY ======================= */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-fade-in" id="customers-tab">
          
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-150 text-left text-xs">
              <thead className="bg-slate-50 font-mono text-[10px] text-slate-450 uppercase tracking-widest border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Client Identifiers</th>
                  <th className="px-4 py-4">Registry Date</th>
                  <th className="px-4 py-4">Transaction Frequency</th>
                  <th className="px-6 py-4 text-right">Gross Account Intake</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3.5">
                      <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight">{cust.name}</p>
                        <span className="font-mono text-[10px] text-slate-400 block">{cust.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-400">{cust.registrationDate}</td>
                    <td className="px-4 py-4 text-slate-605">{cust.ordersCount} Completed Orders</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                      {settings.baseCurrency}{cust.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ======================= VIEW: DISCOUNT CAMPAIGNS ======================= */}
      {activeTab === 'promos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" id="promos-tab">
          
          {/* Coupon Generator Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 h-fit shadow-sm">
            <h3 className="font-display text-sm font-bold text-slate-900 flex items-center">
              <Sparkles className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> Coupon Formulator
            </h3>
            
            <form onSubmit={handleCreatePromoSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Promo/Coupon Code Name
                </label>
                <input
                  type="text"
                  required
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  placeholder="e.g. SUMMER30"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 uppercase tracking-wider text-xs font-mono outline-none focus:bg-white focus:border-indigo-550 focus:ring-1 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Cutoff Discount Percentage
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={newPromoPercent}
                  onChange={(e) => setNewPromoPercent(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-mono outline-none focus:bg-white focus:border-indigo-550 focus:ring-1 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Brief description spec
                </label>
                <input
                  type="text"
                  value={newPromoDesc}
                  onChange={(e) => setNewPromoDesc(e.target.value)}
                  placeholder="e.g. Seasonal 30% reduction off checkout invoice"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs outline-none focus:bg-white focus:border-indigo-550 focus:ring-1 focus:ring-indigo-500 text-slate-805"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white uppercase hover:bg-indigo-700 tracking-wider flex items-center justify-center space-x-1 shadow-md shadow-indigo-100 transition-all font-semibold"
              >
                <span>Authorize campaign code</span>
              </button>
            </form>
          </div>

          {/* Dynamic Active codes index list table */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-900">Approved Promotion campaigns</h3>
            
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-150 text-xs">
                <thead className="bg-slate-50 font-mono text-[10px] text-slate-450 uppercase tracking-widest text-left border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Active code</th>
                    <th className="px-4 py-4">Reduction Index</th>
                    <th className="px-4 py-4">Campaign specifications</th>
                    <th className="px-6 py-4 text-right">Clearance toggles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {promoCodes.map(pc => (
                    <tr key={pc.code} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-mono font-bold text-slate-900">{pc.code}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-600">{pc.percent}% OFF</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{pc.description}</td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => {
                            if (checkPermission('promos')) {
                              togglePromoCode(pc.code);
                            }
                          }}
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider uppercase transition-all text-right ${
                            pc.active 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-205 hover:bg-slate-150'
                          }`}
                        >
                          {pc.active ? '● LIVE ACTIVE' : '○ PAUSED'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================= VIEW: GENERAL SETTINGS ======================= */}
      {activeTab === 'settings' && (() => {
        const imagePresets = [
          {
            id: 'workspace',
            name: 'Minimal Workspace',
            url: 'https://images.unsplash.com/photo-1593642702821-c8da63116c2c?w=1600&q=80',
            desc: 'Deep slate grey desks with clean gadgetry textures'
          },
          {
            id: 'abstract-lines',
            name: 'Abstract Metal Lines',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80',
            desc: 'Metallic gradients and luxurious industrial lines'
          },
          {
            id: 'nordic',
            name: 'Nordic Ceramic Calm',
            url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1600&q=80',
            desc: 'Soft morning shadows cast over clay utensils'
          },
          {
            id: 'loft',
            name: 'Industrial Studio Loft',
            url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1600&q=80',
            desc: 'Warm brick highlights inside a draftsmans studio'
          },
          {
            id: 'materials',
            name: 'Cognac Leather & Felt',
            url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=1600&q=80',
            desc: 'Ultra high-definition closeups of office stationery'
          }
        ];

        const templatePresets = [
          {
            id: 'classic-slate',
            name: 'Classic Slate',
            colors: 'bg-slate-900 text-white',
            badge: 'border-indigo-400/60 bg-indigo-500/10 text-indigo-300',
            btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
            desc: 'Corporate, trustworthy, robust slate grey aesthetic.'
          },
          {
            id: 'cosmic-night',
            name: 'Cosmic Night',
            colors: 'bg-indigo-950 text-indigo-100',
            badge: 'border-purple-400 bg-purple-500/10 text-purple-300',
            btn: 'bg-purple-600 hover:bg-purple-700 text-white',
            desc: 'Ethereal, majestic, deeply saturated blues and purples.'
          },
          {
            id: 'emerald-glass',
            name: 'Emerald Glass',
            colors: 'bg-emerald-950 text-emerald-100',
            badge: 'border-amber-400 bg-amber-500/10 text-amber-300',
            btn: 'bg-amber-500 text-stone-900 font-extrabold hover:bg-amber-400',
            desc: 'Deep green layout paired with glowing amber accents.'
          },
          {
            id: 'warm-oak',
            name: 'Warm Oak',
            colors: 'bg-stone-900 text-stone-100',
            badge: 'border-orange-400 bg-orange-500/10 text-orange-300',
            btn: 'bg-orange-600 hover:bg-orange-500 text-white font-semibold',
            desc: 'Earthy, warm-textured, sierra orange and rich oak notes.'
          },
          {
            id: 'minimal-cream',
            name: 'Minimal Sand',
            colors: 'bg-slate-50 text-slate-800 border-slate-205 border',
            badge: 'border-slate-300 bg-slate-100 text-slate-600',
            btn: 'bg-slate-900 hover:bg-slate-805 text-white',
            desc: 'Spacious light sand cream theme with high-contrast elements.'
          },
          {
            id: 'ocean-cinematic',
            name: '🌊 Ocean Cinematic (Video)',
            colors: 'bg-teal-950 text-teal-100',
            badge: 'border-cyan-400 bg-cyan-905/20 text-cyan-300',
            btn: 'bg-cyan-500 hover:bg-cyan-450 text-slate-950 font-bold',
            desc: 'Hypnotic aerial ocean waves rolling over coastal rocks.'
          },
          {
            id: 'workspace-ambient',
            name: '☕ Workspace Ambient (Video)',
            colors: 'bg-neutral-900 text-stone-105',
            badge: 'border-amber-400 bg-amber-500/10 text-amber-300',
            btn: 'bg-amber-600 hover:bg-amber-550 text-white font-semibold',
            desc: 'Cozy, high-definition cinematic hands typing on notebook layouts.'
          },
          {
            id: 'cosmic-starfall',
            name: '✨ Cosmic Starfall (Video)',
            colors: 'bg-violet-950 text-indigo-100',
            badge: 'border-pink-400 bg-pink-500/10 text-pink-300',
            btn: 'bg-pink-600 hover:bg-pink-500 text-white font-bold',
            desc: 'Twinkling indigo stars swirling through nebulas.'
          }
        ];

        const activePreviewTheme = templatePresets.find(t => t.id === (settings.bannerType || 'classic-slate')) || templatePresets[0];

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl w-full animate-fade-in" id="settings-tab">
            
            {/* BRANDING BLUEPRINT PRESETS LIBRARY (Full-Width Header) */}
            <div className="lg:col-span-12 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-slate-850">
              {/* Background graphic flare */}
              <div className="absolute right-0 top-0 h-64 w-64 bg-indigo-550/15 rounded-full blur-3xl pointer-events-none -mr-15 -mt-15"></div>
              <div className="absolute left-1/3 bottom-0 h-40 w-40 bg-indigo-900/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div>
                    <span className="inline-flex items-center space-x-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[9.5px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
                      💎 High-Fidelity Design Presets
                    </span>
                    <h2 className="font-display text-lg md:text-xl font-bold mt-2 text-white">Brand Blueprint Preset Library</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Instantly transform your entire storefront. Applying a blueprint updates branding names, logos, card templates, backdrops, currencies, and hero banner displays simultaneously.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Theme Blueprint Engine Activeed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                  {[
                    {
                      id: 'retro-industrial',
                      name: 'Industrial Depot',
                      tagline: 'Bold, raw mechanical lines',
                      logoText: 'OD',
                      storeName: 'THE OBJECT DEPOT',
                      adminPanelName: 'CRITICAL OPS STATION',
                      websiteTheme: 'neutral-slate',
                      productGridTheme: 'brutalist-grid',
                      bannerType: 'classic-slate',
                      bannerBadge: 'STARK ARCHITECTURE // RAW CONTRASTS',
                      bannerTitle: 'FUNCTIONAL HEAVY OBJECTS',
                      bannerDesc: 'Heavy cast-iron castings, raw structural concrete sheets, and calibrated draftsman tools designed to withstand heavy everyday projects.',
                      bannerBtnText: 'ACQUIRE HEAVY OBJECTS ↗',
                      bannerImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80',
                      baseCurrency: '$',
                      taxRate: 0.10,
                      shippingRate: 20,
                      colorIndicator: 'bg-slate-950 text-white border-white',
                      badgeTheme: 'Brutalist'
                    },
                    {
                      id: 'midnight-nexus',
                      name: 'Obsidian Nexus',
                      tagline: 'Deep neon & frosted glass',
                      logoText: 'NX',
                      storeName: 'NEXUS SYSTEMS',
                      adminPanelName: 'NEXUS APEX COMMAND',
                      websiteTheme: 'dark-obsidian',
                      productGridTheme: 'glassmorphism-card',
                      bannerType: 'cosmic-night',
                      bannerBadge: 'QUANTUM RELEASE // INTEGRITY SHIELD',
                      bannerTitle: 'Holographic Desk Stations',
                      bannerDesc: 'Futuristic ergonomic panels engineered with custom-doped high-integrity elements and rare-earth static dissipate frames.',
                      bannerBtnText: 'INITIALIZE DOWNLINK ↓',
                      bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80',
                      baseCurrency: 'Ξ',
                      taxRate: 0.05,
                      shippingRate: 0,
                      colorIndicator: 'bg-purple-600 text-purple-100 border-purple-400',
                      badgeTheme: 'Sci-Fi Glow'
                    },
                    {
                      id: 'organic-scandi',
                      name: 'Nordic Sage Studio',
                      tagline: 'Earthy wood, clay & forest green',
                      logoText: 'Ø',
                      storeName: 'ØDGER WOODWORKS',
                      adminPanelName: 'Sage Crafted Headquarters',
                      websiteTheme: 'nordic-forest',
                      productGridTheme: 'editorial-list',
                      bannerType: 'minimal-cream',
                      bannerBadge: 'MINIMAL SCANDINAVIAN DESIGNS // HANDMADE',
                      bannerTitle: 'Sculpted Ceramics & Birch',
                      bannerDesc: 'Each specimen is hand-crafted in Copenhagen using certified organic birch timber of historic cabins, radiating high spiritual density.',
                      bannerBtnText: 'EXAMINE CRAFTED GOODS',
                      bannerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=80',
                      baseCurrency: 'kr',
                      taxRate: 0.25,
                      shippingRate: 45,
                      colorIndicator: 'bg-emerald-700 text-emerald-100 border-emerald-500',
                      badgeTheme: 'Organic'
                    },
                    {
                      id: 'imperial-gilded',
                      name: 'Royal Heritage',
                      tagline: 'Parchment and golden bronze',
                      logoText: '⚜',
                      storeName: 'AUREATE ACQUISITIONS',
                      adminPanelName: 'LE GRAND IMPERIAL LEDGER',
                      websiteTheme: 'royal-bronze',
                      productGridTheme: 'minimal-floating',
                      bannerType: 'classic-slate',
                      bannerBadge: 'ESTAB. MDCCLXXXIV // HIGH CROWN TRUST',
                      bannerTitle: 'Treasures of the Gilded Era',
                      bannerDesc: 'Unearth solid-cast bronze compasses, parchment journals, and gold leaf sandglass timers curated for leaders who measure time in centuries.',
                      bannerBtnText: 'BEHOLD COLLECTIONS',
                      bannerImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1600&q=80',
                      baseCurrency: '£',
                      taxRate: 0.08,
                      shippingRate: 15,
                      colorIndicator: 'bg-amber-700 text-amber-100 border-amber-505',
                      badgeTheme: 'Royal'
                    },
                    {
                      id: 'velvet-rose',
                      name: 'Aura Sunset Velvet',
                      tagline: 'Rich crimson, rose & luxury',
                      logoText: '❦',
                      storeName: 'VELOUR INTERIEURS',
                      adminPanelName: 'Rose Crimson Dashboard',
                      websiteTheme: 'crimson-velvet',
                      productGridTheme: 'glassmorphism-card',
                      bannerType: 'warm-oak',
                      bannerBadge: 'BOUTIQUE CURATED LUXURIES // SPRING',
                      bannerTitle: 'Tactile Crimson Pleasures',
                      bannerDesc: 'Elevate your private lounge with premium velvet chaise accessories, hand-rolled beeswax lamps, and heavy porcelain incense vessels.',
                      bannerBtnText: 'SECURE INDULGENCES',
                      bannerImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',
                      baseCurrency: '€',
                      taxRate: 0.12,
                      shippingRate: 25,
                      colorIndicator: 'bg-rose-700 text-rose-100 border-rose-500',
                      badgeTheme: 'Romantic'
                    },
                    {
                      id: 'carthage-stationery',
                      name: 'Carthage Crafts',
                      tagline: 'Warm terracotta clays & stationery',
                      logoText: '🇹🇳',
                      storeName: 'CARTHAGE CRAFTS CO',
                      adminPanelName: 'CARTHAGE OPERATIONAL CONSOLE',
                      websiteTheme: 'sand-carthage',
                      productGridTheme: 'brutalist-grid',
                      bannerType: 'ocean-cinematic',
                      bannerBadge: 'HANDCRAFTED IN TUNIS // LIMITED RELEASES',
                      bannerTitle: 'The Mediterranean Craft Set',
                      bannerDesc: 'Unearth authentic leather-bound traveler notebooks, vintage journal kits, and traditional craft materials shipped directly from Carthage.',
                      bannerBtnText: 'DISCOVER BLUEPRINT STATIONERY',
                      bannerImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&q=80',
                      bannerVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41225-large.mp4',
                      baseCurrency: 'DT',
                      taxRate: 0.19,
                      shippingRate: 7,
                      colorIndicator: 'bg-red-750 text-orange-50 border-orange-500',
                      badgeTheme: 'Tunisian Crafted'
                    },
                    {
                      id: 'lunar-cosmic',
                      name: 'Starlit Lunar Studio',
                      tagline: 'Dreamy violet & celestial astronomy',
                      logoText: '🔮',
                      storeName: 'LUNAR CO',
                      adminPanelName: 'LUNAR HQ CONTROL STATION',
                      websiteTheme: 'dreamy-lavender',
                      productGridTheme: 'glassmorphism-card',
                      bannerType: 'cosmic-starfall',
                      bannerBadge: 'CELESTIAL RELEASES // LIMITED EDITION',
                      bannerTitle: 'Aether Purple Moon Set',
                      bannerDesc: 'Immerse yourself in deep mystical violet journaling diaries, lunar starcharts, and glass wax seal accessories aligned with the stars.',
                      bannerBtnText: 'ENTER THE COSMOS',
                      bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&q=80',
                      bannerVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-shining-stars-and-clouds-40913-large.mp4',
                      baseCurrency: 'Ξ',
                      taxRate: 0.05,
                      shippingRate: 0,
                      colorIndicator: 'bg-indigo-950 text-indigo-100 border-violet-400',
                      badgeTheme: 'Dreamy Sci-Fi'
                    }
                  ].map((preset) => {
                    const isActive = settings.logoText === preset.logoText && settings.websiteTheme === preset.websiteTheme;
                    return (
                      <div 
                        key={preset.id}
                        onClick={() => {
                          updateSettings({
                            storeName: preset.storeName,
                            adminPanelName: preset.adminPanelName,
                            logoType: 'text',
                            logoText: preset.logoText,
                            websiteTheme: preset.websiteTheme,
                            productGridTheme: preset.productGridTheme,
                            bannerType: preset.bannerType,
                            bannerBadge: preset.bannerBadge,
                            bannerTitle: preset.bannerTitle,
                            bannerDesc: preset.bannerDesc,
                            bannerBtnText: preset.bannerBtnText,
                            bannerImage: preset.bannerImage,
                            bannerVideoUrl: (preset as any).bannerVideoUrl || undefined,
                            showHeroBanner: true,

                            // Separate cinematic video campaign settings
                            showVideoBanner: true,
                            videoBannerType: preset.id === 'carthage-stationery' ? 'ocean-cinematic' : 'cosmic-starfall',
                            videoBannerBadge: preset.bannerBadge,
                            videoBannerTitle: preset.id === 'carthage-stationery' ? 'Carthage Shores & Sea Breeze' : 'Lunar Cosmic Starfall',
                            videoBannerDesc: preset.bannerDesc,
                            videoBannerBtnText: preset.id === 'carthage-stationery' ? 'EXPERIENCE COSTA CRAFTS ↓ font-bold' : 'ENTER THE COSMOS ↓ font-bold',
                            videoBannerVideoUrl: (preset as any).bannerVideoUrl || undefined,

                            baseCurrency: preset.baseCurrency,
                            taxRate: preset.taxRate,
                            shippingRate: preset.shippingRate
                          });
                          alert(`Brand Template Applied: Applied complete "${preset.name}" blueprint package successfully!`);
                        }}
                        className={`group cursor-pointer rounded-2xl p-4 transition-all duration-350 text-left relative flex flex-col justify-between border ${
                          isActive 
                            ? 'bg-slate-850 border-indigo-500 ring-1 ring-indigo-500 shadow-lg shadow-indigo-950/20' 
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-850/50'
                        }`}
                      >
                        <div>
                          {/* Colored Accent Badges */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`inline-block h-6 w-6 rounded-lg font-display text-xs font-bold flex items-center justify-center border ${preset.colorIndicator}`}>
                              {preset.logoText}
                            </span>
                            <span className={`text-[8.5px] font-mono tracking-wider uppercase font-semibold text-slate-400 ${
                              isActive ? 'text-indigo-400 font-extrabold' : ''
                            }`}>
                              {preset.badgeTheme}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                            {preset.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 leading-snug mt-1.5">
                            {preset.tagline}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-850/60 flex items-center justify-between">
                          <span className="text-[9.5px] font-mono font-bold text-white/70">
                            {preset.baseCurrency} // T:{preset.taxRate * 100}%
                          </span>
                          {isActive ? (
                            <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center">
                              ● ACTIVE
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono font-semibold text-slate-500 group-hover:text-slate-350 transition-colors">
                              APPLY ↗
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* COLUMN 1: Operational Base Settings (Left) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* BRANDING, INITIALS & LOGO CARD */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-display text-xs font-bold font-mono uppercase tracking-widest text-slate-400 pb-3 border-b border-slate-100 flex items-center">
                  <Sparkles className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> Identity & Branding
                </h3>

                <div className="space-y-4">
                  {/* Storefront Name */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Storefront Name (Navbar & Foots)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                      value={settings.storeName}
                      onChange={(e) => updateSettings({ storeName: e.target.value.toUpperCase() })}
                      placeholder="e.g. AETHER OBJECTS"
                    />
                  </div>

                  {/* Admin Console Name */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Admin Panel Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                      value={settings.adminPanelName || ''}
                      onChange={(e) => updateSettings({ adminPanelName: e.target.value })}
                      placeholder="e.g. Administrative Control Console"
                    />
                  </div>

                  {/* Brand Logo Preference Selector */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Brand Logo Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateSettings({ logoType: 'text' })}
                        className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                          (settings.logoType || 'text') === 'text'
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Text Symbol
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSettings({ logoType: 'image' })}
                        className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                          settings.logoType === 'image'
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Image Upload / URL
                      </button>
                    </div>
                  </div>

                  {/* Context Sensitive Forms for Logo Type chosen */}
                  {settings.logoType === 'image' ? (
                    <div className="space-y-2 animate-fade-in">
                      <label className="block text-[9px] font-mono font-semibold uppercase text-slate-400">
                        Brand Logo Image URL
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                          <img
                            src={settings.logoImage || 'https://images.unsplash.com/photo-1593642702821-c8da63116c2c?w=100&q=80'}
                            alt="Logo brand preview"
                            className="h-full w-full object-cover rounded"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593642702821-c8da63116c2c?w=100&q=80';
                            }}
                          />
                        </div>
                        <input
                          type="text"
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:bg-white focus:border-indigo-500 font-mono text-slate-800"
                          placeholder="Paste image logo URL..."
                          value={settings.logoImage || ''}
                          onChange={(e) => updateSettings({ logoImage: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-fade-in">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Logo Text Symbol / Initials (Max 3 chars)
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-display text-lg font-bold shadow-md shadow-indigo-150 flex-shrink-0">
                          {settings.logoText || 'Æ'}
                        </div>
                        <input
                          type="text"
                          maxLength={3}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800 font-bold"
                          placeholder="e.g. Æ, DT, MK"
                          value={settings.logoText || ''}
                          onChange={(e) => updateSettings({ logoText: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO, FAVICON, & SEARCH INDEX CONFIGURATION */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-display text-xs font-bold font-mono uppercase tracking-widest text-slate-400 pb-3 border-b border-slate-100 flex items-center">
                  <Database className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> SEO & Favicon Settings
                </h3>

                <div className="space-y-4">
                  {/* Favicon URL with live preview */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Favicon Link URL
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex-shrink-0 flex items-center justify-center p-1.5">
                        <img
                          src={settings.faviconUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&q=80'}
                          alt="Favicon preview"
                          className="h-full w-full object-contain rounded"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:bg-white focus:border-indigo-500 font-mono text-slate-800"
                        placeholder="Paste favicon link URL..."
                        value={settings.faviconUrl || ''}
                        onChange={(e) => updateSettings({ faviconUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* SEO Title */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Meta Index Title (SEO)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                      value={settings.seoTitle || ''}
                      onChange={(e) => updateSettings({ seoTitle: e.target.value })}
                      placeholder="e.g. AETHER OBJECTS — Timeless Artisan Storefront"
                    />
                  </div>

                  {/* SEO Description */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Meta Index Description
                    </label>
                    <textarea
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800 leading-normal"
                      value={settings.seoDescription || ''}
                      onChange={(e) => updateSettings({ seoDescription: e.target.value })}
                      placeholder="Timeless home and workplace coordinates crafted from premium North American materials..."
                    />
                  </div>

                  {/* SEO Keywords */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Meta Keywords list (separated by commas)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800 font-mono"
                      value={settings.seoKeywords || ''}
                      onChange={(e) => updateSettings({ seoKeywords: e.target.value })}
                      placeholder="artisan, stationery, workspace, premium, object"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[10.5px] text-slate-500 space-y-1 text-left leading-relaxed">
                    <p className="font-bold text-slate-600 flex items-center">
                      <Sparkles className="h-3 w-3 mr-1 text-indigo-500" /> Automated Search Index Features:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Your sitemap at <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-700">/sitemap.xml</code> syncs with Google and Bing search crawlers.</li>
                      <li>Page titles and descriptions automatically update when items are viewed inside the store.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* OPERATIONAL FEES & TAXES CONFIGURATION */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-display text-xs font-bold font-mono uppercase tracking-widest text-slate-400 pb-3 border-b border-slate-100 mb-5 flex items-center">
                  <Settings className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> Operational Constants
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Active Currency Spec
                    </label>
                    <select
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-2.5 text-xs font-mono outline-none focus:bg-white focus:border-indigo-700 text-slate-800"
                      value={settings.baseCurrency}
                      onChange={(e) => updateSettings({ baseCurrency: e.target.value })}
                    >
                      <option value="$">US Dollar ($)</option>
                      <option value="€">Euro (€)</option>
                      <option value="£">Pound Sterling (£)</option>
                      <option value="¥">Yen / Yuan (¥)</option>
                      <option value="DT">Tunisian Dinar (DT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Associated State Taxes ratio
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="0.5"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-mono outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                      value={settings.taxRate}
                      onChange={(e) => updateSettings({ taxRate: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Flat Deliver Cost Tariff ({settings.baseCurrency})
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-mono outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                      value={settings.shippingRate}
                      onChange={(e) => updateSettings({ shippingRate: Number(e.target.value) })}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => alert('General operational metrics saved in memory.')}
                      className="w-full rounded-lg bg-indigo-600 text-white py-2 text-xs font-bold uppercase hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                      Enforce Constants
                    </button>
                  </div>
                </div>
              </div>

              {/* Banner Live Mockup (Interactive preview box) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <span className="block text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">Live Storefront Previews</span>
                
                {/* Visual miniature mockup for static banner */}
                {settings.showHeroBanner !== false ? (
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-semibold text-slate-400 font-mono">1. STATIC IMAGE HERO PREVIEW</span>
                    <div className={`relative rounded-xl overflow-hidden p-6 aspect-[16/9] flex flex-col justify-end transition-all ${activePreviewTheme.colors}`}>
                      <div className="absolute inset-0 z-0 opacity-35">
                        <img 
                          src={settings.bannerImage || imagePresets[0].url} 
                          alt="Preview mockup background" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = imagePresets[0].url;
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent z-5"></div>

                      <div className="relative z-10 space-y-1.5 text-left">
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-[7.5px] font-mono font-bold uppercase ${activePreviewTheme.badge}`}>
                          {settings.bannerBadge || 'SPRING COLLECTION'}
                        </span>
                        <h4 className="text-xs font-black tracking-tight leading-tight text-white line-clamp-1">
                          {settings.bannerTitle || 'Instruments for Fine Craft.'}
                        </h4>
                        <div className="pt-1">
                          <span className={`inline-block pointer-events-none text-[8px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${activePreviewTheme.btn}`}>
                            {settings.bannerBtnText || 'Examine acquisitions'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-left opacity-60">
                    <span className="text-[9px] font-semibold text-slate-400 font-mono">1. STATIC IMAGE HERO PREVIEW</span>
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 aspect-[16/9] flex flex-col items-center justify-center text-center bg-slate-50 text-slate-400">
                      <span className="text-xl">🖼️</span>
                      <span className="text-[10px] font-mono mt-1 font-bold">IMAGE BANNER DISABLED</span>
                    </div>
                  </div>
                )}

                {/* Visual miniature mockup for video spotlight */}
                {settings.showVideoBanner !== false && (() => {
                  if (settings.videoBannerType === 'pure-video') {
                    const defaultVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41225-large.mp4';
                    return (
                      <div className="space-y-1.5 text-left pt-3 border-t border-slate-100">
                        <span className="text-[9px] font-semibold text-slate-400 font-mono">2. CINEMATIC VIDEO SPOTLIGHT PREVIEW</span>
                        <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-black border border-slate-100/50 shadow-md">
                          <video
                            src={settings.videoBannerVideoUrl || defaultVideoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    );
                  }

                  const viewThemeColors = (() => {
                    switch (settings.videoBannerType || 'ocean-cinematic') {
                      case 'workspace-ambient':
                        return { colors: 'bg-neutral-950 text-stone-101', badge: 'border-amber-400/60 bg-amber-500/10 text-amber-300', btn: 'bg-amber-600 text-white' };
                      case 'cosmic-starfall':
                        return { colors: 'bg-violet-950 text-indigo-101', badge: 'border-pink-400 bg-pink-500/10 text-pink-300', btn: 'bg-pink-600 text-white' };
                      case 'ocean-cinematic':
                      default:
                        return { colors: 'bg-teal-950 text-teal-101', badge: 'border-cyan-400 bg-cyan-900/20 text-cyan-300', btn: 'bg-cyan-500 text-slate-950 font-bold' };
                    }
                  })();

                  const defaultVideoUrl = settings.videoBannerType === 'workspace-ambient'
                     ? 'https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-notebook-computer-close-up-of-hands-41481-large.mp4'
                     : settings.videoBannerType === 'cosmic-starfall'
                       ? 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-shining-stars-and-clouds-40913-large.mp4'
                       : 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41225-large.mp4';

                  return (
                    <div className="space-y-1.5 text-left pt-3 border-t border-slate-100">
                      <span className="text-[9px] font-semibold text-slate-400 font-mono">2. CINEMATIC VIDEO SPOTLIGHT PREVIEW</span>
                      <div className={`relative rounded-xl overflow-hidden p-6 aspect-[16/9] flex flex-col justify-end transition-all ${viewThemeColors.colors}`}>
                        <div className="absolute inset-0 z-0 opacity-40">
                          <video
                            src={settings.videoBannerVideoUrl || defaultVideoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent z-5"></div>

                        <div className="relative z-10 space-y-1.5 text-left">
                          <span className={`inline-block rounded-full border px-2 py-0.5 text-[7.5px] font-mono font-bold uppercase ${viewThemeColors.badge}`}>
                            {settings.videoBannerBadge || 'CINEMATIC SPOTLIGHT'}
                          </span>
                          <h4 className="text-xs font-black tracking-tight leading-tight text-white line-clamp-1">
                            {settings.videoBannerTitle || 'Experience Pure Stationery Craft.'}
                          </h4>
                          <div className="pt-1">
                            <span className={`inline-block pointer-events-none text-[8px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${viewThemeColors.btn}`}>
                              {settings.videoBannerBtnText || 'EXPERIENCE LIVE CAMPAIGN'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="text-[10px] text-slate-450 leading-relaxed text-center">
                  Any toggles made to templates, images, or headings are dynamically updated immediately to the customer storefront viewport.
                </div>
              </div>
            </div>

            {/* COLUMN 2: Storefront Banner & Theme Customizer (Right) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                
                {/* Section Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900 flex items-center">
                      <Sparkles className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> Storefront Hero Customization Panel
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Configure color themes, template alignments, and visual background images for your primary landing storefront banner.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Status:</span>
                    <button
                      type="button"
                      onClick={() => updateSettings({ showHeroBanner: settings.showHeroBanner === false ? true : false })}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.showHeroBanner !== false ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.showHeroBanner !== false ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className={`text-[9px] font-mono font-bold uppercase ${settings.showHeroBanner !== false ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {settings.showHeroBanner !== false ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {settings.showHeroBanner !== false ? (
                    <>
                      {/* Part 1: Select Visual Style Template */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Step 1: Choose Theme Palette Template</label>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {templatePresets.map((t) => {
                        const isSelected = (settings.bannerType || 'classic-slate') === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => updateSettings({ bannerType: t.id })}
                            className={`rounded-xl p-3 border text-left flex flex-col justify-between transition-all duration-200 hover:border-indigo-500 cursor-pointer ${
                              isSelected 
                                ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20' 
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-800 tracking-tight block mb-1.5">
                              {t.name}
                            </span>
                            
                            {/* Accent swatches */}
                            <div className="flex space-x-1.5 mb-2.5">
                              <span className={`h-4.5 w-4.5 rounded-full border border-white flex-shrink-0 ${
                                t.id === 'classic-slate' ? 'bg-slate-900' :
                                t.id === 'cosmic-night' ? 'bg-indigo-950' :
                                t.id === 'emerald-glass' ? 'bg-emerald-950' :
                                t.id === 'warm-oak' ? 'bg-stone-900' :
                                t.id === 'ocean-cinematic' ? 'bg-teal-950' :
                                t.id === 'workspace-ambient' ? 'bg-neutral-900' :
                                t.id === 'cosmic-starfall' ? 'bg-violet-950' : 'bg-slate-100'
                              }`}></span>
                              <span className={`h-4.5 w-4.5 rounded-full border border-white flex-shrink-0 ${
                                t.id === 'classic-slate' ? 'bg-indigo-600' :
                                t.id === 'cosmic-night' ? 'bg-purple-600' :
                                t.id === 'emerald-glass' ? 'bg-amber-400' :
                                t.id === 'warm-oak' ? 'bg-orange-600' :
                                t.id === 'ocean-cinematic' ? 'bg-cyan-500' :
                                t.id === 'workspace-ambient' ? 'bg-amber-600' :
                                t.id === 'cosmic-starfall' ? 'bg-pink-600' : 'bg-slate-900'
                              }`}></span>
                            </div>

                            <span className="text-[9px] text-slate-400 leading-tight block">
                              {t.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Part 2: Select Template Background Image */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Step 2: Choose Template Background Image</label>
                    </div>
                    
                    {/* Prest image chooser */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {imagePresets.map((p) => {
                        const isSelected = settings.bannerImage === p.url;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => updateSettings({ bannerImage: p.url })}
                            className={`group relative rounded-xl h-24 overflow-hidden border transition-all hover:scale-[1.02] cursor-pointer ${
                              isSelected 
                                ? 'border-indigo-600 ring-2 ring-indigo-500/30' 
                                : 'border-slate-200'
                            }`}
                          >
                            <img src={p.url} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2 text-left">
                              <span className="text-[9px] font-bold text-white leading-tight line-clamp-1">
                                {p.name}
                              </span>
                              <span className="text-[8px] text-white/70 line-clamp-1 font-mono">
                                Preset
                              </span>
                            </div>
                            
                            {/* Checkmark overlay */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-indigo-600 rounded-full h-4.5 w-4.5 flex items-center justify-center text-white border border-white shadow-sm">
                                <span className="text-[9px]">✓</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom URL Option */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1.5">
                      <div>
                        <label className="block text-[9px] font-mono font-semibold uppercase text-slate-400 mb-1">
                          Or enter any custom background image URL:
                        </label>
                        <input
                          type="text"
                          className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs font-mono text-slate-700 outline-none focus:bg-white focus:border-indigo-500"
                          placeholder="Paste image URL (Unsplash or private bucket)..."
                          value={settings.bannerImage || ''}
                          onChange={(e) => updateSettings({ bannerImage: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono font-semibold uppercase text-slate-400 mb-1">
                          Or enter custom loop MP4 video URL:
                        </label>
                        <input
                          type="text"
                          className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs font-mono text-slate-700 outline-none focus:bg-white focus:border-indigo-500"
                          placeholder="Paste background video URL (.mp4 format)..."
                          value={settings.bannerVideoUrl || ''}
                          onChange={(e) => updateSettings({ bannerVideoUrl: e.target.value || undefined })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 3: Text Values inputs */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Step 3: Edit Banner Text Copy</label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono font-semibold uppercase text-slate-450 mb-1">Badge Tag / Small Title</label>
                        <input
                          type="text"
                          className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800 font-semibold"
                          value={settings.bannerBadge}
                          onChange={(e) => updateSettings({ bannerBadge: e.target.value })}
                          placeholder="e.g. Curated Collection // Spring Release"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono font-semibold uppercase text-slate-450 mb-1">Primary Header Text</label>
                        <input
                          type="text"
                          className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800 font-bold"
                          value={settings.bannerTitle}
                          onChange={(e) => updateSettings({ bannerTitle: e.target.value })}
                          placeholder="e.g. Instruments for the Fine Craft."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono font-semibold uppercase text-slate-450 mb-1">Button Action Label</label>
                        <input
                          type="text"
                          className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                          value={settings.bannerBtnText}
                          onChange={(e) => updateSettings({ bannerBtnText: e.target.value })}
                          placeholder="e.g. Examine Acquisitions ↓"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono font-semibold uppercase text-slate-450 mb-1">Description / Subtitle copy</label>
                        <textarea
                          rows={2}
                          className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                          value={settings.bannerDesc}
                          onChange={(e) => updateSettings({ bannerDesc: e.target.value })}
                          placeholder="Brief explanation copy to display under main heading..."
                        />
                      </div>
                    </div>
                  </div>
                    </>
                ) : (
                  <div className="py-10 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 my-2">
                    <Sparkles className="h-8 w-8 mx-auto text-indigo-400 opacity-60 mb-2.5 animate-pulse" />
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Static Image Hero Banner is Off</h5>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      Enable the storefront image banner using the <strong className="text-indigo-600 font-bold">Status switch</strong> above to customize themes, images, videos, and headings.
                    </p>
                  </div>
                )}

                {/* Part 4: Dedicated Cinematic Video Spotlight Campaign */}
                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Step 4: Configure Independent Cinematic Video Spotlight</label>
                        <p className="text-[10px] text-slate-400 mt-0.5">Set up a gorgeous, distinct video campaign block displayed separately beneath your primary image hero banner.</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Status:</span>
                        <button
                          type="button"
                          onClick={() => updateSettings({ showVideoBanner: settings.showVideoBanner === false ? true : false })}
                          className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            settings.showVideoBanner !== false ? 'bg-indigo-600' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.showVideoBanner !== false ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`text-[9px] font-mono font-bold uppercase ${settings.showVideoBanner !== false ? 'text-indigo-600' : 'text-slate-400'}`}>
                          {settings.showVideoBanner !== false ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    {settings.showVideoBanner !== false && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-[9px] font-mono font-semibold uppercase text-slate-450 mb-1.5">Choose Video Campaign Ambient Theme</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                              { id: 'ocean-cinematic', name: '🌊 Ocean Cinematic', desc: 'Hypnotic aerial ocean waves rolling over coastal rocks.' },
                              { id: 'workspace-ambient', name: '☕ Workspace Ambient', desc: 'Cozy, high-definition cinematic typing and coffee beans.' },
                              { id: 'cosmic-starfall', name: '✨ Cosmic Starfall', desc: 'Twinkling indigo stars swirling through deep nebulas.' },
                              { id: 'pure-video', name: '📺 Pure Spotlight', desc: 'Theatrical, clean video card layout with zero texts or buttons.' }
                            ].map((v) => {
                              const isSelected = (settings.videoBannerType || 'ocean-cinematic') === v.id;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => updateSettings({ videoBannerType: v.id })}
                                  className={`rounded-xl p-3 border text-left flex flex-col justify-between transition-all duration-200 hover:border-indigo-500 cursor-pointer ${
                                    isSelected 
                                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20' 
                                      : 'border-slate-200 bg-white'
                                  }`}
                                >
                                  <span className="text-xs font-semibold text-slate-800 tracking-tight block mb-1">
                                    {v.name}
                                  </span>
                                  <span className="text-[9px] text-slate-400 leading-tight block">
                                    {v.desc}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-mono font-semibold uppercase text-slate-450 mb-1">Custom Loop MP4 Video URL</label>
                            <input
                              type="text"
                              className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs font-mono text-slate-700 outline-none focus:bg-white focus:border-indigo-500"
                              placeholder="Paste MP4 video link..."
                              value={settings.videoBannerVideoUrl || ''}
                              onChange={(e) => updateSettings({ videoBannerVideoUrl: e.target.value || undefined })}
                            />
                            <p className="text-[9px] text-slate-400 mt-1 font-mono">Leave empty to use the selected video theme's default cinematic loop.</p>
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono font-semibold uppercase text-slate-450 mb-1">Video Banner Badge Tag</label>
                            <input
                              type="text"
                              className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800 font-semibold"
                              value={settings.videoBannerBadge || ''}
                              onChange={(e) => updateSettings({ videoBannerBadge: e.target.value })}
                              placeholder="e.g. CINEMATIC RELEASE // AUTOPLAY CAMPAIGN"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-mono font-semibold uppercase text-slate-450 mb-1">Video Banner Primary Header Text</label>
                            <input
                              type="text"
                              className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800 font-bold"
                              value={settings.videoBannerTitle || ''}
                              onChange={(e) => updateSettings({ videoBannerTitle: e.target.value })}
                              placeholder="e.g. Carthage Shores & Sea Breeze Workspace"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono font-semibold uppercase text-slate-450 mb-1">Video Banner Button Action Label</label>
                            <input
                              type="text"
                              className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                              value={settings.videoBannerBtnText || ''}
                              onChange={(e) => updateSettings({ videoBannerBtnText: e.target.value })}
                              placeholder="e.g. EXPERIENCE LIVE CAMPAIGN ↓"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono font-semibold uppercase text-slate-450 mb-1">Video Banner Description / Subtitle copy</label>
                          <textarea
                            rows={2}
                            className="w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                            value={settings.videoBannerDesc || ''}
                            onChange={(e) => updateSettings({ videoBannerDesc: e.target.value })}
                            placeholder="Brief description copy to display under video heading..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reset defaults button */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs leading-relaxed">
                    <span className="text-slate-400">
                      Changes are securely recorded inside memory structures and synchronized with visitor home views.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings({
                          bannerType: 'classic-slate',
                          bannerImage: 'https://images.unsplash.com/photo-1593642702821-c8da63116c2c?w=1600&q=80',
                          bannerBadge: 'Curated Collection // Spring Release',
                          bannerTitle: 'Instruments for the Fine Craft.',
                          bannerDesc: 'Our latest design objects merge resilient structures with premium natural materials, engineered to introduce harmony to your daily workspaces.',
                          bannerBtnText: 'Examine Acquisitions ↓',
                          
                          // Reset video spotlight as well
                          showVideoBanner: true,
                          videoBannerType: 'ocean-cinematic',
                          videoBannerBadge: 'CINEMATIC RELEASE // AUTOPLAY CAMPAIGN',
                          videoBannerTitle: 'Carthage Shores & Sea Breeze Workspace',
                          videoBannerDesc: 'Dive into our breathtaking sea-inspired stationery and limited edition travel diaries, capturing coastal magic on premium sand-colored coordinates.',
                          videoBannerBtnText: 'EXPERIENCE SEASHORE JOURNALING ↓',
                          videoBannerVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41225-large.mp4',

                          storeName: 'AETHER OBJECTS',
                          adminPanelName: 'Administrative Control Console',
                          logoType: 'text',
                          logoText: 'Æ',
                          logoImage: '',
                          websiteTheme: 'neutral-slate',
                          productGridTheme: 'minimal-floating'
                        });
                        alert('Storefront hero banner & themes restored to primary factory defaults.');
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase transition-all whitespace-nowrap"
                    >
                      Reset banner & theme defaults
                    </button>
                  </div>

                </div>

              </div>

              {/* WEBSITE & PRODUCT GRAPHIC THEME ENGINE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="font-display text-sm font-bold text-slate-900 flex items-center">
                    <Palette className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> Website & Product Theme Engine
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tune the overall color palette vibe, custom layout templates for product grid cards, and layout aesthetics.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Topic 1: Website Accent & Backdrop Theme */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Step 1: Website Palette Theme
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'neutral-slate', name: 'Neutral Slate (Default)', desc: 'Slate-50 layout with cool midnight typography & deep indigo cues' },
                        { id: 'dark-obsidian', name: 'Dark Obsidian Midnight', desc: 'Premium deep dark high-contrast wallpaper with vibrant violet details' },
                        { id: 'nordic-forest', name: 'Nordic Forest Sage', desc: 'Earthy organic sage green headers with calm pine accents' },
                        { id: 'royal-bronze', name: 'Royal Bronze Cream', desc: 'Aureate warm parchment sheets overlaid with golden bronze accents' },
                        { id: 'crimson-velvet', name: 'Crimson Velvet Rose', desc: 'Sunkissed velvet rose tone panels styling rich product contours' },
                        { id: 'sand-carthage', name: 'Carthage Terracotta', desc: 'Warm Tunisian clay look with terracotta red highlights and sand tones' },
                        { id: 'dreamy-lavender', name: 'Dreamy Lavender Moon', desc: 'Bespoke romantic lavender hues with misty star-filled night vibes' }
                      ].map((wt) => {
                        const isSelected = (settings.websiteTheme || 'neutral-slate') === wt.id;
                        return (
                          <button
                            key={wt.id}
                            type="button"
                            onClick={() => updateSettings({ websiteTheme: wt.id })}
                            className={`w-full text-left rounded-xl p-3 border transition-all cursor-pointer block ${
                              isSelected 
                                ? 'border-indigo-600 ring-2 ring-indigo-550/20 bg-indigo-50/15'
                                : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800">{wt.name}</span>
                              <span className={`h-2.5 w-2.5 rounded-full ${
                                wt.id === 'neutral-slate' ? 'bg-indigo-600' :
                                wt.id === 'dark-obsidian' ? 'bg-purple-600' :
                                wt.id === 'nordic-forest' ? 'bg-emerald-600' :
                                wt.id === 'royal-bronze' ? 'bg-amber-700' :
                                wt.id === 'crimson-velvet' ? 'bg-rose-700' :
                                wt.id === 'sand-carthage' ? 'bg-[#C05C36]' : 'bg-[#8B5CF6]'
                              }`}></span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-normal mt-1">{wt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Topic 2: Product Card Listing Presentation Theme */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Step 2: Product Card Layout Template
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'minimal-floating', name: 'Clean Floating Cards (Default)', desc: 'Clean cards with subtle 1px border lines, background tints, and slide-up trigger actions' },
                        { id: 'brutalist-grid', name: 'Stark Retro Brutalist', desc: 'Bold thick board lines, square geometric corners, with strong solid offset drop shadows' },
                        { id: 'glassmorphism-card', name: 'Holographic Glassmorphism', desc: 'Translucent frosted backgrounds with crystal visual outline glows' },
                        { id: 'editorial-list', name: 'Editorial Portfolio Panels', desc: 'Gorgeous side-by-side presentation splits displaying technical specs on wide grids' }
                      ].map((pt) => {
                        const isSelected = (settings.productGridTheme || 'minimal-floating') === pt.id;
                        return (
                          <button
                            key={pt.id}
                            type="button"
                            onClick={() => updateSettings({ productGridTheme: pt.id })}
                            className={`w-full text-left rounded-xl p-3 border transition-all cursor-pointer block ${
                              isSelected 
                                ? 'border-indigo-600 ring-2 ring-indigo-550/20 bg-indigo-50/15'
                                : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-800 block">{pt.name}</span>
                            <p className="text-[10px] text-slate-400 leading-normal mt-1">{pt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* CLOUD DATABASE SYNCHRONIZATION */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-800 flex items-center">
                      <Database className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> Cloud Database Connection & Backup Sync
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Manage real-time updates and synchronization with your MongoDB Atlas database cluster.
                    </p>
                  </div>
                  
                  {/* Status Indicator Badge */}
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center space-x-1 ${
                    dbSyncStatus === 'synced' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    dbSyncStatus === 'loading' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    dbSyncStatus === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-250 animate-pulse' :
                    'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      dbSyncStatus === 'synced' ? 'bg-emerald-500' :
                      dbSyncStatus === 'loading' ? 'bg-amber-500' :
                      dbSyncStatus === 'error' ? 'bg-rose-500' :
                      'bg-slate-400'
                    }`} />
                    <span className="uppercase tracking-wider font-mono text-[9px]">
                      {dbSyncStatus === 'synced' ? 'DB Connected' :
                       dbSyncStatus === 'loading' ? 'Syncing...' :
                       dbSyncStatus === 'error' ? 'SSL / Connection Error' :
                       'Offline Storage'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {dbSyncStatus === 'error' && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs space-y-3 text-left">
                      <div className="flex items-start space-x-2 text-rose-850">
                        <ShieldAlert className="h-4.5 w-4.5 mt-0.5 text-rose-600 flex-shrink-0" />
                        <div>
                          <p className="font-bold">MongoDB Atlas Connection Blocked (IP Access Restricted)</p>
                          <p className="mt-1 text-rose-700 text-[10.5px] leading-relaxed font-mono bg-rose-100/50 p-2 rounded border border-rose-200/50">
                            {dbError || 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR (SSL Alert 80)'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-rose-100 rounded-lg p-3 text-[11px] space-y-1.5 text-slate-705">
                        <p className="font-bold text-slate-800">💡 How to fix in 1 Minute:</p>
                        <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-slate-600">
                          <li>Go to your <strong>MongoDB Atlas Dashboard</strong>.</li>
                          <li>Navigate to the <strong>Security &rarr; Network Access</strong> tab in the left sidebar.</li>
                          <li>Click on <strong>Add IP Address</strong>.</li>
                          <li>Choose <strong>"Allow Access From Anywhere"</strong> (this automatically fills <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-800">0.0.0.0/0</code>).</li>
                          <li>Click <strong>Confirm</strong> and wait 30 seconds for Atlas to update. Our application will connect automatically!</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {dbSyncStatus === 'synced' && (
                    <div className="bg-emerald-50/50 border border-emerald-150 rounded-xl p-4 text-xs flex items-center space-x-3 text-emerald-850 text-left">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-emerald-800">Database status healthy & active</p>
                        <p className="text-[10.5px] text-emerald-700 mt-0.5 leading-normal">
                          All products, orders, promo codes, configurations, and accounts are automatically synchronized to your Atlas cluster. Open the dashboard on any other device or PC to manage instantly.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 pt-4 gap-3">
                    <div className="space-y-0.5 text-left">
                      <span className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Manual Cluster Synchronization</span>
                      <span className="text-[10.5px] text-slate-500">Force immediate state dump/clone to MongoDB server</span>
                    </div>

                    <button
                      type="button"
                      disabled={dbSyncStatus === 'loading'}
                      onClick={async () => {
                        const success = await manualSyncDb();
                        if (success) {
                          alert('💾 Local store state saved & backed up to MongoDB cluster successfully!');
                        } else {
                          alert('❌ Database connection failed.\n\nThis is usually due to MongoDB Atlas Network Access rules. Please make sure IP Address "0.0.0.0/0" (All Access) is added in Network Access.');
                        }
                      }}
                      className={`h-9 px-4 rounded-xl flex items-center space-x-1.5 text-xs font-bold transition-all border outline-none cursor-pointer hover:scale-[1.01] ${
                        dbSyncStatus === 'loading'
                          ? 'border-slate-200 bg-slate-50 text-slate-400'
                          : 'border-indigo-200 bg-indigo-50/30 text-indigo-700 hover:bg-indigo-50/80 active:bg-indigo-50'
                      }`}
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${dbSyncStatus === 'loading' ? 'animate-spin' : ''}`} />
                      <span>{dbSyncStatus === 'loading' ? 'Saving Backup...' : 'Save Backup to MongoDB'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* FLOATING ACTION CONTACT WIDGET SETTINGS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="font-display text-sm font-bold text-slate-800 flex items-center">
                    <MessageCircle className="h-4.5 w-4.5 mr-1.5 text-indigo-600 animate-pulse" /> Store Contact & Custom Floating Button Setup
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Configure a modern floating support widget at the bottom of your shop to route customers instantly to WhatsApp or Facebook Messenger.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
                  {/* Left Column: Toggles and Chooser */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Widget Visibility
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateSettings({ showContactWidget: true })}
                          className={`px-4 py-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                            settings.showContactWidget !== false
                              ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Enabled
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSettings({ showContactWidget: false })}
                          className={`px-4 py-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                            settings.showContactWidget === false
                              ? 'border-rose-600 bg-rose-50/20 text-rose-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Disabled
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Choose Messenger Platform
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: 'whatsapp', name: 'WhatsApp Web/App', desc: 'Secure direct-to-number messaging.', color: 'border-emerald-500 hover:bg-emerald-50/10' },
                          { id: 'messenger', name: 'Facebook Messenger', desc: 'Chat using Facebook username.', color: 'border-indigo-550 hover:bg-indigo-50/5' },
                        ].map((item) => {
                          const isSelected = (settings.contactWidgetType || 'whatsapp') === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => updateSettings({ contactWidgetType: item.id as any })}
                              className={`text-left rounded-xl p-3 border transition-all cursor-pointer block ${
                                isSelected 
                                  ? `scale-[1.01] ring-2 ring-indigo-500/20 bg-slate-50 ${item.color}`
                                  : 'border-slate-205 bg-white hover:border-slate-350'
                              }`}
                            >
                              <div className="flex items-center space-x-1.5 mb-1 text-slate-800">
                                {item.id === 'whatsapp' ? (
                                  <MessageCircle className="h-4 w-4 text-emerald-550" />
                                ) : (
                                  <MessageSquare className="h-4 w-4 text-indigo-550" />
                                )}
                                <span className="text-xs font-bold font-sans">{item.name}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-normal font-sans">{item.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Widget Position
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateSettings({ contactWidgetPosition: 'right' })}
                          className={`px-4 py-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                            (settings.contactWidgetPosition || 'right') === 'right'
                              ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Bottom-Right
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSettings({ contactWidgetPosition: 'left' })}
                          className={`px-4 py-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                            settings.contactWidgetPosition === 'left'
                              ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Bottom-Left
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Platform Credentials & Custom text */}
                  <div className="space-y-4">
                    {/* Dynamic Label Config */}
                    <div>
                      <label className="block text-[10px] font-mono font-semibold uppercase text-slate-450 mb-1.5">
                        Button Label Text
                      </label>
                      <input
                        type="text"
                        value={settings.contactWidgetText || 'Support'}
                        onChange={(e) => updateSettings({ contactWidgetText: e.target.value })}
                        placeholder="e.g. Support, Chat with us"
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-indigo-550 font-sans"
                      />
                    </div>

                    {/* WhatsApp fields */}
                    {((settings.contactWidgetType || 'whatsapp') === 'whatsapp') && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono font-semibold uppercase text-slate-450">
                          WhatsApp Phone Number
                        </label>
                        <input
                          type="text"
                          value={settings.whatsappNumber || '15550199'}
                          onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                          placeholder="e.g. 15550199 (digits with country code, e.g. 15550199)"
                          className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono outline-none focus:border-indigo-550"
                        />
                        <p className="text-[10px] text-slate-400">
                          We will format this automatically to link to <strong>https://wa.me/&lt;number&gt;</strong>. Include country code.
                        </p>
                      </div>
                    )}

                    {/* Messenger fields */}
                    {((settings.contactWidgetType || 'whatsapp') === 'messenger') && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono font-semibold uppercase text-slate-450">
                          Messenger Username or Page ID
                        </label>
                        <input
                          type="text"
                          value={settings.messengerId || 'aether.objects'}
                          onChange={(e) => updateSettings({ messengerId: e.target.value })}
                          placeholder="e.g. aether.objects"
                          className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono outline-none focus:border-indigo-550"
                        />
                        <p className="text-[10px] text-slate-400">
                          We will link this automatically to your Facebook chat inbox via <strong>https://m.me/&lt;id&gt;</strong>.
                        </p>
                      </div>
                    )}

                    {/* Preview inside Admin */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="block text-[8px] font-mono text-slate-400 font-bold uppercase">Widget Live Indicator</span>
                        <span className="text-[10px] text-slate-700">Currently live: <strong className="text-slate-900 capitalize font-bold">{settings.contactWidgetType || 'whatsapp'}</strong></span>
                      </div>
                      <div className={`h-8.5 px-3.5 rounded-full flex items-center space-x-1.5 text-[10px] font-mono font-bold uppercase text-white shadow-md ${
                        (settings.contactWidgetType || 'whatsapp') === 'whatsapp' ? 'bg-emerald-600' : 'bg-indigo-600'
                      }`}>
                        {(settings.contactWidgetType || 'whatsapp') === 'whatsapp' ? (
                          <MessageCircle className="h-3.5 w-3.5 fill-white/10 text-white" />
                        ) : (
                          <MessageSquare className="h-3.5 w-3.5 fill-white/10 text-white" />
                        )}
                        <span>{settings.contactWidgetText || 'Support'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>

          </div>
        );
      })()}

      {activeTab === 'emails' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl w-full animate-fade-in text-xs" id="emails-tab">
          
          {/* Main Emails List & Detail View */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-4">
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-800 flex items-center">
                    <Mail className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> Administrative Telemetry Inbox
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Simulated email warnings dispatched by the inventory control bot when stock levels drop below warning thresholds.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      simulatedEmails.forEach(e => markEmailRead(e.id));
                    }}
                    disabled={simulatedEmails.length === 0}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    Mark All Read
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear the system alerts inbox?')) {
                        clearAllEmails();
                        setSelectedEmailId(null);
                      }
                    }}
                    disabled={simulatedEmails.length === 0}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-[10px] uppercase font-bold hover:bg-rose-100 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {simulatedEmails.length === 0 ? (
                <div className="py-16 text-center text-slate-400 font-mono text-xs">
                  <p className="mb-2 text-lg">📭</p>
                  <p className="font-bold text-slate-700 mb-1">Telemetry Inbox Empty</p>
                  <p className="text-[10px] font-sans text-slate-400 max-w-sm mx-auto">All products are healthy and above defined thresholds, or no purchases have triggered inventory drops yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Left Column list */}
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {simulatedEmails.map((email) => {
                      const isSelected = selectedEmailId === email.id;
                      return (
                        <button
                          key={email.id}
                          type="button"
                          onClick={() => {
                            setSelectedEmailId(email.id);
                            markEmailRead(email.id);
                          }}
                          className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all block ${
                            isSelected
                              ? 'border-indigo-650 bg-indigo-50/15 ring-1 ring-indigo-500/10 shadow-sm'
                              : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {!email.read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-650 inline-block animate-pulse shrink-0"></span>
                              )}
                              <span className="text-[9.5px] font-mono text-slate-450 block truncate max-w-[130px]">
                                {email.sender}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap">
                              {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <h4 className={`text-xs font-semibold text-slate-800 truncate mt-1 ${!email.read ? 'font-bold' : ''}`}>
                            {email.subject}
                          </h4>
                          <p className="text-[10px] text-slate-450 line-clamp-1 mt-0.5">
                            Product quantity currently at: <strong className="text-slate-800 font-bold">{email.stock} left</strong>
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column details */}
                  <div className="border border-slate-150 rounded-xl bg-slate-50/40 p-4 min-h-[300px] flex flex-col justify-between">
                    {selectedEmailId ? (() => {
                      const email = simulatedEmails.find(e => e.id === selectedEmailId);
                      if (!email) return <div className="text-slate-400 text-xs font-mono text-center my-auto">Message not found</div>;
                      return (
                        <div className="flex-grow flex flex-col justify-between h-full">
                          <div className="space-y-3.5 flex-grow">
                            <div className="space-y-1 pb-3 border-b border-slate-205">
                              <div className="flex items-start justify-between gap-1">
                                <span className="text-[10px] font-bold text-slate-700">From: <span className="text-slate-400 font-mono font-normal">{email.sender}</span></span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteEmail(email.id);
                                    setSelectedEmailId(null);
                                  }}
                                  className="text-slate-400 hover:text-rose-600 text-[10px] transition-colors p-0.5"
                                  title="Delete Email"
                                >
                                  Delete
                                </button>
                              </div>
                              <div className="text-[10px] font-bold text-slate-700">To: <span className="text-slate-400 font-mono font-normal">{email.recipient}</span></div>
                              <div className="text-[9px] font-mono text-slate-400">Date: {new Date(email.timestamp).toLocaleString()}</div>
                            </div>
                            
                            <div>
                              <h5 className="text-xs font-bold text-slate-800 mb-2">{email.subject}</h5>
                              <pre className="text-[10px] font-mono text-slate-600 bg-white border border-slate-100 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto">
                                {email.body}
                              </pre>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-200 flex justify-between items-center mt-3">
                            <span className="text-[9px] font-mono text-slate-400">ID: {email.id}</span>
                            <button
                              onClick={() => {
                                const prod = products.find(p => p.id === email.productId);
                                if (prod) {
                                  const replenishment = prompt(`How many units are you adding to replenishment for "${prod.name}"?`, '15');
                                  if (replenishment !== null) {
                                    const count = parseInt(replenishment, 10);
                                    if (!isNaN(count) && count > 0) {
                                      editProduct({
                                        ...prod,
                                        stock: prod.stock + count
                                      });
                                      alert(`Replenished "${prod.name}" successfully! Stock updated from ${prod.stock} to ${prod.stock + count}.`);
                                    }
                                  }
                                } else {
                                  alert('Could not locate the associated object.');
                                }
                              }}
                              className="px-3 py-1 text-[10px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all cursor-pointer"
                            >
                              Replenish Stock Now
                            </button>
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="text-center my-auto py-12 space-y-2">
                        <span className="text-lg text-slate-300 block">📬</span>
                        <p className="text-xs font-semibold text-slate-700">Select an alert warning</p>
                        <p className="text-[10px] text-slate-450 font-sans max-w-[200px] mx-auto">Click on any low stock dispatch record on the left to read telemetry payloads.</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* Right Section: Threshold settings and live monitoring */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Setting Configuration */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h4 className="font-display text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                  <Sliders className="h-4 w-4 mr-1.5 text-indigo-600" /> Warning Thresholds Config
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">Configure warning triggers and notification alerts destination email.</p>
              </div>

              <div className="space-y-3.5 pt-2">
                
                {/* Threshold Field */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450">Stock Warning Threshold</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={settings.lowStockThreshold ?? 3}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1) {
                          updateSettings({ lowStockThreshold: val });
                        }
                      }}
                      className="w-20 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-center border border-slate-202 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/10 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-405 font-medium">alert sent if stock &lt; threshold</span>
                  </div>
                </div>

                {/* Email Recipient Destination */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450">Destination Admin Email</label>
                  <input
                    type="email"
                    value={settings.adminEmail ?? 'admin@aetherobjects.co'}
                    onChange={(e) => updateSettings({ adminEmail: e.target.value })}
                    placeholder="admin@aetherobjects.co"
                    className="w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 border border-slate-202 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/10 focus:outline-none"
                  />
                  <p className="text-[9px] text-slate-400 font-mono leading-normal">System alerts copy will format and target this inbox profile.</p>
                </div>

              </div>
            </div>

            {/* Live Telemetry Health Bar widget */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h4 className="font-display text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-1.5 text-amber-500" /> Active Inventory Alerts
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">Live status of catalogue objects currently under warning threshold limit ({settings.lowStockThreshold ?? 3} units).</p>
              </div>

              <div className="space-y-2.5 pt-2">
                {products.filter(p => p.stock < (settings.lowStockThreshold ?? 3)).length === 0 ? (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center text-[10px] text-emerald-800 font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-650" />
                    <span>All stock levels compliant. Grid is fully healthy.</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {products.filter(p => p.stock < (settings.lowStockThreshold ?? 3)).map((prod) => (
                      <div key={prod.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-202 bg-slate-50/40 hover:bg-slate-50 text-[10.5px]">
                        <div className="flex items-center space-x-2 truncate">
                          <img src={prod.image} alt={prod.name} className="h-6 w-6 rounded object-cover border border-slate-100" />
                          <span className="font-semibold text-slate-800 truncate">{prod.name}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 font-mono">
                          <span className={`${
                            prod.stock === 0 
                              ? 'bg-rose-100 text-rose-800 ring-rose-600/10' 
                              : 'bg-amber-100 text-amber-800 ring-amber-600/10'
                          } text-[9.5px] px-1.5 py-0.5 rounded font-bold uppercase`}>
                            {prod.stock} unit{prod.stock !== 1 ? 's' : ''} left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
          
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl w-full animate-fade-in text-xs" id="permissions-tab">
          
          {/* Left Column: Authority matrix & Security details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="pb-4 border-b border-slate-100 mb-6">
                <h3 className="font-display text-sm font-bold text-slate-800 flex items-center">
                  <Lock className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> Administrative Authority Matrix
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Adjust active permissions allowed for all system Standard Admin credentials in real-time. Super Administrators have permanent root clearance.
                </p>
              </div>

              {/* Status Indicator */}
              <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">YOUR DEPLOYED IDENTIFIER</span>
                  <span className="font-semibold text-slate-700 font-mono text-[11px]">{currentAdminUser?.email || 'N/A'}</span>
                </div>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                  currentAdminUser?.role === 'super_admin' 
                    ? 'bg-amber-100 text-amber-850 border border-amber-200'
                    : 'bg-indigo-50 text-indigo-800 border border-indigo-150'
                }`}>
                  {currentAdminUser?.role === 'super_admin' ? '⚡ Super Admin (Root)' : 'Associate Admin'}
                </span>
              </div>

              {/* Permissions list */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-[9px] uppercase font-bold text-indigo-505 bg-indigo-50/50 border border-indigo-100 rounded px-2 py-1 tracking-wider mb-3 flex items-center justify-between">
                    <span className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5 animate-pulse"></span>
                      Section A — Tab Visibility (What they can see)
                    </span>
                    <span className="text-[8px] text-indigo-400">7 TOGGLES</span>
                  </h4>
                  <div className="space-y-3">
                    {[
                      { key: 'viewDashboard', label: 'Suite Dashboard View', desc: 'Allows viewing the key general statistics, net revenue ledger, and charts.' },
                      { key: 'viewProducts', label: 'Inventory Register View', desc: 'Allows viewing the product catalogue and active stock indicators.' },
                      { key: 'viewOrders', label: 'Order Processing View', desc: 'Allows viewing client order logs, shipment details, and addresses.' },
                      { key: 'viewCustomers', label: 'Customers Registry View', desc: 'Allows viewing user profiles, buyer emails, and registry history.' },
                      { key: 'viewPromos', label: 'Discount Campaigns View', desc: 'Allows viewing coupon campaigns, vouchers, and active discount codes.' },
                      { key: 'viewEmails', label: 'System Alerts & Emails View', desc: 'Allows viewing administrative logs, alert messages, and emails.' },
                      { key: 'viewSettings', label: 'Store Constants Setup View', desc: 'Allows viewing the theme selector, active currency rates, and parameters.' }
                    ].map((perm) => {
                      const isChecked = adminPermissions[perm.key as keyof typeof adminPermissions];
                      const isSuper = currentAdminUser?.role === 'super_admin';
                      
                      return (
                        <div key={perm.key} className="p-3 rounded-xl border border-slate-150 bg-white hover:bg-slate-50/50 transition-all flex items-start justify-between gap-4 shadow-2xs">
                          <div className="space-y-0.5 text-left">
                            <label className="text-xs font-bold text-slate-800 block cursor-pointer">
                              {perm.label}
                            </label>
                            <p className="text-[10px] text-slate-400 leading-normal">{perm.desc}</p>
                          </div>
                          
                          <button
                            type="button"
                            disabled={!isSuper}
                            onClick={() => {
                              if (isSuper) {
                                updateAdminPermissions({
                                  [perm.key]: !isChecked
                                });
                              }
                            }}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isChecked ? 'bg-indigo-600' : 'bg-slate-200'
                            } ${!isSuper ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                isChecked ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-[9px] uppercase font-bold text-emerald-805 bg-emerald-50/50 border border-emerald-100 rounded px-2 py-1 tracking-wider mb-3 flex items-center justify-between">
                    <span className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                      Section B — Operational Clearance (What they can change)
                    </span>
                    <span className="text-[8px] text-emerald-400">5 TOGGLES</span>
                  </h4>
                  <div className="space-y-3">
                    {[
                      { key: 'canEditProducts', label: 'Catalog Specs Modification', desc: 'Allows adding products, editing active inventories, and tweaking stock quantities.' },
                      { key: 'canDeleteProducts', label: 'Deep Catalogue Purging', desc: 'Allows deleting items from the active shop listing permanently.' },
                      { key: 'canManageOrders', label: 'Logistics & Status Processing', desc: 'Allows modifying order statuses (pending, shipped, delivered, cancelled).' },
                      { key: 'canManagePromos', label: 'Voucher Synthesizing & Clearance', desc: 'Allows creating coupon campaigns and pausing/activating discount codes.' },
                      { key: 'canModifySettings', label: 'Enterprise Constants Modification', desc: 'Allows editing critical rates, banner image typography, and visual grids.' }
                    ].map((perm) => {
                      const isChecked = adminPermissions[perm.key as keyof typeof adminPermissions];
                      const isSuper = currentAdminUser?.role === 'super_admin';
                      
                      return (
                        <div key={perm.key} className="p-3 rounded-xl border border-slate-150 bg-white hover:bg-slate-50/50 transition-all flex items-start justify-between gap-4 shadow-2xs">
                          <div className="space-y-0.5 text-left">
                            <label className="text-xs font-bold text-slate-800 block cursor-pointer">
                              {perm.label}
                            </label>
                            <p className="text-[10px] text-slate-400 leading-normal">{perm.desc}</p>
                          </div>
                          
                          <button
                            type="button"
                            disabled={!isSuper}
                            onClick={() => {
                              if (isSuper) {
                                updateAdminPermissions({
                                  [perm.key]: !isChecked
                                });
                              }
                            }}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isChecked ? 'bg-indigo-600' : 'bg-slate-200'
                            } ${!isSuper ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                isChecked ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {!currentAdminUser || currentAdminUser.role !== 'super_admin' ? (
                <div className="mt-6 p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start space-x-2.5 text-rose-800">
                  <span className="text-base select-none">🔒</span>
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-rose-900 leading-tight">Authority Restricted</h5>
                    <p className="text-[10.5px] text-rose-700/90 leading-relaxed mt-1">
                      This permission matrix can only be modified with active **Super Administrator** access credentials. Standard administrators have read-only views of their capabilities.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center space-x-2 text-emerald-800">
                  <span className="text-base select-none">⚡</span>
                  <p className="text-[10.5px] font-semibold leading-relaxed">
                    Root privileges checked. Your modifications to the Standard Admin matrix apply in real-time.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Employee Register & Registration */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Active Staff Registry */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="pb-4 border-b border-slate-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-800 flex items-center">
                    <Users className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> System Account Registry
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Manage active authority degrees of all enrolled system credentials dynamically.
                  </p>
                </div>
                <span className="font-mono text-[9px] bg-slate-100 text-slate-500 rounded-lg px-2.5 py-1 self-start sm:self-auto uppercase font-bold border border-slate-200">
                  Admins: {userCredentials.filter(u => u.role === 'admin' || u.role === 'super_admin').length} | Customers: {userCredentials.filter(u => u.role === 'customer').length}
                </span>
              </div>

              {/* Staff table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-150 text-left text-xs">
                  <thead className="bg-slate-50 font-mono text-[9px] text-slate-450 uppercase tracking-widest border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">User Profile</th>
                      <th className="px-4 py-3">Credentials Key</th>
                      <th className="px-4 py-3">Authority Degree</th>
                      <th className="px-5 py-3 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {userCredentials
                      .map((u) => {
                        const isSelf = u.email.toLowerCase() === currentAdminUser?.email?.toLowerCase();
                        const isSuperAdmin = currentAdminUser?.role === 'super_admin';
                        
                        return (
                          <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3.5">
                              <span className="font-bold text-slate-800 block text-xs truncate max-w-[130px]" title={u.name}>
                                {u.name} {isSelf && <span className="text-indigo-600 font-normal font-sans text-[10px]">(You)</span>}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-[10.5px] text-slate-450 truncate max-w-[180px]" title={u.email}>
                              {u.email}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                                u.role === 'super_admin' 
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {u.role === 'super_admin' ? 'SUPER_ROOT' : u.role === 'admin' ? 'ADMIN' : 'CUSTOMER'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right font-sans">
                              {isSelf ? (
                                <span className="text-[10px] italic text-slate-400 block pr-2">Locked self-safe</span>
                              ) : !isSuperAdmin ? (
                                <span className="text-[10px] italic text-slate-400 block pr-2">Requires Root Access</span>
                              ) : (
                                <select
                                  value={u.role || 'customer'}
                                  onChange={(e) => {
                                    const nextRole = e.target.value as UserRole;
                                    const roleLabel = nextRole === 'super_admin' ? 'Super Admin' : nextRole === 'admin' ? 'Standard Admin' : 'Customer';
                                    if (confirm(`Alter credentials role of ${u.name} to ${roleLabel}?`)) {
                                      updateUserRole(u.email, nextRole);
                                    }
                                  }}
                                  className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 cursor-pointer hover:bg-slate-100 transition-all font-sans inline-block"
                                >
                                  <option value="customer">Customer</option>
                                  <option value="admin">Standard Admin</option>
                                  <option value="super_admin">Super Admin</option>
                                </select>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Onboard New Systems Colleague */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="pb-4 border-b border-slate-100 mb-6">
                <h3 className="font-display text-sm font-bold text-slate-800 flex items-center font-display">
                  <Plus className="h-4.5 w-4.5 mr-1.5 text-indigo-600" /> Authorize New Operational Colleague
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Provision new login keys to onboard associates onto administrative control channels.
                </p>
              </div>

              {staffSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10.5px] rounded-xl font-semibold">
                  {staffSuccess}
                </div>
              )}

              {staffError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-850 text-[10.5px] rounded-xl font-semibold">
                  {staffError}
                </div>
              )}

              <form onSubmit={handleRegisterStaffSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 mb-1">Colleague Name</label>
                    <input
                      type="text"
                      required
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      placeholder="e.g. Liam Sterling"
                      disabled={currentAdminUser?.role !== 'super_admin'}
                      className="w-full rounded-lg px-2.5 py-1.5 border border-slate-202 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/10 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 mb-1">Email Username Key</label>
                    <input
                      type="email"
                      required
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      placeholder="colleague@aetherobjects.co"
                      disabled={currentAdminUser?.role !== 'super_admin'}
                      className="w-full rounded-lg px-2.5 py-1.5 border border-slate-202 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/10 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-col text-left">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 mb-1">Credentials Password</label>
                    <input
                      type="password"
                      required
                      value={newStaffPass}
                      onChange={(e) => setNewStaffPass(e.target.value)}
                      placeholder="Enter secure password"
                      disabled={currentAdminUser?.role !== 'super_admin'}
                      className="w-full rounded-lg px-2.5 py-1.5 border border-slate-202 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/10 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 mb-1">Clearance Degree</label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value as any)}
                      disabled={currentAdminUser?.role !== 'super_admin'}
                      className="w-full rounded-lg px-2.5 py-1.5 border border-slate-202 bg-slate-50 focus:bg-white focus:outline-none disabled:opacity-50 h-[30px]"
                    >
                      <option value="admin">Standard Admin (governed by authority matrix)</option>
                      <option value="super_admin">Super Administrator (permanent root clearance)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={currentAdminUser?.role !== 'super_admin'}
                  className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-350 disabled:cursor-not-allowed text-white py-2 text-xs font-bold uppercase tracking-wider shadow transition-all cursor-pointer font-semibold"
                >
                  Onboard Systems Access Key
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {permissionError && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-rose-50 border border-slate-200 p-4 shadow-lg flex items-start space-x-3 animate-fade-in animate-slide-up rounded-xl">
          <span className="text-sm select-none">⚠️</span>
          <div className="flex-1 text-left text-xs text-rose-800">
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-rose-900 font-mono">Authorization Rejected</h4>
            <p className="text-[10px] font-sans text-rose-700 leading-normal mt-0.5">{permissionError}</p>
          </div>
          <button onClick={() => setPermissionError(null)} className="text-rose-450 hover:text-rose-600 text-xs font-bold font-sans">✕</button>
        </div>
      )}

    </div>
  );
};
