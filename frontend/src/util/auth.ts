
/**
 * Unified utility to get the authentication token from localStorage or cookies.
 * Matches logic used in src/util/request.ts
 */
export const getAuthToken = (): string => {
  if (typeof window === 'undefined') return '';
  
  let token = localStorage.getItem('access_token') || '';
  if (!token) {
    const match = document.cookie.match(/access_token=([^;]+)/);
    if (match) token = match[1];
  }
  return token;
};
