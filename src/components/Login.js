import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { validateEmail, validatePassword, getValidationSummary, formatValidationErrors } from '../utils/validation';

const API_URL = 'https://expense-tracker-api-wrxh.onrender.com/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      default:
        return null;
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, field === 'email' ? email : password);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value);
    else setPassword(value);
    
    // Clear error as user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('sessionStartTime');
    
    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    const newErrors = {
      email: emailError,
      password: passwordError
    };
    
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    
    const validationSummary = getValidationSummary(newErrors);
    if (validationSummary?.hasErrors) {
      alert(formatValidationErrors(validationSummary.errors));
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      onLogin(response.data.token, response.data.user);
    } catch (err) {
      setServerError(err.response?.data?.error || 'Invalid User ID or Password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <div className="flex flex-col md:flex-row">
            
            {/* Left Panel */}
            <div className="md:w-2/5 bg-gradient-to-br from-indigo-900 to-indigo-800 p-8 md:p-10 flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                <span className="text-5xl">💰</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">FinancePro</h1>
              <p className="text-indigo-200 text-sm">Smart Expense Management System</p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-indigo-200 text-xs">
                  Track • Save • Grow<br />
                  Secure • Fast • Reliable
                </p>
              </div>
            </div>

            {/* Right Panel */}
            <div className="md:w-3/5 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-gray-400 text-sm mb-8">Please login to your account</p>

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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    User ID / Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        touched.email && errors.email ? 'border-red-500' : 'border-slate-700'
                      }`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
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
                      placeholder="Enter your password"
                      required
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    'LOGIN'
                  )}
                </button>

                <div className="text-center mt-6">
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                      Create Account
                    </Link>
                  </p>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                <p className="text-gray-500 text-xs">© 2026 FinancePro | Secure Expense Management System</p>
                <p className="text-gray-600 text-[10px] mt-1">Session Timeout: 30 minutes • All actions are logged</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;