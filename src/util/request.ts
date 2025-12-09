// Simple request helper using fetch
export async function request(
  config: { method: string; url: string },
  data?: any
) {
  // Get token from localStorage or cookies
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token') || '';
    if (!token) {
      const match = document.cookie.match(/access_token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  const options: RequestInit = {
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  };
  const res = await fetch(config.url, options);
  if (!res.ok) throw new Error('Request failed');
  return await res.json();
}
