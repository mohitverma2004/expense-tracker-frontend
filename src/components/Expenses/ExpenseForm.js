import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../../utils/formatters';

function ExpenseForm({ onSave, editingExpense, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        note: editingExpense.note || '',
        date: editingExpense.date.split('T')[0],
      });
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title *"
          value={formData.title}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (₹) *"
          value={formData.amount}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          required
          step="1"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          required
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          required
        />
        <input
          type="text"
          name="note"
          placeholder="Note (optional)"
          value={formData.note}
          onChange={handleChange}
          className="md:col-span-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        />
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700">
            {editingExpense ? 'Update' : 'Save'}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-xl">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

export default ExpenseForm;