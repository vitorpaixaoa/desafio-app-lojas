import { productsDb, storesDb } from "@/mocks/data";
import { Product, Store } from "@/shared/types/entities";
import {
  getAddressSearchText,
  isValidAddress,
  normalizeZipCode,
} from "@/shared/utils/address";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

type RuntimeResponse = {
  status: number;
  data?: unknown;
  message?: string;
};

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function parsePath(path: string) {
  return new URL(path, "http://local");
}

export function runtimeRequest(
  method: RequestMethod,
  path: string,
  body?: unknown,
): RuntimeResponse {
  const url = parsePath(path);
  const pathname = url.pathname;

  if (pathname === "/stores" && method === "GET") {
    const search = (url.searchParams.get("search") || "").toLowerCase().trim();

    const data = storesDb.filter((store) => {
      if (!search) {
        return true;
      }

      return (
        store.name.toLowerCase().includes(search) ||
        getAddressSearchText(store.address).includes(search)
      );
    });

    return { status: 200, data };
  }

  if (pathname === "/stores" && method === "POST") {
    const payload = body as Pick<Store, "name" | "address">;

    if (!payload?.name?.trim() || !isValidAddress(payload?.address)) {
      return { status: 400, message: "Nome e endereço são obrigatórios" };
    }

    const store: Store = {
      id: uid("store"),
      name: payload.name.trim(),
      address: {
        zipCode: normalizeZipCode(payload.address.zipCode),
        street: payload.address.street.trim(),
        number: payload.address.number.trim(),
        neighborhood: payload.address.neighborhood?.trim() || "",
        city: payload.address.city.trim(),
        state: payload.address.state.trim().toUpperCase(),
        complement: payload.address.complement?.trim() || "",
      },
      createdAt: new Date().toISOString(),
    };

    storesDb.unshift(store);
    return { status: 201, data: store };
  }

  if (pathname.startsWith("/stores/") && method === "PUT") {
    const storeId = pathname.split("/")[2];
    const payload = body as Pick<Store, "name" | "address">;
    const index = storesDb.findIndex((store) => store.id === storeId);

    if (index < 0) {
      return { status: 404, message: "Loja não encontrada" };
    }

    const nextAddress = payload.address
      ? {
          zipCode: normalizeZipCode(payload.address.zipCode),
          street:
            payload.address.street?.trim() || storesDb[index].address.street,
          number:
            payload.address.number?.trim() || storesDb[index].address.number,
          neighborhood: payload.address.neighborhood?.trim() || "",
          city: payload.address.city?.trim() || storesDb[index].address.city,
          state:
            payload.address.state?.trim().toUpperCase() ||
            storesDb[index].address.state,
          complement: payload.address.complement?.trim() || "",
        }
      : storesDb[index].address;

    storesDb[index] = {
      ...storesDb[index],
      name: payload?.name?.trim() || storesDb[index].name,
      address: nextAddress,
    };

    return { status: 200, data: storesDb[index] };
  }

  if (pathname.startsWith("/stores/") && method === "DELETE") {
    const storeId = pathname.split("/")[2];
    const storeIndex = storesDb.findIndex((store) => store.id === storeId);

    if (storeIndex < 0) {
      return { status: 404, message: "Loja não encontrada" };
    }

    storesDb.splice(storeIndex, 1);

    for (let i = productsDb.length - 1; i >= 0; i -= 1) {
      if (productsDb[i].storeId === storeId) {
        productsDb.splice(i, 1);
      }
    }

    return { status: 204 };
  }

  if (pathname === "/products" && method === "GET") {
    const storeId = url.searchParams.get("storeId");
    const search = (url.searchParams.get("search") || "").toLowerCase().trim();

    const filtered = productsDb.filter((product) => {
      if (storeId && product.storeId !== storeId) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        String(product.price).includes(search)
      );
    });

    return { status: 200, data: filtered };
  }

  if (pathname === "/products" && method === "POST") {
    const payload = body as Pick<
      Product,
      "storeId" | "name" | "category" | "price"
    >;

    if (
      !payload?.storeId ||
      !payload?.name?.trim() ||
      !payload?.category?.trim() ||
      payload.price <= 0
    ) {
      return { status: 400, message: "Dados inválidos" };
    }

    const storeExists = storesDb.some((store) => store.id === payload.storeId);

    if (!storeExists) {
      return { status: 404, message: "Loja não encontrada" };
    }

    const product: Product = {
      id: uid("product"),
      storeId: payload.storeId,
      name: payload.name.trim(),
      category: payload.category.trim(),
      price: Number(payload.price),
      createdAt: new Date().toISOString(),
    };

    productsDb.unshift(product);
    return { status: 201, data: product };
  }

  if (pathname.startsWith("/products/") && method === "PUT") {
    const productId = pathname.split("/")[2];
    const payload = body as Pick<Product, "name" | "category" | "price">;
    const index = productsDb.findIndex((product) => product.id === productId);

    if (index < 0) {
      return { status: 404, message: "Produto não encontrado" };
    }

    productsDb[index] = {
      ...productsDb[index],
      name: payload?.name?.trim() || productsDb[index].name,
      category: payload?.category?.trim() || productsDb[index].category,
      price:
        payload?.price && payload.price > 0
          ? payload.price
          : productsDb[index].price,
    };

    return { status: 200, data: productsDb[index] };
  }

  if (pathname.startsWith("/products/") && method === "DELETE") {
    const productId = pathname.split("/")[2];
    const index = productsDb.findIndex((product) => product.id === productId);

    if (index < 0) {
      return { status: 404, message: "Produto não encontrado" };
    }

    productsDb.splice(index, 1);
    return { status: 204 };
  }

  return { status: 404, message: `Rota não encontrada: ${method} ${pathname}` };
}
