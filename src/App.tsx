import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, MessageSquare, Users, Stethoscope, Clock, Menu, X, Search } from 'lucide-react';
import AppointmentBooking from './pages/AppointmentBooking';
import AppointmentLookup from './pages/AppointmentLookup';
import ConsultationPage from './pages/ConsultationPage';
import PatientProfileManager from './components/PatientProfileManager';
import ClinicInfoDisplay from './components/ClinicInfoDisplay';
import ClinicProgress from './components/ClinicProgress';

const pages = [
  {
    id: 'clinic',
    path: '/',
    name: '診所資訊',
    icon: Stethoscope,
    description: '醫師團隊與診所介紹',
    component: ClinicInfoDisplay
  },
  {
    id: 'appointment',
    path: '/appointment',
    name: '門診預約',
    icon: Calendar,
    description: '線上預約看診',
    component: AppointmentBooking
  },
  {
    id: 'lookup',
    path: '/lookup',
    name: '查詢預約',
    icon: Search,
    description: '查看預約記錄',
    component: AppointmentLookup
  },
  {
    id: 'progress',
    path: '/progress',
    name: '看診進度',
    icon: Clock,
    description: '即時看診進度查詢',
    component: ClinicProgress
  },
  {
    id: 'consultation',
    path: '/consultation',
    name: '客戶諮詢',
    icon: MessageSquare,
    description: '諮詢服務申請',
    component: ConsultationPage
  },
  {
    id: 'profile',
    path: '/profile',
    name: '看診資訊設定',
    icon: Users,
    description: '管理使用者資料',
    component: PatientProfileManager
  }
];

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handlePageChange = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">上杉診所</h1>
                <p className="text-xs text-gray-500">預約管理系統</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-800">功能選單</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-3">
                {pages.map((page) => {
                  const Icon = page.icon;
                  const isActive = location.pathname === page.path;
                  
                  return (
                    <Link
                      key={page.id}
                      to={page.path}
                      onClick={handlePageChange}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left ${
                        isActive
                          ? 'bg-cyan-500 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <div>
                        <div className="font-medium">{page.name}</div>
                        <div className={`text-sm ${isActive ? 'text-cyan-100' : 'text-gray-500'}`}>
                          {page.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
        <Navigation />
        
        {/* Main Content */}
        <main className="pb-20">
          <Routes>
            {pages.map((page) => (
              <Route
                key={page.id}
                path={page.path}
                element={<page.component />}
              />
            ))}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;