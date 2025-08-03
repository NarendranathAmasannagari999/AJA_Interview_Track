import { jwtDecode } from 'jwt-decode';

/**
 * Debug utility to check authentication status and token details
 */
export const debugAuthStatus = () => {
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('userRole');
  const employeeId = localStorage.getItem('employeeId');
  
  console.log('=== Authentication Debug Info ===');
  console.log('Token exists:', !!token);
  console.log('User role from localStorage:', userRole);
  console.log('Employee ID from localStorage:', employeeId);
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      
      console.log('JWT Token decoded:', {
        email: decoded.sub || decoded.email,
        role: decoded.role,
        employeeId: decoded.employeeId,
        exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'No expiration',
        iat: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : 'No issued at',
        timeUntilExpiry: decoded.exp ? `${Math.floor((decoded.exp - now) / 60)} minutes` : 'Unknown'
      });
      
      // Check if token is expired
      if (decoded.exp && decoded.exp < now) {
        console.warn('⚠️ JWT token is expired!');
      } else {
        console.log('✅ JWT token is valid');
      }
      
      // Check role consistency
      if (decoded.role && userRole && decoded.role !== userRole) {
        console.warn('⚠️ Role mismatch: Token role:', decoded.role, 'vs localStorage role:', userRole);
      }
      
      // Check employee ID consistency
      if (decoded.employeeId && employeeId && decoded.employeeId.toString() !== employeeId) {
        console.warn('⚠️ Employee ID mismatch: Token ID:', decoded.employeeId, 'vs localStorage ID:', employeeId);
      }
      
    } catch (error) {
      console.error('❌ Failed to decode JWT token:', error.message);
    }
  } else {
    console.warn('⚠️ No JWT token found in localStorage');
  }
  
  console.log('=== End Debug Info ===');
};

/**
 * Check if user has required role for sales team operations
 */
export const checkSalesTeamPermission = () => {
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return { hasPermission: false, reason: 'No authentication token' };
  }
  
  let roleFromToken = null;
  let emailFromToken = null;
  try {
    const decoded = jwtDecode(token);
    roleFromToken = decoded.role;
    emailFromToken = decoded.sub || decoded.email;
  } catch (error) {
    return { hasPermission: false, reason: 'Invalid token format' };
  }
  
  const effectiveRole = userRole || roleFromToken;
  const hasPermission = effectiveRole === 'ROLE_SALES' || effectiveRole === 'ROLE_ADMIN';
  
  return {
    hasPermission,
    reason: hasPermission ? 'Valid role' : `Insufficient role: ${effectiveRole}`,
    effectiveRole,
    tokenRole: roleFromToken,
    localStorageRole: userRole,
    userEmail: emailFromToken
  };
};

/**
 * Check if user has required role for delivery team operations
 */
export const checkDeliveryTeamPermission = () => {
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return { hasPermission: false, reason: 'No authentication token' };
  }
  
  let roleFromToken = null;
  let emailFromToken = null;
  try {
    const decoded = jwtDecode(token);
    roleFromToken = decoded.role;
    emailFromToken = decoded.sub || decoded.email;
  } catch (error) {
    return { hasPermission: false, reason: 'Invalid token format' };
  }
  
  const effectiveRole = userRole || roleFromToken;
  const hasPermission = effectiveRole === 'ROLE_DELIVERY' || effectiveRole === 'ROLE_ADMIN';
  
  return {
    hasPermission,
    reason: hasPermission ? 'Valid role' : `Insufficient role: ${effectiveRole}`,
    effectiveRole,
    tokenRole: roleFromToken,
    localStorageRole: userRole,
    userEmail: emailFromToken
  };
};

/**
 * Check if user has required role for employee operations
 */
export const checkEmployeePermission = () => {
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return { hasPermission: false, reason: 'No authentication token' };
  }
  
  let roleFromToken = null;
  let employeeIdFromToken = null;
  let emailFromToken = null;
  try {
    const decoded = jwtDecode(token);
    roleFromToken = decoded.role;
    employeeIdFromToken = decoded.employeeId;
    emailFromToken = decoded.sub || decoded.email;
  } catch (error) {
    return { hasPermission: false, reason: 'Invalid token format' };
  }
  
  const effectiveRole = userRole || roleFromToken;
  const hasPermission = effectiveRole === 'ROLE_EMPLOYEE' || effectiveRole === 'ROLE_ADMIN';
  
  return {
    hasPermission,
    reason: hasPermission ? 'Valid role' : `Insufficient role: ${effectiveRole}`,
    effectiveRole,
    tokenRole: roleFromToken,
    localStorageRole: userRole,
    userEmail: emailFromToken,
    employeeId: employeeIdFromToken
  };
};

/**
 * Get comprehensive authentication status
 */
