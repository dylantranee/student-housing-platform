// Simple request helper using fetch
export async function request<T = any>(
  urlOrConfig: string | { method: string; url: string },
  data?: any
): Promise<T> {
  // Parse input
  const url = typeof urlOrConfig === 'string' ? urlOrConfig : urlOrConfig.url;
  const method = typeof urlOrConfig === 'string' ? 'GET' : urlOrConfig.method;
  
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
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  };
  
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Request failed');
  }
  return await res.json();
}
