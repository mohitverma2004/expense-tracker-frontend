import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, FiBarChart2, FiActivity
} from 'react-icons/fi';
import { expenseAPI } from '../services/api';
import { formatINR } from '../utils/formatters';


function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [, setTrends] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      const [trendsRes, summaryRes] = await Promise.all([
        expenseAPI.getTrends(),
        expenseAPI.getSummary(),
      ]);
      setTrends(trendsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = summary.reduce((sum, item) => sum + item.total, 0);
  const topCategory = summary.length > 0 ? summary.reduce((max, item) => item.total > max.total ? item : max, summary[0]) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Deep insights into your spending patterns</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setSelectedPeriod('week')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPeriod === 'week' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setSelectedPeriod('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPeriod === 'month' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setSelectedPeriod('year')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPeriod === 'year' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
          }`}
        >
          This Year
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-blue-500" size={20} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Spending</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatINR(totalSpent)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <FiBarChart2 className="text-purple-500" size={20} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Top Category</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {topCategory ? topCategory.category : 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {topCategory ? formatINR(topCategory.total) : 'No data'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FiActivity className="text-green-500" size={20} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Categories</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{summary.length}</p>
          <p className="text-sm text-gray-500 mt-1">Active spending categories</p>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📊</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Advanced Analytics Coming Soon</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          We're working on detailed charts, spending predictions, and personalized insights.
        </p>
      </div>
    </div>
  );
}

export default AnalyticsPage;