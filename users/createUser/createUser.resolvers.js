import client from '../../client';
import bcrypt from 'bcrypt';

export default {
  Mutation: {
    createUser: async (
      _,
      { firstName, lastName, userName, email, password }
    ) => {
      try {
        const checkUser = await client.user.findFirst({
          where: {
            OR: [
              {
                userName,
              },
              {
                email,
              },
            ],
          },
        });
        if (checkUser) throw new Error('닉네임 혹은 이메일이 중복됩니다.');
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await client.user.create({
          data: {
            firstName,
            lastName,
            userName,
            email,
            password: hashPassword,
          },
        });
        if (user) {
          return { ok: true };
        } else {
          return {
            ok: false,
            error: '회원가입이 실패하였습니다',
          };
        }
      } catch (error) {
        return error;
      }
    },
  },
};
