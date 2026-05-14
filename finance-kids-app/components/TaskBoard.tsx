"use client";

import { AppData, TaskStatus } from "@/lib/types";
import { brl } from "@/lib/format";

export function TaskBoard({ data, onStatusChange }: { data: AppData; onStatusChange: (id: string, status: TaskStatus) => void }) {
  return (
    <section className="card">
      <h3>Tarefas com recompensa</h3>
      <div className="task-list">
        {data.tasks.map((task) => {
          const kid = data.children.find((c) => c.id === task.childId)?.nome;
          return (
            <div key={task.id} className="task-item">
              <div>
                <strong>{task.nome}</strong> — {kid} ({brl(task.valor)})
                <small>{task.data}</small>
              </div>
              <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}>
                <option value="pendente">pendente</option>
                <option value="concluída">concluída</option>
                <option value="aprovada">aprovada</option>
              </select>
            </div>
          );
        })}
      </div>
    </section>
  );
}
