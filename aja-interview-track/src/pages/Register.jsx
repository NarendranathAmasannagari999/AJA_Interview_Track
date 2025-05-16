import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiPhone, FiChevronDown } from "react-icons/fi";
import { registerUser } from "../API/RegisterApi";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "employee",
    empid: "", // Added for employee-specific field
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [apiError, setApiError] = useState(null);

  const userRoles = [
    { value: "employee", label: "Employee" },
    { value: "delivery_team", label: "Delivery Team" },
    { value: "sales_team", label: "Sales Team" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
    setApiError(null); // Clear API error on input change
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.role === "employee" && !formData.empid.trim()) {
      newErrors.empid = "Employee ID is required for employees";
    }
    if (formData.role !== "employee" && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required for team members";
    } else if (formData.role !== "employee" && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === "employee" ? { empid: formData.empid } : { phone: formData.phone }),
      };

      const response = await registerUser(userData);
      console.log("Registration successful:", response.data);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      console.error("Registration failed:", error);
      setApiError(error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className={styles.registerContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={styles.registerForm}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className={styles.formHeader}>
          <motion.h1 
            className={styles.title}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create Your Account
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join AJA Interview Preparation Track
          </motion.p>
        </div>

        {apiError && (
          <motion.div
            className={styles.apiError}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {apiError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <div className={`${styles.inputContainer} ${errors.name ? styles.error : ""}`}>
              <FiUser className={styles.inputIcon} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={styles.input}
              />
            </div>
            {errors.name && (
              <motion.span 
                className={styles.errorMessage}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.name}
              </motion.span>
            )}
          </motion.div>

          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <div className={`${styles.inputContainer} ${errors.email ? styles.error : ""}`}>
              <FiMail className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={styles.input}
              />
            </div>
            {errors.email && (
              <motion.span 
                className={styles.errorMessage}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.email}
              </motion.span>
            )}
          </motion.div>

          {formData.role === "employee" && (
            <motion.div
              className={styles.formGroup}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="empid" className={styles.label}>
                Employee ID
              </label>
              <div className={`${styles.inputContainer} ${errors.empid ? styles.error : ""}`}>
                <FiUser className={styles.inputIcon} />
                <input
                  type="text"
                  id="empid"
                  name="empid"
                  value={formData.empid}
                  onChange={handleChange}
                  placeholder="Enter your employee ID"
                  className={styles.input}
                />
              </div>
              {errors.empid && (
                <motion.span 
                  className={styles.errorMessage}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.empid}
                </motion.span>
              )}
            </motion.div>
          )}

          {formData.role !== "employee" && (
            <motion.div
              className={styles.formGroup}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <div className={`${styles.inputContainer} ${errors.phone ? styles.error : ""}`}>
                <FiPhone className={styles.inputIcon} />
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={styles.input}
                />
              </div>
              {errors.phone && (
                <motion.span 
                  className={styles.errorMessage}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.phone}
                </motion.span>
              )}
            </motion.div>
          )}

          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={`${styles.inputContainer} ${errors.password ? styles.error : ""}`}>
              <FiLock className={styles.inputIcon} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={styles.input}
              />
            </div>
            {errors.password && (
              <motion.span 
                className={styles.errorMessage}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.password}
              </motion.span>
            )}
          </motion.div>

          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <div className={`${styles.inputContainer} ${errors.confirmPassword ? styles.error : ""}`}>
              <FiLock className={styles.inputIcon} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={styles.input}
              />
            </div>
            {errors.confirmPassword && (
              <motion.span 
                className={styles.errorMessage}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.confirmPassword}
              </motion.span>
            )}
          </motion.div>

          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <label htmlFor="role" className={styles.label}>
              Select Your Role
            </label>
            <div 
              className={styles.selectContainer}
              onClick={() => setIsSelectOpen(!isSelectOpen)}
            >
              <div classNamezzly={styles.selectedOption}>
                {userRoles.find(r => r.value === formData.role)?.label}
                <FiChevronDown className={`${styles.chevron} ${isSelectOpen ? styles.open : ''}`} />
              </div>
              {isSelectOpen && (
                <motion.div 
                  className={styles.options}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {userRoles.map((role) => (
                    <div
                      key={role.value}
                      className={styles.option}
                      onClick={() => {
                        setFormData({ ...formData, role: role.value });
                        setIsSelectOpen(false);
                      }}
                    >
                      {role.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            {isSubmitting ? (
              <span className={styles.spinner}></span>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        <motion.div
          className={styles.loginLink}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log in</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Register;