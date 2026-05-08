// src/components/EmptyState.jsx
// Place this file at: expense-tracker-frontend/src/components/EmptyState.jsx

export default function EmptyState({ onAdd }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 1rem",
      color: "#9ca3af",
      textAlign: "center",
    }}>
      <span style={{ fontSize: 52, marginBottom: 12 }}>🧾</span>
      <p style={{ fontSize: 16, fontWeight: 500, color: "#374151", margin: "0 0 6px" }}>
        No expenses yet
      </p>
      <p style={{ fontSize: 13, margin: "0 0 20px" }}>
        Add your first expense to start tracking your spending.
      </p>
      <button
        onClick={onAdd}
        style={{
          background: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "0.6rem 1.5rem",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        + Add Expense
      </button>
    </div>
  );
}
