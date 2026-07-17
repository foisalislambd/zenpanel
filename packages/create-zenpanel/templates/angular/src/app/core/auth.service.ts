import { Injectable, signal } from '@angular/core';
import { previewLogin, type PublicAdmin } from '@/app/lib/admin-api';

const STORAGE_KEY = 'zenpanel-preview-admin';

function readStoredAdmin(): PublicAdmin | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PublicAdmin;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly admin = signal<PublicAdmin | null>(readStoredAdmin());

  async login(username?: string): Promise<void> {
    const res = await previewLogin(username);
    this.admin.set(res.admin);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(res.admin));
    } catch {
      // ignore
    }
  }

  logout(): void {
    this.admin.set(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
