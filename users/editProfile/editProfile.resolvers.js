import client from '../../client';
import bcrypt from 'bcrypt';
import { protectedResolver } from '../uesrs.utils';

const resolverFn = async (
  _,
  { firstName, lastName, userName, password, bio, avatar },
  { loggedInUser }
) => {
  try {
    if (!loggedInUser) {
      return {
        ok: false,
        error: '회원정보가 없습니다',
      };
    }

    let newPassword = null;
    if (password) {
      newPassword = await bcrypt.hash(password, 5);
    }
    const ok = await client.user.update({
      where: { id: loggedInUser.id },
      data: {
        firstName,
        lastName,
        userName,
        ...(newPassword && { password: newPassword }),
        bio,
        avatar,
      },
    });
    if (ok) {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        error: '업데이트를 실패했습니다',
      };
    }
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
