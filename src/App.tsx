import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './pages/Login';
import { AdminLayout } from './components/layout/AdminLayout';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { DynamicAdminView } from './components/dashboard/DynamicAdminView';

// Existing Landing Page components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { FormatosSection } from './components/FormatosSection';
import { ReaderExperience } from './components/ReaderExperience';
import { ContextualTools } from './components/ContextualTools';
import { AiCapabilities } from './components/AiCapabilities';
import { Organization } from './components/Organization';
import { HowItWorks } from './components/HowItWorks';
import { PrivacySection } from './components/PrivacySection';
import { TargetAudience } from './components/TargetAudience';
import { ComparisonTable } from './components/ComparisonTable';
import { PricingSection } from './components/PricingSection';
import { FaqAccordion } from './components/FaqAccordion';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', position: 'relative' }}>
      <Header />
      <main id="top" className="container">
        <Hero />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <FormatosSection />
        <ReaderExperience />
        <ContextualTools />
        <AiCapabilities />
        <Organization />
        <HowItWorks />
        <PrivacySection />
        <TargetAudience />
        <ComparisonTable />
        <PricingSection />
        <FaqAccordion />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin Login Flow */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewTab />} />
          <Route path="*" element={<DynamicAdminView />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
