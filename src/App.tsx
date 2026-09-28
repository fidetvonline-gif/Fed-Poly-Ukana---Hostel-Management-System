import React, { useState } from 'react';
import { store } from './services/store';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';

// Views
import { HomeLandingView } from './components/home/HomeLandingView';

// Student Views
import { StudentDashboardView } from './components/student/StudentDashboardView';
import { StudentProfileView } from './components/student/StudentProfileView';
import { StudentApplyView } from './components/student/StudentApplyView';
import { StudentAllocationView } from './components/student/StudentAllocationView';
import { StudentPaymentView } from './components/student/StudentPaymentView';
import { StudentMaintenanceView } from './components/student/StudentMaintenanceView';

// Admin Views
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminStudentRegistryView } from './components/admin/AdminStudentRegistryView';
import { AdminHostelsView } from './components/admin/AdminHostelsView';
import { AdminApplicationsView } from './components/admin/AdminApplicationsView';
import { AdminAllocationView } from './components/admin/AdminAllocationView';
import { AdminPaymentsView } from './components/admin/AdminPaymentsView';
import { AdminMaintenanceView } from './components/admin/AdminMaintenanceView';
import { AdminAnnouncementsView } from './components/admin/AdminAnnouncementsView';
import { AdminReportsView } from './components/admin/AdminReportsView';
import { AdminAuditView } from './components/admin/AdminAuditView';

export default function App() {
  const current = store.getCurrentUser();
  const currentUser = current?.user || null;

  const [activeView, setActiveView] = useState<string>('home');
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);

  const handleNavigate = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    const updatedUser = store.getCurrentUser()?.user;
    if (updatedUser) {
      if (updatedUser.role === 'admin') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('student-dashboard');
      }
    }
  };

  const renderMainView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeLandingView
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onNavigate={handleNavigate}
          />
        );

      // Student Views
      case 'student-dashboard':
        return <StudentDashboardView onNavigate={handleNavigate} />;
      case 'student-profile':
        return <StudentProfileView />;
      case 'student-apply':
        return <StudentApplyView onNavigate={handleNavigate} />;
      case 'student-allocation':
        return <StudentAllocationView />;
      case 'student-payment':
        return <StudentPaymentView onNavigate={handleNavigate} />;
      case 'student-maintenance':
        return <StudentMaintenanceView />;

      // Admin Views
      case 'admin-dashboard':
        return <AdminDashboardView onNavigate={handleNavigate} />;
      case 'admin-students':
        return <AdminStudentRegistryView />;
      case 'admin-hostels':
        return <AdminHostelsView />;
      case 'admin-applications':
        return <AdminApplicationsView onNavigate={handleNavigate} />;
      case 'admin-allocations':
        return <AdminAllocationView />;
      case 'admin-payments':
        return <AdminPaymentsView />;
      case 'admin-maintenance':
        return <AdminMaintenanceView />;
      case 'admin-announcements':
        return <AdminAnnouncementsView />;
      case 'admin-reports':
        return <AdminReportsView />;
      case 'admin-audit':
        return <AdminAuditView />;

      default:
        return (
          <HomeLandingView
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  const showSidebar = activeView !== 'home' && currentUser;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans antialiased">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onSelectRole={() => {}}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onNavigate={handleNavigate}
        activeView={activeView}
      />

      {/* Body Shell */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {showSidebar && (
          <Sidebar
            role={currentUser.role}
            activeView={activeView}
            onNavigate={handleNavigate}
          />
        )}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 min-w-0 ${!showSidebar ? 'max-w-7xl mx-auto w-full' : ''}`}>
          {renderMainView()}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => setIsRegisterOpen(true)}
        onSuccess={handleAuthSuccess}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => setIsLoginOpen(true)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
