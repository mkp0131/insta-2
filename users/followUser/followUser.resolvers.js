import client from '../../client';
import { protectedResolver } from '../uesrs.utils';

const resolverFn = async (_, { userName }, { loggedInUser }) => {
  try {
    const user = await client.user.findUnique({ where: { userName } });
    if (!user) {
      return {
        ok: false,
        error: '유저네임을 확인해주세요',
      };
    }

    const ok = await client.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        following: {
          connect: {
            userName,
          },
        },
      },
    });

    if (ok) {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        error: '팔로잉 실패하였습니다',
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: '팔로잉 실패하였습니다',
    };
  }
};

export default {
  Mutation: {
    followUser: protectedResolver(resolverFn),
  },
};
