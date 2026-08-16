# SmartClinic Angular — instruções do projeto

## Escopo

- Este repositório contém somente o frontend Angular da SmartClinic.
- Não modificar backend, banco de dados, infraestrutura externa ou contratos de API fora deste repositório.
- Quando uma necessidade pertencer ao backend, documentar o requisito, o risco e o contrato recomendado, sem tentar corrigi-la aqui.

## Fluxo obrigatório para trabalho de frontend

- Usar a skill `$smartclinic-frontend-workflow` em toda criação ou alteração de tela, componente, formulário, relatório, rota, estilo, experiência do usuário, arquitetura frontend, segurança ou performance.
- Aplicar, na mesma tarefa, quatro lentes: QA/usabilidade, arquitetura e reutilização, oportunidades futuras de IA, e segurança/performance.
- Antes de editar uma interface, comunicar de forma breve 2 ou 3 alternativas de organização visual, recomendar uma e explicar o motivo. Em seguida, continuar automaticamente com a alternativa recomendada; só pausar quando faltar uma decisão de negócio que altere materialmente o resultado.
- Inspecionar primeiro telas e componentes semelhantes para preservar linguagem visual e comportamento existentes.
- Não tratar as quatro lentes como quatro implementações independentes. Consolidar decisões e evitar recomendações contraditórias.

## Padrões de implementação

- Manter compatibilidade com Angular 18, TypeScript estrito, templates estritos e a arquitetura NgModule existente, salvo solicitação explícita de migração.
- Buscar componentes, diretivas, pipes, helpers e serviços existentes antes de criar novos.
- Separar responsabilidades de apresentação, estado/formulário, acesso HTTP e regras reutilizáveis; não criar abstrações sem benefício concreto.
- Em campos monetários, percentuais, textos formatados e seleções recorrentes, avaliar componente de formulário reutilizável ou diretiva com contrato tipado, validação, acessibilidade e semântica de valor explícita.
- Reutilizar Bootstrap e estilos existentes de modo seletivo. Evitar CSS global amplo, duplicação de regras, `!important` desnecessário e novas dependências sem justificativa.
- Não introduzir jQuery, manipulação direta do DOM, segredos no cliente ou HTML não confiável.

## Verificação e entrega

- Validar estados normal, vazio, carregando, erro, sem permissão e responsivo quando aplicáveis.
- Executar ao menos `npm run build` após alterações de código. Executar testes direcionados quando existirem ou forem adicionados; informar lacunas de cobertura.
- Para alterações visuais executáveis, verificar a interface no navegador quando o ambiente estiver disponível e registrar qualquer limitação.
- Na entrega, resumir decisões de UX, reutilização/arquitetura, segurança/performance, oportunidades futuras de IA e recomendações exclusivas de backend.
