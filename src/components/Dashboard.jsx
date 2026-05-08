// src/components/Dashboard.jsx
// Place this file at: expense-tracker-frontend/src/components/Dashboard.jsx
// Install recharts first: npm install recharts

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import api from "../services/api";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6"];

const CATEGORY_COLORS = {
  Food: "#f59e0b",
  Transport: "#3b82f6",
  Bills: "#ef4444",
  Shopping: "#ec4899",
  Health: "#22c55e",
  Entertainment: "#8b5cf6",
  Other: "#6b7280",
};

function SummaryCard({ title, value, sub, color, icon }) {
  return (
    <div style={{
      background: "var(--card-bg, #fff)",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "1.1rem 1.25rem",
      flex: 1,
      minWidth: 160,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 4px" }}>{title}</p>
          <p style={{ fontSize: 22, fontWeight: 600, margin: 0, color }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>{sub}</p>}
        </div>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: "#f3f4f6",
      borderRadius: 12,
      padding: "1.1rem 1.25rem",
      flex: 1,
      minWidth: 160,
      animation: "pulse 1.5s infinite",
    }}>
      <div style={{ height: 12, background: "#e5e7eb", borderRadius: 6, width: "60%", marginBottom: 10 }} />
      <div style={{ height: 28, background: "#e5e7eb", borderRadius: 6, width: "80%" }} />
    </div>
  );
}

export default function Dashboard({ selectedMonth, selectedYear }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/expenses/summary?month=${selectedMonth}&year=${selectedYear}`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { total_this_month, monthly_budget, categories, trend } = data;
  const budget = parseFloat(monthly_budget) || 0;
  const spent = parseFloat(total_this_month) || 0;
  const remaining = budget - spent;
  const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const topCategory = categories?.[0];

  // Budget status
  let budgetColor = "#22c55e";
  let budgetLabel = "On track";
  if (pct >= 100) { budgetColor = "#ef4444"; budgetLabel = "Over budget!"; }
  else if (pct >= 80) { budgetColor = "#f59e0b"; budgetLabel = "Warning: 80%+"; }

  return (
    <div>
      {/* Budget alert banner */}
      {pct >= 80 && (
        <div style={{
          background: pct >= 100 ? "#fef2f2" : "#fffbeb",
          border: `1px solid ${pct >= 100 ? "#fca5a5" : "#fcd34d"}`,
          borderRadius: 10,
          padding: "0.75rem 1rem",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          color: pct >= 100 ? "#b91c1c" : "#92400e",
        }}>
          <span>{pct >= 100 ? "🚨" : "⚠️"}</span>
          <span>
            {pct >= 100
              ? `You're ₹${Math.abs(remaining).toLocaleString("en-IN")} over your monthly budget!`
              : `You've used ${pct}% of your budget. ₹${remaining.toLocaleString("en-IN")} remaining.`}
          </span>
        </div>
      )}

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <SummaryCard
          title="Total Spent"
          value={`₹${spent.toLocaleString("en-IN")}`}
          sub="This month"
          color="#6366f1"
          icon="💸"
        />
        <SummaryCard
          title="Budget Left"
          value={budget > 0 ? `₹${Math.max(0, remaining).toLocaleString("en-IN")}` : "Not set"}
          sub={budget > 0 ? `${pct}% used` : "Set a budget"}
          color={budgetColor}
          icon="🎯"
        />
        <SummaryCard
          title="Top Category"
          value={topCategory?.category || "—"}
          sub={topCategory ? `₹${parseFloat(topCategory.total).toLocaleString("en-IN")}` : "No data"}
          color={CATEGORY_COLORS[topCategory?.category] || "#6b7280"}
          icon="📊"
        />
        <SummaryCard
          title="Transactions"
          value={categories?.reduce((a, c) => a + 1, 0) || "0"}
          sub="categories used"
          color="#14b8a6"
          icon="🧾"
        />
      </div>

      {/* Budget progress bar */}
      {budget > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: "#6b7280" }}>Monthly budget</span>
            <span style={{ fontWeight: 500, color: budgetColor }}>{budgetLabel}</span>
          </div>
          <div style={{ background: "#e5e7eb", borderRadius: 999, height: 8, overflow: "hidden" }}>
            <div style={{
              width: `${Math.min(pct, 100)}%`,
              height: "100%",
              background: budgetColor,
              borderRadius: 999,
              transition: "width 0.6s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4, color: "#9ca3af" }}>
            <span>₹0</span>
            <span>₹{budget.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Pie chart */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem" }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: "#374151" }}>Spending by category</p>
          {categories?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categories} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={75} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {categories.map((entry, index) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${parseFloat(v).toLocaleString("en-IN")}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14 }}>
              No expenses this month
            </div>
          )}
        </div>

        {/* Bar chart - 6 month trend */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem" }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: "#374151" }}>6-month trend</p>
          {trend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v) => `₹${parseFloat(v).toLocaleString("en-IN")}`} />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14 }}>
              Not enough data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
