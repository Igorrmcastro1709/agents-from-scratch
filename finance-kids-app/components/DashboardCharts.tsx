"use client";

import { AppData, ChildSummary } from "@/lib/types";
import { weeklyData } from "@/lib/data";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DashboardCharts({ data, summaries }: { data: AppData; summaries: ChildSummary[] }) {
  const monthComp = summaries.map((s) => ({ nome: s.child.nome, ganhos: s.ganhosMes, gastos: s.gastosMes, saldo: s.saldoMes }));

  const weekly = (() => {
    const map = new Map<string, Record<string, string | number>>();
    data.children.forEach((c) => {
      weeklyData(data, c.id).forEach((w) => {
        const row = map.get(w.week) || { week: w.week };
        row[c.nome] = w.saldoSemana;
        map.set(w.week, row);
      });
    });
    return [...map.values()].slice(-12);
  })();

  return (
    <section className="charts-grid">
      <article className="card chart-card">
        <h3>Evolução semanal do saldo</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.children.map((c) => <Line key={c.id} type="monotone" dataKey={c.nome} stroke={c.cor} strokeWidth={2} />)}
          </LineChart>
        </ResponsiveContainer>
      </article>
      <article className="card chart-card">
        <h3>Comparativo mensal</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthComp}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ganhos" fill="#10B981" />
            <Bar dataKey="gastos" fill="#EF4444" />
            <Bar dataKey="saldo" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </article>
    </section>
  );
}
