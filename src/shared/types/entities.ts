export type Store = {
  id: string;
  name: string;
  address: string;
  createdAt: string;
};

export type Product = {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  createdAt: string;
};

export type StoreWithProductsCount = Store & {
  productsCount: number;
};
