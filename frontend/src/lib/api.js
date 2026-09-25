const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function saveSession({ token, user }) {
  localStorage.setItem('safetravels.token', token);
  localStorage.setItem('safetravels.user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('safetravels.token');
  localStorage.removeItem('safetravels.user');
}

export function readSession() {
  const token = localStorage.getItem('safetravels.token');
  try { return token ? { token, user: JSON.parse(localStorage.getItem('safetravels.user') || 'null') } : null; }
  catch { return token ? { token, user: null } : null; }
}

export async function api(path, options = {}) {
  const token = localStorage.getItem('safetravels.token');
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || `Request failed (${response.status})`);
  return data;
}
