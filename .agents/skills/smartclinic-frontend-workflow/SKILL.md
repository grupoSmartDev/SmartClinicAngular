---
name: smartclinic-frontend-workflow
description: "Planejar, implementar, revisar e validar mudanças no frontend Angular da SmartClinic por quatro lentes obrigatórias: QA e usabilidade, arquitetura e reutilização de componentes, oportunidades futuras de automação com IA, e segurança e performance. Usar implicitamente ao criar ou alterar telas, relatórios, dashboards, formulários, componentes, diretivas, pipes, rotas, navegação, estilos CSS/Bootstrap, integrações HTTP do frontend, refatorações ou revisões de código e experiência do usuário neste repositório. Não usar para modificar backend, banco de dados ou infraestrutura externa."
---

# SmartClinic Frontend Workflow

Conduzir cada tarefa como uma revisão integrada de produto e engenharia. Produzir uma solução coerente, não quatro respostas isoladas.

## Carregar o contexto do projeto

1. Ler [project-baseline.md](references/project-baseline.md) antes de planejar qualquer alteração.
2. Ler [four-lens-checklists.md](references/four-lens-checklists.md) antes de implementar e consultá-lo novamente na revisão final.
3. Inspecionar `AGENTS.md`, o estado do Git e apenas os arquivos relevantes.
4. Localizar telas análogas, componentes compartilhados, modelos, serviços, rotas, menus, estilos e testes antes de propor uma estrutura.
5. Preservar mudanças preexistentes e não expandir o escopo para corrigir débitos não relacionados.

## Classificar a tarefa

- **Nova tela ou mudança visual relevante:** executar o fluxo completo abaixo.
- **Alteração interna sem impacto visual:** manter as quatro lentes, mas resumir a proposta visual como “sem alteração de layout”.
- **Revisão ou diagnóstico:** não editar código; apresentar achados priorizados e evidências.
- **Pedido de backend detectado durante o trabalho:** não escrever fora do frontend. Registrar a responsabilidade do backend, o contrato esperado e o impacto no frontend.

## Propor a experiência antes de editar

Antes da primeira alteração de interface, enviar uma atualização curta com:

1. objetivo do usuário e informação principal da tela;
2. duas ou três alternativas reais de organização visual;
3. alternativa recomendada e justificativa ligada à rotina clínica;
4. principais estados e ações que serão cobertos.

Continuar imediatamente com a alternativa recomendada, sem exigir novo prompt. Pausar somente se uma decisão ausente mudar regras de negócio, dados persistidos, permissões, contrato de API ou uma ação externa relevante.

Para relatórios, considerar como ponto de partida:

- título e contexto temporal;
- filtros essenciais, com ação clara de aplicar e limpar;
- resumo dos indicadores antes do detalhe;
- tabela legível com ordenação/paginação quando necessárias;
- estados vazio, carregando e erro;
- ações de exportação ou impressão somente quando solicitadas ou já suportadas.

## Executar as quatro lentes

### 1. QA e usabilidade

- Definir o caminho principal e os estados alternativos antes de codificar.
- Reduzir cliques, preservar contexto e usar rótulos compreensíveis para recepção, fisioterapeuta e financeiro.
- Verificar obrigatoriedade, validações, mensagens, confirmação de ações destrutivas, feedback de sucesso/erro, navegação por teclado e responsividade.
- Distinguir defeito, risco, melhoria necessária e preferência pessoal.

### 2. Arquitetura e reutilização

- Manter cada componente com responsabilidade clara: apresentação, coordenação da tela, formulário/estado ou acesso a dados.
- Buscar primeiro um recurso compartilhado existente e melhorar seu contrato quando seguro.
- Extrair componente, diretiva, pipe ou helper quando houver repetição real, alta probabilidade de reuso ou regra que precise de consistência centralizada.
- Preferir formulários reativos e tipos explícitos. Para controles personalizados reutilizáveis, avaliar `ControlValueAccessor` e integração completa com estado desabilitado, toque, validação e mensagens de erro.
- Isolar chamadas HTTP em serviços e impedir que componentes dupliquem transformação de payloads ou regras financeiras.
- Não realizar migração ampla de arquitetura durante uma funcionalidade localizada sem solicitação explícita.

### 3. Oportunidades futuras de IA

- Identificar automações plausíveis relacionadas à tarefa, sem adicionar IA por ornamentação.
- Para cada oportunidade relevante, registrar: evento disparador, entradas, saída esperada, revisão humana, dados sensíveis, dependência de backend e métrica de sucesso.
- Não adicionar provedor, SDK, chamada de modelo, prompt oculto ou envio de dados clínicos sem autorização explícita e desenho de privacidade.
- Implementar apenas pontos de extensão frontend que já sejam necessários ao escopo atual; manter a automação futura como recomendação.

### 4. Segurança e performance

- Tratar validações do cliente e ocultação de ações como experiência, nunca como autorização real.
- Não expor segredos, confiar em IDs/roles do navegador, inserir HTML não confiável ou registrar tokens/dados clínicos.
- Revisar ciclo de vida de subscriptions, concorrência de requisições, tratamento de erro, renderizações de listas, `trackBy`/`track`, carregamento de módulos e tamanho de bundles conforme o caso.
- Reutilizar utilitários Bootstrap e estilos locais; reduzir duplicação sem alterar a aparência aprovada.
- Registrar controles que devem existir no backend, como autorização, isolamento por clínica, validação financeira, auditoria, idempotência e limites de consulta, sem modificar o backend.

## Implementar de forma incremental

1. Criar o menor recorte vertical utilizável: rota/navegação, tela, estado, serviço e feedback.
2. Reutilizar padrões visuais observados no sistema e preservar português do domínio.
3. Cobrir acessibilidade semântica: `label`, nomes acessíveis, foco, ordem de tabulação, contraste e anúncios de erro.
4. Manter valores monetários e percentuais como números no domínio. Formatar somente na entrada/saída e documentar se percentual usa `10`, `0.10` ou outra escala.
5. Evitar alterações globais de CSS para resolver um caso local. Se um padrão for realmente compartilhado, centralizá-lo com contrato e revisar regressões nas telas consumidoras.
6. Não instalar dependências se Angular, RxJS, Bootstrap ou bibliotecas já presentes resolverem o problema com clareza.

## Verificar antes de concluir

1. Revisar o diff para escopo, duplicação, tipos frágeis, estados esquecidos e mudanças visuais acidentais.
2. Executar `npm run build` e testes direcionados aplicáveis.
3. Quando a aplicação puder ser executada, validar no navegador o caminho principal, largura desktop e móvel, estados alternativos e ausência de erros de console/rede relevantes.
4. Repassar cada item relevante de [four-lens-checklists.md](references/four-lens-checklists.md).
5. Não declarar como validado o que não foi executado. Informar claramente limitações e riscos residuais.

## Entregar um resumo integrado

Relatar de forma concisa:

- solução e alternativa visual adotada;
- validações executadas e não executadas;
- decisão de arquitetura/reutilização;
- achados ou proteções de segurança/performance;
- até três oportunidades futuras de IA realmente úteis;
- recomendações que pertencem exclusivamente ao backend;
- riscos ou próximos passos, se houver.
