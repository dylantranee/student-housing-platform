import { request } from '../../../util/request';

export class UserLoginService {
  static async loginByEmailAndPassword({ email, password }: { email: string; password: string }) {
    const res = await request(
      { method: 'POST', url: 'http://localhost:3000/api/auth/login' },
      { email, password }
    );
    // Backend trả về { data: { accessToken, user } }
    if (res.data && res.data.accessToken) {
      localStorage.setItem('access_token', res.data.accessToken);
    }
    return res;
  }
}
