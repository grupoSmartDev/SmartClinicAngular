# Checklists das quatro lentes

Use somente os itens aplicáveis à tarefa. Um item não executado não pode ser descrito como aprovado.

## 1. QA e usabilidade

### Fluxo e estados

- O objetivo principal está evidente sem treinamento?
- A ação primária tem nome específico e posição previsível?
- Filtros preservam valores, podem ser limpos e não disparam requisições excessivas?
- Carregando, vazio, erro, sucesso, sem permissão e indisponibilidade têm feedback distinto?
- Edição, cancelamento e exclusão preservam contexto e pedem confirmação quando necessário?
- Valores, datas, status e totais são consistentes com telas relacionadas?

### Formulários e acessibilidade

- Todo campo tem `label` associado, ajuda quando necessária e erro acionável?
- A obrigatoriedade é visível antes do envio?
- Teclado, foco inicial, retorno de foco após modal e ordem de tabulação funcionam?
- Leitores de tela recebem nomes de botões, erros e mudanças de estado?
- Layout funciona em 320 px, tablet e desktop sem esconder ações essenciais?
- Cores não são o único meio de comunicar status?

### Rotina clínica

- Recepção consegue concluir a tarefa rapidamente enquanto atende uma pessoa?
- Fisioterapeuta encontra paciente, contexto e histórico sem perder o atendimento atual?
- Financeiro entende período, competência, pagamento, cancelamento e totalização?
- A tela evita termos técnicos ou ambíguos quando há linguagem clínica/financeira melhor?

## 2. Arquitetura e reutilização

- Há componente/diretiva/pipe/helper existente que já cobre o caso?
- O componente de página coordena, em vez de acumular regras de domínio e formatação?
- Serviços HTTP têm retorno tipado e tratamento coerente de parâmetros e erros?
- Regras repetidas de tabela, paginação, modal, filtro e feedback foram centralizadas com contrato claro?
- Controles de dinheiro, percentual e texto formatado preservam valor numérico/canônico no modelo?
- Um controle customizado implementa corretamente `ControlValueAccessor`, disabled, touched e validação quando necessário?
- A abstração reduz duplicação real sem criar API genérica difícil de entender?
- Novos nomes e caminhos seguem o padrão da área tocada, mesmo quando o padrão global ainda é inconsistente?

## 3. Automação futura com IA

Para cada ideia, exigir resposta positiva às perguntas abaixo antes de recomendá-la:

- Existe tarefa repetitiva ou decisão assistível com ganho mensurável?
- Entradas e saída podem ser descritas objetivamente?
- Um humano pode revisar/corrigir antes de qualquer efeito clínico ou financeiro?
- Dados pessoais e clínicos podem ser minimizados, mascarados e auditados?
- O backend pode aplicar autorização, consentimento, retenção e rastreabilidade?
- Há fallback manual quando o serviço de IA falhar?
- Existe métrica como tempo economizado, taxa de correção ou redução de retrabalho?

Exemplos plausíveis, nunca automáticos: resumo de evolução para revisão do fisioterapeuta, sugestão de pendências de prontuário, classificação assistida de despesas e explicação textual de indicadores. Não diagnosticar, prescrever ou executar lançamentos financeiros sem revisão humana.

## 4. Segurança e performance

### Frontend

- Templates evitam `innerHTML`, bypass de sanitização e URLs construídas com entrada não confiável?
- Nenhum segredo, token, dado clínico ou payload sensível aparece em log, mensagem ou bundle?
- Erros técnicos são convertidos em feedback útil sem revelar detalhes internos?
- Requisições repetidas são canceladas, combinadas ou protegidas contra respostas fora de ordem quando aplicável?
- Subscriptions têm ciclo de vida controlado por `async`, signals, `takeUntilDestroyed` ou estratégia equivalente?
- Listas usam identidade estável e paginação/virtualização quando o volume justificar?
- Componentes evitam getters pesados e funções caras chamadas a cada detecção de mudança?
- Rotas/módulos pesados, gráficos e calendários são carregados apenas quando necessários, quando a arquitetura permitir?
- CSS novo reutiliza tokens/classes existentes, limita seletores ao componente e não duplica Bootstrap?
- O build respeita budgets e não introduz dependência desproporcional?

### Responsabilidades a sinalizar para o backend

- Autorização real por usuário, perfil e clínica.
- Validação canônica de valores, percentuais, datas e transições de status.
- Isolamento multi-tenant, auditoria, idempotência e concorrência.
- Paginação, filtragem, ordenação e agregação de relatórios em grande volume.
- Rate limiting, proteção contra enumeração e mensagens de erro seguras.
- Consentimento, minimização, retenção e rastreabilidade para dados usados por IA.

Ocultar botão, validar formulário ou filtrar dados no navegador não substitui nenhum desses controles.
