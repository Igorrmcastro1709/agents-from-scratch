export type MovementType = "entrada" | "saida";

export type MovementCategory =
  | "mesada mensal"
  | "tarefa extra"
  | "bônus dos pais"
  | "outro crédito"
  | "lanche"
  | "brinquedo"
  | "passeio"
  | "presente"
  | "outro gasto";

export type TaskStatus = "pendente" | "concluída" | "aprovada";

export interface Child {
  id: string;
  nome: string;
  metaEconomia: number;
  cor: string;
}

export interface Movement {
  id: string;
  date: string;
  childId: string;
  type: MovementType;
  category: MovementCategory;
  value: number;
  note?: string;
}

export interface Task {
  id: string;
  nome: string;
  valor: number;
  status: TaskStatus;
  data: string;
  childId: string;
}

export interface AppData {
  children: Child[];
  movements: Movement[];
  tasks: Task[];
}

export interface ChildSummary {
  child: Child;
  recebidoAno: number;
  gastoAno: number;
  extraAno: number;
  saldoAno: number;
  saldoMes: number;
  ganhosMes: number;
  gastosMes: number;
  percentualEconomizado: number;
}
