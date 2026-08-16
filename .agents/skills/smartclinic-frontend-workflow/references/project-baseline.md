# Baseline do frontend SmartClinic

## Escopo e stack observados

- Aplicação Angular 18 com TypeScript 5.5, `strict` e `strictTemplates` habilitados.
- Arquitetura atual baseada em `NgModule`; componentes, diretivas e pipes não são standalone por padrão.
- UI baseada principalmente em Bootstrap 5.3 e CSS por componente.
- Formulários usam `FormsModule` e `ReactiveFormsModule`.
- Bibliotecas já disponíveis incluem `ngx-mask`, `ngx-currency`, `ngx-toastr`, `ngx-spinner`, `ngx-bootstrap`, FullCalendar e ngx-charts.
- O frontend conversa com serviços HTTP em `src/app/_services` e mantém modelos/DTOs em `src/app/_module`.
- Telas de negócio ficam majoritariamente em `src/app/_pages`; elementos reutilizáveis em `src/app/_components`; pipes, diretivas e helpers em `src/app/_shared`.

## Realidade arquitetural a respeitar

- `src/app/app.module.ts` centraliza grande número de declarações e imports.
- `src/app/app-routing.module.ts` centraliza as rotas e usa `AuthGuard` no layout autenticado.
- Existem componentes de tabela, diálogos, selects, calendário e campos/formatadores compartilhados. Inspecioná-los antes de criar equivalentes.
- Há cobertura de testes pequena em relação ao volume de componentes. Priorizar testes das regras tocadas e não alegar cobertura ampla.
- O projeto já carrega Bootstrap globalmente. Evitar importá-lo novamente em componentes ou adicionar frameworks visuais concorrentes.
- Não introduzir jQuery ou APIs diretas de DOM em código novo, mesmo que a dependência exista no `package.json`.

## Comandos de verificação

- Build de produção: `npm run build`
- Testes existentes: `npm test -- --watch=false`
- Desenvolvimento: `npm start`

Antes de executar testes em navegador, confirmar a URL efetiva e a disponibilidade da API de homologação. Não alterar arquivos de ambiente para contornar indisponibilidade sem autorização.

## Fronteira com o backend

O repositório não contém o backend. Pode-se inspecionar o contrato consumido pelo frontend, mas qualquer recomendação de endpoint, autorização, auditoria, isolamento por clínica, validação de valores, agregação de relatório ou automação com IA deve ser registrada como dependência externa. Nunca criar arquivos de backend neste repositório nem alterar outro workspace.
