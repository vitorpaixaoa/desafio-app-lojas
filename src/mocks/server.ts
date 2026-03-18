import { setupServer } from 'msw/native';

import { handlers } from '@/mocks/handlers';

export const server = setupServer(...handlers);

let started = false;

export function ensureMocksStarted() {
  if (started) {
    return;
  }

  server.listen({ onUnhandledRequest: 'bypass' });
  started = true;
}
