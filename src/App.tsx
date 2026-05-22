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

const MainAppContent: React.FC = () => {
  const { currentView, settings } = useStore();
  const theme = getTheme(settings.websiteTheme);

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
