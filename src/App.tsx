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
import { CheckoutPage } from './components/CheckoutPage';

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

    // 3. Dynamic Google Analytics Injector
    const gaId = settings.googleAnalyticsId;
    if (gaId) {
      let gaScript1 = document.head.querySelector(`script[src*="googletagmanager.com/gtag/js?id="]`);
      if (!gaScript1) {
        gaScript1 = document.createElement('script');
        gaScript1.setAttribute('async', 'true');
        gaScript1.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${gaId}`);
        document.head.appendChild(gaScript1);

        const gaScript2 = document.createElement('script');
        gaScript2.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(gaScript2);
      }
    }

    // 4. Dynamic Meta Pixel/API Key Injector
    const metaPixelId = settings.metaApiKey;
    if (metaPixelId) {
      let metaScript = document.head.querySelector(`script[id="meta-pixel-script"]`);
      if (!metaScript) {
        metaScript = document.createElement('script');
        metaScript.id = 'meta-pixel-script';
        metaScript.textContent = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${metaPixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(metaScript);
      }
    }
  }, [settings, currentView, activeProductDetail]);

  if (dbLoading && !bypassed) {
    return (
      <LoadingScreen 
        onBypass={() => setBypassed(true)} 
        error={dbError} 
        syncStatus={dbSyncStatus} 
        storeName={settings.storeName}
        logoType={settings.logoType}
        logoImage={settings.logoImage}
        logoText={settings.logoText}
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
        {currentView === 'checkout' && <CheckoutPage />}
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
