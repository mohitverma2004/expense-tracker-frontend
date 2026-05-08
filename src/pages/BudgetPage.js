import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { formatINR, getMonthName } from '../utils/formatters';
import Loader from '../components/Common/Loader';

const API_URL = 'https://expense-tracker-api-wrxh.onrender.com/api';

function BudgetPage() {
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(0);
  const [newBudget, setNewBudget] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [monthlyHistory, setMonthlyHistory] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const token = localStorage.getItem('token');

  const fetchBudgetData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch budget status
      const statusRes = await axios.get(`${API_URL}/expenses/budget-status`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { month: selectedMonth, year: selectedYear }
      });
      
      console.log('Budget status:', statusRes.data);
      setBudgetStatus(statusRes.data);
      setBudget(statusRes.data.budget);
      
      // Fetch trends
      const trendsRes = await axios.get(`${API_URL}/expenses/trends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Trends:', trendsRes.data);
      setMonthlyHistory(trendsRes.data || []);
      
    } catch (error) {
      console.error('Error fetching budget:', error);
      toast.error(error.response?.data?.error || 'Failed to load budget data');
    } finally {
      setLoading(false);
    }
  }, [token, selectedMonth, selectedYear]);

  useEffect(() => {
    if (token) {
      fetchBudgetData();
    }
  }, [fetchBudgetData, token]);

  const handleUpdateBudget = async () => {
    if (!newBudget || newBudget === '') {
      toast.error('Please enter a budget amount');
      return;
    }
    
    const budgetAmount = parseFloat(newBudget);
    if (isNaN(budgetAmount) || budgetAmount < 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      console.log('Updating budget to:', budgetAmount);
      console.log('API URL:', `${API_URL}/expenses/budget`);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      // IMPORTANT: Use PUT request to /expenses/budget
      const response = await axios({
        method: 'PUT',
        url: `${API_URL}/expenses/budget`,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { monthly_budget: budgetAmount }
      });
      
      console.log('Update response:', response.data);
      
      setBudget(budgetAmount);
      setNewBudget('');
      toast.success(`Budget updated to ${formatINR(budgetAmount)}`);
      
      // Refresh budget status
      await fetchBudgetData();
      
    } catch (error) {
      console.error('Budget update error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.error || 'Failed to update budget');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <Loader />;

  const progressColor = budgetStatus?.percentage >= 90 ? '#ef4444' : 
                        budgetStatus?.percentage >= 70 ? '#f59e0b' : '#10b981';

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Budget Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Set and track your monthly spending limits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Budget Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Current Budget</h3>
          <div className="text-center py-8">
            <p className="text-5xl font-bold text-indigo-600">{formatINR(budget)}</p>
            <p className="text-gray-500 mt-2">per month</p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Monthly Budget
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Enter amount in ₹"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleUpdateBudget}
                disabled={isUpdating}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Overview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Overview</h3>
          <div className="flex gap-4 mb-6">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{getMonthName(m)}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700"
            >
              {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {budgetStatus && (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Spent</span>
                  <span className="font-semibold">{formatINR(budgetStatus.spent)} of {formatINR(budgetStatus.budget)}</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: progressColor }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                  <p className={`text-xl font-bold ${budgetStatus.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatINR(budgetStatus.remaining)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Budget Used</p>
                  <p className="text-xl font-bold text-orange-600">{budgetStatus.percentage.toFixed(0)}%</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Budget History */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Spending History</h3>
        {monthlyHistory && monthlyHistory.length > 0 ? (
          <div className="space-y-3">
            {monthlyHistory.map((month, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {getMonthName(month.month)} {month.year}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-indigo-600">{formatINR(month.total)}</p>
                  <p className="text-xs text-gray-500">total spent</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No spending history available</p>
        )}
      </div>
    </div>
  );
}

export default BudgetPage;