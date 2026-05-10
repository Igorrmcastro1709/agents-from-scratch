# Receitas da Cris

Este diretório é um MVP de livro de receitas online para publicar no GitHub Pages.
A ideia é transformar posts salvos do Instagram, PDFs, vídeos, links e imagens em um catálogo organizado por tipo de receita, tags e fluxo de execução.

## Visão do produto

- **Captura:** registrar o link ou arquivo de origem sempre que a Cris encontrar uma receita interessante.
- **Curadoria:** transformar a mídia original em ingredientes, tempo, dificuldade, rendimento e notas pessoais.
- **Execução:** criar um passo a passo curto e objetivo para cozinhar sem precisar rever todo o post ou vídeo.
- **Publicação:** manter o conteúdo em `data/recipes.json` e publicar a página pelo GitHub Pages.

## Como validar a entrega

- Abra `validacao.html` para revisar o MVP em uma página dedicada de validação.
- Use o preview incorporado para navegar pela entrega final sem sair da tela de checklist.
- Marque os critérios de aceite e siga o roteiro sugerido antes de publicar.

## Como atualizar receitas

1. Abra `index.html` pelo GitHub Pages ou em um servidor local.
2. Use o formulário **Adicionar nova descoberta** para gerar um rascunho JSON.
3. Cole o objeto gerado dentro do array de `data/recipes.json`.
4. Faça commit e publique no GitHub.

> Observação: os posts salvos do Instagram normalmente não ficam disponíveis por uma API pública simples. Por isso, o fluxo inicial recomendado é registrar manualmente o link do post salvo e enriquecer a receita no catálogo.

## Publicação no GitHub Pages

1. Faça push do repositório para o GitHub.
2. Acesse **Settings → Pages**.
3. Escolha a branch principal e a pasta `/receitas-da-cris` como origem, se disponível, ou publique a partir de `/docs` em uma etapa futura.
4. Compartilhe a URL gerada.

## Próximas evoluções

- Criar um formulário com GitHub Issues para enviar novas receitas sem editar JSON manualmente.
- Adicionar upload de PDFs/imagens para uma pasta `media/`.
- Integrar um fluxo com IA para extrair ingredientes e passos a partir de links e PDFs.
- Adicionar favoritos, lista de compras e modo cozinha com passos grandes.
