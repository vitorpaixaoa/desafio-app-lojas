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

import { StoreListScreen } from "@/features/stores/ui/StoreListScreen";
import { resetMockDb } from "@/mocks/data";
import { server } from "@/mocks/server";
import { TestProviders } from "@/test/TestProviders";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe("StoreListScreen", () => {
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

  it("renderiza lojas carregadas da API", async () => {
    render(
      <TestProviders>
        <StoreListScreen />
      </TestProviders>,
    );

    await waitFor(() => {
      expect(screen.getByText("Loja Centro")).toBeTruthy();
      expect(screen.getByText("Loja Norte")).toBeTruthy();
    });
  });

  it("filtra lojas por termo de busca", async () => {
    render(
      <TestProviders>
        <StoreListScreen />
      </TestProviders>,
    );

    const input = await screen.findByPlaceholderText("Buscar lojas");

    fireEvent.changeText(input, "Centro");

    await waitFor(() => {
      expect(screen.getByText("Loja Centro")).toBeTruthy();
      expect(screen.queryByText("Loja Norte")).toBeNull();
    });
  });
});
