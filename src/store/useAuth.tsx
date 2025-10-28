import { create } from 'zustand';
import { loginRequest } from '../services/auth';
import { setAuthToken } from '../services/api';

export type User = { id?: string | number; email: string; username?: string; name?: string ;} | null;

const SESSION_TTL_SEC = 15 * 60; // 15 dk

export type AuthState = {
  isHydrated: boolean;
  token: string | null;
  user: User;
  expiresAt: number | null;
  otpVerified : boolean;

  loginWithCredentials: (email: string, password: string) => Promise<User>;
  setSession: (payload: { token: string; user: NonNullable<User>; expiresInSec?: number }) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  isHydrated: true,
  token: null,
  user: null,
  expiresAt: null,
  otpVerified: false,

  async loginWithCredentials(email, password) {
    const res = await loginRequest(email, password);

    // axios’a Bearer tak
    setAuthToken(res.token);

    // Dahili TTL (sabit) — istersen 0 yapıp kaldır
    const exp = SESSION_TTL_SEC > 0 ? Date.now() + SESSION_TTL_SEC * 1000 : null;

    set({token: res.token , user: res.user, expiresAt: exp });

    return res.user;
  },

  setSession({ token, user, expiresInSec }) {
    setAuthToken(token);
    const ttl = typeof expiresInSec === 'number' ? expiresInSec : SESSION_TTL_SEC;
    const exp = ttl > 0 ? Date.now() + ttl * 1000 : null;
    set({ token, user, expiresAt: exp , otpVerified:true});
  },

  logout() {
    setAuthToken(null);
    set({ token: null, user: null, expiresAt: null , otpVerified: false });
  },
}));
