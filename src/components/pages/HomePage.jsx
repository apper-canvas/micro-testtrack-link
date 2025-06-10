import React from 'react';
import HomeHeroSection from '@/components/organisms/HomeHeroSection';
import HomeQuickActionsSection from '@/components/organisms/HomeQuickActionsSection';
import HomeOverviewSection from '@/components/organisms/HomeOverviewSection';

const HomePage = () => {
  return (
    <div className="min-h-full bg-surface-50">
      <HomeHeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HomeQuickActionsSection />
        <HomeOverviewSection />
      </div>
    </div>
  );
};

export default HomePage;