# Desafio App Lojas (React Native + Expo)

Aplicativo mobile para gestão de lojas e produtos, com foco em substituir controle manual em planilhas por uma experiência fluida, tipada e testável.

## Stack
- Expo SDK 55
- React 19 + React Native 0.83
- TypeScript
- Expo Router
- Gluestack UI
- React Query
- Zustand
- MSW (mock de API)
- i18next (PT/EN/ES)
- Jest + Testing Library
- Moti (animações)

## Funcionalidades
- CRUD de lojas
- Busca/filtro de lojas
- Contagem de produtos por loja
- CRUD de produtos por loja
- Busca/filtro de produtos
- Traduções em tempo real (PT/EN/ES)
- UI com animações de entrada de cards e feedback visual

## Arquitetura
- `app/`: rotas com Expo Router
- `src/features/stores`: domínio de lojas (api, hooks, ui, testes)
- `src/features/products`: domínio de produtos (api, hooks, ui, testes)
- `src/shared`: infraestrutura compartilhada (i18n, estado global, ui, tipos, cliente HTTP)
- `src/mocks`: handlers e servidor MSW com endpoints `/stores` e `/products`

## Requisitos
- Node.js 22+
- npm 10+

Versões usadas nesta implementação:
- Node: `v22.22.0`
- npm: `10.9.4`
- Expo CLI: `55.0.17`

## Instalação
```bash
npm install
```

## Execução
```bash
npm run start
```

Atalhos:
```bash
npm run android
npm run ios
npm run web
```

## Mock de Back-end
A API mockada com MSW é inicializada automaticamente em modo de desenvolvimento na subida do app.

Endpoints simulados:
- `GET/POST/PUT/DELETE /stores`
- `GET/POST/PUT/DELETE /products`

## Testes e Qualidade
Executar testes:
```bash
npm run test
```

Typecheck:
```bash
npm run typecheck
```

Lint:
```bash
npm run lint
```

## Fluxo de desenvolvimento
O desenvolvimento foi conduzido em ciclos TDD:
1. escrever testes
2. validar falha
3. implementar o mínimo para passar
4. refatorar e commitar semanticamente
