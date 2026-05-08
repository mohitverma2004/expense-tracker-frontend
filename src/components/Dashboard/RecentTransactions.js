import React from 'react';
import { formatINR, formatDate, getCategoryIcon } from '../../utils/formatters';

function RecentTransactions({ expenses }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Transactions</h3>
      </div>
      {!expenses || expenses.length === 0 ? (
        <div className="p-12 text-center text-gray-400">No transactions yet</div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {expenses.slice(0, 5).map((expense) => (
            <div key={expense.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-xl">
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{expense.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(expense.date)} • {expense.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-500">{formatINR(expense.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;