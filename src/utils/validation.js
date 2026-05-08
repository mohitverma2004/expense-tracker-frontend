// Validation Utilities - Like CSIO Portal

// Validate Email
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  if (email.length > 150) return 'Email cannot exceed 150 characters';
  return null;
};

// Validate Password
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 50) return 'Password cannot exceed 50 characters';
  return null;
};

// Validate Name
export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 3) return 'Name must be at least 3 characters';
  if (name.length > 100) return 'Name cannot exceed 100 characters';
  const nameRegex = /^[a-zA-Z\s.-]+$/;
  if (!nameRegex.test(name)) return 'Name can only contain letters, spaces, dots, and hyphens';
  return null;
};

// Validate Expense Title
export const validateTitle = (title) => {
  if (!title) return 'Title is required';
  if (title.length < 2) return 'Title must be at least 2 characters';
  if (title.length > 150) return 'Title cannot exceed 150 characters';
  return null;
};

// Validate Amount
export const validateAmount = (amount) => {
  if (!amount) return 'Amount is required';
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return 'Amount must be a number';
  if (numAmount <= 0) return 'Amount must be greater than 0';
  if (numAmount > 999999999) return 'Amount cannot exceed 999,999,999';
  return null;
};

// Validate Category
export const validateCategory = (category) => {
  const validCategories = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other'];
  if (!category) return 'Category is required';
  if (!validCategories.includes(category)) return 'Please select a valid category';
  return null;
};

// Validate Date
export const validateDate = (date) => {
  if (!date) return 'Date is required';
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate > today) return 'Date cannot be in the future';
  const minDate = new Date('2020-01-01');
  if (selectedDate < minDate) return 'Date cannot be before 2020';
  return null;
};

// Validate Budget Amount
export const validateBudget = (budget) => {
  if (!budget && budget !== 0) return null; // Budget is optional
  const numBudget = parseFloat(budget);
  if (isNaN(numBudget)) return 'Budget must be a number';
  if (numBudget < 0) return 'Budget cannot be negative';
  if (numBudget > 999999999) return 'Budget cannot exceed 999,999,999';
  return null;
};

// Validate Note (Remarks like CSIO)
export const validateNote = (note) => {
  if (!note) return null; // Note is optional
  if (note.length > 1500) return 'Note cannot exceed 1500 characters';
  // Basic SQL injection protection
  const sqlPatterns = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b|--|;|'|\|/i;
  if (sqlPatterns.test(note)) return 'Note contains invalid characters';
  return null;
};

// Validate Date Range (From Date - To Date)
export const validateDateRange = (fromDate, toDate) => {
  if (!fromDate) return 'From Date is required';
  if (!toDate) return 'To Date is required';
  
  const from = new Date(fromDate);
  const to = new Date(toDate);
  
  if (to < from) return 'To Date must be on or after From Date';
  
  const diffDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
  if (diffDays > 365) return 'Date range cannot exceed 1 year';
  
  return null;
};

// Validate IP Address (for audit)
export const validateIPAddress = (ip) => {
  if (!ip) return null;
  const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!ipRegex.test(ip)) return 'Please enter a valid IP address';
  return null;
};

// Get validation summary (like CSIO ValidationSummary)
export const getValidationSummary = (errors) => {
  const validErrors = Object.values(errors).filter(err => err);
  if (validErrors.length === 0) return null;
  
  return {
    hasErrors: true,
    count: validErrors.length,
    message: `Please correct the following ${validErrors.length} error(s)`,
    errors: validErrors
  };
};

// Format validation errors for display
export const formatValidationErrors = (errors) => {
  return errors.map(err => `• ${err}`).join('\n');
};