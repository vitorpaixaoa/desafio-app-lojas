import { StoreAddress } from '@/shared/types/entities';

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function formatZipCode(value: string) {
  const digits = onlyDigits(value).slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function normalizeZipCode(value: string) {
  return onlyDigits(value).slice(0, 8);
}

export function formatAddressLine(address: StoreAddress) {
  const parts = [address.street, address.number].filter(Boolean);
  const base = parts.join(', ');

  if (address.complement?.trim()) {
    return `${base} - ${address.complement.trim()}`;
  }

  return base;
}

export function formatAddressMeta(address: StoreAddress) {
  const locality = [address.neighborhood, address.city, address.state]
    .filter(Boolean)
    .join(' • ');

  return `${locality} • CEP ${formatZipCode(address.zipCode)}`;
}

export function getAddressSearchText(address: StoreAddress) {
  return [
    address.street,
    address.number,
    address.neighborhood,
    address.city,
    address.state,
    address.zipCode,
    address.complement,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function isValidAddress(address: Partial<StoreAddress>) {
  return Boolean(
    address.zipCode?.trim() &&
      normalizeZipCode(address.zipCode).length === 8 &&
      address.street?.trim() &&
      address.number?.trim() &&
      address.city?.trim() &&
      address.state?.trim(),
  );
}
