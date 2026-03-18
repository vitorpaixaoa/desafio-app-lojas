# Diretrizes de Desenvolvimento

## 1. Objetivo do Produto
Construir um aplicativo móvel multiplataforma (Android/iOS) para gestão de lojas e seus produtos, substituindo controles manuais em planilhas.

## 2. Escopo Funcional (MVP)
- Módulo de Lojas:
  - Listar lojas com nome, endereço e quantidade de produtos.
  - Cadastrar loja (nome e endereço obrigatórios).
  - Editar loja.
  - Excluir loja.
- Módulo de Produtos:
  - Listar produtos vinculados à loja selecionada.
  - Cadastrar produto (nome, categoria, preço).
  - Editar produto.
  - Excluir produto.

## 3. Requisitos Técnicos
- Expo SDK 54+
- React Native + TypeScript
- Navegação com Expo Router
- React Query para estado assíncrono e cache de dados
- Zustand para estado global de preferência (idioma)
- Mock de API com MSW, com endpoints:
  - `GET/POST/PUT/DELETE /stores`
  - `GET/POST/PUT/DELETE /products`
- Internacionalização com suporte completo a:
  - Português (pt-BR)
  - Inglês (en)
  - Espanhol (es)

## 4. Arquitetura
- Organização por feature:
  - `src/features/stores`
  - `src/features/products`
- Camadas por responsabilidade:
  - `api`: contratos e chamadas HTTP
  - `domain`: tipos, validações e regras
  - `ui`: componentes e telas
  - `hooks`: lógica de consumo com React Query
- Separação de serviços compartilhados:
  - `src/shared/i18n`
  - `src/shared/theme`
  - `src/shared/state`

## 5. UX, UI e Acessibilidade
- Visual limpo, legível e consistente.
- Animações fluidas e intencionais:
  - entrada de listas
  - feedback em interações (salvar/excluir)
  - transições de navegação suaves
- Garantir contraste adequado, áreas de toque confortáveis e mensagens claras de erro/sucesso.

## 6. Qualidade e Boas Práticas
- TDD como fluxo principal:
  - escrever teste primeiro
  - ver teste falhar
  - implementar mínimo necessário
  - refatorar mantendo teste verde
- Tipagem forte para entidades, payloads e respostas de API.
- Componentes reutilizáveis e focados em responsabilidade única.

## 7. Definição de Pronto
Um item só é considerado concluído quando:
- comportamento implementado
- testes cobrindo cenário principal e casos críticos
- lint sem erros
- commit semântico em pt-BR realizado
- documentação atualizada quando necessário

## 8. Convenção de Commits
Padrão de commits semânticos em português:
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `test:` inclusão/ajuste de testes
- `refactor:` melhoria interna sem alterar regra de negócio
- `docs:` atualização de documentação
- `chore:` tarefas de infraestrutura/configuração
