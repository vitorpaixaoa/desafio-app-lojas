import { Product, Store } from '@/shared/types/entities';

const now = new Date().toISOString();

const initialStores: Store[] = [
  {
    id: 'store-1',
    name: 'Loja Centro',
    address: {
      zipCode: '65010120',
      street: 'Rua do Comércio',
      number: '120',
      neighborhood: 'Centro',
      city: 'São Luís',
      state: 'MA',
      complement: 'Térreo',
    },
    createdAt: now,
  },
  {
    id: 'store-2',
    name: 'Loja Norte',
    address: {
      zipCode: '65055010',
      street: 'Av. das Flores',
      number: '900',
      neighborhood: 'Cohama',
      city: 'São Luís',
      state: 'MA',
      complement: 'Loja B',
    },
    createdAt: now,
  },
];

const initialProducts: Product[] = [
  {
    id: 'product-1',
    storeId: 'store-1',
    name: 'Camiseta Básica',
    category: 'Vestuário',
    price: 59.9,
    createdAt: now,
  },
  {
    id: 'product-2',
    storeId: 'store-1',
    name: 'Tênis Casual',
    category: 'Calçados',
    price: 299.9,
    createdAt: now,
  },
  {
    id: 'product-3',
    storeId: 'store-2',
    name: 'Mochila Urbana',
    category: 'Acessórios',
    price: 189.0,
    createdAt: now,
  },
];

export let storesDb: Store[] = [...initialStores];
export let productsDb: Product[] = [...initialProducts];

export function resetMockDb() {
  storesDb = [...initialStores];
  productsDb = [...initialProducts];
}
