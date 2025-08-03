import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  isAuthenticated, 
  getToken, 
  getUserRole, 
  getEmployeeId, 
  setEmployeeId, 
  setUserRole,
  logoutUser,
  getUserEmail,
  isTokenExpired
} from '../API/auth';
import { getEmployeeDetails } from '../API/employee';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const token = getToken();
          const role = getUserRole();
          const email = getUserEmail();

          if (token && role && email) {
            setUser({ token, role, email });
            
            // Extract employee ID from token
            let empId = null;
            try {
              const decodedToken = jwtDecode(token);
              empId = decodedToken.employeeId || getEmployeeId();
              
              // Update localStorage with role from token if available
              if (decodedToken.role && decodedToken.role !== getUserRole()) {
                setUserRole(decodedToken.role);
              }
            } catch (error) {
              console.warn('Could not decode JWT token:', error.message);
              empId = getEmployeeId();
            }
            
            // If we have an employee ID, fetch employee details
            if (empId) {
              try {
                const employeeData = await getEmployeeDetails(empId);
                setEmployee(employeeData);
                setEmployeeId(empId); // Ensure it's stored in localStorage
              } catch (error) {
                console.warn('Could not fetch employee details:', error.message);
                // Clear invalid employee ID
                setEmployeeId(null);
              }
            }
          } else {
            // Invalid authentication state, clear everything
            console.warn('Invalid authentication state detected, clearing data');
            logoutUser();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logoutUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData) => {
    try {
      const { token, role, user, employee, employeeId } = userData;
      
      // Extract email from token
      let email = null;
      try {
        const decodedToken = jwtDecode(token);
        email = decodedToken.sub || decodedToken.email;
      } catch (error) {
        console.warn('Could not decode JWT token during login:', error.message);
        email = user?.email;
      }
      
      setUser({ token, role, email });
      setUserRole(role);
      
      // If this is an employee and we have employee data, set it
      if (role === 'ROLE_EMPLOYEE') {
        if (employee) {
          setEmployee(employee);
          if (employeeId) {
            setEmployeeId(employeeId);
          }
        } else if (employeeId) {
          // If we have employee ID but no employee data, fetch it
          setEmployeeId(employeeId);
          try {
            const employeeData = await getEmployeeDetails(employeeId);
            setEmployee(employeeData);
          } catch (error) {
            console.warn('Could not fetch employee details during login:', error.message);
          }
        } else {
          console.warn('Employee login but no employee data or ID provided');
        }
      }
      
      // Verify role consistency between token and response
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role && decodedToken.role !== role) {
          console.warn('Role mismatch between response and token:', role, 'vs', decodedToken.role);
          // Prefer the role from the token as it's more secure
          setUserRole(decodedToken.role);
        }
      } catch (error) {
        console.warn('Could not decode JWT token during login:', error.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setEmployee(null);
    logoutUser();
  };

  const updateEmployeeData = async (employeeId) => {
    try {
      const employeeData = await getEmployeeDetails(employeeId);
      setEmployee(employeeData);
      setEmployeeId(employeeId);
      return employeeData;
    } catch (error) {
      console.error('Error updating employee data:', error);
      throw error;
    }
  };

  const value = {
    user,
    employee,
    loading,
    login,
    logout,
    updateEmployeeData,
    isAuthenticated: !!user && !isTokenExpired(),
    getEmployeeId: () => employee?.id || getEmployeeId(),
    getUserEmail: () => user?.email || getUserEmail()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 