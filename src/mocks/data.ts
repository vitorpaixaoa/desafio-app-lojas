import { Product, Store } from '@/shared/types/entities';

const now = new Date().toISOString();

const initialStores: Store[] = [
  {
    id: 'store-1',
    name: 'Loja Centro',
    address: 'Rua do Comércio, 120',
    createdAt: now,
  },
  {
    id: 'store-2',
    name: 'Loja Norte',
    address: 'Av. das Flores, 900',
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
