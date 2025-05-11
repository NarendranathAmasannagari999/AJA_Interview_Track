import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import "./assets/styles/global.css";

function AppContent() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <Sidebar darkMode={darkMode} isCollapsed={sidebarCollapsed} />
      <div className="main-content">
        <Navbar 
          toggleSidebar={toggleSidebar} 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
        />
        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
              <Route path="/dashboard/delivery-team" element={<DeliveryTeamDashboard />} />
              <Route path="/dashboard/sales-team" element={<SalesTeamDashboard />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;