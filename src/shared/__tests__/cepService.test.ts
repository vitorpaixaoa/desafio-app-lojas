import { describe, expect, it, jest } from '@jest/globals';

import { lookupCep } from '@/shared/services/cepService';

describe('lookupCep', () => {
  it('consulta CEP e retorna dados normalizados', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cep: '01001-000',
          logradouro: 'Praça da Sé',
          bairro: 'Sé',
          localidade: 'São Paulo',
          uf: 'SP',
        }),
      } as Response);

    const result = await lookupCep('01001000');

    expect(result).toEqual({
      zipCode: '01001000',
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
    });

    fetchMock.mockRestore();
  });

  it('lança erro quando CEP não existe', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ erro: true }),
      } as Response);

    await expect(lookupCep('00000000')).rejects.toThrow('CEP não encontrado');

    fetchMock.mockRestore();
  });
});
