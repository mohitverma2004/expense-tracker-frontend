import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = 'https://expense-tracker-api-wrxh.onrender.com/api';

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const token = localStorage.getItem('token');

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/expenses`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Expense added!');
      setShowForm(false);
      setFormData({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to add expense');
    }
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

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Toaster position="top-center" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Expenses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
              required
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
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
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
            />
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold">
              Save Expense
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No expenses yet</div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{expense.title}</p>
                <p className="text-xs text-gray-500">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-red-500">{formatINR(expense.amount)}</p>
                <button onClick={() => handleDelete(expense.id)} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpensesPage;