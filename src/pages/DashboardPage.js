import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import toast, { Toaster } from 'react-hot-toast';
import { expenseAPI } from '../services/api';
import { FiPlus, FiTrendingUp, FiTarget, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { formatINR, getCategoryIcon, getCategoryColor } from '../utils/formatters';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monthlyTotal: 0,
    budgetStatus: { budget: 0, spent: 0, remaining: 0, percentage: 0 },
    summary: [],
    recentExpenses: [],
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to get monthly total
      let monthlyTotal = 0;
      try {
        const totalRes = await expenseAPI.getMonthlyTotal();
        monthlyTotal = totalRes.data.total || 0;
      } catch (err) {
        console.log('Monthly total API error, using default');
      }

      // Try to get budget status
      let budgetStatus = { budget: 0, spent: 0, remaining: 0, percentage: 0 };
      try {
        const budgetRes = await expenseAPI.getBudgetStatus();
        budgetStatus = budgetRes.data;
      } catch (err) {
        console.log('Budget API error, using default');
      }

      // Try to get summary
      let summary = [];
      try {
        const summaryRes = await expenseAPI.getSummary();
        summary = summaryRes.data || [];
      } catch (err) {
        console.log('Summary API error, using default');
      }

      // Try to get recent expenses
      let recentExpenses = [];
      try {
        const expensesRes = await expenseAPI.getAll({ limit: 10 });
        recentExpenses = expensesRes.data || [];
      } catch (err) {
        console.log('Expenses API error, using default');
      }

      setStats({
        monthlyTotal,
        budgetStatus,
        summary,
        recentExpenses,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Some features may be limited');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) {
      toast.error('Please fill title and amount');
      return;
    }
    try {
      await expenseAPI.create(newExpense);
      toast.success('Expense added!');
      setShowAddModal(false);
      setNewExpense({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const progressProps = useSpring({
    width: `${Math.min(stats.budgetStatus.percentage, 100)}%`,
    from: { width: '0%' },
    config: { tension: 200, friction: 20 },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Toaster position="top-center" />
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-white/80 text-sm">Total Balance</p>
            <p className="text-3xl font-bold">{formatINR(stats.monthlyTotal)}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <FiTarget size={18} className="mb-1 opacity-80" />
            <p className="text-xs opacity-80">Budget</p>
            <p className="font-semibold">{formatINR(stats.budgetStatus.budget)}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <FiTrendingUp size={18} className="mb-1 opacity-80" />
            <p className="text-xs opacity-80">Spent</p>
            <p className="font-semibold">{formatINR(stats.budgetStatus.spent)}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <FiDollarSign size={18} className="mb-1 opacity-80" />
            <p className="text-xs opacity-80">Left</p>
            <p className="font-semibold">{formatINR(stats.budgetStatus.remaining)}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Budget Usage</span>
            <span className="font-semibold text-indigo-600">{stats.budgetStatus.percentage.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <animated.div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600" style={progressProps} />
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Categories</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {stats.summary.slice(0, 4).map((cat, idx) => (
            <motion.div
              key={cat.category}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-3 text-center shadow-sm"
            >
              <div className="text-2xl mb-1">{getCategoryIcon(cat.category)}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{cat.category}</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{formatINR(cat.total)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          <AnimatePresence>
            {stats.recentExpenses.slice(0, 5).map((expense, idx) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${getCategoryColor(expense.category)}20` }}>
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{expense.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FiCalendar size={10} />
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-red-500">{formatINR(expense.amount)}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white z-50"
      >
        <FiPlus size={24} />
      </motion.button>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Add Expense</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-2xl">×</button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                />
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Bills</option>
                  <option>Shopping</option>
                  <option>Health</option>
                  <option>Entertainment</option>
                  <option>Other</option>
                </select>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                />
                <button
                  onClick={handleAddExpense}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold"
                >
                  Add Expense
                </button>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DashboardPage;