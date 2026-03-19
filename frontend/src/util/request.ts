import axios from 'axios';

// Shared API request helper using Axios
export async function request<T = any>(
  urlOrConfig: string | { method: string; url: string },
  data?: any
): Promise<T> {
  // Parse input signature (either a string URL or an object config)
  const url = typeof urlOrConfig === 'string' ? urlOrConfig : urlOrConfig.url;
  const method = typeof urlOrConfig === 'string' ? 'GET' : urlOrConfig.method;
  
  // Gracefully extract token from localStorage or secure cookies
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token') || '';
    if (!token) {
      const match = document.cookie.match(/access_token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  // Axios natively throws structured error objects (AxiosError) on 4xx / 5xx responses!
  const response = await axios({
    method,
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
  });
  
  // Return typed JSON payload
  return response.data;
}
