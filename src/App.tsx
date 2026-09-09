import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AddJobPage } from './pages/admin/AddJobPage';
import { EditJobPage } from './pages/admin/EditJobPage';
import { authStorage } from './services/api';

type Page =
  | 'home'
  | 'job-details'
  | 'about'
  | 'contact'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-add-job'
  | 'admin-edit-job';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Sync with browser URL pathname and hash for clean navigation
  useEffect(() => {
    const handleNavigation = () => {
      // Check both pathname and hash
      const path = window.location.pathname.replace(/^\/+/, '');
      const hash = window.location.hash.replace(/^#\/?/, '');
      const activeRoute = hash || path;

      if (!activeRoute) {
        setCurrentPage('home');
        return;
      }

      if (activeRoute.startsWith('job/')) {
        const id = activeRoute.split('job/')[1];
        setSelectedJobId(id);
        setCurrentPage('job-details');
      } else if (activeRoute === 'about') {
        setCurrentPage('about');
      } else if (activeRoute === 'contact') {
        setCurrentPage('contact');
      } else if (activeRoute === 'admin/login') {
        setCurrentPage('admin-login');
      } else if (activeRoute === 'admin/dashboard' || activeRoute === 'admin') {
        if (authStorage.isAuthenticated()) {
          setCurrentPage('admin-dashboard');
        } else {
          // Unauthenticated access to /admin/dashboard redirects to /admin/login
          window.location.hash = 'admin/login';
          setCurrentPage('admin-login');
        }
      } else if (activeRoute === 'admin/add') {
        if (authStorage.isAuthenticated()) {
          setCurrentPage('admin-add-job');
        } else {
          window.location.hash = 'admin/login';
          setCurrentPage('admin-login');
        }
      } else if (activeRoute.startsWith('admin/edit/')) {
        const id = activeRoute.split('admin/edit/')[1];
        setSelectedJobId(id);
        if (authStorage.isAuthenticated()) {
          setCurrentPage('admin-edit-job');
        } else {
          window.location.hash = 'admin/login';
          setCurrentPage('admin-login');
        }
      } else {
        setCurrentPage('home');
      }
    };

    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  const navigateTo = (page: Page, param?: string) => {
    // If attempting to open admin dashboard without authentication, redirect to admin login
    if (
      (page === 'admin-dashboard' || page === 'admin-add-job' || page === 'admin-edit-job') &&
      !authStorage.isAuthenticated()
    ) {
      setCurrentPage('admin-login');
      window.location.hash = 'admin/login';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    if (param) {
      setSelectedJobId(param);
    }

    // Update URL hash for consistent SPA state & direct access
    if (page === 'home') window.location.hash = '';
    else if (page === 'job-details' && param) window.location.hash = `job/${param}`;
    else if (page === 'about') window.location.hash = 'about';
    else if (page === 'contact') window.location.hash = 'contact';
    else if (page === 'admin-login') window.location.hash = 'admin/login';
    else if (page === 'admin-dashboard') window.location.hash = 'admin/dashboard';
    else if (page === 'admin-add-job') window.location.hash = 'admin/add';
    else if (page === 'admin-edit-job' && param) window.location.hash = `admin/edit/${param}`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    // Destroy the local authentication state and return to admin login
    authStorage.removeToken();
    navigateTo('admin-login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 antialiased font-sans">
      {/* Universal Green and White Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={(p, param) => navigateTo(p as Page, param)}
      />

      {/* Main Page Routing Container */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onSelectJob={(id) => {
              navigateTo('job-details', id);
            }}
          />
        )}

        {currentPage === 'job-details' && selectedJobId && (
          <JobDetailsPage
            jobId={selectedJobId}
            onBack={() => navigateTo('home')}
          />
        )}

        {currentPage === 'about' && <AboutPage />}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'admin-login' && (
          <AdminLoginPage
            onLoginSuccess={() => navigateTo('admin-dashboard')}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {currentPage === 'admin-dashboard' && (
          <AdminDashboardPage
            onAddJob={() => navigateTo('admin-add-job')}
            onEditJob={(id) => navigateTo('admin-edit-job', id)}
            onViewJob={(id) => navigateTo('job-details', id)}
            onLogout={handleLogout}
            onViewPublicSite={() => navigateTo('home')}
          />
        )}

        {currentPage === 'admin-add-job' && (
          <AddJobPage
            onBack={() => navigateTo('admin-dashboard')}
            onJobAdded={() => navigateTo('admin-dashboard')}
          />
        )}

        {currentPage === 'admin-edit-job' && selectedJobId && (
          <EditJobPage
            jobId={selectedJobId}
            onBack={() => navigateTo('admin-dashboard')}
            onJobUpdated={() => navigateTo('admin-dashboard')}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={(p) => navigateTo(p as Page)} />
    </div>
  );
}
