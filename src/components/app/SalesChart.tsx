"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function SalesChart({ data }: { data: { date: string; qty: number }[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid stroke="#dfe7ee" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} width={40} />
          <Tooltip />
          <Area type="monotone" dataKey="qty" stroke="#177abf" fill="#e8f2fa" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
