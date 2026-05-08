import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { expenseAPI } from '../services/api';
import { formatINR } from '../utils/formatters';
import Loader from '../components/Common/Loader';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [summaryRes, trendsRes] = await Promise.all([
        expenseAPI.getSummary(),
        expenseAPI.getTrends(),
      ]);
      setSummary(summaryRes.data);
      setTrends(trendsRes.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = summary.reduce((sum, item) => sum + item.total, 0);
  const topCategory = summary.length > 0 ? summary.reduce((max, item) => item.total > max.total ? item : max, summary[0]) : null;

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Deep insights into your spending</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{formatINR(totalSpent)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Top Category</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{topCategory?.category || '-'}</p>
          <p className="text-sm text-indigo-600 mt-1">{topCategory ? formatINR(topCategory.total) : ''}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Average</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {trends.length > 0 ? formatINR(trends.reduce((sum, t) => sum + t.total, 0) / trends.length) : formatINR(0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Category Breakdown</h3>
          {summary.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={summary} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={120} label>
                  {summary.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatINR(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Spending by Category</h3>
          {summary.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={summary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip formatter={(value) => formatINR(value)} />
                <Bar dataKey="total" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">6-Month Trend</h3>
        {trends.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatINR(value)} />
              <Tooltip formatter={(value) => formatINR(value)} />
              <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-72 flex items-center justify-center text-gray-400">No data</div>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;