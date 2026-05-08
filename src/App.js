import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import BudgetPage from './pages/BudgetPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import Login from './components/Login';
import Register from './components/Register';
import SessionTimeoutModal from './components/Common/SessionTimeoutModal';
import { sessionManager, WARNING_MINUTES } from './utils/session';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Handle session timeout
  const handleSessionTimeout = useCallback(() => {
    setShowTimeoutWarning(false);
    handleLogout();
    alert('Your session has expired. Please login again.');
  }, []);

  const handleSessionWarning = useCallback(() => {
    setShowTimeoutWarning(true);
    setTimeLeft(WARNING_MINUTES * 60);
  }, []);

  const extendSession = useCallback(() => {
    setShowTimeoutWarning(false);
    sessionManager.resetTimer(handleSessionTimeout, handleSessionWarning);
    
    // Call API to refresh session
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Session extended');
    }
  }, [handleSessionTimeout, handleSessionWarning]);

  // Reset session on user activity
  const resetSessionTimer = useCallback(() => {
    if (isAuthenticated) {
      sessionManager.resetTimer(handleSessionTimeout, handleSessionWarning);
    }
  }, [isAuthenticated, handleSessionTimeout, handleSessionWarning]);

  // Set up activity listeners for session timeout
  useEffect(() => {
    if (!isAuthenticated) return;

    const activities = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetSessionTimer();
    };
    
    activities.forEach(event => {
      document.addEventListener(event, handleActivity);
    });
    
    // Start the session timer
    sessionManager.startTimer(handleSessionTimeout, handleSessionWarning);
    
    return () => {
      activities.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      sessionManager.clearTimers();
    };
  }, [isAuthenticated, resetSessionTimer, handleSessionTimeout, handleSessionWarning]);

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const sessionStartTime = sessionStorage.getItem('sessionStartTime');
    
    // Check if this is a fresh browser session
    const isNewBrowserSession = !sessionStartTime;
    
    if (isNewBrowserSession) {
      // Fresh browser session - clear any old data
      console.log('New browser session detected - clearing old login data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.setItem('sessionStartTime', Date.now().toString());
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }
    
    // Check if token exists and is not expired
    if (token && savedUser) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000;
        
        if (Date.now() >= expiryTime) {
          // Token expired
          console.log('Token expired - logging out');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
        } else {
          // Valid token
          console.log('Valid session found');
          setIsAuthenticated(true);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Token parsing error:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Store session start time to detect browser restart
    sessionStorage.setItem('sessionStartTime', Date.now().toString());
    setIsAuthenticated(true);
    setUser(userData);
    // Start session timer after login
    sessionManager.startTimer(handleSessionTimeout, handleSessionWarning);
  };

  const handleLogout = () => {
    sessionManager.clearTimers();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('sessionStartTime');
    setIsAuthenticated(false);
    setUser(null);
    setShowTimeoutWarning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <SessionTimeoutModal 
        isOpen={showTimeoutWarning}
        onExtend={extendSession}
        onLogout={handleLogout}
        timeLeft={timeLeft}
      />
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar onLogout={handleLogout} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <Sidebar onLogout={handleLogout} isMobile={true} setIsOpen={setSidebarOpen} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header setIsOpen={setSidebarOpen} user={user} onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;