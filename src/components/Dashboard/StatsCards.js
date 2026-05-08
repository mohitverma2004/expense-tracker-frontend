import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiTarget, FiDollarSign } from 'react-icons/fi';
import { formatINR } from '../../utils/formatters';

function StatsCards({ monthlyTotal, budgetStatus, percentageChange }) {
  const cards = [
    {
      title: 'Total Spent',
      value: formatINR(monthlyTotal),
      icon: FiDollarSign,
      color: 'from-blue-500 to-blue-600',
      change: percentageChange,
    },
    {
      title: 'Monthly Budget',
      value: formatINR(budgetStatus.budget),
      icon: FiTarget,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Remaining',
      value: formatINR(budgetStatus.remaining),
      icon: FiTrendingUp,
      color: budgetStatus.remaining >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600',
    },
    {
      title: 'Budget Used',
      value: `${budgetStatus.percentage.toFixed(0)}%`,
      icon: FiTrendingDown,
      color: 'from-orange-500 to-orange-600',
      progress: budgetStatus.percentage,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center`}>
              <card.icon size={24} className="text-white" />
            </div>
            {card.change !== undefined && (
              <span className={`text-sm ${card.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {card.change >= 0 ? '+' : ''}{card.change}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{card.value}</p>
          {card.progress !== undefined && (
            <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(card.progress, 100)}%` }} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default StatsCards;