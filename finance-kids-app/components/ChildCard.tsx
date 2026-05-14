import { ChildSummary } from "@/lib/types";
import { brl } from "@/lib/format";

export function ChildCard({ summary }: { summary: ChildSummary }) {
  const trend = summary.saldoMes >= 0;
  const progresso = Math.min(100, (summary.saldoAno / summary.child.metaEconomia) * 100);

  return (
    <article className="card" style={{ borderTopColor: summary.child.cor }}>
      <h3>{summary.child.nome}</h3>
      <p>Saldo atual do mês: <strong>{brl(summary.saldoMes)}</strong></p>
      <p>Saldo acumulado no ano: <strong>{brl(summary.saldoAno)}</strong></p>
      <p>{trend ? "📈 Tendência positiva" : "📉 Tendência negativa"}</p>
      <p>Meta de economia: {brl(summary.child.metaEconomia)}</p>
      <div className="progress"><span style={{ width: `${progresso}%`, background: summary.child.cor }} /></div>
      <small>Faltam {brl(Math.max(0, summary.child.metaEconomia - summary.saldoAno))} para atingir a meta.</small>
    </article>
  );
}
