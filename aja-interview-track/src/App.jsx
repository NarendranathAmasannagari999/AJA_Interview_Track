import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Sidebar from "./components/Sidebar/Sidebar";
import LandingPage from "./components/LandingPage/LandingPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import EmployeeDashboard from "./pages/Dashboard/EmployeeDashboard";
import DeliveryTeamDashboard from "./pages/Dashboard/DeliveryTeamDashboard";
import SalesTeamDashboard from "./pages/Dashboard/SalesTeamDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import InterviewQuestions from './pages/InterviewQuestions/InterviewQuestions';
import { AuthProvider, useAuth } from "./context/AuthContext"; 
import "./assets/styles/global.css";

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  const role = user.role?.replace('ROLE_', '').toLowerCase();
  
  switch(role) {
    case 'employee':
      return <Navigate to="/dashboard/employee" replace />;
    case 'delivery_team':
    case 'delivery':
      return <Navigate to="/dashboard/delivery-team" replace />;
    case 'sales_team':
    case 'sales':
      return <Navigate to="/dashboard/sales-team" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      console.warn('Unknown role for redirect:', user.role);
      return <Navigate to="/login" replace />;
  }
};

// Not Found Component
const NotFound = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center'
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button 
        onClick={() => window.history.back()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go Back
      </button>
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const sidebarVisible = !['/', '/login', '/register', '/about'].includes(location.pathname);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleSidebarToggle = (isCollapsed) => {
    setSidebarCollapsed(isCollapsed);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {sidebarVisible && (
        <Sidebar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onToggle={handleSidebarToggle}
        />
      )}
      <main
        className="main-content"
        style={{
          marginLeft: sidebarVisible ? (sidebarCollapsed ? '70px' : '250px') : '0',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {!sidebarVisible && (<Navbar
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />)}
        <div className="page-content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
              <Route path="/dashboard/employee/questions" element={<InterviewQuestions />} />
              <Route path="/dashboard/delivery-team" element={<DeliveryTeamDashboard />} />
              <Route path="/dashboard/sales-team" element={<SalesTeamDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </div>
        {!sidebarVisible && (<Footer darkMode={darkMode} />)}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
