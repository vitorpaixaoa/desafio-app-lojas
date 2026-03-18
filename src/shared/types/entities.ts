export type StoreAddress = {
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
};

export type Store = {
  id: string;
  name: string;
  address: StoreAddress;
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