export const getAuthStatus = () => {
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('userRole');
  const employeeId = localStorage.getItem('employeeId');
  
  if (!token) {
    return {
      isAuthenticated: false,
      reason: 'No token found',
      tokenValid: false,
      role: null,
      email: null,
      employeeId: null
    };
  }
  
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp && decoded.exp < now;
    
    return {
      isAuthenticated: !isExpired,
      reason: isExpired ? 'Token expired' : 'Valid token',
      tokenValid: !isExpired,
      role: decoded.role,
      email: decoded.sub || decoded.email,
      employeeId: decoded.employeeId,
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null,
      issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : null,
      localStorageRole: userRole,
      localStorageEmployeeId: employeeId
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      reason: 'Invalid token format',
      tokenValid: false,
      role: null,
      email: null,
      employeeId: null
    };
  }
};

/**
 * Debug role mapping and routing issues
 */
export const debugRoleMapping = () => {
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('userRole');
  
  console.log('=== Role Mapping Debug ===');
  console.log('Token exists:', !!token);
  console.log('localStorage role:', userRole);
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const tokenRole = decoded.role;
      console.log('Token role:', tokenRole);
      
      // Check role mapping for routing
      const normalizedRole = tokenRole?.replace('ROLE_', '').toLowerCase();
      console.log('Normalized role for routing:', normalizedRole);
      
      // Expected routing paths
      const routingMap = {
        'employee': '/dashboard/employee',
        'delivery_team': '/dashboard/delivery-team',
        'delivery': '/dashboard/delivery-team',
        'sales_team': '/dashboard/sales-team',
        'sales': '/dashboard/sales-team',
        'admin': '/dashboard/admin'
      };
      
      const expectedPath = routingMap[normalizedRole];
      console.log('Expected routing path:', expectedPath || 'No route found');
      
      // Check backend role expectations
      const backendRoleMap = {
        'ROLE_EMPLOYEE': 'EMPLOYEE',
        'ROLE_DELIVERY_TEAM': 'DELIVERY', // Legacy support
        'ROLE_DELIVERY': 'DELIVERY', // New expected role
        'ROLE_SALES_TEAM': 'SALES', // Legacy support
        'ROLE_SALES': 'SALES', // New expected role
        'ROLE_ADMIN': 'ADMIN'
      };
      
      const backendExpectedRole = backendRoleMap[tokenRole];
      console.log('Backend expected role:', backendExpectedRole || 'Unknown role');
      
      return {
        tokenRole,
        localStorageRole: userRole,
        normalizedRole,
        expectedPath,
        backendExpectedRole,
        hasRoutingIssue: !expectedPath
      };
    } catch (error) {
      console.error('Error decoding token for role mapping:', error);
      return {
        error: error.message
      };
    }
  }
  
  console.log('=== End Role Mapping Debug ===');
};

/**
 * Test backend role mapping and identify issues
 */
export const testBackendRoleMapping = () => {
  console.log('=== Backend Role Mapping Test ===');
  
  // Test cases based on the backend AuthService logic
  const testCases = [
    { input: 'employee', expected: 'ROLE_EMPLOYEE' },
    { input: 'delivery_team', expected: 'ROLE_DELIVERY' }, // Updated: should be ROLE_DELIVERY
    { input: 'delivery', expected: 'ROLE_DELIVERY' },
    { input: 'sales_team', expected: 'ROLE_SALES' }, // Updated: should be ROLE_SALES
    { input: 'sales', expected: 'ROLE_SALES' },
    { input: 'admin', expected: 'ROLE_ADMIN' }
  ];
  
  console.log('Backend AuthService role transformation:');
  testCases.forEach(testCase => {
    const transformed = 'ROLE_' + testCase.input.toUpperCase().replace('-', '_');
    console.log(`Input: "${testCase.input}" -> Output: "${transformed}" (Expected: "${testCase.expected}")`);
  });
  
  console.log('\nSecurityConfig expectations:');
  console.log('- /api/delivery/** -> hasAuthority("ROLE_DELIVERY")');
  console.log('- /api/sales/** -> hasRole("SALES")');
  console.log('- /api/employee/** -> hasAnyRole("EMPLOYEE", "DELIVERY", "SALES")');
  
  console.log('\nFrontend routing expectations:');
  console.log('- ROLE_EMPLOYEE -> /dashboard/employee');
  console.log('- ROLE_DELIVERY -> /dashboard/delivery-team'); // Updated
  console.log('- ROLE_SALES -> /dashboard/sales-team'); // Updated
  console.log('- ROLE_SALES_TEAM -> /dashboard/sales-team'); // Legacy support
  
  console.log('\nFrontend registration mapping:');
  console.log('- delivery_team -> DELIVERY -> ROLE_DELIVERY');
  console.log('- sales-team -> SALES -> ROLE_SALES'); // Updated
  console.log('- employee -> EMPLOYEE -> ROLE_EMPLOYEE');
  
  console.log('=== End Backend Role Mapping Test ===');
}; 