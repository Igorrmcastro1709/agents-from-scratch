import { AppData, ChildSummary, Movement, Task } from "./types";

const MESEDA_VALOR = 150;
export const CREDITO_MENSAL = MESEDA_VALOR;

const monthRange = Array.from({ length: 12 }, (_, i) => i + 1);

const id = () => Math.random().toString(36).slice(2, 10);

export const initialData: AppData = {
  children: [
    { id: "c1", nome: "Alice", metaEconomia: 1200, cor: "#7C3AED" },
    { id: "c2", nome: "Bruno", metaEconomia: 1000, cor: "#0891B2" },
  ],
  movements: [],
  tasks: [
    { id: "t1", nome: "Arrumar o quarto", valor: 10, status: "pendente", data: "2026-01-07", childId: "c1" },
    { id: "t2", nome: "Ajudar na mesa", valor: 8, status: "concluída", data: "2026-01-08", childId: "c2" },
    { id: "t3", nome: "Ler um livro", valor: 12, status: "aprovada", data: "2026-01-06", childId: "c1" },
  ],
};

export function seedMonthlyAllowance(year: number, childIds: string[]): Movement[] {
  return childIds.flatMap((childId) =>
    monthRange.map((month) => ({
      id: id(),
      date: `${year}-${String(month).padStart(2, "0")}-01`,
      childId,
      type: "entrada" as const,
      category: "mesada mensal" as const,
      value: CREDITO_MENSAL,
      note: "Crédito automático da mesada",
    }))
  );
}

export function ensureSeedData(data: AppData, year: number): AppData {
  const seeded = seedMonthlyAllowance(year, data.children.map((c) => c.id));
  const existingKeys = new Set(data.movements.map((m) => `${m.childId}-${m.date.slice(0, 7)}-${m.category}`));
  const merged = [...data.movements];
  seeded.forEach((m) => {
    const key = `${m.childId}-${m.date.slice(0, 7)}-${m.category}`;
    if (!existingKeys.has(key)) merged.push(m);
  });

  const hasApprovedTaskCredits = data.movements.filter((m) => m.category === "tarefa extra").map((m) => m.id);
  const taskMovements = data.tasks
    .filter((t) => t.status === "aprovada")
    .map((t) => ({
      id: `task-${t.id}`,
      date: t.data,
      childId: t.childId,
      type: "entrada" as const,
      category: "tarefa extra" as const,
      value: t.valor,
      note: `Recompensa aprovada: ${t.nome}`,
    }))
    .filter((m) => !hasApprovedTaskCredits.includes(m.id));

  return { ...data, movements: [...merged, ...taskMovements] };
}

export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function computeSummaries(data: AppData, selectedMonth: string): ChildSummary[] {
  return data.children.map((child) => {
    const childMovements = data.movements.filter((m) => m.childId === child.id);
    const monthly = childMovements.filter((m) => monthOf(m.date) === selectedMonth);

    const recebidoAno = childMovements.filter((m) => m.type === "entrada").reduce((acc, m) => acc + m.value, 0);
    const gastoAno = childMovements.filter((m) => m.type === "saida").reduce((acc, m) => acc + m.value, 0);
    const extraAno = childMovements
      .filter((m) => m.type === "entrada" && m.category !== "mesada mensal")
      .reduce((acc, m) => acc + m.value, 0);

    const ganhosMes = monthly.filter((m) => m.type === "entrada").reduce((acc, m) => acc + m.value, 0);
    const gastosMes = monthly.filter((m) => m.type === "saida").reduce((acc, m) => acc + m.value, 0);

    const saldoAno = recebidoAno - gastoAno;
    const saldoMes = ganhosMes - gastosMes;
    const percentualEconomizado = recebidoAno > 0 ? (saldoAno / recebidoAno) * 100 : 0;

    return {
      child,
      recebidoAno,
      gastoAno,
      extraAno,
      saldoAno,
      saldoMes,
      ganhosMes,
      gastosMes,
      percentualEconomizado,
    };
  });
}

export function weekKey(dateStr: string): string {
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 1);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const week = Math.ceil((day + start.getDay() + 1) / 7);
  return `${date.getFullYear()}-S${week}`;
}

export function weeklyData(data: AppData, childId: string) {
  const list = data.movements.filter((m) => m.childId === childId);
  const grouped = new Map<string, { week: string; ganhos: number; gastos: number; saldoSemana: number }>();
  list.forEach((m) => {
    const wk = weekKey(m.date);
    const current = grouped.get(wk) || { week: wk, ganhos: 0, gastos: 0, saldoSemana: 0 };
    if (m.type === "entrada") current.ganhos += m.value;
    else current.gastos += m.value;
    current.saldoSemana = current.ganhos - current.gastos;
    grouped.set(wk, current);
  });
  return [...grouped.values()].sort((a, b) => a.week.localeCompare(b.week));
}
