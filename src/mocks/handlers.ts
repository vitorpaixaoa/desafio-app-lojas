import { http, HttpResponse } from "msw";

import { productsDb, storesDb } from "@/mocks/data";
import { API_BASE_URL } from "@/shared/constants/api";
import { Product, Store } from "@/shared/types/entities";
import {
  getAddressSearchText,
  isValidAddress,
  normalizeZipCode,
} from "@/shared/utils/address";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const handlers = [
  http.get(`${API_BASE_URL}/stores`, ({ request }) => {
    const url = new URL(request.url);
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

    return HttpResponse.json(data);
  }),

  http.post(`${API_BASE_URL}/stores`, async ({ request }) => {
    const payload = (await request.json()) as Pick<Store, "name" | "address">;

    if (!payload.name?.trim() || !isValidAddress(payload.address)) {
      return HttpResponse.text("Nome e endereço são obrigatórios", {
        status: 400,
      });
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

    return HttpResponse.json(store, { status: 201 });
  }),

  http.put(`${API_BASE_URL}/stores/:storeId`, async ({ request, params }) => {
    const payload = (await request.json()) as Pick<Store, "name" | "address">;
    const { storeId } = params;
    const index = storesDb.findIndex((store) => store.id === storeId);

    if (index < 0) {
      return HttpResponse.text("Loja não encontrada", { status: 404 });
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
      name: payload.name?.trim() || storesDb[index].name,
      address: nextAddress,
    };

    return HttpResponse.json(storesDb[index]);
  }),

  http.delete(`${API_BASE_URL}/stores/:storeId`, ({ params }) => {
    const { storeId } = params;
    const storeIndex = storesDb.findIndex((store) => store.id === storeId);

    if (storeIndex < 0) {
      return HttpResponse.text("Loja não encontrada", { status: 404 });
    }

    storesDb.splice(storeIndex, 1);

    for (let i = productsDb.length - 1; i >= 0; i -= 1) {
      if (productsDb[i].storeId === storeId) {
        productsDb.splice(i, 1);
      }
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
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

    return HttpResponse.json(filtered);
  }),

  http.post(`${API_BASE_URL}/products`, async ({ request }) => {
    const payload = (await request.json()) as Pick<
      Product,
      "storeId" | "name" | "category" | "price"
    >;

    if (
      !payload.storeId ||
      !payload.name?.trim() ||
      !payload.category?.trim() ||
      payload.price <= 0
    ) {
      return HttpResponse.text("Dados inválidos", { status: 400 });
    }

    const storeExists = storesDb.some((store) => store.id === payload.storeId);

    if (!storeExists) {
      return HttpResponse.text("Loja não encontrada", { status: 404 });
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

    return HttpResponse.json(product, { status: 201 });
  }),

  http.put(
    `${API_BASE_URL}/products/:productId`,
    async ({ request, params }) => {
      const payload = (await request.json()) as Pick<
        Product,
        "name" | "category" | "price"
      >;
      const { productId } = params;

      const index = productsDb.findIndex((product) => product.id === productId);

      if (index < 0) {
        return HttpResponse.text("Produto não encontrado", { status: 404 });
      }

      productsDb[index] = {
        ...productsDb[index],
        name: payload.name?.trim() || productsDb[index].name,
        category: payload.category?.trim() || productsDb[index].category,
        price:
          payload.price && payload.price > 0
            ? payload.price
            : productsDb[index].price,
      };

      return HttpResponse.json(productsDb[index]);
    },
  ),

  http.delete(`${API_BASE_URL}/products/:productId`, ({ params }) => {
    const { productId } = params;
    const index = productsDb.findIndex((product) => product.id === productId);

    if (index < 0) {
      return HttpResponse.text("Produto não encontrado", { status: 404 });
    }

    productsDb.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
