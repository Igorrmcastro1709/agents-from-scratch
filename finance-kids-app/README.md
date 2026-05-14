# Campeonato de Educação Financeira (Kids)

Aplicação web em Next.js para acompanhamento de mesada, gastos, tarefas e ranking anual entre crianças.

## Como rodar

```bash
cd finance-kids-app
npm install
npm run dev
```

Abra `http://localhost:3000`.

## O que a versão 1 entrega

- Cadastro de crianças (adicionar/remover).
- Crédito mensal automático de R$ 150 por criança para todos os meses do ano.
- Lançamento de entradas e saídas com categorias.
- Painel com saldo mensal, saldo acumulado e meta de economia.
- Gráficos de evolução semanal e comparativo mensal.
- Tarefas com status e aprovação.
- Ranking anual com badges simbólicas.
- Relatório de fechamento anual estilo dezembro.
- Persistência local com `localStorage`.

## Próximas melhorias sugeridas

- Edição completa de crianças e metas por formulário dedicado.
- Autenticação com perfis de pais e modo criança.
- Banco SQLite com API para sincronização entre dispositivos.
- Notificações semanais e trilhas educativas gamificadas.
