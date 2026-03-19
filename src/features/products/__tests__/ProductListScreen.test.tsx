import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from "@jest/globals";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

import { ProductListScreen } from "@/features/products/ui/ProductListScreen";
import { resetMockDb } from "@/mocks/data";
import { server } from "@/mocks/server";
import { TestProviders } from "@/test/TestProviders";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe("ProductListScreen", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockDb();
  });

  afterAll(() => {
    server.close();
  });

  it("renderiza produtos da loja selecionada", async () => {
    render(
      <TestProviders>
        <ProductListScreen storeId="store-1" />
      </TestProviders>,
    );

    await waitFor(() => {
      expect(screen.getByText("Camiseta Básica")).toBeTruthy();
      expect(screen.getByText("Tênis Casual")).toBeTruthy();
    });
  });

  it("filtra produtos por busca", async () => {
    render(
      <TestProviders>
        <ProductListScreen storeId="store-1" />
      </TestProviders>,
    );

    const input = await screen.findByPlaceholderText("Buscar produtos");

    fireEvent.changeText(input, "Tênis");

    await waitFor(() => {
      expect(screen.getByText("Tênis Casual")).toBeTruthy();
      expect(screen.queryByText("Camiseta Básica")).toBeNull();
    });
  });
});
