# Matriz de Cenários

Aplicação: [PlayLab — Playwright Practice Arena](https://playwrightlab.github.io/)

## Critérios de prioridade

- **P0**: jornada principal; se quebrar, o usuário não consegue usar a funcionalidade.
- **P1**: comportamento importante ou validação que evita erro do usuário.
- **P2**: comportamento secundário, de baixo impacto ou já coberto de outra forma.

A decisão de automatizar considera **risco x valor x custo de manutenção**. Cenários de baixo risco, opcionais no escopo ou com alto custo de manutenção ficam para uma próxima fase.

## Cenários

| ID | Jornada | Descrição | Tipo | Risco protegido | Prioridade | Automatizar? | Justificativa | Status |
|---|---|---|---|---|---|---|---|---|
| USR-01 | Usuários | Tabela carrega com cabeçalhos, 5 linhas e "Showing 1-5 of 15" | Funcional | Tabela não renderiza ou vem incompleta | P0 | Sim | Porta de entrada da jornada principal; incorpora o USR-02 | Planejado |
| USR-02 | Usuários | Estrutura e cabeçalhos da tabela | Funcional | Coluna ausente ou renomeada | P1 | Sim | Validado dentro do USR-01, não justifica teste separado | Planejado |
| USR-03 | Usuários | Busca por usuário existente | Funcional | Usuário não consegue localizar registros | P0 | Sim | Ação mais frequente da jornada; incorpora o USR-07 | Planejado |
| USR-04 | Usuários | Busca por usuário inexistente | Negativo | Estado vazio incorreto ou confuso | P1 | Sim | Cenário negativo da jornada; expõe o defeito DEF-01 | Planejado |
| USR-05 | Usuários | Ordenação por nome | Funcional | Ordenação incorreta induz erro de leitura | P1 | Sim | Regra de negócio verificável de forma objetiva | Planejado |
| USR-06 | Usuários | Navegação entre páginas | Funcional | Registros inacessíveis | P1 | Não nesta fase | Validado manualmente; o USR-01 já valida o contador de paginação | Backlog |
| USR-07 | Usuários | Situação (status) de um usuário | Funcional | Status exibido incorretamente | P1 | Sim | Validado dentro do USR-03 | Planejado |
| USR-08 | Usuários | Excluir usuário e validar total (15 para 14) | Funcional | Ação destrutiva sem efeito ou com efeito errado | P1 | Sim, se houver tempo | Ação disponível da jornada; ver DEF-02 | Backlog |
| FRM-01 | Formulário | Cadastro com dados válidos | Funcional | Usuário não consegue se cadastrar | P0 | Sim | Caminho feliz do formulário | Planejado |
| FRM-02 | Formulário | Envio com obrigatórios vazios | Negativo | Cadastro inválido aceito | P0 | Sim | Validação essencial; incorpora o FRM-06 | Planejado |
| FRM-03 | Formulário | E-mail inválido | Negativo | Dado inválido aceito | P1 | Sim | Regra de validação com mensagem própria | Planejado |
| FRM-04 | Formulário | Limite de caracteres do nome (50) | Funcional | Overflow de dados | P2 | Não | Limite nativo do navegador (`maxlength`), baixo risco | Não automatizar |
| FRM-05 | Formulário | Botão Reset limpa o formulário | Funcional | Dados residuais | P2 | Não | Comportamento nativo do HTML, baixo risco | Não automatizar |
| FRM-06 | Formulário | Mensagens de erro de validação | Negativo | Usuário não entende o erro | P1 | Sim | Validado dentro do FRM-02 | Planejado |
| FRM-07 | Formulário | Associação entre campos e labels | Acessibilidade | Campo ilegível para leitor de tela | P1 | Sim | Coberto pela análise axe (A11Y-06) e pelos seletores `getByLabel` | Planejado |
| FRM-08 | Formulário | Operação do formulário por teclado | Acessibilidade | Usuário de teclado bloqueado | P2 | Não nesta fase | Próximo passo da cobertura de acessibilidade | Backlog |
| DYN-01 | Dinâmico | Aguardar carregamento do dropdown assíncrono | Assíncrono | Interação antes do carregamento | P1 | Sim | Cenário assíncrono principal | Planejado |
| DYN-02 | Dinâmico | Selecionar opção carregada dinamicamente | Assíncrono | Opção não selecionável | P1 | Sim | Mesmo teste do DYN-01 | Planejado |
| DYN-07 | Dinâmico | Estado de carregamento ("Loading options...") | Assíncrono | Usuário sem feedback durante a espera | P1 | Sim | Mesmo teste do DYN-01 | Planejado |
| DYN-03 | Dinâmico | Tabela com colunas que mudam de posição | Assíncrono | Leitura de dado na coluna errada | P2 | Não nesta fase | Componente de demonstração, fora da jornada principal | Backlog |
| DYN-04 | Dinâmico | Comportamento após recarregar a página | Funcional | Perda de estado | P2 | Não | Dados em memória, sem persistência esperada | Não automatizar |
| DYN-06 | Dinâmico | Múltiplos cliques no carregamento | Funcional | Requisições ou opções duplicadas | P2 | Não nesta fase | Risco baixo, validado manualmente | Backlog |
| NET-01 | Rede e API | Erro 500 simulado na busca de usuários da API externa | Integração | Tela quebrada quando a API externa falha | P2 | Sim | Isola a dependência de terceiro (jsonplaceholder) com interceptação de rede | Planejado |
| A11Y-06 | Acessibilidade | Análise automatizada (axe) no formulário | Acessibilidade | Barreiras para usuários com deficiência | P1 | Sim | Cobertura ampla e de baixo custo; cobre o A11Y-02 | Planejado |
| A11Y-01 | Acessibilidade | Nomes acessíveis dos controles da tabela | Acessibilidade | Controles sem nome para leitor de tela | P1 | Não | Falha conhecida (DEF-03, DEF-04); registrada como defeito | Defeito registrado |
| A11Y-07 | Acessibilidade | Modal sem armadilha de teclado | Acessibilidade | Usuário de teclado preso no modal | P2 | Não nesta fase | Próximo passo da cobertura de acessibilidade | Backlog |
| RSP-02 | Responsividade | Jornada da tabela em resolução mobile (Pixel 7, 412px) | Responsivo | Jornada principal inutilizável no celular | P1 | Sim | Reaproveita USR-01 e USR-03 com a tag `@mobile` | Planejado |
| RSP-04 | Responsividade | Ausência de scroll horizontal indevido | Responsivo | Layout quebrado em tela pequena | P2 | Não nesta fase | Próximo passo da cobertura mobile | Backlog |
| UPL-01 a 05 | Upload | Cenários de upload de arquivo | Funcional | Arquivo inválido aceito | P2 | Não | Opcional no escopo; priorizada a jornada principal | Não automatizar |
| SHP-01 | Loja | Checkout completo (carrinho, cupom, pagamento) | Funcional | Compra não concluída | P2 | Não | Fora do escopo de plataforma administrativa; fluxo longo com alto custo de manutenção | Próximo passo |

## Defeitos e riscos encontrados na exploração

| ID | Descrição | Tipo | Severidade |
|---|---|---|---|
| DEF-01 | Busca sem resultados exibe "Showing 1-0 of 0 entries" e nenhuma mensagem de estado vazio | Funcional / UX | Média |
| DEF-02 | Exclusão de usuário acontece sem pedido de confirmação | UX | Alta |
| DEF-03 | Campo de busca, seletor de itens por página e filtro de papéis não possuem label acessível (apenas placeholder) | Acessibilidade | Média |
| DEF-04 | Botões "anterior" e "próximo" da paginação são apenas ícones, sem nome acessível | Acessibilidade | Média |
| DEF-05 | Ordenação acionada por clique no cabeçalho (`th`), sem botão nem `aria-sort`; possível bloqueio para usuários de teclado (a confirmar manualmente) | Acessibilidade | Média |
| DEF-06 | Após envio inválido do formulário, as mensagens de erro ficam fora da área visível e o foco não é levado ao primeiro campo com erro | UX / Acessibilidade | Média |
| DEF-07 | Modal de checkout exibe barra de rolagem clara, destoando do tema escuro | Visual | Baixa |
