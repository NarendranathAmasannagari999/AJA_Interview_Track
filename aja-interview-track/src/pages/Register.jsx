import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { registerUser, loginUser } from '../API/RegisterApi';

const Register = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    technology: '',
    resourceType: '',
    employeeId: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setApiError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      technology: '',
      resourceType: '',
      employeeId: ''
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.role) {
        newErrors.role = 'Role is required';
      }
      if (!formData.technology) {
        newErrors.technology = 'Technology is required';
      }
      if (!formData.resourceType) {
        newErrors.resourceType = 'Resource Type is required';
      }
      if (!formData.employeeId) {
        newErrors.employeeId = 'Employee ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      if (isLogin) {
        // Handle login
        const token = await loginUser({
          email: formData.email,
          password: formData.password
        });
        
        localStorage.setItem('token', token);
        // Fetch user data to get role
        const userResponse = await axios.get('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        const redirectPath = userResponse.data.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectPath);
      } else {
        // Handle registration
        const userData = await registerUser(formData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Generate token by logging in after registration
        const token = await loginUser({
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', token);
        
        const redirectPath = userData.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setApiError(
        error.message ||
          (isLogin ? 'Invalid email or password' : 'Registration failed: Email may already exist')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      {/* Register Form */}
      <div className={`${styles.formSide} ${isLogin ? '' : styles.active}`} id="registerSide">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.errorInput : ''}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="employeeId"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={handleChange}
              className={errors.employeeId ? styles.errorInput : ''}
            />
            {errors.employeeId && <span className={styles.errorText}>{errors.employeeId}</span>}
          </div>

          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`${styles.roleSelect} ${errors.role ? styles.errorInput : ''}`}
            >
              <option value="employee">Employee</option>
              <option value="delivery_team">Delivery Team</option>
              <option value="sales_team">Sales Team</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <span className={styles.errorText}>{errors.role}</span>}
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="technology"
              placeholder="Technology"
              value={formData.technology}
              onChange={handleChange}
              className={errors.technology ? styles.errorInput : ''}
            />
            {errors.technology && <span className={styles.errorText}>{errors.technology}</span>}
          </div>

          <div className={styles.formGroup}>
            <select
              name="resourceType"
              value={formData.resourceType}
              onChange={handleChange}
              className={`${styles.roleSelect} ${errors.resourceType ? styles.errorInput : ''}`}
            >
              <option value="">Select Resource Type</option>
              <option value="TT">TT</option>
              <option value="TCT">TCT</option>
              <option value="ALT">ALT</option>
              <option value="SALES">SALES</option>
            </select>
            {errors.resourceType && <span className={styles.errorText}>{errors.resourceType}</span>}
          </div>

          {apiError && !isLogin && <div className={styles.apiError}>{apiError}</div>}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Register'}
          </button>
        </form>
      </div>

      {/* Login Form */}
      <div className={`${styles.formSide} ${isLogin ? styles.active : ''}`} id="loginSide">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          {apiError && isLogin && <div className={styles.apiError}>{apiError}</div>}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Overlay with toggle buttons */}
      <div className={`${styles.overlay} ${isLogin ? '' : styles.left}`} id="mainOverlay">
        <button
          className={styles.overlayBtn}
          id="loginBtn"
          style={{ marginLeft: '10vw', display: isLogin ? 'block' : 'none' }}
          onClick={toggleAuth}
          disabled={isLoading}
        >
          Register
        </button>
        <span style={{ flex: 1 }}></span>
        <button
          className={styles.overlayBtn}
          id="registerBtn"
          style={{
            marginRight: '10vw',
            display: isLogin ? 'none' : 'block',
            transform: 'rotate(180deg)',
          }}
          onClick={toggleAuth}
          disabled={isLoading}
        >
          Login 
        </button>
      </div>
    </div>
  );
};

export default Register;