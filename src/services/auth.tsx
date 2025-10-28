// src/services/auth.ts
import { api } from './api';
import { encode as btoa } from 'base-64';

export type LoginResponse = {
  token: string;
  user: { id: string | number; email: string; username?: string; name?: string };
};

function makeMockToken(email: string) {
  return `mock.${btoa(`${email}:${Date.now()}`)}`;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const { data: users } = await api.get<
    Array<{ id: string | number; email: string; password: string; username?: string; name?: string }>
  >('/users', { params: { email, password } });

  if (!users || users.length === 0) throw new Error('E-posta veya şifre hatalı');

  const u = users[0];
  return {
    token: makeMockToken(u.email),
    user: { id: u.id, email: u.email, username: u.username, name: u.name },
  };
}
