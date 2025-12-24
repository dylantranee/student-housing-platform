import { request } from '../../util/request';
import { API_BASE_URL } from '../../config/apiConfig';

export async function updateProfile(data: { name?: string; age?: number; phone?: string; email?: string }) {
  return await request({ method: 'PATCH', url: `${API_BASE_URL}/auth/profile` }, data);
}
