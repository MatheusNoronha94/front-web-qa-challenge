# Front Web QA Challenge

Suíte de automação Front Web com **Playwright + TypeScript** para o [PlayLab — Playwright Practice Arena](https://playwrightlab.github.io/), desenvolvida como case técnico de Engenharia de Qualidade.

## Descrição da solução

A suíte cobre a jornada de gerenciamento de usuários, o formulário de cadastro, um componente assíncrono, uma análise de acessibilidade e a integração com uma API externa simulada, rodando em Chromium, Firefox e mobile. Os testes rodam na pipeline do GitHub Actions a cada push, com relatório HTML, screenshots, vídeos e traces das falhas.

Antes do código, a aplicação foi explorada manualmente para mapear riscos. Dessa exploração saíram **8 defeitos** que não estavam no enunciado. A análise está em:

- [`docs/estrategia-de-testes.md`](docs/estrategia-de-testes.md): riscos, escopo, priorização e próximos passos
- [`docs/matriz-de-cenarios.md`](docs/matriz-de-cenarios.md): todos os cenários avaliados, o que foi ou não automatizado e por quê, e os defeitos encontrados

## Aplicação utilizada

https://playwrightlab.github.io/ (aplicação pública de prática, com dados em memória)

## Escopo implementado

| Teste | O que valida | Tags |
|---|---|---|
| USR-01 | Tabela carrega com os 7 cabeçalhos, 5 linhas e "Showing 1-5 of 15 entries" | `@usuarios` `@mobile` |
| USR-03 | Busca parcial e sem diferenciar maiúsculas encontra só o usuário certo, com nome, e-mail e status | `@usuarios` `@mobile` |
| USR-04 | Busca inexistente deixa a tabela vazia e o total zerado (defeito DEF-01 anotado) | `@usuarios` `@mobile` |
| USR-05 | Ordenação por nome em A-Z e Z-A, comparando com a ordem calculada | `@usuarios` |
| USR-08 | Exclusão de usuário: linha some, total cai em 1 e a busca não encontra mais o usuário (defeito DEF-02 anotado) | `@usuarios` `@mobile` |
| FRM-01 | Cadastro com dados válidos gerados a cada execução | `@formulario` `@mobile` |
| FRM-02/03 | Mensagens de erro de cada campo obrigatório e de e-mail inválido | `@formulario` |
| DYN-01 | Dropdown assíncrono: travado, carregando, liberado e opção selecionada | `@dinamico` |
| A11Y-06 | Análise axe (WCAG 2 A/AA) do formulário (defeito DEF-08 anotado) | `@acessibilidade` |
| NET-01 | Com a API externa interceptada, o site exibe exatamente os 2 usuários simulados ("200 OK — 2 users") | `@rede` |
| NET-02 | Com a API externa respondendo erro 500, o site avisa o erro, não exibe dados e o botão continua utilizável | `@rede` |

Cobertura obrigatória do case: jornada de usuários ✅ · formulário ✅ · assíncrono ✅ · cenário negativo ✅ (USR-04, FRM-02/03, NET-02) · acessibilidade ✅ · mobile ✅ · pipeline ✅ · relatório e evidências ✅

## Stack utilizada

- **Node.js** (LTS)
- **TypeScript**
- **Playwright Test**
- **@axe-core/playwright**, para a análise de acessibilidade
- **GitHub Actions**, para a pipeline

## Pré-requisitos

- Node.js LTS (testado com a versão 26)
- Git

## Instalação

```bash
git clone https://github.com/MatheusNoronha94/front-web-qa-challenge.git
cd front-web-qa-challenge
npm ci
npx playwright install
```

## Execução

```bash
# todos os testes, em todos os projetos
npx playwright test

# um arquivo
npx playwright test usuarios

# um grupo de testes, por tag
npx playwright test --grep @formulario

# modo visual, para acompanhar e depurar
npx playwright test --ui
```

### Execução por navegador

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Execução mobile

```bash
npx playwright test --project=mobile
```

O projeto `mobile` roda apenas os testes marcados com `@mobile`.

### Relatório

```bash
npx playwright show-report
```

O relatório HTML é gerado em `playwright-report/`. Em caso de falha, screenshot, vídeo e trace ficam em `test-results/` e podem ser abertos pelo próprio relatório (botão **View Trace**).

### Pipeline

O workflow [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) roda:

- **automaticamente** a cada push e pull request na `main`
- **manualmente**, pela aba *Actions* › *Playwright Tests* › *Run workflow*, escolhendo o navegador e o grupo de testes

Cada navegador roda em um job paralelo (matriz). O relatório e as evidências de cada um ficam em **Artifacts** na página da execução, inclusive quando algum teste falha.

## Arquitetura do projeto

```text
front-web-qa-challenge/
├── .github/workflows/playwright.yml   # pipeline
├── docs/
│   ├── estrategia-de-testes.md
│   └── matriz-de-cenarios.md
├── src/
│   ├── data/                          # dados de teste
│   │   ├── registration.ts            # fábrica de usuários para o cadastro
│   │   └── users.ts                   # massa conhecida da tabela
│   └── pages/                         # Page Objects (seletores e ações)
│       ├── DelayedDropdown.ts
│       ├── FetchUsersCard.ts
│       ├── RegistrationPage.ts
│       └── UsersPage.ts
├── tests/
│   ├── accessibility/acessibilidade.spec.ts
│   ├── dynamic/dropdown-assincrono.spec.ts
│   ├── forms/cadastro.spec.ts
│   ├── network/api-usuarios.spec.ts
│   └── users/usuarios.spec.ts
├── playwright.config.ts               # configuração centralizada
└── tsconfig.json
```

- **Page Objects** guardam seletores e ações. Não têm asserções.
- **Testes** ficam com as asserções, para que a intenção fique visível sem abrir outro arquivo.
- **`playwright.config.ts`** centraliza URL base, timeouts, navegadores, retries, workers e evidências.

## Estratégia de seletores

Ordem de preferência:

1. `getByRole` e `getByLabel`, que refletem o que o usuário vê e também validam a acessibilidade de forma indireta (se o campo perder o label, o seletor deixa de encontrá-lo)
2. `getByPlaceholder`, só onde não há label (busca da tabela, ver DEF-03)
3. `getByTestId`, quando há ambiguidade: a página tem três tabelas e dois campos "Full Name" (cadastro e checkout), então os seletores são limitados ao componente certo (`registration-form`, `data-table`)

Sem XPath e sem seletor por posição. Para ler uma coluna da tabela, o `UsersPage.columnCells()` encontra o índice **pelo nome do cabeçalho**, então o teste continua funcionando se as colunas mudarem de lugar.

## Estratégia de sincronização

Nenhum `waitForTimeout`. O teste sempre espera uma condição que o usuário também perceberia:

- `expect(...).toBeVisible()`, `toBeHidden()`, `toBeEnabled()`, `toHaveCount()` e `toHaveText()` repetem a verificação até passar ou estourar o timeout (5s)
- No dropdown assíncrono, o teste espera o "Loading options..." **sumir** e o select **habilitar**, em vez de esperar 2 segundos
- Depois de mudar para 15 itens por página, o `toHaveCount` garante que a tabela já foi redesenhada antes de ler os nomes
- No NET-01, o teste espera o **evento** de resposta da API (`waitForResponse`), criado antes do clique para não perder a resposta

**Controle de flakiness:** retries só na pipeline (2), e o relatório marca como *flaky* qualquer teste que passou só na repetição, então a instabilidade aparece em vez de ficar escondida. Localmente não há retry, para que as falhas apareçam de cara.

## Estratégia de dados de teste

- **Tabela:** massa conhecida em `src/data/users.ts`. A aplicação mantém os dados em memória e volta ao estado original a cada carregamento, então cada teste começa com os mesmos 15 usuários. O USR-05 lê o total exibido no rodapé em vez de fixar 15.
- **Formulário:** a fábrica `buildValidUser()` monta nomes e sobrenomes sorteados e um e-mail único (`nome.sobrenome.<timestamp>@exemplo.com`, domínio fictício). Os dados usados ficam anexados ao relatório (`dados-do-cadastro`), para que uma falha possa ser reproduzida.
- **Cenário negativo:** reaproveita a fábrica e troca só o campo inválido (`{ ...buildValidUser(), email: 'teste@' }`), assim a falha é atribuída a um único campo.
- **API externa:** os testes de rede usam respostas próprias via `page.route`, então não dependem do conteúdo nem da disponibilidade do jsonplaceholder.
- Nenhuma senha, token ou dado real no repositório.

## Decisões técnicas

| Decisão | Ganho | Custo | Motivo |
|---|---|---|---|
| 11 testes cobrindo vários cenários cada | Qualidade e foco nos riscos | Menos cenários isolados | O case valoriza relevância, não quantidade |
| Mobile só em parte dos testes | Execução rápida | Ordenação e validações não rodam no mobile | O risco no mobile é de layout, não de regra |
| Chromium + Firefox (sem WebKit) | Pipeline leve | Safari não coberto | Os dois motores mais usados; WebKit fica como próximo passo |
| Defeito conhecido como anotação, não como falha | Suíte verde e confiável | Exige lembrar de endurecer a asserção depois da correção | Teste vermelho permanente acostuma o time a ignorar falhas |
| Axe ignorando a regra `color-contrast` | Teste ainda pega problemas novos de outras regras | Contraste novo no formulário não seria detectado | Contraste já mapeado no DEF-08; relatório completo anexado |
| Workers limitados a 2 na pipeline | Não sobrecarrega uma aplicação pública | Suíte um pouco mais lenta | Restrição do case |
| API externa simulada com `page.route` | Teste estável e capaz de simular erro 500 | Não detecta mudanças no contrato real da API | A API é de terceiro; o objetivo é validar como o site trata a resposta |
| Listas próprias de nomes em vez do Faker | Sem dependência extra | Menos variedade | Poucos campos a gerar |

## Acessibilidade

O A11Y-06 roda o axe com as regras WCAG 2 A e AA no formulário de cadastro. Todos os campos, caixas de seleção e o botão de mostrar senha têm nome acessível. O axe encontrou **contraste insuficiente** (DEF-08) no contador da Bio (2,56:1) e no botão Register (4,46:1), registrado como defeito conhecido.

**Limitações da análise automatizada:** ferramentas como o axe detectam apenas parte dos problemas. Ainda exigem validação manual:

- ordem de foco e navegação completa por teclado
- se os nomes e mensagens fazem sentido (o axe confere se existem, não se são claros)
- uso real com leitor de tela (NVDA, VoiceOver)
- tema escuro, que não foi analisado
- os controles da tabela (DEF-03, DEF-04 e DEF-05), registrados a partir da análise do HTML

## Responsividade

O projeto `mobile` usa o perfil do **Pixel 7 (412x915)**: está abaixo do breakpoint mobile da aplicação (480px), então os testes rodam no layout de celular, e representa a largura média dos smartphones mais comuns. Roda no Chromium, o mesmo motor do desktop, sem instalar outro navegador na pipeline.

## Limitações conhecidas

- O USR-05 confere a ordenação até 15 registros (o máximo por página). Com mais usuários, seria preciso juntar todas as páginas.
- Massa de dados fixa porque a aplicação não tem backend. Em um sistema real, os dados seriam criados via API antes do teste.
- Os testes de rede validam o tratamento das respostas, não o contrato real da API; a mensagem de erro do NET-02 é validada por padrão de texto, e não pelo texto exato.
- Os testes rodam no tema claro.

## Uso de Inteligência Artificial

**Ferramenta:** Claude (Anthropic), em conversa ao longo do desenvolvimento.

**Em quais atividades foi usado:**
- configuração do ambiente na máquina (Node, Git, VS Code, Playwright)
- explicação de conceitos do case e de boas práticas
- sugestão da estrutura da matriz de cenários e da seleção inicial de testes
- geração do código base dos Page Objects, testes, configuração e pipeline, a partir dos cenários e decisões que defini; cada trecho foi explicado antes de entrar no projeto, e eu montei a estrutura, executei, depurei falhas e ajustei o código até passar localmente e na pipeline
- rascunho deste README e da estratégia de testes

**O que foi decidido por mim:**
- exploração da aplicação e identificação dos defeitos DEF-01, DEF-02, DEF-06 e DEF-07
- ampliar o escopo além das duas seções sugeridas inicialmente, e deixar a Loja de fora por custo x prazo
- rodar o USR-04 também no mobile, porque o estado vazio pode renderizar diferente
- incluir a pré-condição no USR-05 (a lista já começa ordenada)
- não fixar o número 15 no USR-05 e ler o total exibido na tela
- usar nomes e sobrenomes sorteados no cadastro
- quais testes rodam no mobile
- incluir o teste de exclusão de usuário (USR-08) para completar a jornada da tabela
- incluir os testes de API e verificar o comportamento real da seção antes de automatizar; com isso, o NET-01 passou a validar a quantidade exibida no status ("2 users")
- revisão e reescrita das mensagens de commit

**Como o conteúdo foi revisado e validado:** cada teste foi executado localmente antes do commit, nos navegadores e resoluções configurados para ele, e a pipeline foi conferida após cada push. O código foi lido trecho a trecho antes de ser incluído.

**Erros e limitações identificados na IA:**
- afirmou que o `.gitignore` não tinha sido criado, mas ele já existia
- a sugestão inicial de ordenação fixava a quantidade de 15 usuários; troquei pela leitura do total exibido
- a sugestão de mobile do USR-04 era só desktop; incluí o mobile

**O que foi alterado manualmente:** além das decisões listadas acima, a montagem do projeto (criação das pastas e arquivos e integração de cada trecho no lugar certo), as correções até os testes passarem localmente e na pipeline (estrutura de pastas, imports e um teste duplicado), a formatação do código e as mensagens de commit.

## Próximos passos

1. Simular lentidão da API externa e deixar mais exata a asserção da mensagem de erro do NET-02
2. Navegação entre páginas (USR-06)
3. Navegação por teclado e armadilha de foco em modal (FRM-08, A11Y-07)
4. No axe, ignorar só os elementos do DEF-08, e não a regra inteira
5. WebKit e resolução de 360px
6. Execução agendada diária e atualização das actions para versões com Node 24
7. Fixture customizada para instanciar os Page Objects
8. Teste visual seletivo em componentes estáveis
