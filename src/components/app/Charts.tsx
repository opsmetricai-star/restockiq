"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

export function HistoryForecastChart({ data }: { data: { date: string; actual?: number; forecast?: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#dfe7ee" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={24} />
          <YAxis tick={{ fontSize: 12 }} width={40} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" name="Actual units" stroke="#0a3256" dot={false} strokeWidth={2} connectNulls />
          <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#177abf" dot={false} strokeWidth={2} strokeDasharray="6 4" connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StockByCategoryChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid stroke="#dfe7ee" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={110} />
          <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
          <Bar dataKey="value" name="Stock value" fill="#177abf" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const COLORS: Record<string, string> = { "stockout-risk": "#dc2626", reorder: "#f59e0b", ok: "#16a34a", overstock: "#177abf" };
export function StatusDonut({ data }: { data: { name: string; value: number }[] }) {
  const shown = data.filter((d) => d.value > 0);
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={shown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
            {shown.map((d) => <Cell key={d.name} fill={COLORS[d.name] ?? "#0a3256"} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
