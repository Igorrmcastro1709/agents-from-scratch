"use client";

import { useEffect, useMemo, useState } from "react";
import { ChildCard } from "@/components/ChildCard";
import { MovementForm } from "@/components/MovementForm";
import { TaskBoard } from "@/components/TaskBoard";
import { DashboardCharts } from "@/components/DashboardCharts";
import { WeeklySummary } from "@/components/WeeklySummary";
import { AppData, Child, Movement, TaskStatus } from "@/lib/types";
import { brl } from "@/lib/format";
import { computeSummaries, ensureSeedData, initialData } from "@/lib/data";

const STORAGE_KEY = "finance-kids-data-v1";
const currentMonth = new Date().toISOString().slice(0, 7);
const year = new Date().getFullYear();

const id = () => Math.random().toString(36).slice(2, 10);

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [data, setData] = useState<AppData>(initialData);
  const [newChildName, setNewChildName] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const base = raw ? (JSON.parse(raw) as AppData) : initialData;
    setData(ensureSeedData(base, year));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const summaries = useMemo(() => computeSummaries(data, selectedMonth), [data, selectedMonth]);
  const ranking = [...summaries].sort((a, b) => b.saldoAno - a.saldoAno);
  const liderMes = [...summaries].sort((a, b) => b.saldoMes - a.saldoMes)[0];

  const addMovement = (form: Omit<Movement, "id">) => {
    setData((prev) => ({ ...prev, movements: [...prev.movements, { id: id(), ...form }] }));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }));
  };

  const addChild = () => {
    if (!newChildName.trim()) return;
    const child: Child = { id: id(), nome: newChildName.trim(), metaEconomia: 1000, cor: "#F59E0B" };
    setData((prev) => ensureSeedData({ ...prev, children: [...prev.children, child] }, year));
    setNewChildName("");
  };

  const removeChild = (childId: string) => {
    setData((prev) => ({
      children: prev.children.filter((c) => c.id !== childId),
      movements: prev.movements.filter((m) => m.childId !== childId),
      tasks: prev.tasks.filter((t) => t.childId !== childId),
    }));
  };

  const totalRecebido = summaries.reduce((a, s) => a + s.recebidoAno, 0);
  const totalGasto = summaries.reduce((a, s) => a + s.gastoAno, 0);

  return (
    <main className="container">
      <header className="hero card">
        <h1>🏆 Campeonato de Educação Financeira</h1>
        <p>Controle de mesada, gastos, tarefas e economia acumulada para toda a família.</p>
        <label>
          Mês de análise:
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
        </label>
      </header>

      <section className="card">
        <h2>Cadastro de crianças</h2>
        <div className="inline">
          <input value={newChildName} onChange={(e) => setNewChildName(e.target.value)} placeholder="Nome da criança" />
          <button onClick={addChild}>Adicionar participante</button>
        </div>
        <ul>
          {data.children.map((c) => (
            <li key={c.id} className="inline">
              {c.nome} — Meta: {brl(c.metaEconomia)}
              <button className="danger" onClick={() => removeChild(c.id)}>Remover</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="cards-grid">
        {summaries.map((summary) => <ChildCard key={summary.child.id} summary={summary} />)}
      </section>

      <DashboardCharts data={data} summaries={summaries} />
      <WeeklySummary data={data} />

      <section className="card">
        <h2>Ranking e medalhas</h2>
        <p>🥇 Ranking anual: {ranking.map((r, i) => `${i + 1}º ${r.child.nome}`).join(" | ")}</p>
        <p>🌟 Melhor Economista do mês: <strong>{liderMes?.child.nome ?? "-"}</strong></p>
        <p>🏅 Mestre da Poupança: <strong>{ranking[0]?.child.nome ?? "-"}</strong></p>
        <p>👑 Rei/Rainha das Tarefas: <strong>{[...summaries].sort((a, b) => b.extraAno - a.extraAno)[0]?.child.nome ?? "-"}</strong></p>
        <p>🎯 Controle Total: <strong>{[...summaries].sort((a, b) => b.percentualEconomizado - a.percentualEconomizado)[0]?.child.nome ?? "-"}</strong></p>
      </section>

      <MovementForm data={data} onAdd={addMovement} />
      <TaskBoard data={data} onStatusChange={updateTaskStatus} />

      <section className="card">
        <h2>Relatório de dezembro (fechamento anual)</h2>
        <p>Total recebido no ano: <strong>{brl(totalRecebido)}</strong></p>
        <p>Total gasto no ano: <strong>{brl(totalGasto)}</strong></p>
        <p>Total economizado no ano: <strong>{brl(totalRecebido - totalGasto)}</strong></p>
        <p>Vencedor atual: <strong>{ranking[0]?.child.nome ?? "-"}</strong></p>
        {ranking.map((r) => (
          <p key={r.child.id}>
            {r.child.nome}: pode usar {brl(r.saldoAno * 0.6)} para presente ou manter {brl(r.saldoAno)} para objetivo maior.
          </p>
        ))}
        <p className="tip">💡 Mensagem educativa: {liderMes?.saldoMes && liderMes.saldoMes > 0 ? "Você economizou bem esta semana!" : "Cuidado com muitos pequenos gastos."}</p>
      </section>
    </main>
  );
}
