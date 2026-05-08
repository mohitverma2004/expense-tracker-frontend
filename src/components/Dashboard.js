import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer, LineChart, Line,
  CartesianGrid 
} from 'recharts';

const API_URL = 'https://expense-tracker-api-wrxh.onrender.com/api';

const CATEGORIES = [
  'Food', 'Transport', 'Bills', 'Shopping', 
  'Health', 'Entertainment', 'Other'
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚗', Bills: '💡', 
  Shopping: '🛍️', Health: '💊', Entertainment: '🎬', Other: '📌'
};

function Dashboard({ onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [budgetStatus, setBudgetStatus] = useState({ budget: 0, spent: 0, remaining: 0, percentage: 0 });
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newBudget, setNewBudget] = useState('');
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const token = localStorage.getItem('token');

  const fetchExpenses = async () => {
    const response = await axios.get(`${API_URL}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { month: selectedMonth, year: selectedYear }
    });
    setExpenses(response.data);
  };

  const fetchSummary = async () => {
    const response = await axios.get(`${API_URL}/expenses/summary`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { month: selectedMonth, year: selectedYear }
    });
    setSummary(response.data);
  };

  const fetchMonthlyTotal = async () => {
    const response = await axios.get(`${API_URL}/expenses/monthly-total`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { month: selectedMonth, year: selectedYear }
    });
    setMonthlyTotal(response.data.total);
  };

  const fetchBudgetStatus = async () => {
    const response = await axios.get(`${API_URL}/expenses/budget-status`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { month: selectedMonth, year: selectedYear }
    });
    setBudgetStatus(response.data);
  };

  const fetchTrends = async () => {
    const response = await axios.get(`${API_URL}/expenses/trends`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTrends(response.data);
  };

  const updateBudget = async () => {
    try {
      await axios.put(`${API_URL}/expenses/budget`, 
        { monthly_budget: parseFloat(newBudget) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowBudgetModal(false);
      fetchBudgetStatus();
    } catch (err) {
      alert('Error updating budget');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchExpenses(), 
      fetchSummary(), 
      fetchMonthlyTotal(),
      fetchBudgetStatus(),
      fetchTrends()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedMonth, selectedYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = { title, amount: parseFloat(amount), category, note, date };
    
    try {
      if (editingExpense) {
        await axios.put(`${API_URL}/expenses/${editingExpense.id}`, expenseData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/expenses`, expenseData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      resetForm();
      fetchAllData();
    } catch (err) {
      alert('Error saving expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      await axios.delete(`${API_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setNote(expense.note || '');
    setDate(expense.date.split('T')[0]);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingExpense(null);
    setTitle('');
    setAmount('');
    setCategory('Food');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const handleExportCSV = async () => {
    const response = await axios.get(`${API_URL}/expenses/export`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { month: selectedMonth, year: selectedYear },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expenses_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const budgetColor = budgetStatus.percentage >= 90 ? '#ef4444' : budgetStatus.percentage >= 70 ? '#f59e0b' : '#10b981';

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                FinanceTracker Pro
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Welcome back</p>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-gray-800">{formatINR(monthlyTotal)}</p>
            <p className="text-xs text-gray-400 mt-2">This month</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Monthly Budget</p>
            <p className="text-3xl font-bold text-gray-800">{formatINR(budgetStatus.budget)}</p>
            <button 
              onClick={() => setShowBudgetModal(true)}
              className="text-xs text-indigo-600 mt-2 hover:underline"
            >
              Update Budget
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Remaining</p>
            <p className={`text-3xl font-bold ${budgetStatus.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatINR(budgetStatus.remaining)}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Budget Used</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-gray-800">{budgetStatus.percentage.toFixed(0)}%</p>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(budgetStatus.percentage, 100)}%`, backgroundColor: budgetColor }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
            {summary.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={summary} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
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

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending Trends</h3>
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip formatter={(value) => formatINR(value)} />
                  <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-400">No data</div>
            )}
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} 
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportCSV} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2">
              📊 Export CSV
            </button>
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2">
              {showForm ? '✖ Cancel' : '+ Add Expense'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required step="1" />
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>)}
              </select>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">
                  {editingExpense ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expenses Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
          </div>
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No expenses yet. Add your first expense!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.map(expense => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{expense.title}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{formatINR(expense.amount)}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                          {CATEGORY_ICONS[expense.category]} {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(expense.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleEdit(expense)} className="text-indigo-600 hover:text-indigo-800 mr-3 text-sm">Edit</button>
                        <button onClick={() => handleDelete(expense.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Set Monthly Budget</h3>
            <input type="number" placeholder="Budget Amount (₹)" value={newBudget} onChange={(e) => setNewBudget(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl mb-4" />
            <div className="flex gap-3">
              <button onClick={updateBudget} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl">Save</button>
              <button onClick={() => setShowBudgetModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;