// src/components/FilterBar.jsx
// Place this file at: expense-tracker-frontend/src/components/FilterBar.jsx

import api from "../services/api";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Health", "Entertainment", "Other"];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function FilterBar({ filters, onChange }) {
  const { month, year, category, search } = filters;

  const handleExport = async () => {
    try {
      const res = await api.get(`/api/expenses/export?month=${month}&year=${year}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expenses_${month}_${year}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed. Please try again.");
    }
  };

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "1rem 1.25rem",
      marginBottom: 16,
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      alignItems: "center",
    }}>
      {/* Search */}
      <input
        type="text"
        placeholder="Search expenses..."
        value={search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "0.45rem 0.75rem",
          fontSize: 13,
          flex: 2,
          minWidth: 160,
          outline: "none",
        }}
      />

      {/* Month */}
      <select
        value={month}
        onChange={(e) => onChange({ ...filters, month: e.target.value })}
        style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.45rem 0.75rem", fontSize: 13, minWidth: 130 }}
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>{m}</option>
        ))}
      </select>

      {/* Year */}
      <select
        value={year}
        onChange={(e) => onChange({ ...filters, year: e.target.value })}
        style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.45rem 0.75rem", fontSize: 13, minWidth: 90 }}
      >
        {[2024, 2025, 2026].map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.45rem 0.75rem", fontSize: 13, minWidth: 130 }}
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Export CSV button */}
      <button
        onClick={handleExport}
        style={{
          background: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "0.45rem 1rem",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ⬇ Export CSV
      </button>
    </div>
  );
}
