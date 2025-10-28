import { api } from './api';
import { addNotification } from './notifications';

// Tipler
export type Balance = { id: number; amount: number; currency: string };
export type Transaction = { id: number; title: string; amount: number; date: string; note?: string };

// Okuma
export async function getBalance(): Promise<Balance> {
  const { data } = await api.get('/balance');
  if (Array.isArray(data)) return data[0] as Balance;
  return data as Balance;
}

export async function getTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>('/transactions?_sort=date&_order=desc');
  return data;
}

// Yardımcı: bakiyeyi delta kadar güncelle
async function patchBalanceDelta(delta: number) {
  const bal = await getBalance();
  try {
    await api.patch('/balance', { amount: bal.amount + delta });
  } catch {
    await api.patch(`/balance/${bal.id}`, { amount: bal.amount + delta });
  }
}

// --- Transfer (negatif işlem) ---
export async function transferMoney(recipient: string, amount: number, note?: string) {
  const now = new Date().toISOString();
  await api.post('/transactions', {
    title: `Transfer: ${recipient}`,
    amount: -Math.abs(amount),
    date: now,
    note,
  });
  await patchBalanceDelta(-Math.abs(amount));

  // Bildirim
  await addNotification('Transfer gönderildi', `${recipient} kişisine ${Math.abs(amount).toLocaleString('tr-TR')} ₺`);
  return true;
}

// --- Para yükleme (pozitif işlem) ---
export async function addMoney(amount: number, note?: string) {
  const now = new Date().toISOString();
  await api.post('/transactions', {
    title: 'Para Yükleme',
    amount: Math.abs(amount),
    date: now,
    note,
  });
  await patchBalanceDelta(Math.abs(amount));

  // Bildirim
  await addNotification('Para yükleme başarılı', `${Math.abs(amount).toLocaleString('tr-TR')} ₺ eklendi`);
  return true;
}

// --- Geriye dönük uyumluluk: addTransaction(title, amount, note) ---
export async function addTransaction(title: string, amount: number, note?: string) {
  const now = new Date().toISOString();
  await api.post('/transactions', {
    title: title || (amount >= 0 ? 'Para Yükleme' : 'Transfer'),
    amount,
    date: now,
    note,
  });
  await patchBalanceDelta(amount);

  // Bildirim: title/amount'a göre anlamlı mesaj
  if (amount >= 0) {
    await addNotification('Para yükleme başarılı', `${Math.abs(amount).toLocaleString('tr-TR')} ₺ eklendi`);
  } else {
    const who = title?.startsWith('Transfer: ') ? title.replace('Transfer: ', '') : 'Alıcı';
    await addNotification('Transfer gönderildi', `${who} kişisine ${Math.abs(amount).toLocaleString('tr-TR')} ₺`);
  }
  return true;
}

// --- Kartlar (daha önce eklediğimiz API’ler) ---
export type WalletCard = {
  id: number;
  holderName: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'troy' | 'unknown';
  last4: string;
  expiry: string;      // MM/YY
  isDefault: boolean;
  color?: string;
};

export async function getCards(): Promise<WalletCard[]> {
  const { data } = await api.get<WalletCard[]>('/cards');
  return [...data].sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.id - b.id);
}

export function detectBrand(pan: string): WalletCard['brand'] {
  const n = pan.replace(/\D/g, '');
  if (/^4\d{6,}/.test(n)) return 'visa';
  if (/^(5[1-5]|2[2-7])\d{4,}/.test(n)) return 'mastercard';
  if (/^3[47]\d{5,}/.test(n)) return 'amex';
  if (/^9792\d{2,}/.test(n)) return 'troy';
  return 'unknown';
}

export async function addCard(params: { holderName: string; number: string; expiry: string; color?: string }) {
  const brand = detectBrand(params.number);
  const last4 = params.number.replace(/\D/g, '').slice(-4) || '0000';
  const payload = {
    holderName: params.holderName.trim().toUpperCase(),
    brand,
    last4,
    expiry: params.expiry.trim(),
    isDefault: false,
    color: params.color || '#1f2937',
  };
  await api.post('/cards', payload);
  return true;
}

export async function deleteCard(cardId: number) {
  await api.delete(`/cards/${cardId}`);
  return true;
}

export async function setDefaultCard(cardId: number) {
  const { data: all } = await api.get<WalletCard[]>('/cards');
  await Promise.all(
    all.map(c => (c.isDefault ? api.patch(`/cards/${c.id}`, { isDefault: false }) : Promise.resolve(null)))
  );
  await api.patch(`/cards/${cardId}`, { isDefault: true });
  return true;
}
