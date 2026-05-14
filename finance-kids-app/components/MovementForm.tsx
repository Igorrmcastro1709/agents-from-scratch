"use client";

import { useState } from "react";
import { AppData, Movement, MovementCategory, MovementType } from "@/lib/types";

const entradas: MovementCategory[] = ["mesada mensal", "tarefa extra", "bônus dos pais", "outro crédito"];
const saidas: MovementCategory[] = ["lanche", "brinquedo", "passeio", "presente", "outro gasto"];

export function MovementForm({ data, onAdd }: { data: AppData; onAdd: (form: Omit<Movement, "id">) => void }) {
  const [type, setType] = useState<MovementType>("saida");
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    childId: data.children[0]?.id ?? "",
    type: "saida" as MovementType,
    category: "lanche" as MovementCategory,
    value: 0,
    note: "",
  });

  const categories = type === "entrada" ? entradas : saidas;

  return (
    <section className="card">
      <h3>Lançar movimentação</h3>
      <div className="grid-form">
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <select value={form.childId} onChange={(e) => setForm({ ...form, childId: e.target.value })}>
          {data.children.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
        </select>
        <select
          value={type}
          onChange={(e) => {
            const t = e.target.value as MovementType;
            setType(t);
            setForm({ ...form, type: t, category: t === "entrada" ? "outro crédito" : "outro gasto" });
          }}
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as MovementCategory })}>
          {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        <input type="number" min="0" step="0.01" placeholder="Valor" onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
        <input placeholder="Observação" onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </div>
      <button onClick={() => onAdd(form)}>Salvar</button>
    </section>
  );
}
