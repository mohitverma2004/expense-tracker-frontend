import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { validateName, validateEmail, validatePassword, getValidationSummary, formatValidationErrors } from '../utils/validation';

const API_URL = 'https://expense-tracker-api-wrxh.onrender.com/api';

function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        if (value !== password) return 'Passwords do not match';
        return null;
      default:
        return null;
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    let error;
    if (field === 'confirmPassword') {
      error = password !== confirmPassword ? 'Passwords do not match' : null;
    } else {
      error = validateField(field, field === 'name' ? name : field === 'email' ? email : password);
    }
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field, value) => {
    if (field === 'name') setName(value);
    else if (field === 'email') setEmail(value);
    else if (field === 'password') setPassword(value);
    else if (field === 'confirmPassword') setConfirmPassword(value);
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
    if (serverError) setServerError('');
    
    // Real-time password match check
    if (field === 'password' && confirmPassword) {
      const matchError = value !== confirmPassword ? 'Passwords do not match' : null;
      setErrors(prev => ({ ...prev, confirmPassword: matchError }));
    }
    if (field === 'confirmPassword') {
      const matchError = value !== password ? 'Passwords do not match' : null;
      setErrors(prev => ({ ...prev, confirmPassword: matchError }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = password !== confirmPassword ? 'Passwords do not match' : null;
    
    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmError
    };
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    
    const validationSummary = getValidationSummary(newErrors);
    if (validationSummary?.hasErrors) {
      alert(formatValidationErrors(validationSummary.errors));
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });
      onRegister(response.data.token, response.data.user);
    } catch (err) {
      setServerError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-6 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/20">
              <span className="text-3xl">💰</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-indigo-200 text-sm mt-1">Join FinancePro - Smart Expense Tracker</p>
          </div>

          <div className="p-8">
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                >
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <span>❌</span> {serverError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      touched.name && errors.name ? 'border-red-500' : 'border-slate-700'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      touched.email && errors.email ? 'border-red-500' : 'border-slate-700'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      touched.password && errors.password ? 'border-red-500' : 'border-slate-700'
                    }`}
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-slate-700'
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'REGISTER'
                )}
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
              <p className="text-gray-500 text-xs">© 2026 FinancePro | Secure Expense Management System</p>
              <p className="text-gray-600 text-[10px] mt-1">All fields marked with * are required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;