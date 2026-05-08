import React, { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import axios from 'axios'; 
 
const API_URL = 'https://expense-tracker-api-wrxh.onrender.com/api'; 
 
function Login({ onLogin }) { 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
 
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setError(''); 
    setLoading(true); 
    try { 
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }); 
      onLogin(response.data.token, response.data.user); 
    } catch (err) { 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  return ( 
    <div className="min-h-screen flex items-center justify-center bg-gray-100"> 
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"> 
        <h1 className="text-2xl font-bold text-center mb-6">Expense Tracker</h1> 
        <h2 className="text-xl text-center mb-6">Login</h2> 
        <form onSubmit={handleSubmit}> 
          <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-lg mb-4" value={email} onChange={(e) => setEmail(e.target.value)} required /> 
          <input type="password" placeholder="Password" className="w-full px-3 py-2 border rounded-lg mb-6" value={password} onChange={(e) => setPassword(e.target.value)} required /> 
          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded-lg">{loading ? 'Logging in...' : 'Login'}</button> 
        </form> 
        <p className="text-center mt-4">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p> 
      </div> 
    </div> 
  ); 
} 
