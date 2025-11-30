import { request } from '../../util/request';

export async function updateProfile(data: { name?: string; age?: number; phone?: string; email?: string }) {
  return await request({ method: 'PATCH', url: 'http://localhost:3000/api/auth/profile' }, data);
}
