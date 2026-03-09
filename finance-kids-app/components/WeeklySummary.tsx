import { AppData } from "@/lib/types";
import { weeklyData } from "@/lib/data";
import { brl } from "@/lib/format";

export function WeeklySummary({ data }: { data: AppData }) {
  return (
    <section className="card">
      <h3>Acompanhamento semanal</h3>
      {data.children.map((c) => {
        let acumulado = 0;
        const rows = weeklyData(data, c.id).slice(-6);
        return (
          <div key={c.id} style={{ marginBottom: 16 }}>
            <h4>{c.nome}</h4>
            <table className="table">
              <thead>
                <tr><th>Semana</th><th>Ganhou</th><th>Gastou</th><th>Saldo semana</th><th>Saldo acumulado</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  acumulado += r.saldoSemana;
                  return (
                    <tr key={r.week}>
                      <td>{r.week}</td><td>{brl(r.ganhos)}</td><td>{brl(r.gastos)}</td><td>{brl(r.saldoSemana)}</td><td>{brl(acumulado)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </section>
  );
}
