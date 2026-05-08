import React from 'react';
import { formatINR } from '../../utils/formatters';

function BudgetProgress({ budgetStatus }) {
  const progressColor = budgetStatus?.percentage >= 90 ? '#ef4444' : budgetStatus?.percentage >= 70 ? '#f59e0b' : '#10b981';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Budget Progress</h3>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-semibold">{budgetStatus?.percentage?.toFixed(0) || 0}%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(budgetStatus?.percentage || 0, 100)}%`, backgroundColor: progressColor }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{formatINR(budgetStatus?.budget || 0)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
          <p className="text-xl font-bold text-red-500">{formatINR(budgetStatus?.spent || 0)}</p>
        </div>
      </div>
    </div>
  );
}

export default BudgetProgress;