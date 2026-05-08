import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = 'https://expense-tracker-api-wrxh.onrender.com/api';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other'];

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const CATEGORY_COLORS = {
  Food: '#f59e0b', Transport: '#3b82f6', Bills: '#ef4444',
  Shopping: '#ec4899', Health: '#22c55e', Entertainment: '#8b5cf6', Other: '#6b7280',
};

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Food',
    date: new Date().toISOString().split('T')[0], note: ''
  });

  // Filter state
  const [search, setSearch]       = useState('');
  const [selMonth, setSelMonth]   = useState(new Date().getMonth() + 1);
  const [selYear, setSelYear]     = useState(new Date().getFullYear());
  const [selCategory, setSelCategory] = useState('');

  const token = localStorage.getItem('token');

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const params = { month: selMonth, year: selYear };
      if (selCategory) params.category = selCategory;
      if (search)      params.search    = search;

      const response = await axios.get(`${API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setExpenses(response.data);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [token, selMonth, selYear, selCategory, search]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await axios.put(`${API_URL}/expenses/${editingExpense.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Expense updated!');
      } else {
        await axios.post(`${API_URL}/expenses`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Expense added!');
      }
      setShowForm(false);
      setEditingExpense(null);
      setFormData({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], note: '' });
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date?.split('T')[0] || expense.date,
      note: expense.note || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await axios.delete(`${API_URL}/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Deleted!');
        fetchExpenses();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/export`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { month: selMonth, year: selYear },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expenses_${selMonth}_${selYear}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const totalShown = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <Toaster position="top-center" />

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Expenses</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingExpense(null);
            setFormData({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], note: '' }); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <div className="space-y-3">
            <input
              type="text" placeholder="Title" required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="number" placeholder="Amount (₹)" required min="0.01" step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="text" placeholder="Note (optional)"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold">
              {editingExpense ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      )}

      {/* ── Filter Bar ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <input
            type="text" placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[150px] px-3 py-2 border rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {/* Month */}
          <select
            value={selMonth}
            onChange={(e) => setSelMonth(e.target.value)}
            className="px-3 py-2 border rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          {/* Year */}
          <select
            value={selYear}
            onChange={(e) => setSelYear(e.target.value)}
            className="px-3 py-2 border rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
          </select>
          {/* Category */}
          <select
            value={selCategory}
            onChange={(e) => setSelCategory(e.target.value)}
            className="px-3 py-2 border rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {/* Export */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium whitespace-nowrap"
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* ── Summary bar ── */}
      {!loading && expenses.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl px-4 py-3 mb-4 flex justify-between items-center">
          <span className="text-sm text-indigo-700 dark:text-indigo-300">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} found
          </span>
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">
            Total: {formatINR(totalShown)}
          </span>
        </div>
      )}

      {/* ── List ── */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : expenses.length === 0 ? (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">🧾</span>
          <p className="text-lg font-semibold text-gray-700 dark:text-white mb-1">No expenses found</p>
          <p className="text-sm text-gray-400 mb-6">
            {search || selCategory ? 'Try changing your filters' : 'Add your first expense to start tracking'}
          </p>
          {!search && !selCategory && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium"
            >
              + Add Expense
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                {/* Category color dot */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[expense.category] || '#6b7280' }}
                >
                  {expense.category?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{expense.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {expense.category} • {new Date(expense.date).toLocaleDateString('en-IN')}
                    {expense.note ? ` • ${expense.note}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <p className="font-semibold text-red-500">{formatINR(expense.amount)}</p>
                <button
                  onClick={() => handleEdit(expense)}
                  className="text-indigo-500 text-sm hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpensesPage;
