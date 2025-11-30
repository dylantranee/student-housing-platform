import { request } from '../../../util/request';

export class UserLoginService {
  static async loginByEmailAndPassword({ email, password }: { email: string; password: string }) {
    return await request(
      { method: 'POST', url: 'http://localhost:3000/api/auth/login' },
      { email, password }
    );
  }
}
