const STORAGE_KEY = "zenpanel-preview-admin";
const ADMIN_ACCOUNT_CREATED_AT = "2024-01-15T10:00:00.000Z";

export function getAdmin() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function login(username = "admin") {
  const name = username.trim() || "admin";
  const admin = {
    id: "admin-1",
    username: name,
    email: `${name}@example.com`,
    role: "admin",
    lastLoginAt: new Date().toISOString(),
    createdAt: ADMIN_ACCOUNT_CREATED_AT,
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
  } catch {
    // Private mode / quota
  }
  return admin;
}

export function logout() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function requireAuth() {
  if (!getAdmin()) {
    window.location.replace("/admin/login");
    return null;
  }
  return getAdmin();
}

export function requireGuest() {
  if (getAdmin()) {
    window.location.replace("/admin");
    return false;
  }
  return true;
}
