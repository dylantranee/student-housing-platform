import { request } from '../../util/request';

export async function getProfile() {
  return await request({ method: 'GET', url: 'http://localhost:3000/api/auth/profile' });
}
