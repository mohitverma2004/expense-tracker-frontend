# FinancePro — Expense Tracker

A full-stack personal finance tracker built with React, Node.js, Express, and PostgreSQL. Track daily expenses, set monthly budgets, visualize spending patterns, and export reports.

**Live Demo:** https://financepro-tracker.netlify.app

---

## Features

- **JWT Authentication** — Secure login/register with token-based auth
- **Expense CRUD** — Add, edit, delete expenses with category tagging
- **Dashboard Charts** — Pie chart (category breakdown) + Bar chart (6-month trend) via Recharts
- **Budget Tracking** — Set monthly budget, get visual alerts at 80% and 100%
- **Smart Filters** — Filter by month, year, category, or search by title
- **CSV Export** — Download monthly expenses as a spreadsheet
- **Responsive Design** — Works on mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Netlify (frontend), Render (backend) |
| Security | Helmet.js, express-rate-limit, bcryptjs |

## Project Structure

```
expense-tracker-frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Summary cards + charts
│   │   ├── FilterBar.jsx      # Search, month/category filters + CSV export
│   │   ├── EmptyState.jsx     # Empty state UI
│   │   └── ExpenseForm.jsx    # Add/edit expense modal
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Home.jsx
│   ├── services/
│   │   └── api.js             # Axios instance with JWT interceptor
│   └── App.js
```

## Getting Started

```bash
git clone https://github.com/mohitverma2004/expense-tracker-frontend
cd expense-tracker-frontend
npm install
```

Create a `.env` file:
```
REACT_APP_API_URL=https://expense-tracker-api-wrxh.onrender.com
```

```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/expenses | Get all expenses (filterable) |
| POST | /api/expenses | Add new expense |
| PUT | /api/expenses/:id | Edit expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/expenses/summary | Category totals + trend data |
| GET | /api/expenses/export | Download as CSV |

## Backend Repo

https://github.com/mohitverma2004/expense-tracker-backend

---

Built by **Mohit Verma** — PEC Chandigarh, CSE
