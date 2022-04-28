import client from '../../client';
import bcrypt from 'bcrypt';

export default {
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await client.user.findFirst({ where: { email } });
      if (!user) {
        return {
          ok: false,
          error: '유저가 없습니다',
        };
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return {
          ok: false,
          error: '비밀번호가 맞지 않습니다',
        };
      }
    },
  },
};
