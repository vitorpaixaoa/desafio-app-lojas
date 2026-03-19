import { normalizeZipCode } from "@/shared/utils/address";

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export type CepLookupResult = {
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

export async function lookupCep(cep: string): Promise<CepLookupResult> {
  const normalized = normalizeZipCode(cep);

  if (normalized.length !== 8) {
    throw new Error("CEP inválido");
  }

  const response = await fetch(`https://viacep.com.br/ws/${normalized}/json/`);

  if (!response.ok) {
    throw new Error("Falha ao consultar CEP");
  }

  const data = (await response.json()) as ViaCepResponse;

  if (data.erro) {
    throw new Error("CEP não encontrado");
  }

  return {
    zipCode: normalized,
    street: data.logradouro?.trim() || "",
    neighborhood: data.bairro?.trim() || "",
    city: data.localidade?.trim() || "",
    state: data.uf?.trim() || "",
  };
}
