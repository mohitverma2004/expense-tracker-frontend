import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/formatters';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

function ExpenseChart({ summary }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Spending Overview</h3>
      {summary && summary.length > 0 ? (
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
  );
}

export default ExpenseChart;