import { request } from '../../../util/request';
import { API_BASE_URL } from '../../../config/apiConfig';

export class UserLoginService {
  static async loginByEmailAndPassword({ email, password }: { email: string; password: string }) {
    const res = await request(
      { method: 'POST', url: `${API_BASE_URL}/auth/login` },
      { email, password }
    );
    // Backend trả về { data: { accessToken, user } }
    if (res.data && res.data.accessToken) {
      localStorage.setItem('access_token', res.data.accessToken);
    }
    return res;
  }
}
