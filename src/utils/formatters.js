export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });
};

export const getMonthName = (month) => {
  return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
};

export const getCategoryIcon = (category) => {
  const icons = {
    Food: '🍔', 
    Transport: '🚗', 
    Bills: '💡',
    Shopping: '🛍️', 
    Health: '💊', 
    Entertainment: '🎬',
    Other: '📌'
  };
  return icons[category] || '📌';
};

export const getCategoryColor = (category) => {
  const colors = {
    Food: '#f59e0b', 
    Transport: '#06b6d4', 
    Bills: '#ef4444',
    Shopping: '#ec4899', 
    Health: '#10b981', 
    Entertainment: '#8b5cf6',
    Other: '#6b7280'
  };
  return colors[category] || '#6b7280';
};

export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other'];