import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaChartLine,
  FaTruck,
  FaShoppingCart,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaSignInAlt,
  FaUserPlus,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import { FiHome, FiBarChart2, FiTruck, FiShoppingCart, FiInfo, FiLogIn, FiUserPlus, FiSettings, FiLogOut } from "react-icons/fi";
import styles from './Sidebar.module.css';

const Sidebar = ({ darkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", icon: <FiHome size={20} />, activeIcon: <FaHome size={20} />, label: "Home" },
    { path: "/dashboard/employee", icon: <FiBarChart2 size={20} />, activeIcon: <FaChartLine size={20} />, label: "Employee" },
    { path: "/dashboard/delivery-team", icon: <FiTruck size={20} />, activeIcon: <FaTruck size={20} />, label: "Delivery" },
    { path: "/dashboard/sales-team", icon: <FiShoppingCart size={20} />, activeIcon: <FaShoppingCart size={20} />, label: "Sales" },
    { path: "/about", icon: <FiInfo size={20} />, activeIcon: <FaInfoCircle size={20} />, label: "About" }
  ];

  const authItems = [
    { path: "/login", icon: <FiLogIn size={20} />, activeIcon: <FaSignInAlt size={20} />, label: "Login" },
    { path: "/register", icon: <FiUserPlus size={20} />, activeIcon: <FaUserPlus size={20} />, label: "Register" }
  ];

  const bottomItems = [
    { path: "/settings", icon: <FiSettings size={20} />, activeIcon: <FaCog size={20} />, label: "Settings" },
    { action: () => { /* handle logout */ }, icon: <FiLogOut size={20} />, activeIcon: <FaSignOutAlt size={20} />, label: "Logout" }
  ];

  const expanded = isCollapsed ? false : isHovered;

  return (
    <motion.div 
      className={`${styles.sidebar} ${darkMode ? styles.dark : ''} ${isCollapsed ? styles.collapsed : ''}`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.header}>
        {(!isCollapsed || isHovered) && (
          <motion.div 
            className={styles.logo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            AJA Interview Prep
          </motion.div>
        )}
        <button
          className={styles.toggleButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      
      <div className={styles.menuSection}>
        <p className={styles.menuTitle}>Navigation</p>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <motion.li
              key={item.path}
              className={`${styles.menuItem} ${location.pathname === item.path ? styles.active : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={item.path} className={styles.menuLink}>
                <span className={styles.menuIcon}>
                  {location.pathname === item.path ? item.activeIcon : item.icon}
                </span>
                {(!isCollapsed || isHovered) && (
                  <motion.span 
                    className={styles.menuLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
      
      <div className={styles.menuSection}>
        <p className={styles.menuTitle}>Account</p>
        <ul className={styles.menu}>
          {authItems.map((item) => (
            <motion.li
              key={item.path}
              className={`${styles.menuItem} ${location.pathname === item.path ? styles.active : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={item.path} className={styles.menuLink}>
                <span className={styles.menuIcon}>
                  {location.pathname === item.path ? item.activeIcon : item.icon}
                </span>
                {(!isCollapsed || isHovered) && (
                  <motion.span 
                    className={styles.menuLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
      
      <div className={styles.bottomMenu}>
        <ul className={styles.menu}>
          {bottomItems.map((item, index) => (
            <motion.li
              key={index}
              className={styles.menuItem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.path ? (
                <Link to={item.path} className={styles.menuLink}>
                  <span className={styles.menuIcon}>
                    {location.pathname === item.path ? item.activeIcon : item.icon}
                  </span>
                  {(!isCollapsed || isHovered) && (
                    <motion.span 
                      className={styles.menuLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              ) : (
                <button onClick={item.action} className={styles.menuLink}>
                  <span className={styles.menuIcon}>{item.icon}</span>
                  {(!isCollapsed || isHovered) && (
                    <motion.span 
                      className={styles.menuLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;