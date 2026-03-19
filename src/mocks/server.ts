type ServerLike = {
  listen: (options?: unknown) => void;
  close: () => void;
  resetHandlers: (...nextHandlers: unknown[]) => void;
};

const noopServer: ServerLike = {
  listen: () => {},
  close: () => {},
  resetHandlers: () => {},
};

let serverInstance: ServerLike | null = null;
let started = false;

function createServerInstance(): ServerLike {
  if (serverInstance) {
    return serverInstance;
  }

  try {
    if (!(globalThis as { MessageEvent?: unknown }).MessageEvent) {
      (globalThis as { MessageEvent?: unknown }).MessageEvent = class {};
    }

    const { setupServer } = require("msw/native");
    const { handlers } = require("./handlers");
    serverInstance = setupServer(...handlers);
  } catch {
    serverInstance = noopServer;
  }

  return serverInstance ?? noopServer;
}

export const server: ServerLike = {
  listen: (options?: unknown) => {
    createServerInstance().listen(options);
  },
  close: () => {
    createServerInstance().close();
  },
  resetHandlers: (...nextHandlers: unknown[]) => {
    createServerInstance().resetHandlers(...nextHandlers);
  },
};

export function ensureMocksStarted() {
  if (started) {
    return;
  }

  createServerInstance().listen({ onUnhandledRequest: "bypass" });
  started = true;
}
