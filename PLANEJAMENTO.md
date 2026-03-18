# Planejamento de Execução

## Estratégia
Entrega incremental orientada por TDD, com commits semânticos a cada bloco fechado.

## Fase 1 - Fundação Técnica
Objetivo: deixar a base preparada para desenvolvimento rápido e seguro.

Entregas:
- Estrutura inicial do app
- Ferramentas de qualidade
- Providers globais (React Query, i18n, tema)
- Mock de API funcional com MSW

Critério de saída:
- App inicia sem erros
- Ambiente de testes executa com sucesso
- Endpoints simulados respondem para lojas e produtos

## Fase 2 - Fluxo de Lojas (TDD)
Objetivo: disponibilizar CRUD completo de lojas com busca.

Ciclos TDD:
1. Escrever teste de comportamento
2. Implementar o mínimo para passar
3. Refatorar componentes e hooks
4. Commit semântico

Critério de saída:
- CRUD de lojas operacional
- Testes de fluxos principais verdes

## Fase 3 - Fluxo de Produtos (TDD)
Objetivo: disponibilizar CRUD de produtos por loja com busca.

Ciclos TDD idênticos à fase anterior.

Critério de saída:
- CRUD de produtos por loja operacional
- Navegação entre lojas e produtos consistente

## Fase 4 - UX, Animações e Internacionalização
Objetivo: elevar experiência visual e usabilidade.

Entregas:
- Animações fluidas de listas e transições
- Feedback visual de ação (loading/sucesso/erro)
- Traduções completas PT/EN/ES em telas e mensagens

Critério de saída:
- Experiência consistente e fluida
- Mudança de idioma funcionando em tempo real

## Fase 5 - Fechamento
Objetivo: preparar entrega final.

Entregas:
- README completo (setup, execução, testes, decisões)
- Revisão final de código
- Verificação de lint e testes

Critério de saída:
- Projeto pronto para avaliação técnica
