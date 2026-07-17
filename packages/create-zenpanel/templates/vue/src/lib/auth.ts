export type AdminSession = {
  username: string;
  email: string;
};

const STORAGE_KEY = "zenpanel-preview-admin";

export function getAdmin(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

export function login(username = "admin"): AdminSession {
  const admin: AdminSession = {
    username,
    email: `${username}@zenpanel.dev`,
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
  } catch {
    // Private mode / quota
  }
  return admin;
}

export function logout(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
