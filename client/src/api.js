const BASE = '/api';

async function request(path, options) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  feed: () => request('/feed'),
  matches: () => request('/matches'),
  swipe: (profileId, direction) =>
    request('/swipe', { method: 'POST', body: JSON.stringify({ profileId, direction }) }),
  reset: () => request('/reset', { method: 'POST' }),
};
