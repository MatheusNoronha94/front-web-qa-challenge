# Estratégia de Testes — Front Web

Aplicação: [PlayLab — Playwright Practice Arena](https://playwrightlab.github.io/)

## Objetivo

Criar a base da automação Front Web da aplicação, cobrindo as jornadas de maior risco com testes estáveis, legíveis e fáceis de evoluir. Esses testes devem rodar na pipeline a cada alteração e deixar evidências para diagnóstico.

## Principais jornadas identificadas

| Jornada | Seção da aplicação | Por que é relevante |
|---|---|---|
| Gerenciamento de usuários | Tables › User Management | Jornada principal de uma plataforma administrativa: localizar, filtrar, ordenar e agir sobre registros |
| Cadastro | Forms › Registration Form | Entrada de dados, com validações e mensagens de erro |
| Componentes assíncronos | Forms › Delayed Dropdown | Carregamento atrasado, que é uma causa comum de testes instáveis |
| Integração com API externa | Network & API | Dependência de um serviço de terceiro (jsonplaceholder) |

## Escopo

- Tabela de usuários: carregamento, estrutura, busca (existente e inexistente), ordenação e exclusão
- Formulário de cadastro: envio válido, obrigatórios vazios e e-mail inválido
- Dropdown com carregamento assíncrono
- Análise automatizada de acessibilidade do formulário
- Execução da jornada principal em resolução mobile
- Execução em Chromium e Firefox, local e na pipeline

## Fora de escopo

| Item | Motivo |
|---|---|
| Loja (carrinho, cupom e checkout) | Fluxo longo e com alto custo de manutenção, e fora do contexto de uma plataforma administrativa |
| Upload de arquivos | Opcional no case; o risco é menor que o das jornadas obrigatórias |
| Drag and drop, Shadow DOM, iframes, carrossel e media player | Opcionais e de menor impacto para o negócio |
| Testes de carga, segurança ou estresse | Proibidos pelo case (aplicação pública) |
| Teste visual (screenshot comparison) | Alto custo de manutenção para este momento; fica como próximo passo |

## Riscos identificados

### Funcionais
- Busca não filtrar ou retornar o registro errado
- Ordenação incorreta, o que induz o usuário a erro de leitura
- Formulário aceitar dados inválidos ou rejeitar dados válidos
- Exclusão de usuário sem confirmação (**DEF-02**)

### Técnicos
- Componentes assíncronos: o teste interagir antes de o elemento estar pronto (flakiness)
- Seletores ambíguos: a página tem **três tabelas** e **dois campos "Full Name"** (cadastro e checkout)
- Dependência de API de terceiro na seção Network & API
- Dados em memória: a tabela volta ao estado original a cada carregamento

### Experiência do usuário
- Busca sem resultados exibe "Showing 1-0 of 0 entries" e não mostra mensagem de estado vazio (**DEF-01**)
- Após um envio inválido, os erros ficam fora da área visível e o foco não vai para o campo com erro (**DEF-06**)
- Barra de rolagem clara no modal de checkout, destoando do tema escuro (**DEF-07**)

### Acessibilidade
- Controles da tabela sem nome acessível: busca, filtros e paginação (**DEF-03**, **DEF-04**)
- Ordenação por clique em `th`, sem `aria-sort` e possivelmente inacessível por teclado (**DEF-05**)
- Contraste insuficiente no formulário, no tema claro (**DEF-08**)

Os detalhes de cada defeito estão em [`matriz-de-cenarios.md`](./matriz-de-cenarios.md).

## Critérios de priorização

Cada cenário foi avaliado por **risco x valor x custo de manutenção**:

- **P0**: se quebrar, o usuário não consegue usar a funcionalidade (carregar a tabela, buscar, cadastrar)
- **P1**: comportamento importante ou validação que evita erro do usuário
- **P2**: comportamento secundário, de baixo impacto ou já coberto de outra forma

Também pesou se o cenário **valida bem pela interface**. Comportamentos nativos do navegador (`maxlength`, botão Reset) não foram automatizados, porque testariam o navegador e não a aplicação.

## Estratégia de cobertura

Foram implementados **9 testes**, e vários deles cobrem mais de um cenário da matriz:

| Teste | Cenários cobertos | Desktop | Mobile |
|---|---|:---:|:---:|
| USR-01 Carregamento e estrutura da tabela | USR-01, USR-02, RSP-02 | ✅ | ✅ |
| USR-03 Busca de usuário existente | USR-03, USR-07, RSP-02 | ✅ | ✅ |
| USR-04 Busca de usuário inexistente | USR-04 (negativo) | ✅ | ✅ |
| USR-05 Ordenação por nome | USR-05 | ✅ | |
| USR-08 Exclusão de usuário | USR-08, RSP-05 | ✅ | ✅ |
| FRM-01 Cadastro válido | FRM-01 | ✅ | ✅ |
| FRM-02/03 Mensagens de erro | FRM-02, FRM-03, FRM-06 (negativo) | ✅ | |
| DYN-01 Dropdown assíncrono | DYN-01, DYN-02, DYN-05, DYN-07 | ✅ | |
| A11Y-06 Análise axe do formulário | A11Y-06, A11Y-02, FRM-07 | ✅ | |

**Critério para o mobile:** entram os cenários em que o layout pode mudar o resultado (tabela em tela estreita, estado vazio, lixeira e botão de cadastro visíveis e clicáveis). Validações de regra (ordenação, mensagens de erro, axe) são a mesma lógica em qualquer tela e rodam só no desktop.

## Estratégia de automação

- **Page Objects** concentram seletores e ações; **asserções ficam no teste**, para a intenção ficar clara
- **Seletores** por papel e nome acessível (`getByRole`, `getByLabel`); `data-testid` quando há ambiguidade; nenhum XPath ou seletor por posição
- **Sincronização** sempre por condição observável (`expect` com auto-retry), sem `waitForTimeout`
- **Dados de teste** controlados: massa fixa para a tabela e fábrica de usuários únicos para o formulário
- **Testes independentes**: cada um abre a página do zero em um contexto isolado, e podem rodar em paralelo e em qualquer ordem
- **Defeitos conhecidos** não deixam o teste vermelho para sempre: o comportamento correto é validado e o defeito é registrado como anotação no relatório

## Navegadores e resoluções

| Projeto | Dispositivo | Viewport | Motivo |
|---|---|---|---|
| chromium | Desktop Chrome | 1280x720 | Motor mais usado (Chrome, Edge) |
| firefox | Desktop Firefox | 1280x720 | Segundo motor, com renderização e eventos diferentes |
| mobile | Pixel 7 (Chromium) | 412x915 | Abaixo do breakpoint mobile da aplicação (480px) e representa a largura média dos celulares mais comuns |

O WebKit (Safari) ficou de fora para manter a pipeline leve; é um próximo passo.

## Critérios de entrada e saída

**Entrada**
- Aplicação acessível em `https://playwrightlab.github.io`
- Dependências e navegadores instalados (`npm ci` e `npx playwright install`)

**Saída**
- Todos os testes passando em Chromium, Firefox e mobile
- Nenhum teste marcado como *flaky* no relatório
- Relatório HTML e evidências publicados na pipeline
- Defeitos encontrados registrados na matriz

## Frequência de execução

- **A cada push e pull request** na `main`: a suíte completa leva cerca de 1 minuto por navegador
- **Manual**, pelo botão *Run workflow*, escolhendo navegador e grupo de testes
- Recomendado como evolução: uma execução **diária agendada**, para detectar mudanças na aplicação mesmo sem alterações no código dos testes

## Limitações conhecidas

- **Massa fixa de dados:** a tabela tem 15 usuários em memória. O USR-05 lê o total exibido em vez de fixar o número, mas valida a ordem apenas da primeira página (até 15 registros). Em um ambiente com banco de dados real, a massa seria criada via API antes do teste.
- **Axe com regra de contraste ignorada:** por causa do DEF-08, a regra `color-contrast` está como problema conhecido. Um problema novo de contraste no formulário não seria detectado; o relatório completo do axe continua anexado.
- **Ferramenta automática de acessibilidade** cobre só parte dos critérios WCAG. Ordem de leitura, clareza dos textos e uso real com leitor de tela exigem validação manual.
- **Tema:** os testes rodam no tema claro (padrão do navegador). O tema escuro não foi validado.

## Próximos passos

1. Teste com interceptação de rede na seção Network & API (`page.route` simulando erro 500 e lentidão)
2. Navegação entre páginas (USR-06) e confirmação antes de excluir, quando o DEF-02 for corrigido
3. Navegação por teclado no formulário e armadilha de foco em modal (FRM-08, A11Y-07)
4. Ignorar no axe apenas os elementos do DEF-08, e não a regra inteira
5. WebKit e uma resolução menor (360px) na matriz de compatibilidade
6. Execução agendada diária e atualização das actions do GitHub para versões com Node 24
7. Teste visual seletivo em componentes estáveis
