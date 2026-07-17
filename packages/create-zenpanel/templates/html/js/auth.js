const STORAGE_KEY = "zenpanel-preview-admin";

export function getAdmin() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function login(username = "admin") {
  const admin = {
    username,
    email: `${username}@zenpanel.dev`,
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
  } catch {
    // Private mode / quota — in-memory redirect still works for this page load.
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
