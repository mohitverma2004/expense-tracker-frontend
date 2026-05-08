import React from 'react';
import { getMonthName } from '../../utils/formatters';

const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other'];

function ExpenseFilters({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
        <select
          value={filters.month}
          onChange={(e) => handleChange('month', parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{getMonthName(m)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
        <select
          value={filters.year}
          onChange={(e) => handleChange('year', parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => handleChange('category', e.target.value === 'All' ? '' : e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
    </div>
  );
}

export default ExpenseFilters;