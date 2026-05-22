/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './state/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ShopLayout } from './components/ShopLayout';
import { AdminPanel } from './components/AdminPanel';
import { LoginPage } from './components/LoginPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutFlow } from './components/CheckoutFlow';
import { getTheme } from './utils/theme';
import { LoadingScreen } from './components/LoadingScreen';

const MainAppContent: React.FC = () => {
  const { currentView, settings, activeProductDetail, dbLoading, dbSyncStatus, dbError } = useStore();
  const [bypassed, setBypassed] = React.useState(false);
  const theme = getTheme(settings.websiteTheme);

  React.useEffect(() => {
    // 1. Dynamic Meta Title, Description & Keywords
    let title = settings.seoTitle || settings.storeName || 'AETHER OBJECTS';
    let description = settings.seoDescription || 'Premium artisan design objects, fine stationery, and architectural workspace tools.';
    let keywords = settings.seoKeywords || 'artisan, stationery, workspace, premium, object';
    let image = settings.bannerImage || 'https://images.unsplash.com/photo-1593642702821-c8da63116c2c?w=1600&q=80';

    if (currentView === 'shop' && activeProductDetail) {
      title = `${activeProductDetail.name} | ${settings.storeName || 'AETHER OBJECTS'}`;
      description = activeProductDetail.description || description;
      if (activeProductDetail.tags && activeProductDetail.tags.length > 0) {
        keywords = `${activeProductDetail.tags.join(', ')}, ${activeProductDetail.category}, ${keywords}`;
      } else {
        keywords = `${activeProductDetail.category}, ${keywords}`;
      }
      image = activeProductDetail.image || image;
    } else if (currentView === 'admin') {
      title = `Admin System | ${settings.storeName || 'AETHER OBJECTS'}`;
      description = 'Administrative control and inventory management dashboard.';
    } else if (currentView === 'login') {
      title = `Identity Access Portal | ${settings.storeName || 'AETHER OBJECTS'}`;
      description = 'Secure credentials gateway portal for administrative staff.';
    }

    document.title = title;

    // Helper to edit/add head tags dynamically
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);

    // OpenGraph Social Graph Previews
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:type', 'website', true);

    // 2. Dynamic favicon injector element
    let faviconLink = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.setAttribute('rel', 'icon');
      document.head.appendChild(faviconLink);
    }
    const faviconUrl = settings.faviconUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&q=80';
    faviconLink.setAttribute('href', faviconUrl);
  }, [settings, currentView, activeProductDetail]);

  if (dbLoading && !bypassed) {
    return (
      <LoadingScreen 
        onBypass={() => setBypassed(true)} 
        error={dbError} 
        syncStatus={dbSyncStatus} 
        storeName={settings.storeName}
        logoUrl={settings.faviconUrl}
        themeName={settings.websiteTheme}
      />
    );
  }

  return (
    <div className={`flex min-h-screen flex-col font-sans transition-colors duration-300 ${theme.backdrop} ${theme.textPrimary}`}>
      {/* Dynamic Navigation Bar Header */}
      <Navbar />

      {/* Primary Context Sections */}
      <div className="flex-grow">
        {currentView === 'shop' && <ShopLayout />}
        {currentView === 'admin' && <AdminPanel />}
        {currentView === 'login' && <LoginPage />}
      </div>

      {/* Global Interactive Sliders and Checkouts Overlays */}
      <CartDrawer />
      <CheckoutFlow />

      {/* Site Footer Anchor */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
